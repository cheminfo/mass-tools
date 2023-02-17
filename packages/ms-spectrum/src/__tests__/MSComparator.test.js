import { MSComparator } from '../MSComparator.js';

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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(0);
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(
      0.07092177177707934,
    );
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
    const comparator = new MSComparator({ intensityPower: 1, requiredY: true });
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(
      0.0003410918284736418,
    );
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
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(0);
  });
});
