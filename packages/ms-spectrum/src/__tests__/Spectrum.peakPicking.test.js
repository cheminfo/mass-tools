import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from '../Spectrum';

describe('peakPicking on Spectrum', () => {
  let chargedText = readFileSync(join(__dirname, 'data/lowres2.txt'), 'utf8');
  it('lowres2', () => {
    let spectrum = fromText(chargedText);
    let peaks = spectrum.peakPicking();

    let nbNaNX = peaks.filter((peak) => isNaN(peak.x));
    let nbNaNY = peaks.filter((peak) => isNaN(peak.y));

    expect(nbNaNX).toHaveLength(0);
    expect(nbNaNY).toHaveLength(0);
  });
});
