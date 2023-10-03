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
      'Could not find any overlaping peaks between experimental and theoretical spectra.',
    );
  });

  it('complex case without slots', async () => {
    const text = readFileSync(join(__dirname, './data/ionic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    const { mfs } = await mfsDeconvolution(
      spectrum,
      ['(C9H17N2(+))0-40(Cl(-))0-40', ',C-1H-2'],
      {
        filter: {
          minMass: 1000,
          maxMass: 2000,
          minCharge: 1,
          maxCharge: 5,
        },
        mass: {
          threshold: 0.0001,
          precision: 20,
          peakWidthFct: '6.491987071624664e-7 * mass ** 1.4356768317473447',
        },
      },
    );
    const relativeQuantities = mfs
      .map((mf) => mf.relativeQuantity)
      .filter((value) => value > 0.01);
    expect(relativeQuantities).toBeDeepCloseTo(
      [
        0.021505061805686832, 0.031194555558935227, 0.028292482806339267,
        0.03208017156620512, 0.013825379160981636, 0.025491044394483943,
        0.0189250980018823, 0.03796739119752509, 0.01612401409049631,
        0.03980564783960812, 0.034646382178323006, 0.012470073384239173,
        0.028360108093551144, 0.010430177909842096, 0.0243206173305774,
        0.013056448315375856, 0.01049853356796891, 0.021937953729900334,
        0.015039030044525276, 0.015629124792231504, 0.020758752386696853,
        0.01568592383033661, 0.02029884396124671, 0.015912224535129502,
        0.015704957645121156, 0.02036679334441191, 0.015932290601511273,
        0.020150619654554225, 0.015263168168473382, 0.016242099607320794,
        0.018391953343584958, 0.01230815249822961, 0.015893746140023524,
        0.013126584657530662, 0.010375499555624975,
      ].sort((a, b) => b - a),
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

    const absoluteQuantities = mfs.map((mf) => mf.absoluteQuantity);
    // results is completely wrong because
    // we didn't set the ionizations
    expect(absoluteQuantities).toBeDeepCloseTo([99, 50.5, 20.3, 10, 0, 0], 0);
  });

  it('HValOH default parameter with logger', async () => {
    const text = readFileSync(join(__dirname, './data/isotopic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    const logger = new FifoLogger();
    const result = await mfsDeconvolution(
      spectrum,
      ['HValOH', '([13C]C-1)0-10'],
      { logger },
    );

    const absoluteQuantities = result.mfs.map((mf) => mf.absoluteQuantity);
    // results is completely wrong because
    // we didn't set the ionizations
    expect(absoluteQuantities).toBeDeepCloseTo([99, 50.5, 20.3, 10, 0, 0], 0);
    const logs = logger.getLogs();
    expect(logs).toHaveLength(6);
    expect(logs[0].message).toBe(
      'No ionizations provided this could be an error if the molecule is not naturally charged.',
    );
    expect(logs[1].message).toBe(
      'Problem with isotopic distribution calculation. Negative number of atoms ? C-1[13C]6H11NO2 ',
    );
  });

  it('HValOH enriched good parameter with bromine outside mass range', async () => {
    const logger = new FifoLogger();
    const text = readFileSync(join(__dirname, './data/isotopic.txt'));
    const spectrum = new Spectrum(parseXY(text));
    const { mfs, reconstructed, matchingScore, difference } =
      await mfsDeconvolution(spectrum, ['HValOH', '([13C]C-1)0-10,Br'], {
        ionizations: 'H+',
        logger,
        peakWidthFct: (em) => em / 1000,
      });
    expect(matchingScore).toBeCloseTo(1);
    const absoluteQuantities = mfs.map((mf) => mf.absoluteQuantity);
    expect(absoluteQuantities).toBeDeepCloseTo([100, 50, 20, 10, 0, 0, 0], 3);
    const relativeQuantities = mfs.map((mf) => mf.relativeQuantity);
    expect(relativeQuantities).toBeDeepCloseTo([
      0.555556, 0.277778, 0.111111, 0.055554, 0, 0, 0,
    ]);
    let totalDifference = 0;
    spectrum.peaks.forEach((peak, index) => {
      totalDifference += Math.abs(reconstructed.y[index] - peak.y);
    });
    expect(totalDifference).toBeLessThan(0.001);
    expect(difference.x).toHaveLength(19);
    expect(difference.y).toHaveLength(19);
    expect(logger.getLogs()).toHaveLength(5);
  });
});
