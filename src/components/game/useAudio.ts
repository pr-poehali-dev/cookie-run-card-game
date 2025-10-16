import { useState, useEffect } from 'react';

export const useAudio = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<OscillatorNode | null>(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    return () => {
      ctx.close();
    };
  }, []);

  const playSound = (type: 'flip' | 'correct' | 'wrong' | 'start' | 'shuffle' | 'deal') => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'flip') {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'wrong') {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'shuffle') {
      for (let i = 0; i < 8; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(200 + Math.random() * 200, audioContext.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.08 + 0.08);
        osc.start(audioContext.currentTime + i * 0.08);
        osc.stop(audioContext.currentTime + i * 0.08 + 0.08);
      }
    } else if (type === 'deal') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'start') {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const toggleBackgroundMusic = () => {
    if (!audioContext) return;

    if (isMusicPlaying && backgroundMusic) {
      backgroundMusic.stop();
      setBackgroundMusic(null);
      setIsMusicPlaying(false);
    } else {
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const osc3 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc3.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.value = 0.08;

      const now = audioContext.currentTime;
      const pattern = [196, 220, 246.94, 220, 196, 220, 246.94, 293.66];
      const time = now;

      const playLoop = () => {
        pattern.forEach((freq, i) => {
          osc1.frequency.setValueAtTime(freq, time + i * 0.4);
          osc2.frequency.setValueAtTime(freq * 1.5, time + i * 0.4);
          osc3.frequency.setValueAtTime(freq * 0.5, time + i * 0.4);
        });
      };

      playLoop();
      setInterval(playLoop, pattern.length * 400);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      setBackgroundMusic(osc1);
      setIsMusicPlaying(true);
    }
  };

  return {
    playSound,
    toggleBackgroundMusic,
    isMusicPlaying
  };
};
