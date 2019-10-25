'use strict';

const fs = require('fs');
const join = require('path').join;

// eslint-disable-next-line import/no-extraneous-dependencies
const parseXY = require('xy-parser').parseXY;

const DBManager = require('..');

describe('test searchSimilarity for ethylbenzene', () => {
  let experimental = loadEthylbenzene();
  it('should find one result with bad distribution', () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(106.077, {
      ionizations: 'Na+,K+,(H+),(H+)2,(H+)3,+',
      ranges: 'C0-100 H0-100 N0-100 O0-100',
      unsaturation: {
        min: 0,
        max: 100,
        onlyInteger: true,
      },
      precision: 1000,
      allowNeutral: false,
    });

    dbManager.setExperimentalSpectrum(experimental);

    let results = dbManager.searchSimilarity({
      filter: {},
      similarity: {
        widthBottom: 0.006,
        widthTop: 0.003,
        zone: {
          low: -0.5,
          high: 2.5,
        },
        // in case we have a 'pure' product we should take all the peaks of the specified area
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
      flatten: true,
    });

    expect(results[0].mf).toBe('C8H10');
    expect(results[0].ms.similarity.value).toBeCloseTo(0.95, 2);
    expect(results).toMatchSnapshot();
  });
});

function loadEthylbenzene() {
  let text = fs.readFileSync(join(__dirname, 'data/ethylbenzene.txt'), 'utf8');
  return parseXY(text);
}
