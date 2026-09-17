import test from 'node:test';
import assert from 'node:assert/strict';
import { heartPoint, heartHalfPath } from '../js/heart.js';

test('t=0 sits at the notch between the two lobes', () => {
  const { x, y } = heartPoint(0);
  assert.equal(x, 0);
  assert.equal(y, -5); // 13 - 5 - 2 - 1 = 5, negated for SVG
});

test('t=PI is the bottom tip', () => {
  const { x, y } = heartPoint(Math.PI);
  assert.ok(Math.abs(x) < 1e-12);
  assert.ok(Math.abs(y - 17) < 1e-12);
});

test('curve is symmetric about the vertical axis', () => {
  for (const t of [0.4, 1.1, 2.3, 3.0]) {
    const a = heartPoint(t);
    const b = heartPoint(-t);
    assert.ok(Math.abs(a.x + b.x) < 1e-9);
    assert.ok(Math.abs(a.y - b.y) < 1e-9);
  }
});

test('curve stays inside the SVG viewBox', () => {
  for (let i = 0; i < 720; i++) {
    const { x, y } = heartPoint((i / 720) * Math.PI * 2);
    assert.ok(x >= -18 && x <= 18, `x out of range: ${x}`);
    assert.ok(y >= -14 && y <= 19, `y out of range: ${y}`);
  }
});

test('each half is an open polyline from the notch to the tip', () => {
  const d = heartHalfPath(1, 8);
  assert.match(d, /^M0.00 -5.00L/);
  assert.doesNotMatch(d, /Z/);
  assert.equal(d.slice(1).split('L').length, 9);
  assert.match(d, /L0.00 17.00$/);
});

test('the two halves mirror each other point for point', () => {
  const l = heartHalfPath(-1, 12).slice(1).split('L');
  const r = heartHalfPath(1, 12).slice(1).split('L');
  assert.equal(l.length, r.length);
  l.forEach((pt, i) => {
    const [lx, ly] = pt.split(' ').map(Number);
    const [rx, ry] = r[i].split(' ').map(Number);
    assert.ok(Math.abs(lx + rx) < 1e-9, `x not mirrored at ${i}: ${lx} / ${rx}`);
    assert.equal(ly, ry);
  });
});

test('the right half stays on the right of the axis', () => {
  const pts = heartHalfPath(1, 60).slice(1).split('L');
  pts.forEach((pt) => assert.ok(Number(pt.split(' ')[0]) >= 0, `x went negative: ${pt}`));
});
