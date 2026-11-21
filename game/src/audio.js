// All sound is synthesized with WebAudio: no audio files, no network request. The context is
// created on the first user gesture (browsers block sound before one); every call before that is
// a silent no-op. Mute is kept in localStorage.

import { MUTE_KEY } from './config.js';

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function createAudio() {
  let context = null;
  let muted = readMuted();

  function ensure() {
    if (context !== null || muted) return context;
    try {
      const Ctor = window.AudioContext ?? window.webkitAudioContext;
      if (!Ctor) return null;
      context = new Ctor();
    } catch {
      context = null;
    }
    return context;
  }

  function tone(freq, at, dur, type, gain) {
    const ctx = ensure();
    if (ctx === null) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + at);
    amp.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + at + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(ctx.currentTime + at);
    osc.stop(ctx.currentTime + at + dur + 0.05);
  }

  function unlock() {
    const ctx = ensure();
    if (ctx !== null && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  return {
    unlock,
    isMuted() {
      return muted;
    },
    toggleMuted() {
      muted = !muted;
      try {
        window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
      } catch {
        // Storage can be off: the mute then lasts this visit only.
      }
      return muted;
    },
    /** A soft tick for ordinary clicks. */
    click() {
      tone(660, 0, 0.06, 'sine', 0.08);
    },
    /** A bright two-note pop when a difference is found. */
    find() {
      tone(523.25, 0, 0.12, 'sine', 0.16);
      tone(783.99, 0.07, 0.18, 'sine', 0.16);
    },
    /** A low buzz for a wrong click. */
    miss() {
      tone(110, 0, 0.18, 'sawtooth', 0.1);
      tone(98, 0.05, 0.18, 'sawtooth', 0.08);
    },
    /** A gentle chime when a hint lights up. */
    hint() {
      tone(880, 0, 0.25, 'sine', 0.1);
      tone(1174.66, 0.09, 0.3, 'sine', 0.08);
    },
    /** A rising arpeggio for a finished scene. */
    win() {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(freq, i * 0.11, 0.28, 'triangle', 0.14));
    },
  };
}
