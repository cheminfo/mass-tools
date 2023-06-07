import { readFileSync } from 'fs';
import { join } from 'path';

import { FifoLogger } from 'fifo-logger';
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { parseXY } from 'xy-parser';

import { Spectrum } from '../../../ms-spectrum/src/Spectrum';
import { mfsDeconvolution } from '../mfsDeconvolution';

expect.extend({ toBeDeepCloseTo });

describe('mfsDeconvolution', () => {
  it('mfsDeconvolution no overlap', async () => {
    const text = readFileSync(join(__dirname, './data/ionic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    expect(async () =>
      mfsDeconvolution(spectrum, ['C.N', 'N.O']),
    ).rejects.toThrow(
      'Could not find any overlaping peaks between experimental and theoretical spectrum.',
    );
  });

  it('no spectrum', async () => {
    // @ts-ignore
    expect(async () => mfsDeconvolution()).rejects.toThrow(
      'spectrum must be an instance of Spectrum',
    );
  });

  it('no ranges', async () => {
    const text = readFileSync(join(__dirname, './data/isotopic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    // @ts-ignore
    expect(async () => mfsDeconvolution(spectrum)).rejects.toThrow(
      'Ranges must be an array of string or object',
    );
  });

  it('HValOH default parameter', async () => {
    const text = readFileSync(join(__dirname, './data/isotopic.txt'));
    const spectrum = new Spectrum(parseXY(text));

    const { mfs } = await mfsDeconvolution(spectrum, [
      'HValOH',
      '([13C]C-1)0-10',
    ]);

    const weights = mfs.map((mf) => mf.weight);
    // results is completely wrong because
    // we didn't set the ionizations
    expect(weights).toBeDeepCloseTo(
      [0, 99, 50.5, 20.3, 10, 0.0, 0, 0, 0, 0, 0],
      0,
    );
  });

  it('HValOH default parameter with logger', async () => {
    const text = readFileSync(join(__dirname, './data/isotopic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    const logger = new FifoLogger();
    const { mfs } = await mfsDeconvolution(
      spectrum,
      ['HValOH', '([13C]C-1)0-10'],
      { logger },
    );

    const weight = mfs.map((mf) => mf.weight);
    // results is completely wrong because
    // we didn't set the ionizations
    expect(weight).toBeDeepCloseTo(
      [0, 99, 50.5, 20.3, 10, 0.0, 0, 0, 0, 0, 0],
      0,
    );
    expect(logger.events[0].message).toBe(
      'No ionizations provided this could be an error if the molecule is not naturally charged.',
    );
  });

  it('HValOH enriched', async () => {
    const logger = new FifoLogger();
    const text = readFileSync(join(__dirname, './data/isotopic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    const { mfs, reconstructed } = await mfsDeconvolution(
      spectrum,
      ['HValOH', '([13C]C-1)0-10'],
      {
        ionizations: 'H+',
        logger,
        peakWidthFct: (em) => em / 1000,
      },
    );
    const weights = mfs.map((mf) => mf.weight);
    expect(weights).toBeDeepCloseTo([100, 50, 20, 10, 0, 0, 0, 0, 0, 0, 0], 3);
    const relatives = mfs.map((mf) => mf.relative);
    expect(relatives).toBeDeepCloseTo([
      0.555556, 0.277778, 0.111111, 0.055554, 0, 0, 0, 0, 0, 0, 0,
    ]);
    let difference = 0;
    spectrum.peaks.forEach((peak, index) => {
      difference += Math.abs(reconstructed.y[index] - peak.y);
    });
    expect(difference).toBeLessThan(0.001);
    expect(logger.getLogs()).toHaveLength(0);
  });
});
