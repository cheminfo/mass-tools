import { Distribution } from '../Distribution.js';

describe('test distribution topY', () => {
  it('create array', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 2 });
    distribution.push({ x: 2, y: 3 });
    distribution.push({ x: 2, y: 1 });
    distribution.push({ x: 2, y: 4 });
    distribution.topY(2);

    expect(distribution.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ]);
  });
});
