import { describe, expect, it } from 'vitest';

import { getPeaks } from '../getPeaks';

describe('test getPeaks', () => {
  const peaks = [
    { x: 2, y: 4 },
    { x: 1, y: 1 },
    { x: 3, y: 2 },
    { x: 4, y: 5 },
    { x: 5, y: 3 },
  ];

  it('default options', () => {
    let result = getPeaks(peaks);

    expect(result).toStrictEqual([
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 4, y: 5 },
      { x: 5, y: 3 },
    ]);
  });

  it('custom options', () => {
    let result = getPeaks(peaks, { numberSlots: 3, numberCloseSlots: 6 });

    expect(result).toStrictEqual([
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 4, y: 5 },
      { x: 5, y: 3 },
    ]);
  });

  it('custom options threshold', () => {
    let result = getPeaks(peaks, { threshold: 0.5 });

    expect(result).toStrictEqual([
      { x: 2, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 3 },
    ]);
  });

  it('custom options limit', () => {
    let result = getPeaks(peaks, { limit: 3 });

    expect(result).toStrictEqual([
      { x: 2, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 3 },
    ]);
  });

  it('custom options sumValue', () => {
    let result = getPeaks(peaks, { sumValue: 75 });

    expect(result).toStrictEqual([
      { x: 1, y: 5 },
      { x: 2, y: 20 },
      { x: 3, y: 10 },
      { x: 4, y: 25 },
      { x: 5, y: 15 },
    ]);
  });
});
