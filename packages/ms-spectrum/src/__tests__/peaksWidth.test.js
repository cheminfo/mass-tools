'use strict';

const peaksWidth = require('../peaksWidth');

describe('test test peakWidth', () => {
  it('five peaks', () => {
    let peaks = [
      { width: 2, x: 1, y: 1 },
      { width: 8, x: 2, y: 1 },
      { width: 18, x: 3, y: 1 },
      { width: 32, x: 4, y: 1 },
      { width: 50, x: 5, y: 1 }
    ];
    let result = peaksWidth(peaks);
    expect(result.score).toStrictEqual({ chi2: 0, r: 1, r2: 1, rmsd: 0 });
    expect(result.tex).toBe('f(x) = 2x^{2}');
    expect(result.predictFct(2)).toBe(8);
    expect(result.fit).toMatchSnapshot();
    expect(result.widths).toStrictEqual({
      x: [1, 2, 3, 4, 5],
      y: [2, 8, 18, 32, 50]
    });
  });

  it('two peaks', () => {
    let peaks = [{ width: 2, x: 1, y: 1 }, { width: 8, x: 2, y: 1 }];
    let result = peaksWidth(peaks);
    expect(result.predictFct(2)).toBeCloseTo(8, 5);
    expect(result.fit).toMatchSnapshot();
    expect(result.widths).toStrictEqual({
      x: [1, 2],
      y: [2, 8]
    });
  });

  it('one peak', () => {
    expect(() => {
      peaksWidth([{ width: 2, x: 1, y: 1 }]);
    }).toThrow('Not enough peaks');
  });
});
