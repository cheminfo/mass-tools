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

  it('maxY', () => {
    expect(new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] }).maxY()).toBe(2);
  });

  it('scaleY', () => {
    expect(
      new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] }).scaleY(100).data
    ).toStrictEqual({ x: [1, 2, 3, 4], y: [50, 50, 100, 50] });
  });
  it('gsd of non continuous spectrum', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i <= 6; i++) {
      data.x.push(i);
      data.y.push(i > 3 ? 6 - i : i);
    }
    expect(new Spectrum(data).peakPicking()).toStrictEqual([
      { width: 0, x: 0, y: 0 },
      { width: 0, x: 1, y: 1 },
      { width: 0, x: 2, y: 2 },
      { width: 0, x: 3, y: 3 },
      { width: 0, x: 4, y: 2 },
      { width: 0, x: 5, y: 1 },
      { width: 0, x: 6, y: 0 }
    ]);
  });

  it('gsd', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i <= 200; i++) {
      data.x.push(i / 20);
      data.y.push(i > 100 ? (200 - i) ** 2 : i * i);
    }
    expect(new Spectrum(data).peakPicking()).toStrictEqual([
      {
        base: 0,
        index: 100,
        soft: false,
        width: 0.1999999999999993,
        x: 5,
        y: 10000
      }
    ]);
  });

  it('gsd realtop', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i <= 200; i++) {
      data.x.push(i / 20);
      data.y.push(i > 100 ? (200 - i) ** 2 : i * i);
    }
    data.y[99] = data.y[100];
    let peaks = new Spectrum(data).peakPicking();
    expect(peaks).toStrictEqual([
      {
        base: 0,
        index: 100,
        soft: false,
        width: 0.14999999999999947,
        x: 4.975,
        y: 10049.5
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
