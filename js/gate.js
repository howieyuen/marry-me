// 入场门答案：规范化后做等值匹配（宽容各种分隔写法）
export function normalize(s) {
  return (s || '').replace(/\s|年|月|日|\.|\/|-/g, '').toLowerCase();
}

export function matchAnswer(input, answers) {
  const n = normalize(input);
  return answers.some((a) => normalize(a) === n);
}

// 第一次见面是 2025.6.15；接受 615 / 0615 / 20250615 / 6月15 / 六月十五
export const GATE_ANSWERS = ['615', '0615', '20250615', '6月15', '六月十五'];
