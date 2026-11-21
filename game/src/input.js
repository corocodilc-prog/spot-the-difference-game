// Mouse and keyboard input, translated into game actions. Clicks are reported in logical
// 1280x720 coordinates; the game decides what was hit. Keyboard play moves a ring around a
// picture and Enter clicks where it stands, so the whole game is playable without a mouse.

import { FIELD, PANEL, PANEL_A, PANEL_B } from './config.js';
import { layoutButtons } from './render.js';

function toLogical(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * FIELD.width,
    y: ((clientY - rect.top) / rect.height) * FIELD.height,
  };
}

function panelAt(x, y) {
  for (const [name, p] of [['A', PANEL_A], ['B', PANEL_B]]) {
    if (x >= p.x && x < p.x + PANEL.width && y >= p.y && y < p.y + PANEL.height) {
      return { panel: name, x: x - p.x, y: y - p.y };
    }
  }
  return null;
}

export function createInput(canvas, game) {
  const clicks = [];
  const keys = [];

  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = toLogical(canvas, event.clientX, event.clientY);
    clicks.push({ x, y, panel: panelAt(x, y) });
    game.lensPos = panelAt(x, y) ? { x, y, panel: panelAt(x, y).panel } : game.lensPos;
    if (event.pointerType === 'mouse') game.mouse = { x, y };
  });
  canvas.addEventListener('pointermove', (event) => {
    const { x, y } = toLogical(canvas, event.clientX, event.clientY);
    game.mouse = { x, y };
    const hit = panelAt(x, y);
    game.lensPos = hit ? { x, y, panel: hit.panel } : null;
  });
  canvas.addEventListener('pointerleave', () => {
    game.lensPos = null;
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    keys.push(event.key);
  });

  /** The buttons under a logical point (or null). */
  function buttonAt(x, y) {
    const buttons = layoutButtons(game);
    for (const [name, rect] of Object.entries(buttons)) {
      if (x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h) return name;
    }
    return null;
  }

  return {
    /** Drain the queued clicks and keys; each is handled once. */
    take() {
      const out = { clicks: clicks.splice(0), keys: keys.splice(0) };
      out.buttons = out.clicks.map((c) => buttonAt(c.x, c.y));
      return out;
    },
  };
}
