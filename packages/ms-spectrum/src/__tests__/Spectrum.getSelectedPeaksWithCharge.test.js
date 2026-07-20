import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { fromText } from '../Spectrum';

describe('test appendPeakCharge on Spectrum', () => {
  it('multicharged', () => {
    const chargedText = readFileSync(
      path.join(__dirname, 'data/multicharge.txt'),
      'utf8',
    );

    let spectrum = fromText(chargedText);
    let peaks = spectrum.peakPicking();
    const peaksWithCharge = spectrum
      .getSelectedPeaksWithCharge(peaks)
      .filter((peak) => peak.y > 1000);

    let stats = new Array(10).fill(0);
    let withoutCharge = 0;
    for (const peak of peaksWithCharge) {
      if (peak.charge === undefined) {
        withoutCharge++;
      } else {
        stats[peak.charge]++;
      }
    }

    // an electrospray of a protein: the charges are distributed around 3
    expect(stats).toStrictEqual([0, 1, 127, 183, 111, 0, 0, 0, 0, 0]);
    // the peaks belonging to no series of at least three isotopologues get
    // nothing rather than a charge nothing shows
    expect(withoutCharge).toBe(20);
  });
});
