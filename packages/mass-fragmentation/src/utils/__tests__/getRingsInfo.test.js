import OCL from 'openchemlib';

import { getRingsInfo } from '../getRingsInfo.js';

const { Molecule } = OCL;

describe('getRingsInfo', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // butane
    const result = getRingsInfo(molecule);

    expect(result).toStrictEqual([]);
  });
  it('C1CC1', () => {
    const molecule = Molecule.fromSmiles('C1CC1'); // butane
    const result = getRingsInfo(molecule);
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
              "atom2": 2,
              "index": 2,
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
  it('c1ccncc1', () => {
    const molecule = Molecule.fromSmiles('c1ccncc1'); // benzene
    const result = getRingsInfo(molecule);

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "bonds": [
            {
              "atom1": 0,
              "atom2": 1,
              "index": 0,
              "isAromatic": true,
              "nbRings": 1,
              "order": 2,
              "ringIndex": 0,
            },
            {
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": true,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 2,
              "atom2": 3,
              "index": 2,
              "isAromatic": true,
              "nbRings": 1,
              "order": 2,
              "ringIndex": 0,
            },
            {
              "atom1": 3,
              "atom2": 4,
              "index": 3,
              "isAromatic": true,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 4,
              "atom2": 5,
              "index": 4,
              "isAromatic": true,
              "nbRings": 1,
              "order": 2,
              "ringIndex": 0,
            },
            {
              "atom1": 0,
              "atom2": 5,
              "index": 5,
              "isAromatic": true,
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
    const result = getRingsInfo(molecule);

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
              "atom1": 1,
              "atom2": 2,
              "index": 1,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 2,
              "atom2": 12,
              "index": 13,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 10,
              "atom2": 12,
              "index": 12,
              "isAromatic": false,
              "nbRings": 2,
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
              "atom1": 7,
              "atom2": 8,
              "index": 7,
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
            {
              "atom1": 9,
              "atom2": 10,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 10,
              "atom2": 12,
              "index": 12,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 6,
              "atom2": 12,
              "index": 14,
              "isAromatic": false,
              "nbRings": 2,
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
              "atom1": 3,
              "atom2": 4,
              "index": 3,
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
            {
              "atom1": 5,
              "atom2": 6,
              "index": 5,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 6,
              "atom2": 12,
              "index": 14,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 2,
              "atom2": 12,
              "index": 13,
              "isAromatic": false,
              "nbRings": 2,
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
    const result2 = getRingsInfo(molecule);

    expect(result2).toMatchInlineSnapshot(`
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
              "atom1": 4,
              "atom2": 5,
              "index": 4,
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
            {
              "atom1": 6,
              "atom2": 7,
              "index": 6,
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
            {
              "atom1": 3,
              "atom2": 8,
              "index": 8,
              "isAromatic": false,
              "nbRings": 2,
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
              "atom1": 1,
              "atom2": 2,
              "index": 1,
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
            {
              "atom1": 3,
              "atom2": 8,
              "index": 8,
              "isAromatic": false,
              "nbRings": 2,
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
  it('C2CCC1CCCC3CCCC4CCCC1(CC2)C34', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 rings (2 hexane & 2 heptane)
    const result3 = getRingsInfo(molecule);
    expect(result3).toMatchInlineSnapshot(`
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
              "atom1": 1,
              "atom2": 2,
              "index": 1,
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
            {
              "atom1": 3,
              "atom2": 15,
              "index": 15,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 15,
              "atom2": 16,
              "index": 16,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 16,
              "atom2": 17,
              "index": 17,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 0,
            },
            {
              "atom1": 0,
              "atom2": 17,
              "index": 18,
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
              "ringIndex": 1,
            },
            {
              "atom1": 4,
              "atom2": 5,
              "index": 4,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 5,
              "atom2": 6,
              "index": 5,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 1,
            },
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
              "atom1": 7,
              "atom2": 18,
              "index": 20,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 15,
              "atom2": 18,
              "index": 19,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 1,
            },
            {
              "atom1": 3,
              "atom2": 15,
              "index": 15,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 1,
            },
          ],
        },
        {
          "bonds": [
            {
              "atom1": 11,
              "atom2": 12,
              "index": 11,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 12,
              "atom2": 13,
              "index": 12,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 13,
              "atom2": 14,
              "index": 13,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 14,
              "atom2": 15,
              "index": 14,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 15,
              "atom2": 18,
              "index": 19,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 2,
            },
            {
              "atom1": 11,
              "atom2": 18,
              "index": 21,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 2,
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
              "ringIndex": 3,
            },
            {
              "atom1": 8,
              "atom2": 9,
              "index": 8,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 3,
            },
            {
              "atom1": 9,
              "atom2": 10,
              "index": 9,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 3,
            },
            {
              "atom1": 10,
              "atom2": 11,
              "index": 10,
              "isAromatic": false,
              "nbRings": 1,
              "order": 1,
              "ringIndex": 3,
            },
            {
              "atom1": 11,
              "atom2": 18,
              "index": 21,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 3,
            },
            {
              "atom1": 7,
              "atom2": 18,
              "index": 20,
              "isAromatic": false,
              "nbRings": 2,
              "order": 1,
              "ringIndex": 3,
            },
          ],
        },
      ]
    `);
  });
});
