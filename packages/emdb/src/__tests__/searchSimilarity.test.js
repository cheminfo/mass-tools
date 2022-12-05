import { EMDB } from '..';

describe('test searchSimilarity', () => {
  it('should find one result with bad distribution', async () => {
    let emdb = new EMDB();
    await emdb.loadNeutralTest({ maxC: 10 });
    emdb.setExperimentalSpectrum({ x: [41, 121], y: [1, 1] });
    let results = await emdb.searchSimilarity({
      ionizations: 'H+,(H+)2,(H+)3', // useless because the test database has already ionizations
      filter: {},
      similarity: {
        widthBottom: 0.05,
        widthTop: 0.01,
        zone: {
          low: -0.5,
          high: 2.5,
        },
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });

    expect(results.test).toHaveLength(2);

    expect(results.test).toMatchSnapshot();
    expect(results.test[0].ms.similarity.value).toBeCloseTo(0.886, 3);
    expect(results.test[1].ms.similarity.value).toBeCloseTo(0.886, 3);
  });

  it('should find one result with callback', async () => {
    let emdb = new EMDB();
    await emdb.loadNeutralTest({ maxC: 10 });
    emdb.setExperimentalSpectrum({ x: [41, 121], y: [1, 1] });
    let results = await emdb.searchSimilarity({
      ionizations: 'H+,(H+)2,(H+)3', // useless because the test database has already ionizations
      filter: {
        callback: (entry) => entry.atoms.C === 10,
      },
    });

    expect(results.test).toHaveLength(2);
  });

  it('should find one result with wrong callback', async () => {
    let emdb = new EMDB();
    await emdb.loadNeutralTest({ maxC: 10 });
    emdb.setExperimentalSpectrum({ x: [41, 121], y: [1, 1] });
    let results = await emdb.searchSimilarity({
      ionizations: 'H+,(H+)2,(H+)3', // useless because the test database has already ionizations
      filter: {
        callback: (entry) => entry.atoms.C === 9,
      },
    });

    expect(results.test).toHaveLength(0);
  });

  it('should find one result with perfect match (small zone)', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120], y: [1] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {},
      similarity: {
        widthBottom: 0.05,
        widthTop: 0.01,
        zone: {
          low: -0.5,
          high: 0.5,
        },
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });
    //   expect(results.test).toMatchSnapshot();
    expect(results.test[0].ms.similarity.value).toBe(1);
  });

  it('should find one result with bad distribution, small zone, small width', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120, 121], y: [1, 1] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {
        msem: 120,
        precision: 1000,
      },
      similarity: {
        zone: {
          low: -0.5,
          high: 0.5,
        },
        widthBottom: 0.1,
        widthTop: 0.1,
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });

    expect(results.test[0].ms.similarity.value).toBe(1);
  });

  it('should find no result because of filter', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120, 121], y: [1, 1] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {
        msem: 120,
        precision: 1,
      },
    });
    expect(results.test).toHaveLength(0);
  });

  it('should find one result with bad bad distribution, large window', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120], y: [1] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {
        msem: 120,
        precision: 1000,
      },
      similarity: {
        zone: {
          low: -0.5,
          high: 2.5,
        },
        widthBottom: 0.1,
        widthTop: 0.1,
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });
    expect(results.test[0].ms.similarity.value).toBeCloseTo(0.895, 2);
  });

  it('should find one result with bad bad distribution, large window huge width', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120], y: [1] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {
        msem: 120,
        precision: 1000,
      },
      similarity: {
        zone: {
          low: -0.5,
          high: 2.5,
        },
        widthBottom: 5,
        widthTop: 5,
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });
    expect(results.test[0].ms.similarity.value).toBe(1);
  });

  it('should find one result with overlap', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120], y: [1] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {
        msem: 120,
        precision: 1000,
      },
      similarity: {
        widthBottom: 0.05,
        widthTop: 0.01,
        zone: {
          low: -0.5,
          high: 2.5,
        },
        common: 'first', // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });
    expect(results.test[0].ms.similarity.value).toBe(1);
  });

  it('should find one result with good distribution', async () => {
    let emdb = new EMDB();
    await emdb.loadTest();
    emdb.setExperimentalSpectrum({ x: [120, 121], y: [1, 0.11] });
    let results = await emdb.searchSimilarity({
      ionizations: '+',
      filter: {
        msem: 120,
        precision: 1000,
      },
      similarity: {
        widthBottom: 0.05,
        widthTop: 0.01,
        common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
      },
    });
    expect(results.test[0].ms.similarity.value).toBeCloseTo(0.995, 2);
  });
});
