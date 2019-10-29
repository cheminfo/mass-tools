'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

const Spectrum = require('../Spectrum');

describe('peakPicking on Spectrum', () => {
  let chargedText = readFileSync(join(__dirname, 'data/lowres2.txt'), 'utf8');
  it('lowres2', () => {
    let spectrum = Spectrum.fromText(chargedText);
    let peaks = spectrum.peakPicking();

    let nbNaNX = peaks.filter(peak => isNaN(peak.x));
    let nbNaNY = peaks.filter(peak => isNaN(peak.y));

    expect(nbNaNX.length).toBe(0);
    expect(nbNaNY.length).toBe(0);
  });
});
