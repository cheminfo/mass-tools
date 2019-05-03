'use strict';

const sequenceSplitter = require('../sequenceSplitter');

test('AAA', () => {
  expect(sequenceSplitter('AAA')).toHaveLength(3);
});

test('HAlaAlaAlaOH', () => {
  expect(sequenceSplitter('HAlaAlaAlaOH')).toHaveLength(3);
});

test('HAlaAla(H-1OH)AlaOH', () => {
  expect(sequenceSplitter('HAlaAla(H-1OH)AlaOH')).toHaveLength(3);
});

test('H(+)AlaAla(H-1OH)AlaOH', () => {
  expect(sequenceSplitter('H(+)AlaAla(H-1OH)AlaOH')).toHaveLength(3);
});

test('ForAlaAla(H-1OH)AlaOH', () => {
  expect(sequenceSplitter('ForAlaAla(H-1OH)AlaOH')).toHaveLength(3);
});
