/**
 * Implementation of the Hill system for sorting atoms
 * https://en.wikipedia.org/wiki/Chemical_formula#Hill_system
 * @param a - first atom to compare
 * @param b - second atom to compare
 * @returns A value suitable for use in Array.prototype.sort.
 */
export function atomSorter(a: string, b: string): 0 | -1 | 1 {
  if (a === b) return 0;
  if (a === 'C') return -1;
  if (b === 'C') return 1;
  if (a === 'H') return -1;
  if (b === 'H') return 1;
  if (a < b) return -1;
  return 1;
}
