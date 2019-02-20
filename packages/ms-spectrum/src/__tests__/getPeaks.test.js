'use strict';

const getPeaks = require('../getPeaks');

describe('test getPeaks', () => {
  let peaks = [
    { x: 1, y: 1 },
    { x: 2, y: 4 },
    { x: 3, y: 2 },
    { x: 4, y: 5 },
    { x: 5, y: 3 }
  ];
  it('default options', () => {
    let result = getPeaks(peaks);
    expect(result).toStrictEqual([
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 4, y: 5 },
      { x: 5, y: 3 }
    ]);
  });

  it('custom options', () => {
    let result = getPeaks(peaks, { numberSlots: 3, numberCloseSlots: 6 });
    expect(result).toStrictEqual([
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 4, y: 5 },
      { x: 5, y: 3 }
    ]);
  });

  it('custom options threshold', () => {
    let result = getPeaks(peaks, { threshold: 0.5 });
    expect(result).toStrictEqual([
      { x: 2, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 3 }
    ]);
  });
});
