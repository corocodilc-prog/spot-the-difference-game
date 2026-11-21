// Every tuning number and colour in one place. The playfield is a fixed 1280x720 logical area;
// the renderer scales it to the window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** One picture's size inside the playfield; both pictures share it. */
export const PANEL = { width: 560, height: 460 };
export const PANEL_A = { x: 40, y: 110 };
export const PANEL_B = { x: 680, y: 110 };

/** How many differences each scene hides, and how many hints a scene grants. */
export const DIFFS_PER_SCENE = 7;
export const HINTS_PER_SCENE = 3;

/** Score: each find, each miss, and the win bonus for a fast, careful round. */
export const SCORE = { find: 100, streak: 25, miss: -25, winTimeBonus: 300 };

/** Stars on the win screen: 3 stars need few misses and a quick round. */
export const STARS = { threeMaxMisses: 2, threeMaxSeconds: 90, twoMaxMisses: 5, twoMaxSeconds: 180 };

export const PALETTE = {
  backdrop: '#191423',
  hud: '#241b30',
  hudLine: '#3a2c4d',
  panelFrame: '#f3e2c7',
  panelShadow: 'rgba(0,0,0,0.45)',
  text: '#f7f0e1',
  muted: '#b9a8c9',
  gold: '#f2c94c',
  goldDeep: '#d99a26',
  green: '#7dc383',
  red: '#e5534b',
  chip: '#2e2340',
  button: '#3a2c4d',
  buttonHover: '#4a3870',
  accent: '#ffb454',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best result is kept between visits (this browser only). */
export const BEST_KEY = 'twinkle-toys.best';
export const MUTE_KEY = 'twinkle-toys.muted';
