// Звуки — синтез Web Audio, без чужих семплов. Звучат только после клика пользователя (политика автоплея браузеров)
// и если не выключены значком динамика; выбор хранится в браузере.

type Cue = 'startup' | 'open' | 'close' | 'click' | 'notify' | 'logoff' | 'error';

const KEY = 'vadimxp:sound';
let ctx: AudioContext | null = null;
let enabled = readEnabled();

function readEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export const soundEnabled = (): boolean => enabled;

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // приватное окно — выбор живёт до перезагрузки
  }
}

/** Вызывать из обработчика клика: браузер разрешает звук только после жеста пользователя. */
export function unlockAudio(): void {
  if (ctx || typeof window === 'undefined' || !('AudioContext' in window)) return;
  ctx = new AudioContext();
}

type Note = { f: number; at: number; len: number; type?: OscillatorType; vol?: number };

const CUES: Record<Cue, Note[]> = {
  // Короткий аккорд «вход»: свой мотив из пяти нот, мажор с задержанной квартой.
  startup: [
    { f: 392, at: 0, len: 0.9, type: 'triangle', vol: 0.16 },
    { f: 523.25, at: 0.12, len: 0.9, type: 'triangle', vol: 0.14 },
    { f: 698.46, at: 0.24, len: 0.5, type: 'sine', vol: 0.12 },
    { f: 659.25, at: 0.5, len: 1.1, type: 'sine', vol: 0.12 },
    { f: 1046.5, at: 0.62, len: 1.2, type: 'sine', vol: 0.06 },
  ],
  open: [{ f: 660, at: 0, len: 0.07, type: 'sine', vol: 0.08 }, { f: 880, at: 0.05, len: 0.09, type: 'sine', vol: 0.07 }],
  close: [{ f: 700, at: 0, len: 0.07, type: 'sine', vol: 0.07 }, { f: 470, at: 0.05, len: 0.1, type: 'sine', vol: 0.06 }],
  click: [{ f: 1200, at: 0, len: 0.025, type: 'square', vol: 0.025 }],
  notify: [{ f: 988, at: 0, len: 0.12, type: 'sine', vol: 0.1 }, { f: 1319, at: 0.12, len: 0.22, type: 'sine', vol: 0.09 }],
  logoff: [
    { f: 784, at: 0, len: 0.5, type: 'triangle', vol: 0.12 },
    { f: 587.33, at: 0.18, len: 0.6, type: 'triangle', vol: 0.11 },
    { f: 392, at: 0.36, len: 0.9, type: 'triangle', vol: 0.12 },
  ],
  error: [{ f: 220, at: 0, len: 0.18, type: 'square', vol: 0.05 }, { f: 196, at: 0.16, len: 0.24, type: 'square', vol: 0.05 }],
};

export function play(cue: Cue): void {
  if (!enabled || !ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();
  const t0 = ctx.currentTime + 0.01;
  for (const n of CUES[cue]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = n.type ?? 'sine';
    osc.frequency.value = n.f;
    const start = t0 + n.at;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(n.vol ?? 0.1, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + n.len);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + n.len + 0.05);
  }
}
