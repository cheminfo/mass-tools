import OCL from 'openchemlib';

import { getFragmentableRings } from '../getFragmentableRings.js';

const { Molecule } = OCL;

describe('getFragmentableRings', () => {
  it('C1CCC1', () => {
    const molecule = Molecule.fromSmiles('C1CCC1');
    const result = getFragmentableRings(molecule);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "bonds": [
            {
              "atom1": 0,
              "atom2": 1,
              "index": 0,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 0,
              "atom2": 3,
              "index": 3,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
      ]
    `);
  });
  it('C1CC2CCCC3CCCC(C1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const result = getFragmentableRings(molecule);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "bonds": [
            {
              "atom1": 0,
              "atom2": 1,
              "index": 0,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 10,
              "atom2": 11,
              "index": 10,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 10,
              "atom2": 11,
              "index": 10,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 0,
              "atom2": 11,
              "index": 11,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 6,
              "atom2": 7,
              "index": 6,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 8,
              "atom2": 9,
              "index": 8,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 6,
              "atom2": 7,
              "index": 6,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 9,
              "atom2": 10,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 7,
              "atom2": 8,
              "index": 7,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 9,
              "atom2": 10,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 4,
              "atom2": 5,
              "index": 4,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 5,
              "atom2": 6,
              "index": 5,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 3,
              "atom2": 4,
              "index": 3,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 5,
              "atom2": 6,
              "index": 5,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
          ],
        },
      ]
    `);
  });
  it('C2CCC1CCCCC1C2', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result = getFragmentableRings(molecule);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "bonds": [
            {
              "atom1": 3,
              "atom2": 4,
              "index": 3,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 5,
              "atom2": 6,
              "index": 5,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 3,
              "atom2": 4,
              "index": 3,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 6,
              "atom2": 7,
              "index": 6,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 3,
              "atom2": 4,
              "index": 3,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 7,
              "atom2": 8,
              "index": 7,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 4,
              "atom2": 5,
              "index": 4,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 6,
              "atom2": 7,
              "index": 6,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 4,
              "atom2": 5,
              "index": 4,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 7,
              "atom2": 8,
              "index": 7,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 5,
              "atom2": 6,
              "index": 5,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 7,
              "atom2": 8,
              "index": 7,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 0,
              "atom2": 1,
              "index": 0,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 0,
              "atom2": 1,
              "index": 0,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 8,
              "atom2": 9,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 8,
              "atom2": 9,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 0,
              "atom2": 9,
              "index": 10,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 8,
              "atom2": 9,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 0,
              "atom2": 9,
              "index": 10,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
      ]
    `);
  });

  it('c1ccccc1', () => {
    const molecule = Molecule.fromSmiles('c1ccccc1'); // benzene
    const result = getFragmentableRings(molecule);
    expect(result).toStrictEqual([]);
  });
});
