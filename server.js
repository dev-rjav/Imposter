const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');
const { ALL_SETS } = require('./data');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, 'public')));

// ─── Word Sets ────────────────────────────────────────────────────────────────
// Category/word/question content lives in ./data (see data/index.js,
// data/wordSets.js, data/questionSets.js) and is imported above as ALL_SETS.

// ─── Game State ───────────────────────────────────────────────────────────────
const rooms = new Map();
const clients = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function generatePlayerId() {
  return Math.random().toString(36).slice(2, 10);
}

// Pick a set not used in the last 20 games
function pickSet(recentHistory = []) {
  const available = ALL_SETS.filter((_, i) => !recentHistory.includes(i));
  const pool = available.length > 0 ? available : ALL_SETS;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { set: chosen, idx: ALL_SETS.indexOf(chosen) };
}

function broadcastToRoom(roomCode, message, excludeWs = null) {
  for (const [ws, info] of clients.entries()) {
    if (info.roomCode === roomCode && ws !== excludeWs && ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  }
}

function sendToPlayer(ws, message) {
  if (ws.readyState === 1) ws.send(JSON.stringify(message));
}

function getRoomState(room) {
  return {
    roomCode: room.code,
    phase: room.phase,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      isAlive: p.isAlive,
      hasDescribed: p.hasDescribed,
    })),
    hostId: room.hostId,
    round: room.round,
    category: room.currentSet ? room.currentSet.category : null,
    setType: room.currentSet ? room.currentSet.type : null,
  };
}

function createRoom(ws, playerName) {
  const code = generateRoomCode();
  const playerId = generatePlayerId();
  const player = { id: playerId, name: playerName, isHost: true, isAlive: true, hasDescribed: false, ws };

  const room = {
    code,
    phase: 'lobby',
    players: [player],
    hostId: playerId,
    round: 0,
    currentSet: null,
    imposterIds: [],
    votes: {},
    recentHistory: [],   // last SET_HISTORY_SIZE set indices used, see config.js
    describeOrder: [],
    currentDescribeIdx: 0,
  };

  rooms.set(code, room);
  clients.set(ws, { roomCode: code, playerId });
  sendToPlayer(ws, { type: 'ROOM_CREATED', roomCode: code, playerId, state: getRoomState(room) });
}

function joinRoom(ws, roomCode, playerName) {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return sendToPlayer(ws, { type: 'ERROR', message: 'Room not found.' });
  if (room.phase !== 'lobby') return sendToPlayer(ws, { type: 'ERROR', message: 'Game already in progress.' });
  if (room.players.length >= config.MAX_PLAYERS_PER_ROOM) {
    return sendToPlayer(ws, { type: 'ERROR', message: `Room is full (max ${config.MAX_PLAYERS_PER_ROOM} players).` });
  }

  const playerId = generatePlayerId();
  const player = { id: playerId, name: playerName, isHost: false, isAlive: true, hasDescribed: false, ws };
  room.players.push(player);
  clients.set(ws, { roomCode: room.code, playerId });

  sendToPlayer(ws, { type: 'ROOM_JOINED', roomCode: room.code, playerId, state: getRoomState(room) });
  broadcastToRoom(room.code, {
    type: 'PLAYER_JOINED',
    player: { id: playerId, name: playerName, isHost: false, isAlive: true, hasDescribed: false },
    state: getRoomState(room),
  }, ws);
}

function startGame(ws, roomCode) {
  const room = rooms.get(roomCode);
  const info = clients.get(ws);
  if (!room || !info) return;
  if (info.playerId !== room.hostId) return sendToPlayer(ws, { type: 'ERROR', message: 'Only the host can start.' });
  if (room.players.length < config.MIN_PLAYERS_TO_START) {
    return sendToPlayer(ws, { type: 'ERROR', message: `Need at least ${config.MIN_PLAYERS_TO_START} players to start.` });
  }

  room.round++;
  room.phase = 'assigning';
  room.votes = {};
  room.players.forEach(p => { p.isAlive = true; p.hasDescribed = false; });

  // Pick set — avoid the last SET_HISTORY_SIZE used in this room
  const { set, idx } = pickSet(room.recentHistory);
  room.currentSet = set;
  room.recentHistory.push(idx);
  if (room.recentHistory.length > config.SET_HISTORY_SIZE) room.recentHistory.shift();

  // Pick 1 imposter
  const imposterIdx = Math.floor(Math.random() * room.players.length);
  room.imposterIds = [room.players[imposterIdx].id];

  // Shuffle describe order
  room.describeOrder = [...room.players].sort(() => Math.random() - 0.5).map(p => p.id);
  room.currentDescribeIdx = 0;

  // Send each player their private info
  room.players.forEach(p => {
    const isImposter = room.imposterIds.includes(p.id);
    const isQuestion = set.type === 'question';
    sendToPlayer(p.ws, {
      type: 'WORD_ASSIGNED',
      setType: set.type,
      word: isImposter ? set.imposter : set.majority,
      question: isQuestion ? (isImposter ? set.imposterQ : set.majorityQ) : null,
      isImposter,
      category: set.category,
      round: room.round,
      describeOrder: room.describeOrder,
      state: getRoomState(room),
    });
  });

  setTimeout(() => {
    room.phase = 'describing';
    broadcastToRoom(room.code, {
      type: 'PHASE_CHANGE',
      phase: 'describing',
      currentDescriberId: room.describeOrder[0],
      state: getRoomState(room),
    });
  }, config.ROLE_REVEAL_DELAY_MS);
}

function nextDescriber(room) {
  room.currentDescribeIdx++;
  if (room.currentDescribeIdx >= room.describeOrder.length) {
    room.phase = 'voting';
    broadcastToRoom(room.code, { type: 'PHASE_CHANGE', phase: 'voting', state: getRoomState(room) });
  } else {
    broadcastToRoom(room.code, {
      type: 'NEXT_DESCRIBER',
      currentDescriberId: room.describeOrder[room.currentDescribeIdx],
      state: getRoomState(room),
    });
  }
}

function submitDescription(ws, roomCode, description) {
  const room = rooms.get(roomCode);
  const info = clients.get(ws);
  if (!room || !info || room.phase !== 'describing') return;
  const currentDescriberId = room.describeOrder[room.currentDescribeIdx];
  if (info.playerId !== currentDescriberId) return sendToPlayer(ws, { type: 'ERROR', message: 'Not your turn.' });

  const player = room.players.find(p => p.id === info.playerId);
  if (player) player.hasDescribed = true;

  broadcastToRoom(room.code, {
    type: 'DESCRIPTION_SUBMITTED',
    playerId: info.playerId,
    playerName: player ? player.name : '?',
    description,
    state: getRoomState(room),
  });

  setTimeout(() => nextDescriber(room), 500);
}

function submitVote(ws, roomCode, targetId) {
  const room = rooms.get(roomCode);
  const info = clients.get(ws);
  if (!room || !info || room.phase !== 'voting') return;
  if (info.playerId === targetId) return sendToPlayer(ws, { type: 'ERROR', message: "You can't vote for yourself." });

  room.votes[info.playerId] = targetId;

  broadcastToRoom(room.code, {
    type: 'VOTE_CAST',
    voterId: info.playerId,
    voteCount: Object.keys(room.votes).length,
    totalPlayers: room.players.length,
    state: getRoomState(room),
  });

  if (Object.keys(room.votes).length >= room.players.length) resolveVotes(room);
}

function resolveVotes(room) {
  const tally = {};
  for (const targetId of Object.values(room.votes)) {
    tally[targetId] = (tally[targetId] || 0) + 1;
  }
  const maxVotes = Math.max(...Object.values(tally));
  const tied = Object.entries(tally).filter(([, v]) => v === maxVotes).map(([id]) => id);
  const eliminatedId = tied[Math.floor(Math.random() * tied.length)];
  const eliminatedPlayer = room.players.find(p => p.id === eliminatedId);
  const isImposterEliminated = room.imposterIds.includes(eliminatedId);

  room.phase = 'result';
  broadcastToRoom(room.code, {
    type: 'RESULT',
    eliminatedId,
    eliminatedName: eliminatedPlayer ? eliminatedPlayer.name : '?',
    isImposterEliminated,
    imposterIds: room.imposterIds,
    imposterNames: room.players.filter(p => room.imposterIds.includes(p.id)).map(p => p.name),
    majorityWord: room.currentSet.majority,
    imposterWord: room.currentSet.imposter,
    category: room.currentSet.category,
    setType: room.currentSet.type,
    majorityQ: room.currentSet.majorityQ || null,
    imposterQ: room.currentSet.imposterQ || null,
    votes: room.votes,
    tally,
    state: getRoomState(room),
  });
}

function resetToLobby(ws, roomCode) {
  const room = rooms.get(roomCode);
  const info = clients.get(ws);
  if (!room || !info || info.playerId !== room.hostId) return;

  room.phase = 'lobby';
  room.votes = {};
  room.imposterIds = [];
  room.currentSet = null;
  room.describeOrder = [];
  room.players.forEach(p => { p.isAlive = true; p.hasDescribed = false; });

  const state = getRoomState(room);
  broadcastToRoom(room.code, { type: 'BACK_TO_LOBBY', state });
  sendToPlayer(ws, { type: 'BACK_TO_LOBBY', state });
}

function removeClient(ws) {
  const info = clients.get(ws);
  if (!info) return;
  const { roomCode, playerId } = info;
  clients.delete(ws);
  const room = rooms.get(roomCode);
  if (!room) return;

  const idx = room.players.findIndex(p => p.id === playerId);
  if (idx === -1) return;
  const wasHost = room.players[idx].isHost;
  const playerName = room.players[idx].name;
  room.players.splice(idx, 1);

  if (room.players.length === 0) { rooms.delete(roomCode); return; }
  if (wasHost) { room.players[0].isHost = true; room.hostId = room.players[0].id; }

  broadcastToRoom(roomCode, { type: 'PLAYER_LEFT', playerId, playerName, state: getRoomState(room) });

  if (room.phase === 'describing') {
    room.describeOrder = room.describeOrder.filter(id => id !== playerId);
    if (room.describeOrder[room.currentDescribeIdx] === undefined || room.describeOrder.length === 0) {
      nextDescriber(room);
    }
  }
  if (room.phase === 'voting' && Object.keys(room.votes).length >= room.players.length) {
    resolveVotes(room);
  }
}

// ─── WebSocket ────────────────────────────────────────────────────────────────
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    switch (msg.type) {
      case 'CREATE_ROOM':           createRoom(ws, msg.name || 'Player'); break;
      case 'JOIN_ROOM':             joinRoom(ws, msg.roomCode, msg.name || 'Player'); break;
      case 'START_GAME':            startGame(ws, msg.roomCode); break;
      case 'SUBMIT_DESCRIPTION':    submitDescription(ws, msg.roomCode, msg.description || ''); break;
      case 'SUBMIT_VOTE':           submitVote(ws, msg.roomCode, msg.targetId); break;
      case 'BACK_TO_LOBBY':         resetToLobby(ws, msg.roomCode); break;
      case 'PING':                  sendToPlayer(ws, { type: 'PONG' }); break;
    }
  });
  ws.on('close', () => removeClient(ws));
  ws.on('error', () => removeClient(ws));
});

server.listen(config.PORT, () => {
  const cats = [...new Set(ALL_SETS.map(s => s.category))];
  const words = ALL_SETS.filter(s => s.type === 'word').length;
  const qs = ALL_SETS.filter(s => s.type === 'question').length;
  console.log(`🎮 Imposter Game → http://localhost:${config.PORT}`);
  console.log(`📦 ${ALL_SETS.length} sets (${words} word, ${qs} question) across ${cats.length} categories`);
  console.log(`🔄 Tracks last ${config.SET_HISTORY_SIZE} games per room to avoid repeats`);
});
