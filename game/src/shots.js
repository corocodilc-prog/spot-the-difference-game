// The screenshot scenes behind ?shot=play|play2|end|start. Each one sets the real game state
// to a fixed, deterministic moment — a mid-game frame with markers on the differences found
// and several still unfound, a second scene mid-game, a finished scene, and the title screen —
// so a screenshot is what a short game really looks like, and the same seed always gives the
// same frame.

import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { SCENES } from './world.js';

function starsFor(misses, seconds) {
  if (misses <= 2 && seconds <= 90) return 3;
  if (misses <= 5 && seconds <= 180) return 2;
  return 1;
}

/**
 * Set `game` to the named scene and return the screen to draw. The game object is the same
 * one the live loop uses; shots only pre-fill its fields.
 */
export function stageShot(name, game) {
  if (name === 'play2') {
    game.sceneIndex = 1;
    game.found = [SCENES[1].diffs[0].id, SCENES[1].diffs[3].id];
    game.lastFind = SCENES[1].diffs[3].id;
    game.lastFindAt = performance.now();
    game.elapsed = 33;
    game.score = 210;
    game.missCount = 0;
    game.misses = [];
    game.hintsLeft = 3;
    game.streak = 2;
    game.screen = SCREEN_PLAY;
    return SCREEN_PLAY;
  }
  if (name === 'end') {
    game.sceneIndex = 0;
    game.found = SCENES[0].diffs.map((d) => d.id);
    game.lastFind = SCENES[0].diffs[6].id;
    game.lastFindAt = performance.now();
    game.elapsed = 84;
    game.missCount = 1;
    game.misses = [];
    game.hintsLeft = 2;
    game.streak = 7;
    game.score = 940;
    game.win = { stars: starsFor(1, 84), time: 84, misses: 1, score: 940 };
    game.screen = SCREEN_WIN;
    return SCREEN_WIN;
  }
  if (name === 'play') {
    game.sceneIndex = 0;
    game.found = SCENES[0].diffs.slice(0, 3).map((d) => d.id);
    game.lastFind = SCENES[0].diffs[2].id;
    game.lastFindAt = performance.now();
    game.elapsed = 47;
    game.score = 320;
    game.missCount = 1;
    game.misses = [];
    game.hintsLeft = 2;
    game.streak = 3;
    game.screen = SCREEN_PLAY;
    return SCREEN_PLAY;
  }
  game.sceneIndex = 0;
  game.found = [];
  game.elapsed = 0;
  game.score = 0;
  game.missCount = 0;
  game.misses = [];
  game.hintsLeft = 3;
  game.screen = SCREEN_TITLE;
  return SCREEN_TITLE;
}
