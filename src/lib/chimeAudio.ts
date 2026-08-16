/**
 * Civic Broadcast Audio Synthesizer
 * Generates an accessible, warm 3-tone harmonic chime (C5 -> E5 -> G5)
 * using Web Audio API before spoken voice notifications.
 */

class CivicAudioSynthesizer {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Play a clean, warm 3-tone harmonic chime (C5 - 523.25Hz, E5 - 659.25Hz, G5 - 783.99Hz)
   */
  public async playCivicChime(): Promise<void> {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.14);

        gain.gain.setValueAtTime(0.001, now + index * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.14);
        osc.stop(now + index * 0.14 + 0.48);
      });

      // Allow chime to finish playing before speech starts
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (err) {
      console.warn('Civic audio chime playback not permitted or unavailable:', err);
    }
  }

  /**
   * Play a subtle, tactile soft click for tab switching and copying
   */
  public playClickSoft(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  /**
   * Play an uplifting 2-tone badge/reward chime (F5 -> A5)
   */
  public playSuccessBadge(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [698.46, 880.0].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.26);
      });
    } catch {}
  }
}

export const civicAudio = new CivicAudioSynthesizer();
