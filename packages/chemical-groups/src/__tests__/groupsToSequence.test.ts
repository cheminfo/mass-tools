import { expect, test } from 'vitest';

import { groupsToSequence } from '../groupsToSequence.js';

test('a peptide gives the one letter code of each amino acid', () => {
  expect(groupsToSequence('HOAlaGlyOH')).toBe('AG');
});

test('a parenthesized part of the formula is dropped', () => {
  expect(groupsToSequence('HOAla(H-1OH-1)GlyOH(C2H5)')).toBe('AG');
});

test('a protecting group inside a peptide becomes a question mark', () => {
  expect(groupsToSequence('HOAlaAlaFmoc(H-1OH-1)GlyOH(C2H5)')).toBe('AA?G');
});

test('a space in the formula separates two sequences', () => {
  expect(groupsToSequence('HO AlaAlaFmoc (H-1OH-1)Gly OH(C2H5)')).toBe('AA? G');
});

test('a nucleotide chain gives the sequence of its bases', () => {
  expect(groupsToSequence('O-2P-1DcmpDampDgmpH')).toBe('CAG');
});

test('a one letter code outside the latin alphabet is kept', () => {
  expect(groupsToSequence('HODamDamDamDamDamH')).toBe('œœœœœ');
});

test('an empty formula gives an empty sequence', () => {
  expect(groupsToSequence('')).toBe('');
});

test('a formula made only of elements gives an empty sequence', () => {
  expect(groupsToSequence('C6H12O6')).toBe('');
  expect(groupsToSequence('HOH')).toBe('');
});

test('a lone group without a one letter code gives a question mark', () => {
  expect(groupsToSequence('HOBocOH')).toBe('?');
});
