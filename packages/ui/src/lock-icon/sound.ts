import { UNLOCK_SOUND_SRC, UNLOCK_SOUND_TYPE } from './sound-data';

let unlockAudio: HTMLAudioElement | null = null;

/** One shared, lazily created element: cheap to keep around and restartable on rapid toggles. */
function getUnlockAudio() {
  if (unlockAudio) return unlockAudio;
  if (typeof Audio === 'undefined') return null;

  const audio = new Audio();
  // Browsers without Opus-in-WebM support stay silent instead of throwing decode errors.
  if (!audio.canPlayType(UNLOCK_SOUND_TYPE)) return null;

  audio.preload = 'auto';
  audio.src = UNLOCK_SOUND_SRC;
  unlockAudio = audio;

  return audio;
}

/** Decode ahead of time so the first unlock plays without a delay. */
export function preloadUnlockSound() {
  getUnlockAudio();
}

export function playUnlockSound(volume = 1) {
  const audio = getUnlockAudio();
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
