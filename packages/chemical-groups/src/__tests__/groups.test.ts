import { expect, test } from 'vitest';

import { groups } from '../groups.js';
import type { Group, Kind } from '../types.js';

/**
 * Symbols of the groups that break an invariant.
 * @param isValid - Invariant every group must satisfy.
 * @returns The offending symbols, in the order of the list.
 */
function offendingSymbols(isValid: (group: Group) => boolean): string[] {
  const offenders: string[] = [];
  for (const group of groups) {
    if (!isValid(group)) offenders.push(group.symbol);
  }
  return offenders;
}

/**
 * Whether a value is a string holding at least one character.
 * @param value - Value to check.
 * @returns `true` for a non-empty string.
 */
function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Whether a value is an integer strictly greater than zero.
 * @param value - Value to check.
 * @returns `true` for a positive integer.
 */
function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Whether a string holds a single character, a lone surrogate half excluded.
 * @param value - String to check.
 * @returns `true` for a one character string.
 */
function isSingleCharacter(value: string): boolean {
  if (value.length !== 1) return false;
  const codePoint = value.codePointAt(0);
  return codePoint !== undefined && (codePoint < 0xd800 || codePoint > 0xdfff);
}

test('the list holds 299 groups', () => {
  expect(groups).toHaveLength(299);
});

test('every symbol appears exactly once', () => {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const group of groups) {
    if (seen.has(group.symbol)) duplicates.push(group.symbol);
    seen.add(group.symbol);
  }

  expect(duplicates).toStrictEqual([]);
  expect(seen.size).toBe(groups.length);
});

test('symbol, name and mf are non-empty strings', () => {
  const offenders = offendingSymbols(
    (group) =>
      isNonEmptyString(group.symbol) &&
      isNonEmptyString(group.name) &&
      isNonEmptyString(group.mf),
  );

  expect(offenders).toStrictEqual([]);
});

test('mass and monoisotopicMass are finite and greater than zero', () => {
  const offenders = offendingSymbols(
    (group) =>
      Number.isFinite(group.mass) &&
      group.mass > 0 &&
      Number.isFinite(group.monoisotopicMass) &&
      group.monoisotopicMass > 0,
  );

  expect(offenders).toStrictEqual([]);
});

test('unsaturation is a finite number or null', () => {
  const offenders = offendingSymbols(
    (group) =>
      group.unsaturation === null || Number.isFinite(group.unsaturation),
  );

  expect(offenders).toStrictEqual([]);
});

test('elements is never empty and every entry is a symbol with a count', () => {
  const offenders = offendingSymbols((group) => {
    if (group.elements.length === 0) return false;
    for (const element of group.elements) {
      if (!isNonEmptyString(element.symbol)) return false;
      if (!isPositiveInteger(element.number)) return false;
    }
    return true;
  });

  expect(offenders).toStrictEqual([]);
});

test('an isotope, when present, is a positive integer', () => {
  const offenders = offendingSymbols((group) => {
    for (const element of group.elements) {
      if (
        element.isotope !== undefined &&
        !isPositiveInteger(element.isotope)
      ) {
        return false;
      }
    }
    return true;
  });

  expect(offenders).toStrictEqual([]);
});

test('oneLetter and alternativeOneLetter are exactly one character', () => {
  const offenders = offendingSymbols((group) => {
    for (const code of [group.oneLetter, group.alternativeOneLetter]) {
      if (code === undefined) continue;
      if (!isSingleCharacter(code)) return false;
    }
    return true;
  });

  expect(offenders).toStrictEqual([]);
});

test('a structure, when present, carries a non-empty idcode', () => {
  const offenders = offendingSymbols(
    (group) => group.ocl === undefined || isNonEmptyString(group.ocl.value),
  );

  expect(offenders).toStrictEqual([]);
});

const KINDS: Kind[] = [
  'aa',
  'DNA',
  'DNAp',
  'DNApp',
  'DNAppp',
  'RNA',
  'RNAp',
  'RNApp',
  'RNAppp',
  'RNApMod',
  'RNAppMod',
  'RNAEnd',
];

test('kind, when present, is one of the known kinds', () => {
  const offenders = offendingSymbols(
    (group) => group.kind === undefined || KINDS.includes(group.kind),
  );

  expect(offenders).toStrictEqual([]);
});

test('every kind is carried by at least one group', () => {
  const used = new Set(groups.map((group) => group.kind));

  expect(KINDS.filter((kind) => !used.has(kind))).toStrictEqual([]);
});

test('Gly is unchanged', () => {
  const glycine = groups.find((group) => group.symbol === 'Gly');

  expect(glycine).toStrictEqual({
    symbol: 'Gly',
    name: 'Glycine diradical',
    mf: 'C2H3NO',
    kind: 'aa',
    oneLetter: 'G',
    alternativeOneLetter: 'γ',
    ocl: {
      value: 'gGYDBaxuqR[Yj@@',
      coordinates: '!BbOq~@Ha}bOrH_P',
    },
    mass: 57.051402191401905,
    monoisotopicMass: 57.021463720689994,
    unsaturation: 2,
    elements: [
      { symbol: 'C', number: 2 },
      { symbol: 'H', number: 3 },
      { symbol: 'N', number: 1 },
      { symbol: 'O', number: 1 },
    ],
  });
});
