const activeElements = new Set<HTMLAudioElement>();

// Garante que apenas um áudio toque por vez, como no WhatsApp.
export const registerAudioPlayer = (element: HTMLAudioElement | null) => {
  if (!element) return;

  const onPlay = () => {
    activeElements.forEach((other) => {
      if (other !== element && !other.paused) {
        other.pause();
      }
    });
    activeElements.add(element);
  };

  element.addEventListener('play', onPlay);
  return () => {
    element.removeEventListener('play', onPlay);
    activeElements.delete(element);
  };
};
