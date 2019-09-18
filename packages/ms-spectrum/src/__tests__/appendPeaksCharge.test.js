'use strict';

const appendPeaksCharge = require('../appendPeaksCharge');

describe('test appendPeaksCharge', () => {
  it('custom options', () => {
    let peaks = [{ x: 1, y: 1 }, { x: 1.5, y: 2 }, { x: 3, y: 3 }];
    appendPeaksCharge(peaks, {
      min: 1,
      max: 1,
      low: -1,
      high: 1,
      precision: 30,
    });
    expect(peaks[0].charge).toBe(1);
    expect(peaks[1].charge).toBe(1);
    expect(peaks[2].charge).toBe(1);
  });

  it('charge 1 or 2', () => {
    let peaks = [{ x: 1, y: 1 }, { x: 1.5, y: 2 }, { x: 2.5, y: 3 }];
    appendPeaksCharge(peaks);
    expect(peaks[0].charge).toBe(2);
    expect(peaks[1].charge).toBe(1);
    expect(peaks[2].charge).toBe(1);
  });

  it('charge various', () => {
    let peaks = [
      { x: 1, y: 1 },
      { x: 1.5, y: 2 },
      { x: 2.5, y: 3 },
      { x: 3, y: 4 },
      { x: 3.3333, y: 5 },
      { x: 3.6666, y: 6 },
    ];

    appendPeaksCharge(peaks);
    expect(peaks[0].charge).toBe(2);
    expect(peaks[1].charge).toBe(1);
    expect(peaks[2].charge).toBe(2);
    expect(peaks[3].charge).toBe(3);
    expect(peaks[4].charge).toBe(3);
    expect(peaks[5].charge).toBe(3);
  });
});
