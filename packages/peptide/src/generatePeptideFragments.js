/**
 * Generate peptide fragments from a molecular formula.
 * @param {string} mf - The molecular formula to fragment.
 * @param {object} [options={}] - Fragmentation options.
 * @param {boolean} [options.a=false] - Generate a-type fragments.
 * @param {boolean} [options.b=true] - Generate b-type fragments.
 * @param {boolean} [options.c=false] - Generate c-type fragments.
 * @param {boolean} [options.x=false] - Generate x-type fragments.
 * @param {boolean} [options.y=true] - Generate y-type fragments.
 * @param {boolean} [options.z=false] - Generate z-type fragments.
 * @param {boolean} [options.i=false] - Generate internal fragments.
 * @param {boolean} [options.ya=false] - Generate ya-type double fragmentation.
 * @param {boolean} [options.yb=false] - Generate yb-type double fragmentation.
 * @param {boolean} [options.yc=false] - Generate yc-type double fragmentation.
 * @param {boolean} [options.zc=false] - Generate zc-type double fragmentation.
 * @param {number} [options.maxInternal=Infinity] - Maximum number of residues for internal fragments.
 * @param {number} [options.minInternal=0] - Minimum number of residues for internal fragments.
 * @returns {string[]} Array of fragment molecular formulas.
 */
export function generatePeptideFragments(mf, options = {}) {
  const {
    a = false,
    b = true,
    c = false,
    x = false,
    y = true,
    z = false,
    i: internal = false,
    ya = false,
    yb = false,
    yc = false,
    zc = false,
    maxInternal = Number.MAX_VALUE,
    minInternal = 0,
  } = options;

  let mfs = [];
  // need to allow 0-9 to deal with neutral loss
  let mfparts = mf
    .replaceAll(/([\d)a-z])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);

  let nTerm = '';
  let cTerm = '';

  if (mfparts[0].startsWith('(')) {
    nTerm += mfparts[0];
    mfparts = mfparts.splice(1);
  }

  if (mfparts.at(-1).includes('(')) {
    cTerm += mfparts.at(-1).replace(/^[^()]*/, '');
    mfparts[mfparts.length - 1] = mfparts.at(-1).replace(/\(.*/, '');
  }

  for (let i = 1; i < mfparts.length; i++) {
    nTerm += mfparts[i - 1];
    cTerm = mfparts[mfparts.length - i] + cTerm;
    addNTerm(mfs, nTerm, i, a, b, c);
    addCTerm(mfs, cTerm, i, x, y, z);
    if (internal) mfs.push(`${mfparts[i]}HC-1O-1(+1)$i:${mfparts[i]}`);

    if (ya || yb || yc || zc) {
      // we have double fragmentations
      for (
        let j = i + 1;
        j < Math.min(mfparts.length, maxInternal + i + 1);
        j++
      ) {
        let iTerm = '';
        if (j - i >= minInternal) {
          for (let k = i; k < j; k++) {
            iTerm += mfparts[k];
          }
          addITerm(mfs, iTerm, mfparts.length - i, j, ya, yb, yc, zc);
        }
      }
    }
  }

  // todo does this make sense ??? I think we should remote those 3 lines
  if (mfs.length === 0) {
    mfs = mfs.concat([mf]);
  }

  return mfs;
}

function addNTerm(mfs, nTerm, i, a, b, c) {
  if (a) mfs.push(`${nTerm}C-1O-1(+1)$a${i}`);
  if (b) mfs.push(`${nTerm}(+1)$b${i}`);
  if (c) mfs.push(`${nTerm}NH3(+1)$c${i}`);
}

function addITerm(mfs, iTerm, i, j, ya, yb, yc, zc) {
  if (ya) mfs.push(`H${iTerm}C-1O-1(+1)$a${j}y${i}`);
  if (yb) mfs.push(`H${iTerm}(+1)$b${j}y${i}`);
  if (yc) mfs.push(`H${iTerm}NH3(+1)$c${j}y${i}`);
  if (zc) mfs.push(`N-1${iTerm}NH3(+1)$c${j}z${i}`);
}

function addCTerm(mfs, cTerm, i, x, y, z) {
  if (x) mfs.push(`CO(+1)${cTerm}$x${i}`);
  if (y) mfs.push(`H2(+1)${cTerm}$y${i}`);
  if (z) mfs.push(`N-1H-1(+1)${cTerm}$z${i}`);
}
