'use strict';

const peptideSVG = require('../peptideSVG');

test('test peptideSVG', () => {
  let options = {
    width: 600,
    leftRightBorders: 50,
    spaceBetweenResidues: 20,
    spaceBetweenInteralLines: 10
  };
  let sequence = '(Me)MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQ';
  let info = [
    { type: 'b38y33', similarity: 90.12, charge: 3 },
    { type: 'b30y30', similarity: 86.86, charge: 3 },
    { type: 'c38', similarity: 89.19, charge: 3 },
    { type: 'c34', similarity: 87.64, charge: 2 },
    { type: 'z21', similarity: 86.94, charge: 2 },
    { type: 'c21', similarity: 86.9, charge: 2 },
    { type: 'c24', similarity: 95.48, charge: 2 },
    { type: 'c28', similarity: 84.63, charge: 2 },
    { type: 'c29', similarity: 81.27, charge: 2 },
    { type: 'z28', similarity: 79.76, charge: 2 },
    { type: 'c30', similarity: 74.06, charge: 2 },
    { type: 'c27', similarity: 71.57, charge: 2 },
    { type: 'c34', similarity: 67.66, charge: 3 },
    { type: 'c17', similarity: 66.17, charge: 2 },
    { type: 'c20', similarity: 62.44, charge: 2 },
    { type: 'z20', similarity: 61.64, charge: 2 },
    { type: 'z9', similarity: 57.76, charge: 3 },
    { type: 'c38', similarity: 50.44, charge: 2 }
  ];
  let svg = peptideSVG(sequence, info, options);
  console.log(svg);

  expect(true).toBe(true);
});
