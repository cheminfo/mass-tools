'use strict';

const getResiduesInfo = require('../getResiduesInfo');

test('getResiduesInfo', () => {
  let options = {
    width: 600,
    leftRightBorders: 50,
    spaceBetweenResidues: 20,
    spaceBetweenInteralLines: 10
  };
  let sequence = 'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQ';

  let residuesInfo = getResiduesInfo(sequence, options);
  console.log(residuesInfo);

  expect(true).toBe(true);
});
