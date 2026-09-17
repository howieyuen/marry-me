import { matchAnswer, GATE_ANSWERS } from './gate.js';
import { daysSince, TOGETHER_START } from './counter.js';
import { initReveal } from './reveal.js';
import { initProposal } from './proposal.js';
import { initMusic } from './music.js';
import { initHeart } from './heart.js';

let counterDone = false;
function runCounter() {
  if (counterDone) return;
  const el = document.getElementById('counter');
  if (!el) return;
  counterDone = true;
  const days = daysSince(TOGETHER_START, new Date());
  let n = 0;
  const step = Math.max(1, Math.floor(days / 40));
  const t = setInterval(() => {
    n += step;
    if (n >= days) { n = days; clearInterval(t); }
    el.innerHTML = n + ' <small>天</small>';
  }, 22);
}

function setupGate(startMusic) {
  const gate = document.getElementById('gate');
  const input = document.getElementById('gateInput');
  const err = document.getElementById('gateErr');
  const btn = document.getElementById('gateBtn');

  function enter() {
    gate.classList.add('open');
    document.body.classList.remove('locked');
    document.body.classList.add('revealed');
    setTimeout(() => { gate.style.display = 'none'; }, 900);
    initReveal({ onCounter: runCounter });
    // Answering the gate is the user gesture browsers require before audio may play.
    startMusic();
  }
  function tryEnter() {
    if (matchAnswer(input.value, GATE_ANSWERS)) {
      enter();
    } else {
      err.style.opacity = 1;
      gate.classList.add('shake');
      setTimeout(() => gate.classList.remove('shake'), 400);
    }
  }
  btn.addEventListener('click', tryEnter);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryEnter(); });
}

// Fallback: on some browsers, IntersectionObserver threshold edge cases mean the counter should also be triggered on scroll
function setupCounterScrollFallback() {
  document.addEventListener('scroll', () => {
    const c = document.getElementById('counter');
    if (!c) return;
    const r = c.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.8 && r.bottom > 0) runCounter();
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  initHeart();
  setupGate(initMusic());
  setupCounterScrollFallback();
  initProposal();
});
