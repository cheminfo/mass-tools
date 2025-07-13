import { describe, expect, it } from 'vitest';

import { getPeaksWithCharge } from '../getPeaksWithCharge';

describe('test getPeaksWithCharge', () => {
  it('custom options', () => {
    let peaks = [
      { x: 1, y: 1 },
      { x: 1.5, y: 2 },
      { x: 3, y: 3 },
    ];
    const peaksWithCharge = getPeaksWithCharge(peaks, peaks, {
      min: 1,
      max: 1,
      low: -1,
      high: 1,
      precision: 30,
    });

    expect(peaksWithCharge[0].charge).toBe(1);
    expect(peaksWithCharge[1].charge).toBe(1);
    expect(peaksWithCharge[2].charge).toBe(1);
  });

  it('selected peaks', () => {
    let peaks = [
      { x: 1, y: 1 },
      { x: 1.5, y: 2 },
      { x: 3, y: 3 },
    ];
    const newPeaks = getPeaksWithCharge([{ x: 1.5, y: 2 }], peaks, {
      min: 1,
      max: 1,
      low: -1,
      high: 1,
      precision: 30,
    });

    expect(newPeaks).toStrictEqual([{ x: 1.5, y: 2, charge: 1 }]);
  });

  it('charge 1 or 2', () => {
    let peaks = [
      { x: 1, y: 1 },
      { x: 1.5, y: 2 },
      { x: 2.5, y: 3 },
    ];
    const peaksWithCharge = getPeaksWithCharge(peaks, peaks);

    expect(peaksWithCharge[0].charge).toBe(2);
    expect(peaksWithCharge[1].charge).toBe(1);
    expect(peaksWithCharge[2].charge).toBe(1);
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

    const peaksWithCharge = getPeaksWithCharge(peaks, peaks);
    const charges = peaksWithCharge.map((peak) => peak.charge);

    expect(charges).toStrictEqual([2, 1, 2, 3, 3, 3]);
  });

  it('charge various with selected', () => {
    const allPeaks = [
      { x: 1, y: 1 },
      { x: 1.5, y: 2 },
      { x: 2.5, y: 3 },
      { x: 3, y: 4 },
      { x: 3.3333, y: 5 },
      { x: 3.6666, y: 6 },
    ];

    const selectedPeaks = [
      {
        x: 1.5,
        y: 2,
      },
      {
        x: 3.3333,
        y: 5,
      },
    ];

    const peaksWithCharge = getPeaksWithCharge(selectedPeaks, allPeaks);

    expect(peaksWithCharge).toStrictEqual([
      { x: 1.5, y: 2, charge: 1 },
      { x: 3.3333, y: 5, charge: 3 },
    ]);
  });
});
