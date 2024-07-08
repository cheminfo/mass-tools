import { readFileSync } from 'node:fs';
import path from 'node:path';

import { fromText, Spectrum } from '../Spectrum';

describe('peakPicking on Spectrum', () => {
  it('lowres2', () => {
    const chargedText = readFileSync(
      path.join(__dirname, 'data/lowres2.txt'),
      'utf8',
    );
    let spectrum = fromText(chargedText, { threshold: 0.1 });
    expect(spectrum.peakPicking()).toHaveLength(55);

    spectrum = fromText(chargedText);
    const peaks = spectrum.peakPicking();

    const nbNaNX = peaks.filter((peak) => Number.isNaN(peak.x));
    const nbNaNY = peaks.filter((peak) => Number.isNaN(peak.y));

    expect(nbNaNX).toHaveLength(0);
    expect(nbNaNY).toHaveLength(0);

    expect(spectrum.data.x).toHaveLength(149056);
    expect(peaks).toHaveLength(2159);

    const peaksDataXY = spectrum.getPeaksAsDataXY();
    expect(peaksDataXY.x).toHaveLength(136);
    expect(peaksDataXY.y).toHaveLength(136);
  });

  it('1e6 points', () => {
    const data = JSON.parse(
      readFileSync(path.join(__dirname, 'data/1e6.json'), 'utf8'),
    );
    const spectrum = new Spectrum(data);
    const peaks = spectrum.peakPicking();
    expect(peaks).toHaveLength(114528);
  });
});
