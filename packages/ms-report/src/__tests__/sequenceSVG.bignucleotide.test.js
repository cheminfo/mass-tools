import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { info } from '../../data/ACGGCTT(C8H14N2O)AGG';
import { sequenceSVG } from '../sequenceSVG';

test('sequenceSVG of big nucleotide', () => {
  const filteredInfo = info.filter((entry) => !entry.type.includes('B'));
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
  let svg = sequenceSVG(sequence, filteredInfo, options);

  writeFileSync(path.join(__dirname, 'testBigNucleotide.svg'), svg);

  expect(true).toBe(true);
});
