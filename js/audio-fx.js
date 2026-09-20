/**
 * KURO FANGS — PROCEDURAL INTERACTIVE AUDIO ENGINE (SOUND FX)
 * Ultra-lightweight Web Audio API Procedural Synthesizer (0 KB external audio files)
 * Linear / Raycast / Apple caliber micro-interactions, mascot feedback & quiz sounds.
 */

(function(window) {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let isUnlocked = false;
  let lastPlayTime = 0;
  const MIN_INTERVAL_MS = 35; // Debounce threshold for rapid clicks

  // Persistent user preference (defaults to true)
  let soundEnabled = true;
  try {
    const stored = localStorage.getItem('kf_sound_fx_enabled');
    soundEnabled = stored === null ? true : stored === 'true';
  } catch (e) {
    soundEnabled = true;
  }

  /**
   * Initializes the AudioContext on first user interaction to comply with browser autoplay policy
   */
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(soundEnabled ? 0.35 : 0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function unlockAudio() {
    if (isUnlocked) return;
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          isUnlocked = true;
        }).catch(() => {});
      } else {
        isUnlocked = true;
      }
    }
  }

  // Bind unlocker to standard user gestures
  ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });

  /**
   * Sound Synthesis Library (Pure Web Audio Mathematics)
   */
  const SoundSynthesizers = {
    // 1. Subtle, crisp Apple/Linear style tactile micro-click
    tap(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Small randomized pitch jitter (+/- 25Hz) so rapid clicks feel organic
      const jitter = (Math.random() - 0.5) * 50;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1350 + jitter, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.026);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.028);
    },

    // 2. Soft velvet bubble pop for tags, segmented tabs, and chips
    pop(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.038);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.042);
    },

    // 3. Crisp mechanical tick-tock dual-tone for switches & toggles
    switch(ctx, now) {
      [420, 840].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.022;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.02);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.022);
      });
    },

    // 4. Soft airy whoosh for opening modals, drawers & panes
    woosh(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.085);
    },

    // 5. Gentle descending tone for closing modals
    close(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.065);
    },

    // 6. Friendly synthesized vocal chirp when clicking Kuro mascot
    kuroTalk(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.linearRampToValueAtTime(840, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.075);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.082);
    },

    // 7. Celebratory cheerful double chirp for Kuro happy moments
    kuroHappy(ctx, now) {
      const notes = [784, 1175]; // G5 - D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.06);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.07);
      });
    },

    // 8. Gentle bell hum when Kuro is pondering / explanation opens
    kuroThinking(ctx, now) {
      const freqs = [440, 880];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(idx === 0 ? 0.1 : 0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.17);
      });
    },

    // 9. Snappy mechanical snap for selecting an MCQ option
    selectOption(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.024);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.026);
    },

    // 10. Radiant golden harmonic chime for correct MCQ answers
    correct(ctx, now) {
      // C5 - E5 - G5 - C6 arpeggio with golden shimmer
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.065;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.13, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.23);
      });
    },

    // 11. Soft, warm low double-thud for incorrect answers (gentle, encouraging, non-punitive)
    incorrect(ctx, now) {
      [160, 120].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, t + 0.07);

        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.08);
      });
    },

    // 12. Triumphant celebratory fanfare on quiz victory / high score
    victory(ctx, now) {
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },    // C5
        { f: 659.25, t: 0.12, d: 0.12 }, // E5
        { f: 783.99, t: 0.24, d: 0.14 }, // G5
        { f: 1046.5, t: 0.38, d: 0.35 }  // C6 sustain
      ];
      melody.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + note.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(start);
        osc.stop(start + note.d + 0.01);
      });
    },

    // 13. Crisp paper snap / rustle sound for Sheet Copying
    copy(ctx, now) {
      [1400, 2200].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.025;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.02);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.025);
      });
    },

    // 14. Crystalline notification chime for toasts
    toast(ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1175, now); // D6
      osc.frequency.exponentialRampToValueAtTime(1568, now + 0.04); // G6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.13);
    },

    // 15. Starlight twinkle when scoring points or earning badges
    badge(ctx, now) {
      [880, 1175, 1568].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.055;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.15);
      });
    }
  };

  /**
   * Main Public API
   */
  const SoundFX = {
    /**
     * Play a sound effect by name
     * @param {string} type Name of sound (tap, pop, switch, kuroTalk, correct, etc.)
     */
    play(type) {
      if (!soundEnabled) return;
      const nowMs = performance.now();
      if (nowMs - lastPlayTime < MIN_INTERVAL_MS && type === 'tap') {
        return; // Throttling rapid repeated taps
      }
      lastPlayTime = nowMs;

      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const fn = SoundSynthesizers[type] || SoundSynthesizers.tap;
        fn(ctx, ctx.currentTime);
      } catch (err) {
        // Audio playback failures are non-fatal
      }
    },

    /**
     * Toggles sound on/off
     * @returns {boolean} New soundEnabled state
     */
    toggle() {
      soundEnabled = !soundEnabled;
      try {
        localStorage.setItem('kf_sound_fx_enabled', soundEnabled ? 'true' : 'false');
      } catch (e) {}

      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(soundEnabled ? 0.35 : 0, audioCtx.currentTime);
      }

      if (soundEnabled) {
        SoundFX.play('switch');
      }

      window.dispatchEvent(new CustomEvent('kf:sound-toggle', {
        detail: { enabled: soundEnabled }
      }));

      return soundEnabled;
    },

    isEnabled() {
      return soundEnabled;
    },

    setVolume(vol) {
      if (!masterGain || !audioCtx) return;
      const clamped = Math.max(0, Math.min(1, vol));
      masterGain.gain.setValueAtTime(soundEnabled ? clamped * 0.35 : 0, audioCtx.currentTime);
    }
  };

  /**
   * Global Event Delegation: Automatically equips buttons, cards, links, and switches with tactile sound
   */
  function setupGlobalEventDelegation() {
    document.addEventListener('click', (e) => {
      // 1. Explicit sound override
      const customSoundEl = e.target.closest('[data-sound]');
      if (customSoundEl) {
        const sType = customSoundEl.getAttribute('data-sound');
        if (sType === 'none') return;
        SoundFX.play(sType);
        return;
      }

      // 2. Toggle switches and checkboxes
      if (e.target.matches('input[type="checkbox"], input[type="radio"], .switch, .kf-toggle')) {
        SoundFX.play('switch');
        return;
      }

      // 3. Close buttons
      if (e.target.closest('.modal-close, .btn-close, .toast-close, [data-close]')) {
        SoundFX.play('close');
        return;
      }

      // 4. Tab selectors, filter pills & chips
      if (e.target.closest('.kf-segmented-tab, .tab-btn, .filter-chip, .filter-btn, .points-pill, .nav-sub-item')) {
        SoundFX.play('pop');
        return;
      }

      // 5. Standard interactive buttons, links, cards & controls
      const interactiveEl = e.target.closest(
        'button, .btn, a[href], .sidebar-menu-item, .bento-subject-card, .home-lecture-card, .bento-sheet-box, .subject-card, .quiz-card, .header-toggle-btn'
      );
      if (interactiveEl) {
        SoundFX.play('tap');
      }
    }, { capture: true, passive: true });
  }

  // Initialize delegation once DOM is interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGlobalEventDelegation);
  } else {
    setupGlobalEventDelegation();
  }

  // Expose to window
  window.SoundFX = SoundFX;

})(window);
