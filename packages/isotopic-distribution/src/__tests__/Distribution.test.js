import { Distribution } from '../Distribution.js';

describe('Distribution', () => {
  it('create array', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    expect(distribution).toHaveLength(2);
  });

  it('joinX array 0', () => {
    let distribution = new Distribution();
    distribution.joinX();
    expect(distribution.array).toStrictEqual([]);
  });

  it('joinX array 1', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 1 });
    distribution.joinX();
    expect(distribution.array).toStrictEqual([{ x: 1, y: 1 }]);
  });

  it('joinX array', () => {
    let distribution = new Distribution();
    distribution.push({ x: 0, y: 0 }, { x: 1, y: 1 });
    distribution.joinX();
    expect(distribution.array).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('really joinX array', () => {
    let distribution = new Distribution();
    distribution.push({ x: 0, y: 0 }, { x: 1, y: 1 });
    distribution.joinX(1);
    expect(distribution.array).toStrictEqual([{ x: 1, y: 1 }]);
  });

  it('really joinX array shifted', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 0 }, { x: 2, y: 1 });
    distribution.joinX(1);
    expect(distribution.array).toStrictEqual([{ x: 2, y: 1 }]);
  });

  it('really joinX array shifted weighted', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 1 }, { x: 2, y: 3 });
    distribution.joinX(1);
    expect(distribution.array).toStrictEqual([{ x: 1.75, y: 4 }]);
  });

  it('really joinX array shifted weighted 3', () => {
    let distribution = new Distribution();
    distribution.push({ x: 2, y: 3 }, { x: 1, y: 1 }, { x: 2.25, y: 1 });
    expect(distribution.minX).toStrictEqual(1);
    expect(distribution.maxX).toStrictEqual(2.25);
    expect(distribution.minY).toStrictEqual(1);
    expect(distribution.maxY).toStrictEqual(3);
    distribution.joinX(1);

    expect(distribution.array).toStrictEqual([{ x: 1.85, y: 5 }]);
  });

  it('really joinX array shifted weighted 4', () => {
    let distribution = new Distribution();
    distribution.push(
      { x: 1, y: 1 },
      { x: 2, y: 3 },
      { x: 2.25, y: 1 },
      { x: 5, y: 1 },
    );
    distribution.joinX(1);
    expect(distribution.array).toStrictEqual([
      { x: 1.85, y: 5 },
      { x: 5, y: 1 },
    ]);
  });

  it('Check the threshold', () => {
    let distribution = new Distribution();
    distribution.push(
      { x: 1, y: 1 },
      { x: 2, y: 3 },
      { x: 2.25, y: 1 },
      { x: 5, y: 1 },
    );
    distribution.threshold(0.5);
    expect(distribution.array).toStrictEqual([{ x: 2, y: 3 }]);
  });
});
