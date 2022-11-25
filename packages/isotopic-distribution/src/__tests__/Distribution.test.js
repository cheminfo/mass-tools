const Distribution = require('../Distribution.js');

describe('test Distribution', () => {
  it('create array', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 2 });
    dist.push({ x: 2, y: 3 });
    expect(dist).toHaveLength(2);
  });

  it('joinX array 0', () => {
    let dist = new Distribution();
    dist.joinX();
    expect(dist.array).toStrictEqual([]);
  });

  it('joinX array 1', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 1 });
    dist.joinX();
    expect(dist.array).toStrictEqual([{ x: 1, y: 1 }]);
  });

  it('joinX array', () => {
    let dist = new Distribution();
    dist.push({ x: 0, y: 0 });
    dist.push({ x: 1, y: 1 });
    dist.joinX();
    expect(dist.array).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('really joinX array', () => {
    let dist = new Distribution();
    dist.push({ x: 0, y: 0 });
    dist.push({ x: 1, y: 1 });
    dist.joinX(1);
    expect(dist.array).toStrictEqual([{ x: 1, y: 1 }]);
  });

  it('really joinX array shifted', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 0 });
    dist.push({ x: 2, y: 1 });
    dist.joinX(1);
    expect(dist.array).toStrictEqual([{ x: 2, y: 1 }]);
  });

  it('really joinX array shifted weighted', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 1 });
    dist.push({ x: 2, y: 3 });
    dist.joinX(1);
    expect(dist.array).toStrictEqual([{ x: 1.75, y: 4 }]);
  });

  it('really joinX array shifted weighted 3', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 1 });
    dist.push({ x: 2, y: 3 });
    dist.push({ x: 2.25, y: 1 });
    dist.joinX(1);
    expect(dist.array).toStrictEqual([{ x: 1.85, y: 5 }]);
  });

  it('really joinX array shifted weighted 4', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 1 });
    dist.push({ x: 2, y: 3 });
    dist.push({ x: 2.25, y: 1 });
    dist.push({ x: 5, y: 1 });
    dist.joinX(1);
    expect(dist.array).toStrictEqual([
      { x: 1.85, y: 5 },
      { x: 5, y: 1 },
    ]);
  });
});
