// Background music toggle. Returns a start function so the gate can kick it off once she's inside.
export function initMusic() {
  const music = document.getElementById('music');
  if (!music) return () => {};
  const audio = document.getElementById('bgm');
  let on = false;

  function render() {
    music.textContent = on ? '🔊' : '🎵';
    music.style.background = on ? '#F3E4D2' : '';
  }

  function fadeIn() {
    let v = 0;
    const timer = setInterval(() => {
      v = Math.min(1, v + 0.05);
      audio.volume = v;
      if (v === 1 || !on) clearInterval(timer);
    }, 60);
  }

  function play() {
    if (on) return;
    on = true;
    render();
    if (!audio) return;
    audio.volume = 0;
    // Autoplay can still be refused; fall back to the off state so the button stays the way in.
    audio.play().then(fadeIn).catch(() => { on = false; render(); });
  }

  function pause() {
    on = false;
    render();
    if (audio) audio.pause();
  }

  music.addEventListener('click', () => (on ? pause() : play()));

  return play;
}
