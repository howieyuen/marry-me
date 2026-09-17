import test from 'node:test';
import assert from 'node:assert/strict';
import { heartPoint, heartPath } from '../js/heart.js';

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

test('path is a closed polyline with one point per step', () => {
  const d = heartPath(8);
  assert.match(d, /^M/);
  assert.match(d, /Z$/);
  assert.equal(d.slice(1, -1).split('L').length, 8);
});
