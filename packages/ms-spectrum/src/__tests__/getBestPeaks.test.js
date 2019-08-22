'use strict';

const getBestPeaks = require('../getBestPeaks');

describe('test getBestPeaks', () => {
  let peaks = [
    { x: 1, y: 1 },
    { x: 2, y: 4 },
    { x: 3, y: 2 },
    { x: 4, y: 5 },
    { x: 5, y: 3 }
  ];
  it('default options', () => {
    let result = getBestPeaks(peaks);
    expect(result).toStrictEqual([
      { x: 1, y: 1, close: false },
      { x: 2, y: 4, close: false },
      { x: 3, y: 2, close: false },
      { x: 4, y: 5, close: false },
      { x: 5, y: 3, close: false }
    ]);
  });

  it('custom options', () => {
    let result = getBestPeaks(peaks, { numberSlots: 3, numberCloseSlots: 6 });
    expect(result).toStrictEqual([
      { close: true, x: 1, y: 1 },
      { close: false, x: 2, y: 4 },
      { close: true, x: 3, y: 2 },
      { close: false, x: 4, y: 5 },
      { close: true, x: 5, y: 3 }
    ]);
  });

  it('custom options threshold', () => {
    let result = getBestPeaks(peaks, { threshold: 0.5 });
    expect(result).toStrictEqual([
      { close: false, x: 2, y: 4 },
      { close: false, x: 4, y: 5 },
      { close: false, x: 5, y: 3 }
    ]);
  });
});

describe('test getBestPeaks with searchMonoisotopicRatio', () => {
  let peaks = [
    { x: 1, y: 5 },
    { x: 1.5, y: 4 },
    { x: 2, y: 2 },
    { x: 2.5, y: 5 },
    { x: 3, y: 3 }
  ];
  it('simple test', () => {
    let result = getBestPeaks(peaks, { searchMonoisotopicRatio: 0.2 });
    expect(result).toStrictEqual([
      { x: 1, y: 5, close: false },
      { x: 1.5, y: 4, close: false },
      { x: 2, y: 2, close: false }
    ]);
  });
});
