'use strict';

const atomSorter = require('..');

test('atom-sorter test', () => {
  expect(atomSorter('C', 'C')).toBe(0);
  expect(atomSorter('C', 'H')).toBe(-1);
  expect(atomSorter('C', 'O')).toBe(-1);
  expect(atomSorter('N', 'O')).toBe(-1);
  expect(atomSorter('Cl', 'Br')).toBe(1);
});

test('sort an array', () => {
  let atoms = ['H', 'Cl', 'C', 'O', 'N', 'Br'];
  atoms.sort((a, b) => atomSorter(a, b));
  expect(atoms).toStrictEqual(['C', 'H', 'Br', 'Cl', 'N', 'O']);
});

test('sort an array HCl', () => {
  let atoms = ['Cl', 'H'];
  atoms.sort((a, b) => atomSorter(a, b));
  expect(atoms).toStrictEqual(['H', 'Cl']);
});
