// Gate answer: normalize then compare for equality (tolerant of various separator styles)
export function normalize(s) {
  return (s || '').replace(/\s|年|月|日|\.|\/|-/g, '').toLowerCase();
}

export function matchAnswer(input, answers) {
  const n = normalize(input);
  return answers.some((a) => normalize(a) === n);
}

// First met on 2025.6.15; accepts 615 / 0615 / 20250615 / 6月15 / 六月十五
export const GATE_ANSWERS = ['615', '0615', '20250615', '6月15', '六月十五'];
