// https://en.wikipedia.org/wiki/Exponentiation_by_squaring

export function power(array, p, options = {}) {
  if (p <= 0) throw new Error('power must be larger than 0');
  if (p === 1) return array;
  if (p === 2) {
    return array.square();
  }

  p--;
  let base = array.copy(); // linear time
  while (p !== 0) {
    if ((p & 1) !== 0) {
      array.multiply(base, options); // executed <= log2(p) times
    }
    p >>= 1;
    if (p !== 0) base.square(options); // executed <= log2(p) times
  }

  return array;
}
