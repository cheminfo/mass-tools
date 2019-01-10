'use strict';

const Spectrum = require('../Spectrum');

describe('test Spectrum', () => {
  it('constructor', () => {
    expect(() => {
      Spectrum(1);
    }).toThrow('Spectrum data must be an object');
  });

  it('empty data', () => {
    expect(new Spectrum().data).toStrictEqual({ x: [], y: [] });
  });

  it('data to normedY', () => {
    expect(
      new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 1, 1] }).normedY().data
    ).toStrictEqual({ x: [1, 2, 3, 4], y: [0.25, 0.25, 0.25, 0.25] });
  });

  it('gsd', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i <= 10; i++) {
      data.x.push(i);
      data.y.push(i > 5 ? 10 - i : i);
    }
    expect(new Spectrum(data).peakPicking()).toStrictEqual([{ base: 0, index: 5, soft: false, width: 5, x: 5, y: 5 }]);
  });

  it('gsd realtop', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i <= 10; i++) {
      data.x.push(i);
      data.y.push(i > 5 ? 10 - i : i);
    }
    data.y[4] = 4.5;
    let peaks = new Spectrum(data).peakPicking();
    expect(peaks).toStrictEqual([
      {
        base: 0,
        index: 5,
        soft: false,
        width: 6,
        x: 4.820728192588237,
        y: 5.022408975926471
      }
    ]);
  });

  it('fromText', () => {
    let spectrum = Spectrum.fromText(`Title of spectrum
    1 2
    2 3
    3 4`);
    expect(spectrum.data).toStrictEqual({ x: [1, 2, 3], y: [2, 3, 4] });
  });
});
