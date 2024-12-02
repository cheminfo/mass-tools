import { expect, test } from 'vitest';

import { getDerivedCompositionInfo } from '../getDerivedCompositionInfo';

test('getDerivedCompositionInfo', () => {
  const data = {
    '12C': 294,
    '13C': 6,
    '1H': 500,
    '14N': 100,
    '16O': 100,
    '32S': 87,
    '34S': 12,
    '33S': 1,
  };
  const result = getDerivedCompositionInfo(data);
  expect(result).toStrictEqual({
    label: '¹²C₂₉₄¹³C₆¹H₅₀₀¹⁴N₁₀₀¹⁶O₁₀₀³²S₈₇³⁴S₁₂³³S',
    shortComposition: { '13C': 6, '34S': 12, '33S': 1 },
    shortLabel: '¹³C₆³⁴S₁₂³³S',
  });
});
