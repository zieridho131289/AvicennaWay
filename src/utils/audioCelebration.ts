/**
 * Web Audio API synthesizer for celebratory fanfare and gentle victory chime
 * Runs entirely client-side without external MP3 files for 100% reliability.
 */
class CelebrationAudioEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playVictoryChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Majestic chord arpeggio: C5, E5, G5, C6
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.8 }, // C5
        { freq: 659.25, time: 0.15, dur: 0.8 }, // E5
        { freq: 783.99, time: 0.3, dur: 0.9 }, // G5
        { freq: 1046.5, time: 0.48, dur: 1.5 }, // C6
      ];

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        // Soft bell-like envelope
        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.3, now + n.time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (e) {
      console.warn('Audio playback not permitted or supported yet', e);
    }
  }

  speakAppreciation(teacherName: string, unit: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Selamat kepada ${teacherName} dari ${unit}. Anda telah menyelesaikan seratus persen Daily Log Avicenna Way minggu ini secara sempurna. Terima kasih atas keteladanan dan dedikasi Anda!`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      // Find Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const celebrationAudio = new CelebrationAudioEngine();
