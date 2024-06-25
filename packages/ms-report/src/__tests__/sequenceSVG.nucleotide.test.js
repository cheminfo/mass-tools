import { writeFileSync } from 'fs';
import { join } from 'path';

import { sequenceSVG } from '../sequenceSVG';

test('sequenceSVG of nucleotide', () => {
  let options = {
    width: 600,
    leftRightBorders: 50,
    spaceBetweenResidues: 20,
    spaceBetweenInternalLines: 10,
    parsing: {
      kind: 'dna',
    },
  };
  let sequence = 'AGGCAG';
  let info = [
    { type: '-B4', similarity: 0.97, charge: -3 },
    { type: '-B4', similarity: 0.96, charge: -2 },
    { type: 'w1', similarity: 0.93, charge: -1 },
    { type: 'w5', similarity: 0.92, charge: -3 },
    { type: 'a4-B', similarity: 0.91, charge: -2 },
    { type: 'a4-B3', similarity: 0.91, charge: -2 },
    { type: 'a5-B', similarity: 0.89, charge: -1 },
    { type: 'b5-B1', similarity: 0.89, charge: -1 },
    { type: 'b5-B2', similarity: 0.89, charge: -1 },
    { type: 'a5-B4', similarity: 0.89, charge: -1 },
    { type: 'a5-B', similarity: 0.89, charge: -2 },
    { type: 'b5-B1', similarity: 0.89, charge: -2 },
    { type: 'b5-B2', similarity: 0.89, charge: -2 },
    { type: 'a5-B4', similarity: 0.89, charge: -2 },
    { type: 'w5', similarity: 0.88, charge: -2 },
    { type: '-B3', similarity: 0.87, charge: -3 },
    { type: '-B1', similarity: 0.87, charge: -3 },
    { type: '-B2', similarity: 0.87, charge: -3 },
    { type: '-B5', similarity: 0.87, charge: -3 },
    { type: '-B1', similarity: 0.85, charge: -2 },
    { type: '-B2', similarity: 0.85, charge: -2 },
    { type: '-B5', similarity: 0.85, charge: -2 },
    { type: 'w3', similarity: 0.84, charge: -2 },
    { type: 'w4:b5', similarity: 0.84, charge: -2 },
    { type: 'a3-B', similarity: 0.83, charge: -1 },
    { type: 'a3-B1', similarity: 0.83, charge: -1 },
    { type: 'a3-B2', similarity: 0.83, charge: -1 },
    { type: 'b2-B1', similarity: 0.83, charge: -1 },
    { type: 'y5:a3-B', similarity: 0.83, charge: -1 },
    { type: 'y4:a4-B', similarity: 0.83, charge: -1 },
    { type: 'd4', similarity: 0.82, charge: -1 },
    { type: 'w4', similarity: 0.82, charge: -1 },
    { type: 'w5:b5', similarity: 0.82, charge: -1 },
    { type: 'w5-B4', similarity: 0.82, charge: -2 },
    { type: 'y5', similarity: 0.8, charge: -2 },
    { type: 'd2', similarity: 0.78, charge: -1 },
    { type: 'w2', similarity: 0.78, charge: -1 },
    { type: 'w3', similarity: 0.77, charge: -1 },
    { type: 'w4:b5', similarity: 0.77, charge: -1 },
    { type: 'd4', similarity: 0.75, charge: -2 },
    { type: 'w4', similarity: 0.75, charge: -2 },
    { type: 'w5:b5', similarity: 0.75, charge: -2 },
    { type: 'x4-B3', similarity: 0.73, charge: -2 },
    { type: 'w5:a5-B', similarity: 0.73, charge: -2 },
  ];
  let svg = sequenceSVG(sequence, info, options);
  writeFileSync(join(__dirname, 'testNucleotide.svg'), svg);

  expect(svg).toHaveLength(21219);
});
