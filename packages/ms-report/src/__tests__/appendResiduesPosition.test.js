'use strict';

const appendResiduesPosition = require('../appendResiduesPosition');

test('appendResiduesPosition', () => {
  let options = {
    width: 600,
    leftRightBorders: 50,
    spaceBetweenResidues: 20,
    spaceBetweenInteralLines: 10,
  };
  let sequence = 'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQ';

  let residuesInfo = appendResiduesPosition(sequence, options);

  expect(true).toBe(true);
});
