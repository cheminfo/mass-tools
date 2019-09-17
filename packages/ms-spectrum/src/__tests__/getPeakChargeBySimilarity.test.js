'use strict';

const getPeakChargeBySimilarity = require('../getPeakChargeBySimilarity');
const Spectrum = require('../Spectrum');

describe('test getPeakChargeBySimilarity', () => {
  let data = {
    x: [1, 2, 3, 4, 4.333, 4.666, 7, 8, 9],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  };
  let spectrum = new Spectrum(data);

  it('default options', () => {
    let charge = getPeakChargeBySimilarity(spectrum, 4, {
      similarity: {
        zone: { low: -0.5, high: 2.5 },
        widthBottom: 0.1,
        widthTop: 0.1
      },
      minCharge: 1,
      maxCharge: 4
    });
    expect(charge).toBe(3);
  });
});
