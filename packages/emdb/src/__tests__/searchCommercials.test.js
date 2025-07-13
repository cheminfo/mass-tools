import { describe, expect, it } from 'vitest';

import { EMDB } from '..';

describe('test search commercial', () => {
  it('should filter the commercial database', async () => {
    let emdb = new EMDB();
    await emdb.loadCommercials();

    let results = emdb.search(
      {
        minMW: 100,
        maxMW: 101,
      },
      {
        flatten: true,
      },
    );

    expect(results).toHaveLength(66);

    results = emdb.search(
      {
        minMW: 100,
        maxMW: 101,
      },
      {
        flatten: false,
      },
    );

    expect(results.commercials).toHaveLength(66);

    results = emdb.searchMSEM(100, {
      flatten: true,
    });

    expect(results).toHaveLength(0);

    results = emdb.searchMSEM(100, {
      // we search for an experimental mass !
      ionizations: 'H+',
      flatten: true,
      filter: {
        precision: 1e4,
        unsaturation: {
          onlyInteger: true,
          min: 2,
          max: 3,
        },
      },
    });

    expect(results[0].ms.charge).toBe(1);
    expect(results[0].ms.em).toBeCloseTo(100, 1);
    expect(results[0].ms.ppm).toBeLessThan(500);
    expect(results).toHaveLength(58);
  });
});
