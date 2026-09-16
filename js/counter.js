// 按"本地日期"取整天数：先取到各自当天的 UTC 零点，避免夏令时/时区造成 ±1 抖动
export function daysSince(start, now) {
  const s = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const n = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((n - s) / 86400000));
}

// 在一起的起点：2025-06-20（本地）
export const TOGETHER_START = new Date(2025, 5, 20);
