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

// Both halves start at the top notch (t=0) and end at the bottom tip (t=±PI), so they can be
// stroked outward at the same time. Left over unclosed, their fills meet along the vertical axis.
export function heartHalfPath(dir, steps = 70) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const { x, y } = heartPoint(dir * (i / steps) * Math.PI);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M${pts.join('L')}`;
}

export function initHeart() {
  const left = document.getElementById('heartL');
  const right = document.getElementById('heartR');
  if (left) left.setAttribute('d', heartHalfPath(-1));
  if (right) right.setAttribute('d', heartHalfPath(1));
}
