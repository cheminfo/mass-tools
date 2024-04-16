import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from '../Spectrum';

describe('test appendPeakCharge on Spectrum', () => {
  let chargedText = readFileSync(
    join(__dirname, 'data/multicharge.txt'),
    'utf8',
  );
  it('multicharged', () => {
    let spectrum = fromText(chargedText);
    let peaks = spectrum.peakPicking();
    const peaksWithCharge = spectrum
      .getSelectedPeaksWithCharge(peaks)
      .filter((peak) => peak.y > 1000);

    let stats = new Array(10).fill(0);
    for (const peak of peaksWithCharge) {
      stats[peak.charge]++;
    }

    expect(stats).toStrictEqual([0, 10, 124, 186, 122, 0, 0, 0, 0, 0]);
  });
});
