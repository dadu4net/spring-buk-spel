// Barbie & Lion King Run - Web Audio API Sound Synthesizer
class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
    this.theme = 'barbie'; // 'barbie' | 'lionking'
  }

  setTheme(theme) {
    this.theme = theme;
    if (this.isBgmPlaying) {
      this.stopBgm();
      this.startBgm();
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  // Jump sound
  playJump() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.theme === 'lionking') {
        // Wooden marimba leap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      } else {
        // Cheerful synth leap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn(e);
    }
  }

  // Slide sound
  playSlide() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.theme === 'lionking' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn(e);
    }
  }

  // Collect item (Heart or Bug/Paw)
  playCollectHeart() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = this.theme === 'lionking' 
        ? [349.23, 440.00, 523.25, 698.46] // F4, A4, C5, F5 (Marimba sunshine)
        : [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Chime)

      notes.forEach((freq, i) => {
        const noteTime = now + (i * 0.04);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = this.theme === 'lionking' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.12);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Power-Up / Shield Fanfare (Sparkle Shield or Roar of the Elders)
  playPowerup() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = this.theme === 'lionking'
        ? [293.66, 369.99, 440.00, 587.33, 739.99, 880.00] // D major triumph
        : [440, 554.37, 659.25, 880, 1108.73, 1318.51];

      notes.forEach((freq, i) => {
        const noteTime = now + (i * 0.05);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = this.theme === 'lionking' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.22);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Hit / Crash sound
  playHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(this.theme === 'lionking' ? 180 : 220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn(e);
    }
  }

  // Knockaway / Beuk sound: comic impact + high celebratory chime
  playKnockaway() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      
      // 1. Comic punchy impact
      const oscPunch = this.ctx.createOscillator();
      const gainPunch = this.ctx.createGain();
      oscPunch.type = this.theme === 'lionking' ? 'triangle' : 'sine';
      oscPunch.frequency.setValueAtTime(160, now);
      oscPunch.frequency.exponentialRampToValueAtTime(40, now + 0.14);

      gainPunch.gain.setValueAtTime(0.45, now);
      gainPunch.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      oscPunch.connect(gainPunch);
      gainPunch.connect(this.ctx.destination);
      oscPunch.start(now);
      oscPunch.stop(now + 0.14);

      // 2. Rising reward chimes
      const notes = this.theme === 'lionking' ? [440, 554, 659, 880] : [587, 740, 880, 1174];
      notes.forEach((freq, i) => {
        const t = now + 0.05 + (i * 0.035);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Milestone celebration (every 100m)
  playMilestone() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, i) => {
        const noteTime = now + (i * 0.06);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Background cheerful melody loop
  startBgm() {
    if (this.isMuted || this.isBgmPlaying || !this.ctx) return;
    this.isBgmPlaying = true;
    
    // Barbie Pop Melody vs Lion King Safari Marimba Melody
    const barbieMelody = [
      { note: 523.25, dur: 0.2 }, { note: 659.25, dur: 0.2 }, { note: 783.99, dur: 0.2 }, { note: 659.25, dur: 0.2 },
      { note: 880.00, dur: 0.3 }, { note: 783.99, dur: 0.3 }, { note: 659.25, dur: 0.4 },
      { note: 587.33, dur: 0.2 }, { note: 659.25, dur: 0.2 }, { note: 783.99, dur: 0.2 }, { note: 880.00, dur: 0.2 },
      { note: 1046.50, dur: 0.4 }, { note: 880.00, dur: 0.4 }
    ];

    const lionKingMelody = [
      { note: 293.66, dur: 0.18 }, { note: 329.63, dur: 0.18 }, { note: 369.99, dur: 0.18 }, { note: 440.00, dur: 0.25 },
      { note: 369.99, dur: 0.18 }, { note: 440.00, dur: 0.35 }, { note: 587.33, dur: 0.4 },
      { note: 440.00, dur: 0.2 }, { note: 369.99, dur: 0.2 }, { note: 329.63, dur: 0.3 }, { note: 293.66, dur: 0.4 }
    ];

    const melody = this.theme === 'lionking' ? lionKingMelody : barbieMelody;

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;
      const current = melody[noteIndex];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.theme === 'lionking' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(current.note, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + current.dur);

      noteIndex = (noteIndex + 1) % melody.length;
      this.bgmTimer = setTimeout(playNext, (current.dur + 0.08) * 1000);
    };

    playNext();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

window.SoundController = SoundController;
