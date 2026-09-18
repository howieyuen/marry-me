import { matchAnswer, GATE_ANSWERS } from './gate.js';
import { daysSince, msUntilNextLocalMidnight, TOGETHER_START } from './counter.js';
import { initReveal } from './reveal.js';
import { initProposal } from './proposal.js';
import { initMusic } from './music.js';
import { initHeart } from './heart.js';

// The gate is fixed and hides the page behind it, so a browser-restored scroll position would go
// unnoticed until she answers and lands mid-page. Always start from the top instead.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

let counterDone = false;
function renderCounter(el, days) {
  el.innerHTML = days + ' <small>天</small>';
}

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
    renderCounter(el, n);
  }, 22);
}

// The count-up only runs once, so without this the number would stay frozen at whatever it was
// when the page loaded — wrong by a day if she leaves it open overnight or comes back later.
function keepCounterFresh() {
  const el = document.getElementById('counter');
  if (!el) return;
  const sync = () => { if (counterDone) renderCounter(el, daysSince(TOGETHER_START, new Date())); };
  // a timer can fire a hair early, so land just after midnight rather than exactly on it
  const scheduleRollover = () => setTimeout(() => {
    sync();
    scheduleRollover();
  }, msUntilNextLocalMidnight(new Date()) + 1000);
  scheduleRollover();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
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
    // A reloaded/bfcached page can keep a restored scroll offset hidden behind the fixed gate;
    // without this she would answer and land mid-page instead of on the hero.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
  keepCounterFresh();
  initProposal();
});
