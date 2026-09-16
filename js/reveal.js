// 滚动进入视口时给 .reveal 加 .in；计数器元素进入时回调 onCounter
export function initReveal({ onCounter } = {}) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (onCounter && en.target.querySelector && en.target.querySelector('#counter')) {
        onCounter();
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  return io;
}
