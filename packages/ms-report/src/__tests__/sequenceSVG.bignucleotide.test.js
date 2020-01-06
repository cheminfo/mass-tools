'use strict';

const { writeFileSync } = require('fs');
const { join } = require('path');

const sequenceSVG = require('../sequenceSVG');

test('sequenceSVG of nucleotide', () => {
  let options = {
    parsing: {
      kind: 'dna',
    },
  };
  let sequence = 'ACGGCTT(C8H14N2O)AGG';
  let info = require('./data/ACGGCTT(C8H14N2O)AGG');
  let svg = sequenceSVG(sequence, info, options);
  writeFileSync(join(__dirname, 'testBigNucleotide.svg'), svg);

  expect(true).toBe(true);
});
