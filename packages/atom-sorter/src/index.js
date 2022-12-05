/**
 * Implementation of the Hill system for sorting atoms
 * https://en.wikipedia.org/wiki/Chemical_formula#Hill_system
 * @param {string} a - first atom to compare
 * @param {string} b - second atom to compare
 * @returns
 */

export function atomSorter(a, b) {
  if (a === b) return 0;
  if (a === 'C') return -1;
  if (b === 'C') return 1;
  if (a === 'H') return -1;
  if (b === 'H') return 1;
  if (a < b) return -1;
  return 1;
}
