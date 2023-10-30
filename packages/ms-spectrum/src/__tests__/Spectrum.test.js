import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { generateSpectrum } from 'spectrum-generator';

import { Spectrum, fromText } from '../Spectrum';

expect.extend({ toBeDeepCloseTo });

describe('test Spectrum', () => {
  it('constructor', () => {
    expect(() => {
      new Spectrum(1);
    }).toThrow('Spectrum data must be an object');
  });

  it('empty data', () => {
    expect(new Spectrum().data).toStrictEqual({ x: [], y: [] });
  });

  it('data to normedY', () => {
    expect(
      new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 1, 1] }).normedY().data,
    ).toStrictEqual({
      x: [1, 2, 3, 4],
      y: Float64Array.from([0.25, 0.25, 0.25, 0.25]),
    });
  });

  it('maxY', () => {
    expect(new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] }).maxY()).toBe(2);
  });

  it('info', () => {
    expect(
      new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] }).info,
    ).toStrictEqual({
      minX: 1,
      maxX: 4,
      minY: 1,
      maxY: 2,
    });
  });

  it('sumY', () => {
    let spectrum = new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] });
    expect(spectrum.sumY()).toBe(5);
  });
  it('scaleY', () => {
    expect(
      new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] }).scaleY(100).data,
    ).toStrictEqual({ x: [1, 2, 3, 4], y: [50, 50, 100, 50] });
  });

  it('rescaleX', () => {
    expect(
      new Spectrum({ x: [1, 2, 3, 4], y: [1, 1, 2, 1] }).rescaleX((x) => x ** 2)
        .data,
    ).toStrictEqual({ x: [1, 4, 9, 16], y: [1, 1, 2, 1] });
  });

  it('gsd of non continuous spectrum', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i <= 6; i++) {
      data.x.push(i);
      data.y.push(i > 3 ? 6 - i : i);
    }
    expect(new Spectrum(data).peakPicking()).toStrictEqual([
      { width: 0, x: 0, y: 0, charge: 1 },
      { width: 0, x: 1, y: 1, charge: 1 },
      { width: 0, x: 2, y: 2, charge: 1 },
      { width: 0, x: 3, y: 3, charge: 1 },
      { width: 0, x: 4, y: 2, charge: 1 },
      { width: 0, x: 5, y: 1, charge: 1 },
      { width: 0, x: 6, y: 0, charge: 1 },
    ]);
  });

  it('gsd', () => {
    const peaks = [{ x: 5, y: 10000, width: 0.2 }];

    const data = generateSpectrum(peaks, {
      generator: {
        from: 0,
        to: 10,
        nbPoints: 10001,
      },
    });
    const result = new Spectrum(data).peakPicking();
    expect(result).toBeDeepCloseTo([
      {
        x: 5,
        y: 10000,
        width: 0.2,
        charge: 1,
      },
    ]);
  });

  it('gsd with stupid threshold', () => {
    const peaks = [{ x: 5, y: 10000, width: 0.2 }];

    const data = generateSpectrum(peaks, {
      generator: {
        from: 0,
        to: 10,
        nbPoints: 10001,
      },
    });
    const result = new Spectrum(data, { threshold: 1 }).peakPicking();
    expect(result).toStrictEqual([]);
  });

  it('peak picking and same y value', () => {
    const peaks = [{ x: 5, y: 10000, width: 0.2 }];

    const data = generateSpectrum(peaks, {
      generator: {
        from: 0,
        to: 10,
        nbPoints: 201,
      },
    });

    data.y[99] = data.y[100];
    let result = new Spectrum(data).peakPicking();
    expect(result).toBeDeepCloseTo([
      { x: 4.975, y: 10491.836675359205, width: 0.2, charge: 1 },
    ]);
  });
});

test('fromText', () => {
  let spectrum = fromText(`Title of spectrum
    1 2
    2 3
    3 4`);
  expect(spectrum.data).toStrictEqual({ x: [1, 2, 3], y: [2, 3, 4] });
});
