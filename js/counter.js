// Round to whole days by "local date": snap each to that day's UTC midnight first, avoiding ±1 jitter from DST/timezones
export function daysSince(start, now) {
  const s = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const n = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((n - s) / 86400000));
}

// Start of "together": 2025-06-20 (local)
export const TOGETHER_START = new Date(2025, 5, 20);

// She may leave the page open, so the day count has to roll over on its own.
export function msUntilNextLocalMidnight(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
}
