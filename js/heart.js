// Heart curve, plotted from the classic parametric equation:
//   x = 16sin³t,  y = 13cos t − 5cos2t − 2cos3t − cos4t
// SVG's y axis points down, so y is negated.
export function heartPoint(t) {
  const s = Math.sin(t);
  return {
    x: 16 * s * s * s,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  };
}

export function heartPath(steps = 140) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const { x, y } = heartPoint((i / steps) * Math.PI * 2);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

export function initHeart() {
  const path = document.getElementById('heartPath');
  if (!path) return;
  path.setAttribute('d', heartPath());
}
