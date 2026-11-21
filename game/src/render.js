// Paints everything: the HUD (title, scene tabs, found/remaining counter, timer), the two
// pictures side by side with their found-difference markers, the bottom bar, the magnifier
// lens, the keyboard crosshair, and the title / pause / win overlays. All drawing is canvas
// 2D in the fixed 1280x720 logical space; the canvas is scaled to the window.

import { FIELD, PANEL, PANEL_A, PANEL_B, PALETTE, FONT } from './config.js';
import { SCENES, paintScene } from './world.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_WIN = 'win';

const HUD_H = 96;
const BOTTOM_Y = 590;

/** Canvas hit regions for the clickable buttons, shared with input.js. */
export function layoutButtons(game) {
  const buttons = {
    hint: { x: 40, y: 612, w: 168, h: 44 },
    magnifier: { x: 222, y: 612, w: 196, h: 44 },
    sound: { x: 432, y: 612, w: 138, h: 44 },
    restart: { x: 584, y: 612, w: 138, h: 44 },
  };
  if (game.screen === SCREEN_WIN) {
    buttons.next = { x: 490, y: 470, w: 150, h: 48 };
    buttons.replay = { x: 660, y: 470, w: 150, h: 48 };
  }
  for (let i = 0; i < SCENES.length; i += 1) {
    buttons[`tab${i}`] = { x: 380 + i * 150, y: 24, w: 140, h: 48 };
  }
  return buttons;
}

function pill(ctx, x, y, w, h, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function button(ctx, rect, label, active) {
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fillStyle = active ? PALETTE.buttonHover : PALETTE.button;
  ctx.fill();
  ctx.strokeStyle = active ? PALETTE.gold : PALETTE.hudLine;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = PALETTE.text;
  ctx.font = `600 15px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function drawStar(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawMarker(ctx, cx, cy, r, number, pulse) {
  const pr = pulse ? r + 4 + Math.sin(performance.now() / 130) * 3 : r + 4;
  ctx.save();
  ctx.strokeStyle = PALETTE.gold;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, pr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, pr + 2.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.arc(cx, cy, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#241b30';
  ctx.font = `bold 12px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(number), cx, cy + 0.5);
  ctx.restore();
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = FIELD.width * dpr;
    canvas.height = FIELD.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fit();
  window.addEventListener('resize', fit);

  function drawPanel(game, panel, variant) {
    const scene = SCENES[game.sceneIndex];
    ctx.save();
    ctx.shadowColor = PALETTE.panelShadow;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = PALETTE.panelFrame;
    ctx.fillRect(panel.x - 6, panel.y - 6, PANEL.width + 12, PANEL.height + 12);
    ctx.restore();
    paintScene(ctx, scene, variant, panel.x, panel.y, 1);
    // Letter chip.
    ctx.fillStyle = 'rgba(24,16,32,0.85)';
    ctx.beginPath();
    ctx.arc(panel.x + 22, panel.y + 22, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 17px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(variant, panel.x + 22, panel.y + 23);
    // Found markers, numbered in the order they were found.
    game.found.forEach((diffId, order) => {
      const diff = scene.diffs.find((d) => d.id === diffId);
      if (!diff) return;
      const pulse = game.lastFind === diffId && performance.now() - game.lastFindAt < 1200;
      drawMarker(ctx, panel.x + diff.x, panel.y + diff.y, diff.r, order + 1, pulse);
    });
    // Miss marks fade out where the player clicked wrongly.
    for (const miss of game.misses) {
      if (miss.panel !== variant) continue;
      const age = (performance.now() - miss.at) / 600;
      if (age >= 1) continue;
      ctx.save();
      ctx.globalAlpha = 1 - age;
      ctx.strokeStyle = PALETTE.red;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const x = panel.x + miss.x;
      const y = panel.y + miss.y;
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 9);
      ctx.lineTo(x + 9, y + 9);
      ctx.moveTo(x + 9, y - 9);
      ctx.lineTo(x - 9, y + 9);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawHud(game) {
    ctx.fillStyle = PALETTE.hud;
    ctx.fillRect(0, 0, FIELD.width, HUD_H);
    ctx.fillStyle = PALETTE.hudLine;
    ctx.fillRect(0, HUD_H - 2, FIELD.width, 2);
    // Title.
    ctx.fillStyle = PALETTE.gold;
    ctx.font = `800 26px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('✦ TWINKLE TOYS', 24, 38);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 14px ${FONT}`;
    ctx.fillText('Spot the Difference', 26, 62);
    // Scene tabs.
    const buttons = layoutButtons(game);
    SCENES.forEach((scene, i) => {
      const rect = buttons[`tab${i}`];
      const active = i === game.sceneIndex;
      pill(ctx, rect.x, rect.y, rect.w, rect.h, active ? '#4a3870' : PALETTE.chip, active ? PALETTE.gold : PALETTE.hudLine);
      ctx.fillStyle = active ? '#ffffff' : PALETTE.muted;
      ctx.font = `600 14px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${i + 1} · ${['Toy Shop', 'Rooftop', 'Kitchen'][i]}`, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
    });
    // Found counter.
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `600 12px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText('FOUND', 848, 34);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `800 26px ${FONT}`;
    ctx.fillText(`${game.found.length} / ${SCENES[game.sceneIndex].diffs.length}`, 848, 62);
    // Remaining counter — the number the player is hunting.
    const remaining = SCENES[game.sceneIndex].diffs.length - game.found.length;
    pill(ctx, 962, 22, 150, 52, remaining === 0 ? PALETTE.green : PALETTE.gold, null);
    ctx.fillStyle = '#241b30';
    ctx.font = `800 ${remaining === 0 ? 19 : 22}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(remaining === 0 ? 'ALL FOUND!' : `${remaining} TO GO`, 1037, 47);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `600 12px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText('TIME', 1128, 34);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `800 22px ${FONT}`;
    ctx.fillText(fmtTime(game.elapsed), 1128, 62);
  }

  function drawBottom(game) {
    const buttons = layoutButtons(game);
    button(ctx, buttons.hint, `Hint (H) · ${game.hintsLeft} left`, false);
    button(ctx, buttons.magnifier, game.lensOn ? 'Magnifier (M) · On' : 'Magnifier (M)', game.lensOn);
    button(ctx, buttons.sound, game.muted ? 'Sound: Off' : 'Sound: On', false);
    button(ctx, buttons.restart, 'Restart (R)', false);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 13px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Score ${game.score}   ·   Best ${game.best}   ·   Click a difference on either picture`, 1256, 634);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 12px ${FONT}`;
    ctx.textAlign = 'center';
    const scene = SCENES[game.sceneIndex];
    ctx.fillText(scene.subtitle, FIELD.width / 2, 590);
    ctx.fillText('Keyboard: arrow keys move the ring · Enter clicks · H hint · M magnifier · P pause · 1/2/3 scenes', FIELD.width / 2, 686);
  }

  function drawLens(game) {
    if (!game.lensOn || !game.lensPos) return;
    const { x, y, panel } = game.lensPos;
    const rect = panel === 'B' ? PANEL_B : PANEL_A;
    const scene = SCENES[game.sceneIndex];
    const variant = panel;
    const R = 96;
    const lx = x;
    const ly = y;
    const px = x - rect.x;
    const py = y - rect.y;
    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly, R, 0, Math.PI * 2);
    ctx.clip();
    // Put the scene point under the cursor at the lens centre, at 2x zoom.
    paintScene(ctx, scene, variant, lx - 2 * (rect.x + px), ly - 2 * (rect.y + py), 2);
    ctx.restore();
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(lx, ly, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(lx, ly, R + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCrosshair(game) {
    if (!game.crosshair || game.screen !== SCREEN_PLAY) return;
    const rect = game.crosshair.panel === 'B' ? PANEL_B : PANEL_A;
    const x = rect.x + game.crosshair.x;
    const y = rect.y + game.crosshair.y;
    ctx.save();
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = PALETTE.gold;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function overlayCard(x, y, w, h) {
    ctx.fillStyle = 'rgba(16,10,24,0.82)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = '#2e2340';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 18);
    ctx.fill();
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawTitle(game) {
    overlayCard(290, 120, 700, 480);
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.gold;
    ctx.font = `800 44px ${FONT}`;
    ctx.fillText('✦ TWINKLE TOYS ✦', 640, 200);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `600 24px ${FONT}`;
    ctx.fillText('Spot the Difference', 640, 240);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 16px ${FONT}`;
    ctx.fillText('Two pictures. Seven tiny changes. Find them all.', 640, 276);
    SCENES.forEach((scene, i) => {
      const y = 322 + i * 44;
      ctx.fillStyle = i === game.sceneIndex ? PALETTE.gold : PALETTE.text;
      ctx.font = `600 17px ${FONT}`;
      ctx.fillText(`${i + 1} · ${scene.name} — ${scene.subtitle}`, 640, y);
    });
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 19px ${FONT}`;
    ctx.fillText('Click a difference — or press Space to start', 640, 480);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 14px ${FONT}`;
    ctx.fillText('Wrong clicks cost 25 points · H asks for a hint · M is a magnifier · Best ' + game.best, 640, 512);
    ctx.fillStyle = PALETTE.gold;
    ctx.font = `600 15px ${FONT}`;
    ctx.fillText('Three original hand-drawn scenes · sounds synthesized live · nothing to download', 640, 556);
  }

  function drawWin(game) {
    overlayCard(390, 130, 500, 400);
    const win = game.win;
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.gold;
    ctx.font = `800 34px ${FONT}`;
    ctx.fillText('Scene complete!', 640, 200);
    for (let i = 0; i < 3; i += 1) {
      drawStar(ctx, 580 + i * 60, 250, 24, i < win.stars ? PALETTE.gold : '#4a4460');
    }
    ctx.fillStyle = PALETTE.text;
    ctx.font = `600 18px ${FONT}`;
    ctx.fillText('You found all 7 differences', 640, 300);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 16px ${FONT}`;
    ctx.fillText(`Time ${fmtTime(win.time)}   ·   Misses ${win.misses}   ·   Score ${win.score}`, 640, 332);
    ctx.fillText(`Total score ${game.score}   ·   Best ${game.best}`, 640, 360);
    const buttons = layoutButtons(game);
    const last = game.sceneIndex === SCENES.length - 1;
    button(ctx, buttons.next, last ? 'Play again ↻' : 'Next scene →', false);
    button(ctx, buttons.replay, 'Replay scene', false);
  }

  function drawPaused() {
    ctx.fillStyle = 'rgba(16,10,24,0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.text;
    ctx.font = `800 36px ${FONT}`;
    ctx.fillText('Paused', 640, 350);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 17px ${FONT}`;
    ctx.fillText('Press P or click to carry on', 640, 390);
  }

  function draw(game) {
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    drawHud(game);
    drawPanel(game, PANEL_A, 'A');
    drawPanel(game, PANEL_B, 'B');
    drawBottom(game);
    if (game.hintPulse) {
      const scene = SCENES[game.sceneIndex];
      const diff = scene.diffs.find((d) => d.id === game.hintPulse);
      if (diff) {
        const age = (performance.now() - game.hintAt) / 1400;
        if (age < 1) {
          ctx.save();
          ctx.globalAlpha = 0.65 + 0.35 * Math.sin(performance.now() / 120);
          ctx.strokeStyle = PALETTE.gold;
          ctx.lineWidth = 3;
          for (const panel of [PANEL_A, PANEL_B]) {
            ctx.beginPath();
            ctx.arc(panel.x + diff.x, panel.y + diff.y, diff.r + 8, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }
    drawLens(game);
    drawCrosshair(game);
    if (game.screen === SCREEN_TITLE) drawTitle(game);
    else if (game.screen === SCREEN_WIN) drawWin(game);
    else if (game.screen === SCREEN_PAUSED) drawPaused();
  }

  return { draw, fit };
}
