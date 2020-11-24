'use strict';

const { toMatchCloseTo } = require('jest-matcher-deep-close-to');

const preprocessEARanges = require('../preprocessEARanges');

expect.extend({ toMatchCloseTo });

describe('preprocessEARanges', () => {
  it('check the result and the order', () => {
    let possibilities = preprocessEARanges(
      [
        { mf: 'C', min: 0, max: 2 },
        { mf: 'H', min: 0, max: 2 },
        { mf: 'O', min: 0, max: 0 },
        { mf: 'Cl', min: 0, max: 3 },
        { mf: 'Me', min: 0, max: 1 },
        { mf: 'Ca', min: 0, max: 1 },
      ],
      { C: 0.8, H: 0.2 },
    );
    expect(Array.isArray(possibilities)).toBe(true);
    expect(possibilities).toHaveLength(5);

    expect(possibilities[3]).toMatchCloseTo(
      {
        mf: 'Me',
        minCount: 0,
        maxCount: 1,
        currentCount: -1,
        currentUnsaturation: 0,
        initialOrder: 4,
        mass: 15.0345,
        unsaturation: -1,
        isGroup: true,
      },
      4,
    );
  });

  it('check a string', () => {
    let possibilities = preprocessEARanges('C1-10H1-10Cl0-10', {
      C: 0.8,
      H: 0.2,
    });
    expect(Array.isArray(possibilities)).toBe(true);
    expect(possibilities).toHaveLength(3);
    expect(possibilities[2]).toMatchCloseTo(
      {
        mf: 'Cl',
        minCount: 0,
        maxCount: 10,
        targetEA: 0,
        currentValue: 0,
        currentCount: -1,
        currentUnsaturation: 0,
        initialOrder: 2,
        mass: 35.4529,
        unsaturation: -1,
      },
      4,
    );
  });
});
