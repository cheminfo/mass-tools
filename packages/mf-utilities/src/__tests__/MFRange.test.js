import { expect, test } from 'vitest';
import { MFRange } from '../MFRange';

test('No ranges', () => {
  const range = 'C10H20O3';
  const mfRange = new MFRange(range);
  expect(mfRange.isInRange('H20C10O3')).toBe(true);
  expect(mfRange.isInRange('H20C10O3Br')).toBe(false);
  expect(mfRange.isInRange('C10O3H20')).toBe(true);
  expect(mfRange.isInRange('O3H20')).toBe(false);
  expect(mfRange.isInRange('')).toBe(false);
});

test('Single element ranges', () => {
  const range = 'C10H20O3';
  const mfRange = new MFRange(range);
  expect(mfRange.isInRange('C10H20O0-3')).toBe(false);
});

test('A range in range ...', () => {
  const range = 'C0-10H10-20O3Cl0-1';
  const mfRange = new MFRange(range);
  expect(mfRange.isInRange('C10H20O0-3')).toBe(false);
  expect(mfRange.isInRange('C10H20O0')).toBe(false);
  expect(mfRange.isInRange('C10H20O3')).toBe(true);
  expect(mfRange.isInRange('H20O3')).toBe(true);
  expect(mfRange.isInRange('O3')).toBe(false);
});

test('2 ranges', () => {
  const range = 'C0-10H10-20O3Cl0-1';
  const mfRange = new MFRange(range);
  expect(mfRange.isInRange('C0H15O3')).toBe(true);
  expect(mfRange.isInRange('C0-10H15O3')).toBe(true);
  expect(mfRange.isInRange('C0-10H10-20O3Cl0-1')).toBe(true);
  expect(mfRange.isInRange('C0-10H10-20O3Cl1-1')).toBe(true);
  expect(mfRange.isInRange('C0-10H10-20O3Cl1-2')).toBe(false);
  expect(mfRange.isInRange('C0-10H9-20O3Cl')).toBe(false);
});
