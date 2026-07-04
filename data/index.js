/**
 * Data layer — single entry point for every category/word/question set used
 * by the game engine.
 *
 * server.js never hardcodes game content. It only imports from here, which
 * means new categories or content packs can be dropped in without touching
 * any game logic:
 *
 *   const { ALL_SETS } = require('./data');
 *
 * Files in this folder:
 *   wordSets.js      — "describe a word" round content
 *   questionSets.js  — "answer a question" round content
 *   index.js         — merges both into ALL_SETS + derives category stats
 */

const WORD_SETS = require('./wordSets');
const QUESTION_SETS = require('./questionSets');

const ALL_SETS = [...WORD_SETS, ...QUESTION_SETS];

/**
 * Builds a { categoryName: count } map plus a sorted list of category names.
 * Used by the server on boot (for the startup log) and can be exposed to the
 * client later (e.g. a "choose a category pack" lobby setting) without
 * touching the underlying set data.
 */
function buildCategoryIndex(sets) {
  const counts = {};
  for (const set of sets) {
    counts[set.category] = (counts[set.category] || 0) + 1;
  }
  const names = Object.keys(counts).sort((a, b) => a.localeCompare(b));
  return { counts, names };
}

const { counts: CATEGORY_COUNTS, names: CATEGORIES } = buildCategoryIndex(ALL_SETS);

module.exports = {
  ALL_SETS,
  WORD_SETS,
  QUESTION_SETS,
  CATEGORIES,
  CATEGORY_COUNTS,
};
