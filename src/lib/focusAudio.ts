// Web Audio API Focus Synthesizer: 40Hz Gamma, Alpha Waves, Brown Noise & Completion Bell
// 100% offline, zero network requests, zero mp3 dependencies

export type AmbientSoundType = 'none' | 'gamma' | 'alpha' | 'brown';

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentType: AmbientSoundType = 'none';
  private masterGain: GainNode | null = null;
  private nodes: (AudioNode | { stop?: () => void; disconnect: () => void })[] = [];
  private volume = 0.5;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx || this.ctx.state === 'suspended') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.volume;
  }

  getCurrentSound() {
    return this.currentType;
  }

  stop() {
    try {
      this.nodes.forEach(node => {
        try {
          if ('stop' in node && typeof node.stop === 'function') {
            node.stop();
          }
          node.disconnect();
        } catch {}
      });
      this.nodes = [];
      this.isPlaying = false;
      this.currentType = 'none';
    } catch {}
  }

  startSound(type: AmbientSoundType) {
    this.stop();
    if (type === 'none') return;

    const ctx = this.getContext();
    if (!ctx) return;

    const master = ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.35, ctx.currentTime);
    master.connect(ctx.destination);
    this.masterGain = master;
    this.nodes.push(master);

    if (type === 'gamma') {
      // 40Hz Isochronic / Binaural Focus: 200Hz base + 240Hz offset
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(200, ctx.currentTime);
      gain1.gain.setValueAtTime(0.5, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(240, ctx.currentTime); // 240 - 200 = 40Hz difference
      gain2.gain.setValueAtTime(0.5, ctx.currentTime);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(master);
      gain2.connect(master);

      osc1.start();
      osc2.start();
      this.nodes.push(osc1, osc2, gain1, gain2);
    } else if (type === 'alpha') {
      // 10Hz Alpha Waves (190Hz + 200Hz) with gentle filter
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(190, ctx.currentTime);
      gain1.gain.setValueAtTime(0.4, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(200, ctx.currentTime);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(master);
      gain2.connect(master);

      osc1.start();
      osc2.start();
      this.nodes.push(osc1, osc2, gain1, gain2);
    } else if (type === 'brown') {
      // 5-second looping buffer of brownian noise (integrated white noise)
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain boost for deep low-end
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Low-pass filter at 450Hz to keep it deep and soothing
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(master);
      noiseSource.start();

      this.nodes.push(noiseSource, filter);
    }

    this.isPlaying = true;
    this.currentType = type;
  }

  /**
   * Deep Tibetan bell tone when lock-in timer completes
   */
  playCompletionBell() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const baseFreq = 432;
      const harmonics = [1, 2, 3.02, 4.15];
      const gains = [0.4, 0.2, 0.1, 0.05];

      harmonics.forEach((h, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * h, ctx.currentTime);

        const dur = 4.0;
        gain.gain.setValueAtTime(gains[idx], ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      });

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([100, 100, 200, 100, 300]); } catch {}
      }
    } catch {}
  }
}

export const focusAudio = new FocusAudioEngine();
