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
  function dodge(e) {
    if (e) e.preventDefault();
    const w = asked.clientWidth;
    const h = asked.clientHeight;
    no.style.left = (40 + Math.random() * Math.max(0, w - 160)) + 'px';
    no.style.top = (90 + Math.random() * Math.max(0, h - 220)) + 'px';
    no.style.transform = 'scale(' + (0.9 - Math.min(ti * 0.06, 0.4)) + ')';
    ti += 1;
    no.textContent = DODGE_TEXTS[ti % DODGE_TEXTS.length];
  }
  no.addEventListener('mouseenter', dodge);
  no.addEventListener('touchstart', dodge, { passive: false });
  no.addEventListener('click', dodge);

  yes.addEventListener('click', () => {
    finalBox.classList.add('show');
    petals();
  });
}
