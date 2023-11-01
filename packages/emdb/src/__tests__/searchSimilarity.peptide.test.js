import fs from 'fs';
import { join } from 'path';

import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { parseXY } from 'xy-parser';

import { EMDB } from '..';

expect.extend({ toBeDeepCloseTo });

describe('test searchSimilarity for peptide', () => {
  let experimental = loadUbiquitin();

  it('should find one result with bad distribution', async () => {
    let emdb = new EMDB();
    await emdb.fromPeptidicSequence(
      //    'KKK',
      'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQ',
      {
        ionizations: 'H1(1+).H2(2+).H3(3+)',
        mfsArray: [],
        protonation: false,
        digestion: {},
        fragmentation: {
          c: true,
          z: true,
        },
      },
    );
    emdb.setExperimentalSpectrum(experimental);

    let results = await emdb.searchSimilarity({
      filter: {},
      similarity: {
        widthBottom: 0.02,
        widthTop: 0.01,
        widthFunction: (mass) => {
          return { bottom: 0.01 + mass / 8000, top: 0.01 + mass / 8000 / 2 };
        },
        zone: {
          low: -0.5,
          high: 2.5,
        },
        common: 'second', // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });
    delete results.peptidic[0].ms.similarity.experimental;
    expect(results.peptidic[0]).toBeDeepCloseTo({
      charge: 1,
      em: 4210.304872186381,
      mw: 4212.888237254821,
      ionization: {
        mf: 'H2(+2)',
        em: 2.01565006446,
        charge: 2,
        atoms: { H: 2 },
      },
      unsaturation: 53,
      atoms: { C: 188, H: 318, N: 47, O: 59, S: 1 },
      ms: {
        ionization: 'H2(+2)',
        em: 1404.106292170371,
        charge: 3,
        similarity: {
          value: 0.9646106703663371,
          factor: 0.0007671062364860218,
          theoretical: [
            [1404.1062921703708, 1404.4405986138634, 1404.774826084723],
            [0.16643354388073694, 0.37817634643567843, 0.45539010968358457],
          ],
          difference: [
            [1404.1062921703708, 1404.4405986138634, 1404.774826084723],
            [0.021767122285728965, 0.01362220734793394, 0],
          ],
          experimentalInfo: {
            sum: 0.0007671062364860218,
            min: 0,
            max: 0.00009697908619110793,
            from: 1403.9396255037043,
            to: 1404.9396255037043,
          },
          thereoticalInfo: {
            sum: 0.5313057912545383,
            min: 0.08842710572285185,
            max: 0.24195140255492786,
          },
          quantity: 0.0007671062364860208,
          width: { bottom: 0.1855132865212964, top: 0.09775664326064819 },
        },
      },
      parts: [
        'HMetGlnIlePheValLysThrLeuThrGlyLysThrIleThrLeuGluValGluProSerAspThrIleGluAsnValLysAlaLysIleGlnAspLysGluGlyIleProProNH3(+1)',
      ],
      sequence: 'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPP',
      mf: 'C188H318N47O59S(+1)',
      comment: 'c38',
    });
  });

  it('should find one result with bad distribution and string fucntion', async () => {
    let emdb = new EMDB();
    await emdb.fromPeptidicSequence(
      'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQ',
      {
        ionizations: 'H1(1+).H2(2+).H3(3+)',
        mfsArray: [],
        protonation: false,
        digestion: {},
        fragmentation: {
          c: true,
          z: true,
        },
      },
    );
    emdb.setExperimentalSpectrum(experimental);

    let results = await emdb.searchSimilarity({
      filter: {},
      similarity: {
        widthBottom: 0.02,
        widthTop: 0.01,
        widthFunction:
          'return { bottom: 0.01 + mass / 8000, top: 0.01 + mass / 8000 / 2 };',
        zone: {
          low: -0.5,
          high: 2.5,
        },
        common: 'second', // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });

    expect(results.peptidic[0].ms.similarity.value).toBeCloseTo(0.96, 2);
  });
});

function loadUbiquitin() {
  let text = fs.readFileSync(join(__dirname, 'data/ubiquitin.txt'), 'utf8');
  return parseXY(text, { arrayType: 'xxyy' });
}
