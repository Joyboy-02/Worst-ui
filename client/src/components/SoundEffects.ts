// Web Audio API pure synthesizer - zero external sound files required!
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private dialUpSource: AudioNode | null = null;
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

  // Synthesizes a harsh 1998 56k Modem dial-up sequence
  playDialUp(durationSeconds: number = 8): void {
    if (this.isDialUpPlaying) return;
    try {
      const ctx = this.getContext();
      this.isDialUpPlaying = true;

      // 1. Dial Tone (350Hz + 440Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(350, ctx.currentTime);
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3);

      osc1.connect(gain);
      osc2.connect(gain);

      // 2. High-pitched handshaking frequencies
      const handshakeOsc = ctx.createOscillator();
      const handshakeGain = ctx.createGain();
      handshakeOsc.type = 'sawtooth';
      handshakeOsc.frequency.setValueAtTime(2100, ctx.currentTime + 1.4);
      handshakeOsc.frequency.linearRampToValueAtTime(1300, ctx.currentTime + 2.5);
      handshakeOsc.frequency.linearRampToValueAtTime(3200, ctx.currentTime + 4.0);

      handshakeGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      handshakeGain.gain.setValueAtTime(0.06, ctx.currentTime + 1.4);
      handshakeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.2);

      handshakeOsc.connect(handshakeGain);

      // 3. White noise carrier screech
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime + 4.0);
      filter.Q.setValueAtTime(3, ctx.currentTime + 4.0);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      noiseGain.gain.setValueAtTime(0.05, ctx.currentTime + 4.0);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);

      // Master output
      gain.connect(ctx.destination);
      handshakeGain.connect(ctx.destination);
      noiseGain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      handshakeOsc.start(ctx.currentTime + 1.4);
      whiteNoise.start(ctx.currentTime + 4.0);

      osc1.stop(ctx.currentTime + 1.3);
      osc2.stop(ctx.currentTime + 1.3);
      handshakeOsc.stop(ctx.currentTime + 4.2);
      whiteNoise.stop(ctx.currentTime + durationSeconds);

      setTimeout(() => {
        this.isDialUpPlaying = false;
      }, durationSeconds * 1000);
    } catch (err) {
      console.warn('[Audio] Failed to synthesize dial-up audio:', err);
      this.isDialUpPlaying = false;
    }
  }

  // 8-bit Explosion for Minesweeper hits
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
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (err) {
      console.warn('[Audio] Explosion audio failed:', err);
    }
  }

  // Aggravating high pitch click
  playClick(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // ignore
    }
  }

  // Annoying error buzzer
  playBuzzer(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
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

export const sounds = new AudioSynthesizer();
