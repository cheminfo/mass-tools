import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { MSComparator } from '../MSComparator.js';

expect.extend({ toBeDeepCloseTo });

describe('Comprator', () => {
  it('same values', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const comparator = new MSComparator();
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 3,
      nbPeaks2: 3,
      nbPeaks1: 3,
      tanimoto: 1,
      cosine: 1,
    });
  });
  it('scaled values', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [10, 20, 30],
      y: [2, 4, 6],
    };
    const comparator = new MSComparator();
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 3,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 1,
      cosine: 1,
    });
  });
  it('default values', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [9.91, 20.09, 30],
      y: [1, 2, 3],
    };
    const comparator = new MSComparator();
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 3,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 1,
      cosine: 1,
    });
  });
  it('default values but nothing match', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [12, 18, 32],
      y: [1, 2, 3],
    };
    const comparator = new MSComparator();
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toStrictEqual({
      nbCommonPeaks: 0,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 0,
      cosine: 0,
    });
  });
  it('default values delta 1', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [9.8, 20.2, 30.2],
      y: [1, 2, 3],
    };
    const comparator = new MSComparator({ delta: 1 });
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 3,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 1,
      cosine: 1,
    });
  });
  it('default values massPower 1', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 1, 1],
    };
    const data2 = {
      x: [10, 20.2, 30.2],
      y: [1, 1, 1],
    };
    const comparator = new MSComparator({ massPower: 1 });
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 1,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 0.2,
      cosine: 0.07092177177707934,
    });
  });
  it('default values requiredY true', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [10, 20.2, 30.2],
      y: [2, 4, 6],
    };
    const comparator = new MSComparator({
      intensityPower: 1,
      selectedMasses: [10],
    });
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toStrictEqual({
      nbCommonPeaks: 1,
      nbPeaks1: 1,
      nbPeaks2: 1,
      tanimoto: 1,
      cosine: 1,
    });
  });

  it('default values minNbCommonPeaks 1', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [10, 20.2, 30.2],
      y: [2, 4, 6],
    };
    const comparator = new MSComparator({ minNbCommonPeaks: 1 });
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 1,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 0.2,
      cosine: 0.0003410918284736418,
    });
  });

  it('default values minNbCommonPeaks 2', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [10, 20.2, 30.2],
      y: [2, 4, 6],
    };
    const comparator = new MSComparator({ minNbCommonPeaks: 2 });
    const similarity = comparator.getSimilarity(data1, data2);
    expect(similarity).toStrictEqual({
      nbCommonPeaks: 1,
      nbPeaks1: 3,
      nbPeaks2: 3,
      tanimoto: 0,
      cosine: 0,
    });
  });

  it('No intensity in data2', () => {
    const data = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const masses = [10, 20.2, 30.2];
    const comparator = new MSComparator();
    const similarity = comparator.getSimilarityToMasses(data, masses);
    expect(similarity).toBeDeepCloseTo({
      nbCommonPeaks: 1,
      nbPeaks1: 3,
      nbPeaks2: 1, // only one because there was no intensity and we removed the non overlapping ones
      tanimoto: 0.3333333333333333,
      cosine: 0.018658382474665287,
    });
  });
});
