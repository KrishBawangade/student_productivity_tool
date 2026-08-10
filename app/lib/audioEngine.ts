// Web Audio API Ambient Soundscape Generator

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | { stop: () => void })[] = [];
  private activeSound: string = 'none';
  private currentVolume: number = 0.5;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
  }

  public stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        } else if ('disconnect' in node && typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch {
        // ignore cleanup errors
      }
    });
    this.activeNodes = [];
    this.activeSound = 'none';
  }

  public playSound(soundType: 'cyber' | 'rain' | 'cafe' | 'binaural' | 'none') {
    this.initCtx();
    this.stopAll();

    if (soundType === 'none' || !this.ctx || !this.masterGain) {
      return;
    }

    this.activeSound = soundType;

    if (soundType === 'cyber') {
      this.createCyberSynth();
    } else if (soundType === 'rain') {
      this.createRainSound();
    } else if (soundType === 'cafe') {
      this.createCafeAmbience();
    } else if (soundType === 'binaural') {
      this.createBinauralBeats();
    }
  }

  // 1. Cyber Synth Pad Generator
  private createCyberSynth() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3 (Cmaj7 pad)
    freqs.forEach(freq => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // Low frequency modulation LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();
      this.activeNodes.push(lfo);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.activeNodes.push(osc);
      this.activeNodes.push(gain);
      this.activeNodes.push(filter);
    });
  }

  // 2. Procedural Pink Noise Rain Generator
  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise);
    this.activeNodes.push(gain);
    this.activeNodes.push(filter);
  }

  // 3. Cozy Cafe Ambience Synthesizer
  private createCafeAmbience() {
    if (!this.ctx || !this.masterGain) return;

    // Soft warm drone + randomized soft clinks
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    this.activeNodes.push(osc);
    this.activeNodes.push(gain);
    this.activeNodes.push(filter);
  }

  // 4. Binaural 10Hz Alpha Waves Generator
  private createBinauralBeats() {
    if (!this.ctx || !this.masterGain) return;

    const merger = this.ctx.createChannelMerger(2);

    // Left Ear: 200 Hz
    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(200, this.ctx.currentTime);
    const gainL = this.ctx.createGain();
    gainL.gain.setValueAtTime(0.15, this.ctx.currentTime);
    oscL.connect(gainL);
    gainL.connect(merger, 0, 0); // Left channel

    // Right Ear: 210 Hz (10 Hz Alpha Difference)
    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(210, this.ctx.currentTime);
    const gainR = this.ctx.createGain();
    gainR.gain.setValueAtTime(0.15, this.ctx.currentTime);
    oscR.connect(gainR);
    gainR.connect(merger, 0, 1); // Right channel

    merger.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.activeNodes.push(oscL);
    this.activeNodes.push(oscR);
    this.activeNodes.push(gainL);
    this.activeNodes.push(gainR);
    this.activeNodes.push(merger);
  }

  public getActiveSound() {
    return this.activeSound;
  }
}

export const audioEngine = typeof window !== 'undefined' ? new SoundscapeEngine() : null;
