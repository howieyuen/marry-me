// 背景音乐开关。没有放 bgm.mp3（index.html 里 <audio> 注释着）时也能安全点击。
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
      audio.play().catch(() => {}); // 自动播放被拦截时静默失败
    } else {
      audio.pause();
    }
  });
}
