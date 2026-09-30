// Pure Web Audio API Synthesizer - Ultra Annoying Nature & Organic Sounds
class NatureAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private mosquitoOsc: OscillatorNode | null = null;
  private mosquitoGain: GainNode | null = null;
  private isMosquitoDroning: boolean = false;
  private isDialUpPlaying: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Annoying Mosquito Drone that buzzes around your ear
  toggleMosquito(enable?: boolean): boolean {
    const ctx = this.getContext();
    const shouldEnable = enable !== undefined ? enable : !this.isMosquitoDroning;

    if (shouldEnable) {
      if (this.isMosquitoDroning) return true;
      try {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();

        // 720 Hz carrier wave with micro frequency flutter (mosquito wingbeats)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(740, ctx.currentTime);

        // LFO fluttering frequency at 25 Hz
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(28, ctx.currentTime);
        lfoGain.gain.setValueAtTime(45, ctx.currentTime);

        lfo.connect(osc.frequency);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        // Lowpass filter to muffle/brighten
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(4, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();

        this.mosquitoOsc = osc;
        this.mosquitoGain = gain;
        this.isMosquitoDroning = true;
        return true;
      } catch (err) {
        console.warn('Mosquito audio failed:', err);
        return false;
      }
    } else {
      if (this.mosquitoOsc) {
        try {
          this.mosquitoGain?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
          setTimeout(() => {
            this.mosquitoOsc?.stop();
            this.mosquitoOsc?.disconnect();
            this.mosquitoOsc = null;
          }, 120);
        } catch {
          // ignore
        }
      }
      this.isMosquitoDroning = false;
      return false;
    }
  }

  getMosquitoStatus(): boolean {
    return this.isMosquitoDroning;
  }

  // Squishy wet mud step sound on clicks
  playMudSquish(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      // Noise pop
      const bufferSize = ctx.sampleRate * 0.08;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start();
      noise.start();
      osc.stop(ctx.currentTime + 0.14);
      noise.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Dry twig snap sound
  playTwigSnap(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  // Cicada burst chorus
  playCicadaChirp(duration = 2.5): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(4400, ctx.currentTime);

      lfo.frequency.setValueAtTime(45, ctx.currentTime);
      lfoGain.gain.setValueAtTime(1200, ctx.currentTime);
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.5);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      lfo.start();
      osc.stop(ctx.currentTime + duration);
      lfo.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  // 8-bit Explosion for Locust Swarm mine hits
  playExplosion(): void {
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.8;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
    } catch {
      // ignore
    }
  }

  playDialUp(durationSeconds: number = 8): void {
    if (this.isDialUpPlaying) return;
    try {
      const ctx = this.getContext();
      this.isDialUpPlaying = true;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.setValueAtTime(350, ctx.currentTime);
      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 1.3);
      osc2.stop(ctx.currentTime + 1.3);

      setTimeout(() => {
        this.isDialUpPlaying = false;
      }, durationSeconds * 1000);
    } catch {
      this.isDialUpPlaying = false;
    }
  }

  playClick(): void {
    this.playMudSquish();
  }

  playBuzzer(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }
}

export const sounds = new NatureAudioSynthesizer();
