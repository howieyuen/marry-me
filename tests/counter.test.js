import test from 'node:test';
import assert from 'node:assert/strict';
import { daysSince, msUntilNextLocalMidnight, TOGETHER_START } from '../js/counter.js';

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

test('one second before midnight waits one second', () => {
  assert.equal(msUntilNextLocalMidnight(new Date(2026, 8, 17, 23, 59, 59)), 1000);
});

test('midnight itself waits a full day, never zero', () => {
  assert.equal(msUntilNextLocalMidnight(new Date(2026, 8, 17, 0, 0, 0)), 86400000);
});

test('rollover crosses month and year boundaries', () => {
  const monthEnd = new Date(2026, 8, 30, 18, 0, 0);
  assert.equal(
    new Date(+monthEnd + msUntilNextLocalMidnight(monthEnd)).getMonth(), 9,
  );
  const yearEnd = new Date(2026, 11, 31, 18, 0, 0);
  assert.equal(
    new Date(+yearEnd + msUntilNextLocalMidnight(yearEnd)).getFullYear(), 2027,
  );
});

test('waiting until past the rollover advances the day count by one', () => {
  const now = new Date(2026, 8, 17, 23, 30, 0);
  const after = new Date(+now + msUntilNextLocalMidnight(now) + 1000);
  assert.equal(daysSince(TOGETHER_START, after), daysSince(TOGETHER_START, now) + 1);
});
