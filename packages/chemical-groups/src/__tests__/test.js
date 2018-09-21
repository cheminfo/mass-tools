'use strict';

var data = require('..');

test('data size', () => {
  expect(data.groups.length).toBeGreaterThan(50);
});

test('getGroupsObject', () => {
  var groupsObject = data.getGroupsObject();
  expect(groupsObject.Ala).toEqual({
    elements: [
      { number: 3, symbol: 'C' },
      { number: 5, symbol: 'H' },
      { number: 1, symbol: 'N' },
      { number: 1, symbol: 'O' }
    ],
    mass: 71.07801959624871,
    monoisotopicMass: 71.03711378515,
    mf: 'C3H5NO',
    name: 'Alanine diradical',
    symbol: 'Ala',
    unsaturation: 2
  });
});
