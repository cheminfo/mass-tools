'use strict';

const DBManager = require('..');

describe('test search commercial', () => {
  it('should filter the commercial database', async () => {
    let dbManager = new DBManager();
    await dbManager.loadCommercials();

    let results = dbManager.search(
      {
        minMW: 100,
        maxMW: 101
      },
      {
        flatten: true
      }
    );
    expect(results).toHaveLength(66);

    results = dbManager.search(
      {
        minMW: 100,
        maxMW: 101
      },
      {
        flatten: false
      }
    );
    expect(results.commercials).toHaveLength(66);

    results = dbManager.searchMSEM(100, {
      flatten: true
    });
    expect(results).toHaveLength(0);

    results = dbManager.searchMSEM(100, { // we search for an experimental mass !
      ionizations: 'H+',
      flatten: true,
      filter: {
        precision: 1e4,
        unsaturation: {
          onlyInteger: true,
          min: 2,
          max: 3,
        }
      }
    });
    expect(results[0].ms.charge).toBe(1);
    expect(results[0].ms.em).toBeCloseTo(100, 1);
    expect(results[0].ms.ppm).toBeLessThan(500);
    expect(results).toHaveLength(56);
  });
});
