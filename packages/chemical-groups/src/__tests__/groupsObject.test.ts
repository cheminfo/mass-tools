import { expect, test } from 'vitest';

import { groups } from '../groups.js';
import { groupsObject } from '../groupsObject.js';

test('Ala is indexed by its symbol', () => {
  expect(groupsObject.Ala).toStrictEqual({
    symbol: 'Ala',
    name: 'Alanine diradical',
    mf: 'C3H5NO',
    kind: 'aa',
    oneLetter: 'A',
    alternativeOneLetter: 'α',
    ocl: {
      coordinates: expect.anything(),
      value: 'gNyDBaxmqR[fZjZ@',
    },
    mass: 71.07801959624871,
    monoisotopicMass: 71.03711378515,
    unsaturation: 2,
    elements: [
      { number: 3, symbol: 'C' },
      { number: 5, symbol: 'H' },
      { number: 1, symbol: 'N' },
      { number: 1, symbol: 'O' },
    ],
  });
});

test('the object holds one key per group', () => {
  expect(Object.keys(groupsObject)).toHaveLength(groups.length);
});

test('every group is reachable through its symbol', () => {
  const unreachable: string[] = [];
  for (const group of groups) {
    if (groupsObject[group.symbol] !== group) unreachable.push(group.symbol);
  }

  expect(unreachable).toStrictEqual([]);
});

test('a symbol that is not a group is undefined', () => {
  expect(groupsObject.Xyz).toBeUndefined();
});
