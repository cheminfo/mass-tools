'use strict';

let data = require('..');

test('data size', () => {
  expect(data.groups.length).toBeGreaterThan(200);
});

test('getGroupsObject', () => {
  let groupsObject = data.getGroupsObject();
  expect(groupsObject.Ala).toStrictEqual({
    elements: [
      { number: 3, symbol: 'C' },
      { number: 5, symbol: 'H' },
      { number: 1, symbol: 'N' },
      { number: 1, symbol: 'O' },
    ],
    mass: 71.07801959624871,
    monoisotopicMass: 71.03711378515,
    mf: 'C3H5NO',
    kind: 'aa',
    name: 'Alanine diradical',
    symbol: 'Ala',
    oneLetter: 'A',
    alternativeOneLetter: 'α',
    unsaturation: 2,
    ocl: {
      coordinates: expect.anything(),
      value: 'gNyDBaxmqR[fZjZ@',
    },
  });
});
