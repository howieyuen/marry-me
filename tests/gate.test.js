import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, matchAnswer, GATE_ANSWERS } from '../js/gate.js';

test('normalize 去除空格/中文年月日/点线斜杠并转小写', () => {
  assert.equal(normalize(' 6 . 15 '), '615');
  assert.equal(normalize('2025-06-15'), '20250615');
  assert.equal(normalize('6月15日'), '615');
  assert.equal(normalize(null), '');
});

test('matchAnswer 接受各种正确写法', () => {
  for (const v of ['6.15', '0615', '6 月 15', '2025/06/15', '六月十五']) {
    assert.equal(matchAnswer(v, GATE_ANSWERS), true, `应通过: ${v}`);
  }
});

test('matchAnswer 拒绝错误答案', () => {
  assert.equal(matchAnswer('6.20', GATE_ANSWERS), false);
  assert.equal(matchAnswer('', GATE_ANSWERS), false);
  assert.equal(matchAnswer('随便', GATE_ANSWERS), false);
});
