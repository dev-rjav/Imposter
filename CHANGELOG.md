# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-07-04

### Added
- Repository scaffolding for public release: README, CONTRIBUTING, LICENSE,
  `.env.example`, issue/PR templates, and a CI workflow.
- `config.js` centralising all tunable server settings, sourced from
  environment variables (`PORT`, `MAX_PLAYERS_PER_ROOM`,
  `MIN_PLAYERS_TO_START`, `SET_HISTORY_SIZE`, `ROLE_REVEAL_DELAY_MS`).
- ESLint flat config (`eslint.config.js`) and `npm run lint` script.

### Changed
- Category, word, and question content moved out of `server.js` into a
  dedicated `data/` module (`data/wordSets.js`, `data/questionSets.js`,
  `data/index.js`), so new content can be added without touching game logic.

## [1.0.0]

### Added
- Real-time multiplayer game server built on Express + `ws`.
- Room creation/joining with 4-character room codes.
- Two round types: word-guessing and question-answering, with a single
  random imposter per round.
- Shuffled describe order, live vote casting, and tie-broken elimination.
- Per-room history tracking to avoid repeating the same set too soon.
- Host migration on disconnect.
- Single-page frontend with a monochrome, serif/sans-serif themed UI.
