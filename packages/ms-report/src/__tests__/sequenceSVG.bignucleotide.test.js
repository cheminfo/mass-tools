'use strict';

const { writeFileSync } = require('fs');
const { join } = require('path');

const sequenceSVG = require('../sequenceSVG');

let info = require('./data/ACGGCTT(C8H14N2O)AGG');

info = info.filter((entry) => !entry.type.includes('B'));

test('sequenceSVG of big nucleotide', () => {
  let options = {
    width: 250,
    labelSize: 8,
    parsing: {
      kind: 'dna',
    },
    merge: {
      charge: true,
    },
  };
  let sequence = 'ACGGCTT(C8H14N2O)AGG';
  let svg = sequenceSVG(sequence, info, options);

  writeFileSync(join(__dirname, 'testBigNucleotide.svg'), svg);

  expect(true).toBe(true);
});
