'use strict';

const DBManager = require('..');

const fs = require('fs');
const join = require('path').join;

// eslint-disable-next-line import/no-extraneous-dependencies
const parseXY = require('xy-parser').parseXY;

describe('test searchSimilarity for peptide', () => {
  let experimental = loadUbiquitin();

  it('should find one result with bad distribution', () => {
    let dbManager = new DBManager();
    dbManager.fromPeptidicSequence(
      //    'KKK',
      'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQ',
      {
        ionizations: 'H1(1+).H2(2+).H3(3+)',
        mfsArray: [],
        protonation: false,
        digestion: {},
        fragmentation: {
          c: true,
          z: true
        }
      }
    );
    dbManager.setExperimentalSpectrum(experimental);

    let results = dbManager.searchSimilarity({
      filter: {},
      similarity: {
        widthBottom: 0.02,
        widthTop: 0.01,
        widthFunction: (mass) => {
          return { bottom: 0.01 + mass / 8000, top: 0.01 + mass / 8000 / 2 };
        },
        zone: {
          low: -0.5,
          high: 2.5
        },
        common: 'second' // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      }
    });

    expect(results).toMatchSnapshot();
    expect(results.peptidic[0].ms.similarity.value).toBeCloseTo(0.9, 2);
  });
});

function loadUbiquitin() {
  let text = fs.readFileSync(join(__dirname, 'data/ubiquitin.txt'), 'utf8');
  let data = parseXY(text, { arrayType: 'xxyy' });
  return {
    x: data[0],
    y: data[1]
  };
}
