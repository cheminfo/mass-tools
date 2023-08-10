import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from '../Spectrum';

describe('peakPicking on Spectrum', () => {
  it('lowres2', () => {
    const chargedText = readFileSync(
      join(__dirname, 'data/lowres2.txt'),
      'utf8',
    );
    let spectrum = fromText(chargedText, { threshold: 0.1 });
    expect(spectrum.peakPicking()).toHaveLength(55);

    spectrum = fromText(chargedText);
    const peaks = spectrum.peakPicking();

    const nbNaNX = peaks.filter((peak) => isNaN(peak.x));
    const nbNaNY = peaks.filter((peak) => isNaN(peak.y));

    expect(nbNaNX).toHaveLength(0);
    expect(nbNaNY).toHaveLength(0);

    expect(spectrum.data.x).toHaveLength(149056);
    expect(peaks).toHaveLength(2159);

    const peaksDataXY = spectrum.getPeaksAsDataXY();
    expect(peaksDataXY.x).toHaveLength(136);
    expect(peaksDataXY.y).toHaveLength(136);
  });
});
