// Background music toggle. Safe to click even without bgm.mp3 in place (the <audio> tag in index.html is commented out).
export function initMusic() {
  const music = document.getElementById('music');
  if (!music) return;
  const audio = document.getElementById('bgm');
  let on = false;
  music.addEventListener('click', () => {
    on = !on;
    music.textContent = on ? '🔊' : '🎵';
    music.style.background = on ? '#F3E4D2' : '';
    if (!audio) return;
    if (on) {
      audio.play().catch(() => {}); // fail silently if autoplay is blocked
    } else {
      audio.pause();
    }
  });
}
