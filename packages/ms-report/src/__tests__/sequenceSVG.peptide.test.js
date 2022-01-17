'use strict';

const { writeFileSync } = require('fs');
const { join } = require('path');

const sequenceSVG = require('../sequenceSVG');

test('sequenceSVG of peptide', () => {
  let options = {
    width: 600,
    leftRightBorders: 50,
    spaceBetweenResidues: 20,
    spaceBetweenInternalLines: 10,
  };
  let sequence =
    '(Me)MQIFVKTLTGKT(OEt)IT(OMe)LEVEPSD(NH2)TIENVKAKIQD(NH2)KEGIPPDQQ(OMe)';
  let info = [
    { type: 'b38y33', similarity: 0.9012, charge: 3 },
    { type: 'b30y30', similarity: 0.8686, charge: 3 },
    { type: 'b40y40', similarity: 0.869, charge: 2 },
    { type: 'c1', similarity: 0.8919, charge: 3 },
    { type: 'c1', similarity: 0.9548, charge: 2 },
    { type: 'c5', similarity: 0.8764, charge: 2 },
    { type: 'x1', similarity: 0.8694, charge: 2 },
    { type: 'c28', similarity: 0.8463, charge: 2 },
    { type: 'c29', similarity: 0.8127, charge: 2 },
    { type: 'z28', similarity: 0.7976, charge: 2 },
    { type: 'c30', similarity: 0.7406, charge: 2 },
    { type: 'c27', similarity: 0.7157, charge: 2 },
    { type: 'c34', similarity: 0.6766, charge: 3 },
    { type: 'c17', similarity: 0.6617, charge: 2 },
    { type: 'z9', similarity: 0.6244, charge: 1 },
    { type: 'z9', similarity: 0.6164, charge: 2 },
    { type: 'z9', similarity: 0.5776, charge: 3 },
    { type: 'c38', similarity: 0.5044, charge: 2 },
  ];
  let svg = sequenceSVG(sequence, info, options);
  writeFileSync(join(__dirname, 'testPeptide.svg'), svg);

  expect(svg.length).toBeGreaterThan(20000);
});
