import { describe, expect, it } from 'vitest';

import { mfDiff } from '../mfDiff';

const tests = [
  ['C10', 'C5', 'C5'],
  ['C10', 'ONC5', 'C5N-1O-1'],
  ['C10', 'ONO', 'C10N-1O-2'],
  ['OC10O', 'ONO', 'C10N-1'],
  ['ClC10O', 'ONO', 'C10ClN-1O-1'],
];

describe('mfDiff', () => {
  it.each(tests)('%s %s', (mf1, mf2, value) => {
    expect(mfDiff(mf1, mf2)).toBe(value);
  });
});
