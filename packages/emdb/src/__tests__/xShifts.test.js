'use strict';

const xShifts = require('../xShifts');

describe('test xShifts', () => {
  it('should give the right function', async () => {
    let data = [
      {
        ms: {
          em: 10,
          delta: 0.2,
          similarity: { value: 0.99 }
        }
      },
      {
        ms: {
          em: 20,
          delta: 0.3,
          similarity: { value: 0.99 }
        }
      },
      {
        ms: {
          em: 30,
          delta: 0.4,
          similarity: { value: 0.99 }
        }
      }
    ];

    let result = xShifts(data, { minLength: 2 });
    console.log(result);
    expect(result).toStrictEqual({});
  });
});
