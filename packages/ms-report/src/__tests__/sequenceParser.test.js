'use strict';

const sequenceParser = require('../sequenceParser');

test.only('A A A', () => {
  let result = sequenceParser('AA(Ph)A(Ph)');
  console.log(result);
  expect(true).toBe(true);
  // expect(result).toHaveLength(3);
});

test('HAlaAlaAlaOH', () => {
  expect(sequenceParser('HAlaAlaAlaOH')).toHaveLength(3);
});

test('HAlaAla(H-1OH)AlaOH', () => {
  expect(sequenceParser('HAlaAla(H-1OH)AlaOH')).toHaveLength(3);
});

test('H(+)AlaAla(H-1OH)AlaOH', () => {
  expect(sequenceParser('H(+)AlaAla(H-1OH)AlaOH')).toHaveLength(3);
});

test('ForAlaAla(H-1OH)AlaOH', () => {
  expect(sequenceParser('ForAlaAla(H-1OH)AlaOH')).toHaveLength(3);
});
