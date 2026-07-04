/**
 * Centralised, environment-driven configuration.
 *
 * Every tunable value the server relies on is read once here and re-used
 * everywhere else, instead of magic numbers scattered through server.js.
 * Copy .env.example to .env to override any of these locally.
 */

require('dotenv').config();

function toInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

module.exports = {
  // Port the HTTP + WebSocket server listens on.
  PORT: toInt(process.env.PORT, 3000),

  // Players allowed in a single room at once.
  MAX_PLAYERS_PER_ROOM: toInt(process.env.MAX_PLAYERS_PER_ROOM, 10),

  // Minimum players required before the host can start a round.
  MIN_PLAYERS_TO_START: toInt(process.env.MIN_PLAYERS_TO_START, 3),

  // How many previous sets to remember per room so the same category/word
  // pair doesn't repeat too soon.
  SET_HISTORY_SIZE: toInt(process.env.SET_HISTORY_SIZE, 20),

  // Delay (ms) between the "assigning roles" phase and the first describer,
  // giving players a moment to read their word/question before play begins.
  ROLE_REVEAL_DELAY_MS: toInt(process.env.ROLE_REVEAL_DELAY_MS, 5000),
};
