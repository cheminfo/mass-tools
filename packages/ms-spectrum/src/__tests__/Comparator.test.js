import { Comparator } from '../Comparator.js';

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
    const comparator = new Comparator();
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
  });
  it('default values', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [9.9, 20.1, 30],
      y: [1, 2, 3],
    };
    const comparator = new Comparator();
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(1);
  });
  it('default values', () => {
    const data1 = {
      x: [10, 20, 30],
      y: [1, 2, 3],
    };
    const data2 = {
      x: [12, 18, 32],
      y: [1, 2, 3],
    };
    const comparator = new Comparator();
    expect(comparator.getSimilarity(data1, data2)).toBeCloseTo(0);
  });
});
