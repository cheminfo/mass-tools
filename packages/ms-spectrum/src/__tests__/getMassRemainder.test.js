import { getMassRemainder } from '../getMassRemainder';

describe('test getMassRemainder', () => {
  let spectrum = {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  it('default options', () => {
    let remainder = getMassRemainder(spectrum, 4);
    expect(remainder).toStrictEqual({ x: [0, 1, 2, 3], y: [12, 15, 8, 10] });
  });
});
