import test from 'node:test';
import assert from 'node:assert/strict';
import { daysSince, TOGETHER_START } from '../js/counter.js';

test('same day is 0 days', () => {
  assert.equal(daysSince(new Date(2025, 5, 20), new Date(2025, 5, 20, 23, 59)), 0);
});

test('next day is 1 day', () => {
  assert.equal(daysSince(new Date(2025, 5, 20), new Date(2025, 5, 21, 0, 1)), 1);
});

test('6.20 to 8.3 is exactly 44 days (consistent with "44 days together as of 8.3")', () => {
  assert.equal(daysSince(new Date(2025, 5, 20), new Date(2025, 7, 3)), 44);
});

test('start date is 2025-06-20', () => {
  assert.equal(TOGETHER_START.getFullYear(), 2025);
  assert.equal(TOGETHER_START.getMonth(), 5); // June
  assert.equal(TOGETHER_START.getDate(), 20);
});
