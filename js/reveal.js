// Add .in to .reveal elements as they scroll into view; call onCounter when the counter element enters
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
