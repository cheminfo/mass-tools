'use strict';

const sequenceSVG = require('../sequenceSVG');

test('sequenceSVG of peptide', () => {
  let options = {
    width: 700,
    leftRightBorders: 50,
    spaceBetweenResidues: 30,
    spaceBetweenInternalLines: 12,
    strokeWidth: 2,
    labelFontFamily: 'Verdana',
    labelSize: 8,
    merge: {
      charge: true,
    },
    parsing: {
      kind: 'peptide',
    },
  };
  let sequence =
    '(C5H5O)IleLeuAspAspLeuCys(C26H29N2OSi+)AlaAsnGlnLeuGlnProLeuLeuLeuLysOH';
  let info = [
    {
      type: 'z15',
      similarity: 98,
      charge: 3,
    },
    {
      type: 'z14',
      similarity: 98,
      charge: 3,
    },
    {
      type: 'y15',
      similarity: 97,
      charge: 3,
    },
    {
      type: 'y9',
      similarity: 97,
      charge: 2,
    },
    {
      type: 'y14',
      similarity: 96,
      charge: 3,
    },
    {
      type: 'y10',
      similarity: 95,
      charge: 2,
    },
    {
      type: 'y8',
      similarity: 90,
      charge: 2,
    },
  ];
  let svg = sequenceSVG(sequence, info, options);
  expect(svg).toHaveLength(9967);
});
