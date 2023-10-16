import { readFileSync } from 'fs';
import { join } from 'path';

import { toMatchCloseTo, toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { xNormed } from 'ml-spectra-processing';

import { blockFcnnls } from '../blockFcnnls.js';

expect.extend({ toMatchCloseTo, toBeDeepCloseTo });

describe('blockFcnnls', () => {
  it('simple test', () => {
    const matrix = [
      [4, 1, 6, 2], // target
      [1, 1, 0, 0], // x 1
      [1, 0, 0, 0], // x 3
      [0, 0, 3, 1], // x 2
    ];
    const result = blockFcnnls(matrix);
    expect(result).toMatchCloseTo({
      reconstructed: [4, 1, 6, 2],
      weights: [1, 3, 2],
    });
  });

  it('complex case', () => {
    const combined = JSON.parse(
      readFileSync(join(__dirname, './data/combined.json'), 'utf8'),
    );
    // first row are the target values
    const result = blockFcnnls(combined.ys);
    let counter = 0;
    result.reconstructed.forEach((value) => {
      if (value > 0) {
        counter++;
      }
    });
    expect(counter).toBe(5292);

    const relativeIntensity = Array.from(
      xNormed(result.weights).filter((value) => value > 0.01),
    );

    expect(Array.from(relativeIntensity)).toBeDeepCloseTo([
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
    ]);
  });
});
