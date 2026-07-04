# Imposter

A real-time, browser-based social deduction party game. Everyone in the room
gets the same word — except the imposter, who gets something close enough to
bluff with. Describe, discuss, and vote before the imposter talks their way
out of it.

Built with a plain Node.js/Express backend and a single-page vanilla JS
frontend, wired together over WebSockets. No build step, no framework,
no database — just clone it, `npm install`, and play on your local network.

---

## Contents

- [How it plays](#how-it-plays)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Adding your own categories](#adding-your-own-categories)
- [Architecture notes](#architecture-notes)
- [Available scripts](#available-scripts)
- [Roadmap](#roadmap)
- [License](#license)

---

## How it plays

1. **Create a room.** One player creates a room and shares the 4-character
   room code with everyone else.
2. **Join.** Other players join using that code (3–10 players per room).
3. **Roles are assigned.** Every round pulls a random category from the
   content pack. Everyone gets the *majority* word or question — one random
   player secretly gets the *imposter* version instead.
4. **Describe or answer.** Players take turns, in a shuffled order,
   describing their word (or answering their question) out loud without
   saying it outright.
5. **Vote.** Once everyone's had a turn, the room votes on who they think
   the imposter is. Ties are broken at random.
6. **Reveal.** The eliminated player is revealed, along with whether they
   were actually the imposter and what the real words/questions were.
7. **Play again.** The host can send everyone back to the lobby for another
   round — the game remembers recently used sets so you won't see the same
   pairing again too soon.

There are two content modes, mixed into the same pool:

| Mode | What happens |
|---|---|
| **Word** | Everyone describes a word (e.g. `Pencil`) — the imposter secretly has a different, related word (`Pen`) and has to fake it. |
| **Question** | Everyone answers a question about a topic (e.g. *"How often do you take it for walks?"* about a `Dog`) — the imposter answers a different but similarly-shaped question about a different topic (`Cat`). |

## Quick start

**Requirements:** [Node.js](https://nodejs.org/) 18 or later.

```bash
# 1. Clone the repo
git clone https://github.com/dev-rjav/Imposter
cd imposter-game

# 2. Install dependencies
npm install

# 3. (Optional) copy the env template if you want to override any defaults
cp .env.example .env

# 4. Start the server
npm start
```

The server logs the URL it's listening on:

```
🎮 Imposter Game → http://localhost:3000
📦 111 sets (81 word, 30 question) across 34 categories
🔄 Tracks last 20 games per room to avoid repeats
```

Open that URL in a browser. To play with others on the same WiFi, share
`http://<your-local-ip>:3000` instead of `localhost` — every player just
needs to be able to reach your machine on the network.

## Project structure

```
imposter-game/
├── data/                 # All game content — the only place word/question
│   │                     # sets live. server.js never hardcodes content.
│   ├── wordSets.js       #   "describe a word" round content, by category
│   ├── questionSets.js   #   "answer a question" round content, by category
│   └── index.js          #   merges both into ALL_SETS + derives category stats
├── public/               # Static frontend served as-is by Express
│   └── index.html        #   single-page UI: lobby, game, voting, results
├── .github/              # Issue templates, PR template, CI workflow
├── config.js             # Centralised, environment-driven server settings
├── server.js             # Express + WebSocket game server (all game logic)
├── .env.example          # Documents every configurable environment variable
├── package.json
└── README.md
```

## Configuration

The server reads its settings from environment variables, all optional —
sensible defaults are defined in [`config.js`](./config.js). Copy
[`.env.example`](./.env.example) to `.env` to override any of them:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the HTTP + WebSocket server listens on |
| `MAX_PLAYERS_PER_ROOM` | `10` | Max players allowed in a single room |
| `MIN_PLAYERS_TO_START` | `3` | Minimum players the host needs before starting |
| `SET_HISTORY_SIZE` | `20` | How many previous sets a room remembers, to avoid repeats |
| `ROLE_REVEAL_DELAY_MS` | `5000` | Delay before the first describer's turn, so players can read their word |

## Adding your own categories

Game content is fully decoupled from game logic, so you can extend it without
touching `server.js` at all.

**To add a word-guessing pair**, append an entry to `data/wordSets.js`:

```js
{ type: "word", category: "Your Category", majority: "Real Word", imposter: "Close-but-different Word" },
```

**To add a question pair**, append an entry to `data/questionSets.js`:

```js
{
  type: "question",
  category: "Your Category",
  majority: "Topic A 🎯",
  imposter: "Topic B 🎲",
  majorityQ: "A question that makes sense for Topic A.",
  imposterQ: "A similarly-shaped question that makes sense for Topic B.",
},
```

Both files export a plain array — nothing else needs to change. `data/index.js`
automatically merges them into `ALL_SETS` and recomputes category counts on
the next server start.

## Architecture notes

- **No database.** All game state lives in memory (`Map`s keyed by room
  code / WebSocket connection) inside `server.js`. Restarting the server
  clears every room — this is intentional for a lightweight party game, not
  an oversight.
- **One WebSocket connection per player**, tracked alongside their room code
  and player ID. Every state-changing action broadcasts a fresh room state
  to all connected players in that room, so clients never need to diff
  state themselves.
- **Repeat avoidance is per-room**, not global — `room.recentHistory` stores
  the indices of the last `SET_HISTORY_SIZE` sets used in that specific
  room, so two rooms playing simultaneously don't affect each other.
- **Host migration.** If the host disconnects, the next remaining player in
  the room is silently promoted to host.

## Available scripts

| Command | What it does |
|---|---|
| `npm start` | Starts the server |
| `npm run dev` | Starts the server with Node's `--watch` flag for auto-restart on file changes |
| `npm run lint` | Runs ESLint over the project |
| `npm test` | Placeholder — no automated tests yet, see [Roadmap](#roadmap) |

## Roadmap

- [ ] Automated tests around room lifecycle and vote resolution
- [ ] Optional category-pack selection from the lobby before starting
- [ ] Reconnect support for players who briefly lose connection mid-round

## License

[MIT](./LICENSE) — do whatever you'd like with it.
