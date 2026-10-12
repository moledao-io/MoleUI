import type { AnimatedIconSound } from './types';

const players = new Map<string, HTMLAudioElement>();

/** One shared, lazily created element per clip: cheap to keep and restartable on rapid toggles. */
function getPlayer({ src, type }: AnimatedIconSound) {
  const cached = players.get(src);
  if (cached) return cached;
  if (typeof Audio === 'undefined') return null;

  const audio = new Audio();
  // Browsers without the codec stay silent instead of throwing decode errors.
  if (!audio.canPlayType(type)) return null;

  audio.preload = 'auto';
  audio.src = src;
  players.set(src, audio);

  return audio;
}

/** Decode ahead of time so the first play has no delay. */
export function preloadSound(sound: AnimatedIconSound | undefined) {
  if (sound) getPlayer(sound);
}

export function playSound(sound: AnimatedIconSound | undefined, volume = 1) {
  const audio = sound ? getPlayer(sound) : null;
  if (!audio) return;

  try {
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audio.currentTime = 0;
    // Browsers may refuse playback without a user gesture; a silent icon is the right fallback.
    void audio.play()?.catch(() => undefined);
  } catch {
    // Media playback unavailable (e.g. test environments).
  }
}
