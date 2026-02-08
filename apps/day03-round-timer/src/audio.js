// Generate beep sounds using the Web Audio API (oscillator).
// No external audio files needed — works offline at the gym.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, durationMs) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = frequency;
  gain.gain.value = 0.3;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationMs / 1000);
}

// Single short high-pitched beep — 10-second warning
export function playWarningBeep() {
  playTone(800, 150);
}

// Double beep — round/phase end
export function playPhaseEndBeep() {
  playTone(600, 150);
  setTimeout(() => playTone(600, 150), 250);
}

// Triple ascending beep — workout complete
export function playCompleteBeep() {
  playTone(400, 150);
  setTimeout(() => playTone(600, 150), 250);
  setTimeout(() => playTone(800, 150), 500);
}
