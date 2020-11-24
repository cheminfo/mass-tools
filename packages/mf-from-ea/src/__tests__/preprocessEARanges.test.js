'use strict';

const preprocessEARanges = require('../preprocessEARanges');

describe('preprocessEARanges', () => {
  it.only('check the result and the order', () => {
    let possibilities = preprocessEARanges([
      { mf: 'C', min: 0, max: 2 },
      { mf: 'H', min: 0, max: 2 },
      { mf: 'O', min: 0, max: 0 },
      { mf: 'Cl', min: 0, max: 3 },
      { mf: 'Me', min: 0, max: 1 },
      { mf: 'Ca', min: 0, max: 1 },
    ]);
    expect(Array.isArray(possibilities)).toBe(true);
    expect(possibilities).toHaveLength(5);
    expect(possibilities[1]).toMatchObject({
      mf: 'Me',
      minCount: 0,
      maxCount: 1,
      currentCount: 0,
      currentUnsaturation: 0,
      initialOrder: 4,
      em: 15.02347509669,
      unsaturation: -1,
      isGroup: true,
    });
  });

  it('check a string', () => {
    let possibilities = preprocessEARanges('C1-10H1-10ClBr2N0');
    expect(Array.isArray(possibilities)).toBe(true);
    expect(possibilities).toHaveLength(3);
    expect(possibilities[0]).toMatchObject({
      minCharge: 0,
      maxCharge: 0,
      originalMinCount: 1,
      originalMaxCount: 1,
    });
  });

  it('check a string polymer kind', () => {
    let possibilities = preprocessEARanges('ClBr2(CH2)0-2NO');
    expect(Array.isArray(possibilities)).toBe(true);
    expect(possibilities).toHaveLength(2);
    expect(possibilities[0]).toMatchObject({
      mf: 'ClBr2NO',
      minCharge: 0,
      maxCharge: 0,
      originalMinCount: 1,
      originalMaxCount: 1,
    });
  });

  it('isotopes [13C]0-10 [12C]0-10', () => {
    let possibilities = preprocessEARanges('[13C]0-10 [12C]0-10');
    expect(Array.isArray(possibilities)).toBe(true);
    expect(possibilities).toHaveLength(2);
    expect(possibilities[0]).toMatchObject({
      mf: '[13C]',
      minCharge: 0,
      maxCharge: 0,
      originalMinCount: 0,
      originalMaxCount: 10,
    });
  });
});
