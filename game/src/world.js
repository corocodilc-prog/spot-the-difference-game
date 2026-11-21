// The three scenes and their seven differences each. Every picture is drawn fresh from code —
// no image files, no network — so the two panels are the same painter run twice, once as A
// (the original) and once as B (with all seven changes applied). A difference is a small,
// fair, local change: a colour, a missing object, an extra object, a moved part. Each one
// carries the point a click must land near and a short label for the hint and the win screen.

import { createRandom, range } from './random.js';

export const PANEL_W = 560;
export const PANEL_H = 460;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function star4(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function grain(ctx, random, count, w, h) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < count; i += 1) {
    ctx.fillRect(range(random, 0, w), range(random, 0, h), 1.5, 1.5);
  }
  ctx.restore();
}

function vignette(ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/* ------------------------------------------------------------------ scene 1 */

function paintToyShop(ctx, variant, random) {
  const B = variant === 'B';
  // Plum wall with faint brick courses.
  const wall = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  wall.addColorStop(0, '#372842');
  wall.addColorStop(1, '#241a2e');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let y = 60; y < PANEL_H; y += 46) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(PANEL_W, y);
    ctx.stroke();
  }
  // The shop window: cream frame, dusk sky inside.
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(24, 24, 512, 412);
  ctx.fillStyle = '#e2cba6';
  ctx.fillRect(24, 424, 512, 12);
  const sky = ctx.createLinearGradient(0, 40, 0, 420);
  sky.addColorStop(0, '#ffb26b');
  sky.addColorStop(0.55, '#c96f9e');
  sky.addColorStop(1, '#4a3a78');
  ctx.fillStyle = sky;
  ctx.fillRect(40, 40, 480, 380);
  // Stars and a low moon over the rooftops inside the window.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 26; i += 1) star4(ctx, range(random, 50, 510), range(random, 48, 190), range(random, 1, 2.6));
  ctx.fillStyle = '#ffe9b0';
  circle(ctx, 452, 92, 26);
  ctx.fill();
  ctx.fillStyle = '#f0d48e';
  circle(ctx, 444, 86, 5);
  ctx.fill();
  circle(ctx, 460, 100, 4);
  ctx.fill();
  // Rooftop silhouettes along the bottom of the sky.
  ctx.fillStyle = '#3a2a55';
  ctx.beginPath();
  ctx.moveTo(40, 420);
  ctx.lineTo(40, 330);
  ctx.lineTo(120, 330);
  ctx.lineTo(120, 300);
  ctx.lineTo(210, 300);
  ctx.lineTo(210, 345);
  ctx.lineTo(300, 345);
  ctx.lineTo(300, 315);
  ctx.lineTo(390, 315);
  ctx.lineTo(390, 350);
  ctx.lineTo(520, 350);
  ctx.lineTo(520, 420);
  ctx.closePath();
  ctx.fill();
  // The wooden shelf the toys stand on.
  ctx.fillStyle = '#8a5a3b';
  ctx.fillRect(40, 330, 480, 14);
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(40, 330, 480, 4);

  // Kite, top left, with a tail of bows (B loses the lowest bow).
  ctx.strokeStyle = '#f7f0e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(95, 125);
  ctx.lineTo(95, 196);
  ctx.stroke();
  ctx.fillStyle = '#e5534b';
  ctx.beginPath();
  ctx.moveTo(95, 62);
  ctx.lineTo(126, 94);
  ctx.lineTo(95, 126);
  ctx.lineTo(64, 94);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.moveTo(95, 62);
  ctx.lineTo(126, 94);
  ctx.lineTo(95, 94);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(95, 126);
  ctx.lineTo(64, 94);
  ctx.lineTo(95, 94);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  for (const by of [140, 160]) {
    ctx.beginPath();
    ctx.moveTo(95, by - 7);
    ctx.lineTo(103, by);
    ctx.lineTo(95, by + 7);
    ctx.lineTo(87, by);
    ctx.closePath();
    ctx.fill();
  }
  if (!B) {
    ctx.beginPath();
    ctx.moveTo(95, 173);
    ctx.lineTo(103, 180);
    ctx.lineTo(95, 187);
    ctx.lineTo(87, 180);
    ctx.closePath();
    ctx.fill();
  }

  // Balloons, top right (B loses the middle one).
  const balloons = [
    { x: 310, y: 102, c: '#e5534b' },
    { x: 350, y: 86, c: '#4a7fc9' },
    { x: 390, y: 102, c: '#f2c94c' },
  ];
  balloons.forEach((b, i) => {
    if (B && i === 1) return;
    ctx.strokeStyle = 'rgba(247,240,225,0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + 20);
    ctx.quadraticCurveTo(b.x + 6, b.y + 60, b.x - 2, b.y + 96);
    ctx.stroke();
    ctx.fillStyle = b.c;
    ellipse(ctx, b.x, b.y, 16, 20);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ellipse(ctx, b.x - 5, b.y - 7, 4, 6);
    ctx.fill();
  });

  // The OPEN sign, hung from the top of the window.
  ctx.strokeStyle = '#d8c49a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(238, 40);
  ctx.lineTo(238, 176);
  ctx.moveTo(282, 40);
  ctx.lineTo(282, 176);
  ctx.stroke();
  ctx.fillStyle = '#fbf3df';
  rr(ctx, 224, 176, 72, 34, 8);
  ctx.fill();
  ctx.strokeStyle = '#c94f43';
  ctx.lineWidth = 2;
  rr(ctx, 224, 176, 72, 34, 8);
  ctx.stroke();
  ctx.fillStyle = '#3a2a3a';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OPEN', 260, 194);

  // Teddy bear on the shelf (B wears a blue bow, A a red one).
  ctx.fillStyle = '#a9743f';
  circle(ctx, 76, 252, 9);
  ctx.fill();
  circle(ctx, 114, 252, 9);
  ctx.fill();
  ellipse(ctx, 95, 306, 27, 25);
  ctx.fill();
  circle(ctx, 95, 272, 24);
  ctx.fill();
  ellipse(ctx, 95, 280, 11, 8);
  ctx.fillStyle = '#e8c9a0';
  ellipse(ctx, 95, 280, 11, 8);
  ctx.fill();
  ctx.fillStyle = '#2a1c22';
  circle(ctx, 87, 268, 2.6);
  ctx.fill();
  circle(ctx, 103, 268, 2.6);
  ctx.fill();
  circle(ctx, 95, 278, 2.2);
  ctx.fill();
  ctx.fillStyle = B ? '#3d7dd9' : '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(95, 296);
  ctx.lineTo(82, 288);
  ctx.lineTo(82, 304);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(95, 296);
  ctx.lineTo(108, 288);
  ctx.lineTo(108, 304);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 95, 296, 3.4);
  ctx.fill();

  // Toy train: engine, two cars, and chimney smoke (B has none).
  ctx.fillStyle = '#2a2a33';
  for (const wx of [222, 244, 282, 306, 330, 352]) {
    circle(ctx, wx, 326, 6);
    ctx.fill();
  }
  ctx.fillStyle = '#c94f43';
  ctx.fillRect(210, 292, 58, 34);
  ctx.fillRect(210, 270, 32, 24);
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(216, 276, 12, 12);
  ctx.fillStyle = '#2a2a33';
  ctx.fillRect(252, 260, 10, 14);
  if (!B) {
    ctx.fillStyle = 'rgba(247,240,225,0.85)';
    circle(ctx, 257, 250, 7);
    ctx.fill();
    circle(ctx, 263, 238, 9);
    ctx.fill();
    circle(ctx, 272, 226, 11);
    ctx.fill();
  }
  ctx.fillStyle = '#4a7fc9';
  ctx.fillRect(272, 296, 44, 30);
  ctx.fillStyle = '#f2c94c';
  circle(ctx, 294, 288, 7);
  ctx.fill();
  ctx.fillStyle = '#5da85d';
  ctx.fillRect(320, 296, 44, 30);
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(330, 284, 24, 12);
  ctx.fill();

  // Dollhouse with two windows (B leaves the right one dark).
  ctx.fillStyle = '#e8a0b4';
  ctx.fillRect(388, 272, 76, 58);
  ctx.fillStyle = '#b84a5a';
  ctx.beginPath();
  ctx.moveTo(380, 272);
  ctx.lineTo(502, 272);
  ctx.lineTo(441, 238);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(398, 282, 16, 16);
  ctx.fillStyle = B ? '#5a4a6a' : '#ffd76a';
  ctx.fillRect(440, 282, 16, 16);
  ctx.strokeStyle = '#7a3a4a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(398, 282, 16, 16);
  ctx.strokeRect(440, 282, 16, 16);
  ctx.fillStyle = '#7a4a2a';
  ctx.fillRect(424, 300, 18, 30);

  // Marble jar on the sill (B has a second one beside it).
  function jar(x) {
    ctx.fillStyle = 'rgba(220,235,245,0.35)';
    rr(ctx, x, 404, 24, 30, 5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(247,240,225,0.7)';
    ctx.lineWidth = 1.2;
    rr(ctx, x, 404, 24, 30, 5);
    ctx.stroke();
    const cols = ['#e5534b', '#4a7fc9', '#5da85d', '#f2c94c'];
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = cols[i];
      circle(ctx, x + 6 + (i % 2) * 11, 420 + Math.floor(i / 2) * 8, 3.4);
      ctx.fill();
    }
  }
  jar(76);
  if (B) jar(110);

  // Cat asleep on the sill, tail curled up in A, flat in B.
  ctx.fillStyle = '#e8a34c';
  ellipse(ctx, 452, 424, 34, 10);
  ctx.fill();
  circle(ctx, 422, 420, 12);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(414, 411);
  ctx.lineTo(417, 402);
  ctx.lineTo(422, 410);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(424, 410);
  ctx.lineTo(430, 402);
  ctx.lineTo(432, 411);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8a34c';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (B) {
    ctx.moveTo(484, 426);
    ctx.lineTo(512, 428);
  } else {
    ctx.moveTo(484, 424);
    ctx.quadraticCurveTo(500, 404, 492, 394);
  }
  ctx.stroke();

  grain(ctx, random, 90, PANEL_W, PANEL_H);
  vignette(ctx, PANEL_W, PANEL_H);
}

/* ------------------------------------------------------------------ scene 2 */

function paintRooftop(ctx, variant, random) {
  const B = variant === 'B';
  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#0a0e2a');
  sky.addColorStop(0.6, '#1c2c5c');
  sky.addColorStop(1, '#2a4a7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 360);
  // Stars.
  for (let i = 0; i < 70; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${range(random, 0.35, 0.95)})`;
    const r = range(random, 0.8, 2.1);
    circle(ctx, range(random, 8, 552), range(random, 8, 330), r);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 8; i += 1) star4(ctx, range(random, 20, 540), range(random, 15, 300), range(random, 1.5, 3));
  // The Dipper: four stars joined by faint lines (B loses the second star).
  const dipper = [
    [120, 70],
    [160, 55],
    [200, 70],
    [235, 100],
  ];
  ctx.strokeStyle = 'rgba(180,200,255,0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(dipper[0][0], dipper[0][1]);
  for (const [x, y] of dipper.slice(1)) ctx.lineTo(x, y);
  ctx.stroke();
  dipper.forEach(([x, y], i) => {
    if (B && i === 1) return;
    ctx.fillStyle = '#ffffff';
    star4(ctx, x, y, 5);
  });
  // The moon with three craters (B loses one).
  const glow = ctx.createRadialGradient(440, 85, 10, 440, 85, 90);
  glow.addColorStop(0, 'rgba(245,238,218,0.5)');
  glow.addColorStop(1, 'rgba(245,238,218,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(340, 0, 200, 180);
  ctx.fillStyle = '#f5eeda';
  circle(ctx, 440, 85, 42);
  ctx.fill();
  ctx.fillStyle = '#ddd2b4';
  circle(ctx, 425, 75, 8);
  ctx.fill();
  if (!B) {
    circle(ctx, 455, 95, 6);
    ctx.fill();
  }
  circle(ctx, 435, 105, 5);
  ctx.fill();
  // Rooftop floor and parapet.
  ctx.fillStyle = '#2e3550';
  ctx.fillRect(0, 340, PANEL_W, 20);
  ctx.fillStyle = '#232838';
  ctx.fillRect(0, 360, PANEL_W, 100);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 40; x < PANEL_W; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 360);
    ctx.lineTo(x, 460);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, 410);
  ctx.lineTo(PANEL_W, 410);
  ctx.stroke();

  // String lights across the top (B leaves one bulb dark).
  ctx.strokeStyle = '#3a2c4d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(16, 26);
  ctx.quadraticCurveTo(280, 52, 544, 26);
  ctx.stroke();
  for (let i = 0; i < 12; i += 1) {
    const t = i / 11;
    const x = 16 + t * 528;
    const y = 26 + Math.sin(t * Math.PI) * 13 + 8;
    ctx.strokeStyle = '#3a2c4d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = B && i === 6 ? '#4a4460' : '#ffd76a';
    circle(ctx, x, y + 4, 5);
    ctx.fill();
  }

  // Telescope on its tripod (B has the red lens cap on).
  ctx.strokeStyle = '#7a6a4a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(170, 300);
  ctx.lineTo(138, 362);
  ctx.moveTo(170, 300);
  ctx.lineTo(202, 362);
  ctx.moveTo(170, 300);
  ctx.lineTo(170, 362);
  ctx.stroke();
  ctx.fillStyle = '#8a7a55';
  circle(ctx, 170, 296, 9);
  ctx.fill();
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 17;
  ctx.beginPath();
  ctx.moveTo(176, 292);
  ctx.lineTo(252, 218);
  ctx.stroke();
  ctx.strokeStyle = '#8a7a55';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(176, 292);
  ctx.lineTo(162, 306);
  ctx.stroke();
  ctx.fillStyle = '#5a4a30';
  circle(ctx, 256, 214, 10);
  ctx.fill();
  if (B) {
    ctx.fillStyle = '#c94f43';
    circle(ctx, 258, 212, 9);
    ctx.fill();
    ctx.fillStyle = '#a83a32';
    circle(ctx, 258, 212, 4);
    ctx.fill();
  }

  // Chimney with a cat on top (B has no cat).
  ctx.fillStyle = '#8a4a3b';
  ctx.fillRect(410, 270, 44, 90);
  ctx.fillStyle = '#a85a48';
  ctx.fillRect(404, 262, 56, 10);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1;
  for (const y of [290, 312, 334]) {
    ctx.beginPath();
    ctx.moveTo(410, y);
    ctx.lineTo(454, y);
    ctx.stroke();
  }
  if (!B) {
    ctx.fillStyle = '#2e2a33';
    ellipse(ctx, 432, 250, 16, 11);
    ctx.fill();
    circle(ctx, 432, 234, 9);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(425, 228);
    ctx.lineTo(427, 220);
    ctx.lineTo(431, 227);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(433, 227);
    ctx.lineTo(437, 220);
    ctx.lineTo(439, 228);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2e2a33';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(446, 254);
    ctx.quadraticCurveTo(456, 240, 450, 232);
    ctx.stroke();
  }

  // Potted plants (the middle flower is red in A, yellow in B).
  function pot(x, flower) {
    ctx.fillStyle = '#5da85d';
    for (let i = 0; i < 5; i += 1) {
      ellipse(ctx, x - 12 + i * 6, 336 - (i % 2) * 8, 5, 12);
      ctx.fill();
    }
    if (flower) {
      ctx.strokeStyle = '#5da85d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, 336);
      ctx.lineTo(x, 322);
      ctx.stroke();
      ctx.fillStyle = flower;
      for (let i = 0; i < 5; i += 1) {
        const a = (i / 5) * Math.PI * 2;
        circle(ctx, x + Math.cos(a) * 6, 318 + Math.sin(a) * 6, 4.5);
        ctx.fill();
      }
      ctx.fillStyle = '#f2c94c';
      circle(ctx, x, 318, 3.5);
      ctx.fill();
    }
    ctx.fillStyle = '#b85a3a';
    ctx.beginPath();
    ctx.moveTo(x - 16, 344);
    ctx.lineTo(x + 16, 344);
    ctx.lineTo(x + 12, 362);
    ctx.lineTo(x - 12, 362);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d07a52';
    ctx.fillRect(x - 18, 340, 36, 6);
  }
  pot(70, null);
  pot(320, B ? '#f2c94c' : '#e5534b');
  pot(510, null);

  // Mug of cocoa on a stool, steam curling up (B has none).
  ctx.fillStyle = '#6a4a2a';
  ctx.fillRect(286, 384, 30, 6);
  ctx.fillRect(296, 390, 4, 22);
  ctx.fillRect(306, 390, 4, 22);
  ctx.fillStyle = '#c94f43';
  rr(ctx, 288, 362, 26, 22, 4);
  ctx.fill();
  ctx.strokeStyle = '#c94f43';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(316, 373, 6, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  if (!B) {
    ctx.strokeStyle = 'rgba(247,240,225,0.75)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(296, 358);
    ctx.quadraticCurveTo(292, 348, 297, 340);
    ctx.moveTo(306, 358);
    ctx.quadraticCurveTo(310, 348, 305, 340);
    ctx.stroke();
  }

  // Open notebook with a star chart on the floor.
  ctx.fillStyle = '#f7f0e1';
  ctx.save();
  ctx.translate(110, 414);
  ctx.rotate(-0.06);
  rr(ctx, -34, -14, 68, 28, 3);
  ctx.fill();
  ctx.strokeStyle = '#b9a8c9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(0, 14);
  ctx.stroke();
  ctx.fillStyle = '#3a2c4d';
  for (const [sx, sy] of [[-24, -6], [-12, 4], [-20, 8], [12, -6], [22, 4], [16, 8]]) {
    circle(ctx, sx, sy, 1.8);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(-24, -6);
  ctx.lineTo(-12, 4);
  ctx.lineTo(12, -6);
  ctx.lineTo(22, 4);
  ctx.stroke();
  ctx.restore();

  grain(ctx, random, 60, PANEL_W, PANEL_H);
  vignette(ctx, PANEL_W, PANEL_H);
}

/* ------------------------------------------------------------------ scene 3 */

function paintKitchen(ctx, variant, random) {
  const B = variant === 'B';
  // Cream wall.
  ctx.fillStyle = '#f2e3c2';
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  ctx.strokeStyle = 'rgba(120,90,50,0.12)';
  ctx.lineWidth = 1;
  for (let y = 300; y < PANEL_H; y += 34) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(PANEL_W, y);
    ctx.stroke();
  }
  // Wall plates, left (B loses the middle one).
  const plates = [90, 150, 210];
  plates.forEach((y, i) => {
    if (B && i === 1) return;
    ctx.fillStyle = '#ffffff';
    circle(ctx, 70, y, 19);
    ctx.fill();
    ctx.strokeStyle = '#4a7fc9';
    ctx.lineWidth = 2;
    circle(ctx, 70, y, 14);
    ctx.stroke();
    ctx.fillStyle = '#4a7fc9';
    circle(ctx, 70, y, 4);
    ctx.fill();
    for (let k = 0; k < 6; k += 1) {
      const a = (k / 6) * Math.PI * 2;
      circle(ctx, 70 + Math.cos(a) * 9, y + Math.sin(a) * 9, 1.8);
      ctx.fill();
    }
  });
  // Window with the sea, the lighthouse and a boat.
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(150, 40, 260, 200);
  const seaSky = ctx.createLinearGradient(0, 52, 0, 228);
  seaSky.addColorStop(0, '#bfe3f2');
  seaSky.addColorStop(0.45, '#dceef5');
  seaSky.addColorStop(0.46, '#7fb8d4');
  seaSky.addColorStop(1, '#3a7ca8');
  ctx.fillStyle = seaSky;
  ctx.fillRect(162, 52, 236, 176);
  // Sun.
  ctx.fillStyle = '#ffd76a';
  circle(ctx, 192, 82, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,215,106,0.8)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(192 + Math.cos(a) * 24, 82 + Math.sin(a) * 24);
    ctx.lineTo(192 + Math.cos(a) * 30, 82 + Math.sin(a) * 30);
    ctx.stroke();
  }
  // Waves.
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 2;
  for (const [wx, wy] of [[200, 190], [260, 205], [330, 185], [370, 215]]) {
    ctx.beginPath();
    ctx.arc(wx, wy, 10, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  // Boat (B has none).
  if (!B) {
    ctx.fillStyle = '#7a4a2a';
    ctx.beginPath();
    ctx.moveTo(192, 186);
    ctx.lineTo(220, 186);
    ctx.lineTo(214, 196);
    ctx.lineTo(198, 196);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e5534b';
    ctx.beginPath();
    ctx.moveTo(206, 184);
    ctx.lineTo(206, 162);
    ctx.lineTo(220, 184);
    ctx.closePath();
    ctx.fill();
  }
  // Rocks and lighthouse.
  ctx.fillStyle = '#5a5a66';
  ellipse(ctx, 330, 222, 42, 12);
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(322, 130, 16, 84);
  ctx.fillStyle = '#c94f43';
  ctx.fillRect(322, 148, 16, 10);
  ctx.fillRect(322, 178, 16, 10);
  ctx.fillStyle = '#3a2c4d';
  ctx.fillRect(320, 118, 20, 12);
  ctx.fillStyle = '#ffd76a';
  circle(ctx, 330, 112, 6);
  ctx.fill();
  // The beam (B has none).
  if (!B) {
    ctx.fillStyle = 'rgba(255,215,106,0.35)';
    ctx.beginPath();
    ctx.moveTo(330, 112);
    ctx.lineTo(250, 84);
    ctx.lineTo(250, 132);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(330, 112);
    ctx.lineTo(398, 92);
    ctx.lineTo(398, 128);
    ctx.closePath();
    ctx.fill();
  }
  // Window cross bars.
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(276, 52, 8, 176);
  ctx.fillRect(162, 134, 236, 8);
  // Counter under the window.
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(0, 250, PANEL_W, 22);
  ctx.fillStyle = '#c08a52';
  ctx.fillRect(0, 250, PANEL_W, 5);
  // Little lighthouse model on the counter.
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(372, 228, 12, 22);
  ctx.fillStyle = '#c94f43';
  ctx.fillRect(372, 234, 12, 5);
  ctx.fillStyle = '#3a2c4d';
  ctx.fillRect(371, 222, 14, 6);
  // Hanging herbs (B loses the second bunch).
  function herbs(x) {
    ctx.strokeStyle = '#8a7a55';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 272);
    ctx.lineTo(x, 286);
    ctx.stroke();
    ctx.fillStyle = '#5da85d';
    ellipse(ctx, x, 296, 8, 14);
    ctx.fill();
    ctx.fillStyle = '#7dc383';
    ellipse(ctx, x - 4, 292, 4, 8);
    ctx.fill();
    ellipse(ctx, x + 4, 300, 4, 8);
    ctx.fill();
  }
  herbs(248);
  if (!B) herbs(284);

  // Stove and kettle (B has no steam).
  ctx.fillStyle = '#4a4a55';
  rr(ctx, 428, 282, 112, 92, 8);
  ctx.fill();
  ctx.fillStyle = '#2a2a33';
  circle(ctx, 458, 306, 12);
  ctx.fill();
  circle(ctx, 506, 306, 12);
  ctx.fill();
  ctx.fillStyle = '#8a8a96';
  circle(ctx, 458, 306, 7);
  ctx.fill();
  circle(ctx, 506, 306, 7);
  ctx.fill();
  ctx.fillStyle = '#5a5a66';
  ctx.fillRect(428, 282, 112, 8);
  // Kettle.
  ctx.fillStyle = '#b8bcc9';
  ellipse(ctx, 476, 268, 20, 14);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(492, 262);
  ctx.lineTo(506, 250);
  ctx.lineTo(508, 258);
  ctx.lineTo(494, 270);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8a8a96';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(458, 268, 9, Math.PI * 0.6, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = '#3a2c4d';
  circle(ctx, 476, 252, 3.5);
  ctx.fill();
  if (!B) {
    ctx.strokeStyle = 'rgba(120,120,130,0.8)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(472, 246);
    ctx.quadraticCurveTo(468, 236, 473, 228);
    ctx.moveTo(482, 246);
    ctx.quadraticCurveTo(486, 236, 481, 228);
    ctx.stroke();
  }

  // Radio on the shelf (B folds the antenna down).
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(398, 330, 142, 10);
  ctx.fillStyle = '#b84a5a';
  rr(ctx, 438, 296, 72, 34, 6);
  ctx.fill();
  ctx.fillStyle = '#f7f0e1';
  circle(ctx, 456, 313, 9);
  ctx.fill();
  ctx.fillStyle = '#3a2c4d';
  circle(ctx, 456, 313, 4);
  ctx.fill();
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(474, 304, 26, 8);
  ctx.strokeStyle = '#5a5a66';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (B) {
    ctx.moveTo(502, 296);
    ctx.lineTo(526, 288);
  } else {
    ctx.moveTo(502, 296);
    ctx.lineTo(520, 258);
  }
  ctx.stroke();

  // Table with a bowl of apples (B has three, A has four).
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(40, 380, 220, 14);
  ctx.fillRect(56, 394, 10, 52);
  ctx.fillRect(234, 394, 10, 52);
  ctx.fillStyle = '#4a7fc9';
  ctx.beginPath();
  ctx.moveTo(96, 368);
  ctx.lineTo(168, 368);
  ctx.quadraticCurveTo(160, 384, 132, 384);
  ctx.quadraticCurveTo(104, 384, 96, 368);
  ctx.closePath();
  ctx.fill();
  const apples = [
    [112, 360],
    [130, 354],
    [148, 360],
    [163, 356],
  ];
  apples.forEach(([ax, ay], i) => {
    if (B && i === 3) return;
    ctx.fillStyle = '#d94f3d';
    circle(ctx, ax, ay, 9);
    ctx.fill();
    ctx.strokeStyle = '#5da85d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay - 8);
    ctx.lineTo(ax + 3, ay - 13);
    ctx.stroke();
  });
  // Rug under the table.
  ctx.fillStyle = '#c96f6f';
  ellipse(ctx, 150, 448, 120, 12);
  ctx.fill();
  ctx.fillStyle = '#e8a0a0';
  ellipse(ctx, 150, 448, 84, 8);
  ctx.fill();

  // Cat asleep on a chair.
  ctx.fillStyle = '#7a5a3a';
  ctx.fillRect(330, 380, 8, 66);
  ctx.fillRect(330, 380, 66, 8);
  ctx.fillRect(388, 380, 8, 66);
  ctx.fillStyle = '#e8a34c';
  ellipse(ctx, 362, 374, 26, 10);
  ctx.fill();
  circle(ctx, 342, 370, 10);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(335, 362);
  ctx.lineTo(337, 354);
  ctx.lineTo(342, 361);
  ctx.closePath();
  ctx.fill();

  grain(ctx, random, 70, PANEL_W, PANEL_H);
  vignette(ctx, PANEL_W, PANEL_H);
}

/* ------------------------------------------------------------------ registry */

export const SCENES = [
  {
    id: 'toyshop',
    name: 'The Toy Shop Window',
    subtitle: 'Dusk on Willow Lane · 7 differences',
    seed: 101,
    paint: paintToyShop,
    diffs: [
      { id: 'bow', label: "Teddy's bow changed colour", x: 95, y: 296, r: 22 },
      { id: 'balloon', label: 'A balloon floated away', x: 350, y: 88, r: 24 },
      { id: 'smoke', label: "The train's smoke is gone", x: 263, y: 240, r: 22 },
      { id: 'window', label: 'A dollhouse window went dark', x: 448, y: 290, r: 20 },
      { id: 'jar', label: 'An extra marble jar appeared', x: 122, y: 419, r: 20 },
      { id: 'kite', label: 'The kite lost a tail bow', x: 95, y: 180, r: 18 },
      { id: 'tail', label: "The cat's tail uncurled", x: 495, y: 405, r: 20 },
    ],
  },
  {
    id: 'rooftop',
    name: "The Astronomer's Rooftop",
    subtitle: 'A clear night above the town · 7 differences',
    seed: 202,
    paint: paintRooftop,
    diffs: [
      { id: 'crater', label: 'A moon crater vanished', x: 455, y: 95, r: 18 },
      { id: 'star', label: 'A star left the Dipper', x: 160, y: 55, r: 18 },
      { id: 'cap', label: 'A lens cap appeared', x: 258, y: 212, r: 20 },
      { id: 'cat', label: 'The chimney cat slipped away', x: 432, y: 248, r: 24 },
      { id: 'steam', label: "The cocoa's steam is gone", x: 301, y: 348, r: 18 },
      { id: 'flower', label: 'A flower changed colour', x: 320, y: 318, r: 20 },
      { id: 'bulb', label: 'A fairy light went out', x: 304, y: 51, r: 16 },
    ],
  },
  {
    id: 'kitchen',
    name: "The Lighthouse Keeper's Kitchen",
    subtitle: 'Morning by the sea · 7 differences',
    seed: 303,
    paint: paintKitchen,
    diffs: [
      { id: 'boat', label: 'The little boat sailed off', x: 206, y: 184, r: 20 },
      { id: 'beam', label: "The lighthouse beam went out", x: 292, y: 106, r: 22 },
      { id: 'steam', label: "The kettle's steam is gone", x: 477, y: 236, r: 18 },
      { id: 'plate', label: 'A wall plate is missing', x: 70, y: 150, r: 20 },
      { id: 'apple', label: 'An apple left the bowl', x: 163, y: 356, r: 18 },
      { id: 'antenna', label: 'The radio antenna folded down', x: 520, y: 262, r: 20 },
      { id: 'herbs', label: 'A bunch of herbs is gone', x: 284, y: 300, r: 18 },
    ],
  },
];

/** Paint one scene into the current transform: the scene always fills a 560x460 box. */
export function paintScene(ctx, scene, variant, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_W, PANEL_H);
  ctx.clip();
  scene.paint(ctx, variant, createRandom(scene.seed));
  ctx.restore();
}
