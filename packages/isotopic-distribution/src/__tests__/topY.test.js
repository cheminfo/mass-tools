import { Distribution } from '../Distribution.js';

describe('test distribution topY', () => {
  it('create array', () => {
    let distribution = new Distribution();
    distribution.push(
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 1 },
      { x: 2, y: 4 },
    );
    distribution.topY(2);

    expect(distribution.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ]);
  });
});
