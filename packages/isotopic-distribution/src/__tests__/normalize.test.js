const Distribution = require('../Distribution.js');

describe('test distribution normalize', () => {
  it('should yield the product', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 2 });
    dist.push({ x: 2, y: 3 });
    dist.normalize();

    expect(dist.array).toStrictEqual([
      { x: 1, y: 0.4 },
      { x: 2, y: 0.6 },
    ]);
  });
});
