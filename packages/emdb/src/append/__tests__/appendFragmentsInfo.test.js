'use strict';

const fs = require('fs');
const join = require('path').join;

// eslint-disable-next-line import/no-extraneous-dependencies
const parseXY = require('xy-parser').parseXY;

const DBManager = require('../..');

describe('test appendFragmentsInfo for ethylbenzene', () => {
  let experimental = loadEthylbenzene();
  it('should find one result with bad distribution', async () => {
    let dbManager = new DBManager();
    await dbManager.fromMonoisotopicMass(106.077, {
      ionizations: '+',
      ranges: 'C0-100 H0-100 N0-100 O0-100 F0-10 Cl0-10',
      filter: {
        unsaturation: {
          min: 0,
          max: 100,
          onlyInteger: true,
        },
      },
      precision: 20,
      allowNeutral: false,
    });

    dbManager.setExperimentalSpectrum(experimental);

    const results = await dbManager.appendFragmentsInfo('monoisotopic', {
      precision: 5,
      ionizations: '+',
    });
    //    console.log(results);
    expect(results).toHaveLength(2);
    expect(results[0].fragments.nbFound).toBe(5);
    expect(results[0].fragments.intensityFound).toBeCloseTo(0.9708522002544118);
    expect(results[0].fragments.assignments).toHaveLength(5);
  });
});

function loadEthylbenzene() {
  let text = fs.readFileSync(
    join(__dirname, '../../__tests__/data/ethylbenzene.txt'),
    'utf8',
  );
  return parseXY(text);
}
