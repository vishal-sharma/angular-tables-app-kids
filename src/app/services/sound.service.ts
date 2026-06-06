import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCorrect(): void {
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    this.tone(ctx, 523.25, now,       0.12);   // C5
    this.tone(ctx, 659.25, now + 0.1, 0.12);   // E5
    this.tone(ctx, 783.99, now + 0.2, 0.18);   // G5
  }

  playWrong(): void {
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    this.tone(ctx, 300, now,       0.14, 'sawtooth');
    this.tone(ctx, 220, now + 0.12, 0.18, 'sawtooth');
  }

  playCelebration(): void {
    const ctx = this.getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      this.tone(ctx, freq, ctx.currentTime + i * 0.1, 0.12);
    });
  }

  private tone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine'
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}
