// Boot and the one loop: input is read every frame, the clock advances in fixed 1/60 s steps,
// and the renderer paints what is there. The game moves between four screens: title, play,
// paused and win.
//
// ?shot=play|play2|end|start (with &seed=N, ignored — the scenes are fixed) stages that scene
// instead of running the loop, paints it twice and sets window.__shotReady for a screenshot.

import { BEST_KEY, SCORE, STARS, STEP } from './config.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createRenderer, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, layoutButtons } from './render.js';
import { SCENES } from './world.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best then lasts this visit only.
  }
}

/** The whole game state, in one object the renderer reads. */
const game = {
  screen: SCREEN_TITLE,
  sceneIndex: 0,
  found: [],
  lastFind: null,
  lastFindAt: 0,
  misses: [],
  missCount: 0,
  hintsLeft: 3,
  hintPulse: null,
  hintAt: 0,
  elapsed: 0,
  score: 0,
  streak: 0,
  best: readBest(),
  muted: audio.isMuted(),
  lensOn: false,
  lensPos: null,
  mouse: null,
  crosshair: null,
  win: null,
};

function announce(message) {
  status.textContent = message;
}

function starsFor(misses, seconds) {
  if (misses <= STARS.threeMaxMisses && seconds <= STARS.threeMaxSeconds) return 3;
  if (misses <= STARS.twoMaxMisses && seconds <= STARS.twoMaxSeconds) return 2;
  return 1;
}

function startScene(index) {
  game.sceneIndex = index;
  game.found = [];
  game.lastFind = null;
  game.misses = [];
  game.missCount = 0;
  game.hintsLeft = 3;
  game.hintPulse = null;
  game.elapsed = 0;
  game.streak = 0;
  game.win = null;
  game.crosshair = null;
  game.screen = SCREEN_PLAY;
  announce(`Playing: ${SCENES[index].name}. Find ${SCENES[index].diffs.length} differences.`);
}

function winScene() {
  const scene = SCENES[game.sceneIndex];
  const bonus = Math.max(0, SCORE.winTimeBonus - Math.floor(game.elapsed) * 2);
  game.score += bonus;
  const stars = starsFor(game.missCount, game.elapsed);
  game.win = { stars, time: game.elapsed, misses: game.missCount, score: game.score };
  if (game.score > game.best) {
    game.best = game.score;
    saveBest(game.best);
  }
  game.screen = SCREEN_WIN;
  audio.win();
  announce(`Scene complete: ${scene.name}. ${stars} stars, ${Math.floor(game.elapsed)} seconds, score ${game.score}.`);
}

function clickAt(panel, x, y) {
  const scene = SCENES[game.sceneIndex];
  for (const diff of scene.diffs) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= (diff.r + 6) * (diff.r + 6)) {
      if (game.found.includes(diff.id)) return;
      game.found.push(diff.id);
      game.lastFind = diff.id;
      game.lastFindAt = performance.now();
      game.streak += 1;
      game.score = Math.max(0, game.score + SCORE.find + (game.streak - 1) * SCORE.streak);
      audio.find();
      announce(`Found: ${diff.label}. ${scene.diffs.length - game.found.length} to go.`);
      if (game.found.length === scene.diffs.length) winScene();
      return;
    }
  }
  game.misses.push({ panel, x, y, at: performance.now() });
  game.missCount += 1;
  game.streak = 0;
  game.score = Math.max(0, game.score + SCORE.miss);
  audio.miss();
  announce(`Not a difference. ${scene.diffs.length - game.found.length} to go.`);
}

function useHint() {
  if (game.screen !== SCREEN_PLAY || game.hintsLeft <= 0) return;
  const scene = SCENES[game.sceneIndex];
  const remaining = scene.diffs.filter((d) => !game.found.includes(d.id));
  if (remaining.length === 0) return;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.hintPulse = diff.id;
  game.hintAt = performance.now();
  audio.hint();
  announce(`Hint: look near ${diff.label.toLowerCase()}.`);
}

function runShot(name) {
  stageShot(name, game);
  let painted = 0;
  function paint() {
    renderer.draw(game);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, game);
  let accumulator = 0;
  let last = performance.now();

  function handleClick(click, button) {
    audio.unlock();
    if (button) {
      if (button === 'hint') {
        if (game.screen === SCREEN_PLAY) useHint();
        return;
      }
      if (button === 'magnifier') {
        game.lensOn = !game.lensOn;
        return;
      }
      if (button === 'sound') {
        game.muted = audio.toggleMuted();
        return;
      }
      if (button === 'restart') {
        if (game.screen !== SCREEN_TITLE) startScene(game.sceneIndex);
        return;
      }
      if (button === 'next') {
        if (game.screen === SCREEN_WIN) {
          startScene(game.sceneIndex === SCENES.length - 1 ? 0 : game.sceneIndex + 1);
        }
        return;
      }
      if (button === 'replay') {
        if (game.screen === SCREEN_WIN) startScene(game.sceneIndex);
        return;
      }
      if (button.startsWith('tab')) {
        const index = Number(button.slice(3));
        if (Number.isInteger(index) && index >= 0 && index < SCENES.length) startScene(index);
        return;
      }
      return;
    }
    if (game.screen === SCREEN_TITLE) {
      startScene(game.sceneIndex);
      return;
    }
    if (game.screen === SCREEN_PAUSED) {
      game.screen = SCREEN_PLAY;
      announce('Playing.');
      return;
    }
    if (game.screen !== SCREEN_PLAY) return;
    if (click.panel) clickAt(click.panel.panel, click.panel.x, click.panel.y);
  }

  function handleKey(key) {
    audio.unlock();
    if (key === ' ' || key === 'Enter') {
      if (game.screen === SCREEN_TITLE) {
        startScene(game.sceneIndex);
        return;
      }
      if (game.screen === SCREEN_WIN) {
        startScene(game.sceneIndex === SCENES.length - 1 ? 0 : game.sceneIndex + 1);
        return;
      }
      if (game.screen === SCREEN_PAUSED) {
        game.screen = SCREEN_PLAY;
        return;
      }
      if (game.crosshair) clickAt(game.crosshair.panel, game.crosshair.x, game.crosshair.y);
      return;
    }
    if (key === 'h' || key === 'H') {
      useHint();
      return;
    }
    if (key === 'm' || key === 'M') {
      game.lensOn = !game.lensOn;
      return;
    }
    if (key === 's' || key === 'S') {
      game.muted = audio.toggleMuted();
      return;
    }
    if (key === 'r' || key === 'R') {
      if (game.screen !== SCREEN_TITLE) startScene(game.sceneIndex);
      return;
    }
    if (key === 'p' || key === 'P' || key === 'Escape') {
      if (game.screen === SCREEN_PLAY) {
        game.screen = SCREEN_PAUSED;
        announce('Paused.');
      } else if (game.screen === SCREEN_PAUSED) {
        game.screen = SCREEN_PLAY;
        announce('Playing.');
      }
      return;
    }
    if (key === '1' || key === '2' || key === '3') {
      const index = Number(key) - 1;
      if (index < SCENES.length) startScene(index);
      return;
    }
    if (key.startsWith('Arrow')) {
      if (game.screen !== SCREEN_PLAY) return;
      if (!game.crosshair) {
        game.crosshair = { panel: 'A', x: 280, y: 230 };
        return;
      }
      const step = key === 'ArrowUp' || key === 'ArrowDown' ? 24 : 24;
      if (key === 'ArrowLeft') game.crosshair.x -= step;
      if (key === 'ArrowRight') game.crosshair.x += step;
      if (key === 'ArrowUp') game.crosshair.y -= step;
      if (key === 'ArrowDown') game.crosshair.y += step;
      if (game.crosshair.x < 0) {
        game.crosshair.panel = game.crosshair.panel === 'A' ? 'B' : 'A';
        game.crosshair.x += 560;
      }
      if (game.crosshair.x > 560) {
        game.crosshair.panel = game.crosshair.panel === 'A' ? 'B' : 'A';
        game.crosshair.x -= 560;
      }
      game.crosshair.y = Math.max(0, Math.min(460, game.crosshair.y));
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const inputState = input.take();
    inputState.clicks.forEach((click, i) => handleClick(click, inputState.buttons[i]));
    inputState.keys.forEach(handleKey);
    accumulator += Math.min((now - last) / 1000, 0.25);
    last = now;
    while (accumulator >= STEP) {
      accumulator -= STEP;
      if (game.screen === SCREEN_PLAY) game.elapsed += STEP;
      if (game.hintPulse && performance.now() - game.hintAt > 1400) game.hintPulse = null;
    }
    renderer.draw(game);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.screen === SCREEN_PLAY) {
      game.screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Twinkle Toys, spot the difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
