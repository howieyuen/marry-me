import test from 'node:test';
import assert from 'node:assert/strict';
import { daysSince, TOGETHER_START } from '../js/counter.js';

test('同一天为 0 天', () => {
  assert.equal(daysSince(new Date(2025, 5, 20), new Date(2025, 5, 20, 23, 59)), 0);
});

test('次日为 1 天', () => {
  assert.equal(daysSince(new Date(2025, 5, 20), new Date(2025, 5, 21, 0, 1)), 1);
});

test('6.20 到 8.3 恰好 44 天（与"8.3已在一起44天"一致）', () => {
  assert.equal(daysSince(new Date(2025, 5, 20), new Date(2025, 7, 3)), 44);
});

test('起始日为 2025-06-20', () => {
  assert.equal(TOGETHER_START.getFullYear(), 2025);
  assert.equal(TOGETHER_START.getMonth(), 5); // 6 月
  assert.equal(TOGETHER_START.getDate(), 20);
});
