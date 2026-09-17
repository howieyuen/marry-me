const DODGE_TEXTS = [
  '让我再想想 🤔', '不许点这个 🙈', '再想想也是愿意呀',
  '这个按钮坏掉啦', '你追不到我的~', '认命吧宝贝 💗',
];

function petals() {
  const em = ['🌸', '💗', '🤍', '💍', '🌷'];
  for (let i = 0; i < 70; i += 1) {
    setTimeout(() => {
      const s = document.createElement('span');
      s.className = 'petal';
      s.textContent = em[i % em.length];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.fontSize = (16 + Math.random() * 18) + 'px';
      s.style.animationDuration = (3 + Math.random() * 3) + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 6500);
    }, i * 55);
  }
}

export function initProposal() {
  const no = document.getElementById('btnNo');
  const yes = document.getElementById('btnYes');
  const finalBox = document.getElementById('final');
  const asked = document.getElementById('ask');
  if (!no || !yes || !finalBox || !asked) return;

  let ti = 0;
  let lastDodge = 0;
  function dodge() {
    // touchstart and the synthetic click that follows would otherwise dodge twice per tap
    const now = Date.now();
    if (now - lastDodge < 350) return;
    lastDodge = now;
    // Move within the button's own positioning container (.btns) so it can't fly out and get
    // clipped by #ask, and keep clear of the "Yes" button so it never blocks the tap that matters.
    const box = no.offsetParent || asked;
    const maxX = Math.max(0, box.clientWidth - no.offsetWidth);
    const maxY = Math.max(0, box.clientHeight - no.offsetHeight);
    const boxRect = box.getBoundingClientRect();
    const yesRect = yes.getBoundingClientRect();
    const keepOut = {
      left: yesRect.left - boxRect.left - 8,
      right: yesRect.right - boxRect.left + 8,
      top: yesRect.top - boxRect.top - 8,
      bottom: yesRect.bottom - boxRect.top + 8,
    };
    let x = maxX;
    let y = maxY;
    for (let i = 0; i < 20; i += 1) {
      const cx = Math.random() * maxX;
      const cy = Math.random() * maxY;
      const hitsYes = cx < keepOut.right && cx + no.offsetWidth > keepOut.left
        && cy < keepOut.bottom && cy + no.offsetHeight > keepOut.top;
      if (!hitsYes) { x = cx; y = cy; break; }
    }
    // the narrow-screen layout anchors this button with `right`; left+right together would stretch it
    no.style.right = 'auto';
    no.style.left = x + 'px';
    no.style.top = y + 'px';
    no.style.transform = 'scale(' + (0.9 - Math.min(ti * 0.06, 0.4)) + ')';
    ti += 1;
    no.textContent = DODGE_TEXTS[ti % DODGE_TEXTS.length];
  }
  no.addEventListener('mouseenter', dodge);
  // passive: a swipe starting on this button must still scroll the page
  no.addEventListener('touchstart', dodge, { passive: true });
  no.addEventListener('click', dodge);

  yes.addEventListener('click', () => {
    finalBox.classList.add('show');
    petals();
    // Kept hidden until now so she can't scroll ahead and read the ending before answering.
    const next = document.getElementById('next');
    if (next) next.classList.add('unlocked');
    // The overlay is fixed and would otherwise hide the closing section forever, so it only invites
    // her onward once the climax has had a few seconds to land.
    const hint = document.getElementById('finalHint');
    setTimeout(() => {
      if (hint) hint.classList.add('in');
      finalBox.addEventListener('click', () => {
        finalBox.classList.remove('show');
        if (next) next.scrollIntoView({ behavior: 'smooth' });
      }, { once: true });
    }, 4000);
  });
}
