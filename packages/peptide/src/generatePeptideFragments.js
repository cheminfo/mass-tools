export function generatePeptideFragments(mf, options) {
  if (options === undefined) {
    options = {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      i: false,
      ya: false,
      yb: false,
      yc: false,
      zc: false,
    };
  }
  options.maxInternal = options.maxInternal || Number.MAX_VALUE;
  options.minInternal = options.minInternal || 0;

  let mfs = [];
  // need to allow 0-9 to deal with neutral loss
  let mfparts = mf
    .replace(/([a-z)0-9])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);

  let nTerm = '';
  let cTerm = '';

  if (mfparts[0].startsWith('(')) {
    nTerm += mfparts[0];
    mfparts = mfparts.splice(1);
  }

  if (mfparts[mfparts.length - 1].includes('(')) {
    cTerm += mfparts[mfparts.length - 1].replace(/^[^()]*/, '');
    mfparts[mfparts.length - 1] = mfparts[mfparts.length - 1].replace(
      /\(.*/,
      '',
    );
  }

  for (let i = 1; i < mfparts.length; i++) {
    nTerm += mfparts[i - 1];
    cTerm = mfparts[mfparts.length - i] + cTerm;
    addNTerm(mfs, nTerm, i, options);
    addCTerm(mfs, cTerm, i, options);
    if (options.i) mfs.push(`${mfparts[i]}HC-1O-1(+1)$i:${mfparts[i]}`);

    if (options.ya || options.yb || options.yc || options.zc) {
      // we have double fragmentations
      for (
        let j = i + 1;
        j < Math.min(mfparts.length, options.maxInternal + i + 1);
        j++
      ) {
        let iTerm = '';
        if (j - i >= options.minInternal) {
          for (let k = i; k < j; k++) {
            iTerm += mfparts[k];
          }
          addITerm(mfs, iTerm, mfparts.length - i, j, options);
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

function addNTerm(mfs, nTerm, i, options) {
  if (options.a) mfs.push(`${nTerm}C-1O-1(+1)$a${i}`);
  if (options.b) mfs.push(`${nTerm}(+1)$b${i}`);
  if (options.c) mfs.push(`${nTerm}NH3(+1)$c${i}`);
}

function addITerm(mfs, iTerm, i, j, options) {
  if (options.ya) mfs.push(`H${iTerm}C-1O-1(+1)$a${j}y${i}`);
  if (options.yb) mfs.push(`H${iTerm}(+1)$b${j}y${i}`);
  if (options.yc) mfs.push(`H${iTerm}NH3(+1)$c${j}y${i}`);
  if (options.zc) mfs.push(`N-1${iTerm}NH3(+1)$c${j}z${i}`);
}

function addCTerm(mfs, cTerm, i, options) {
  if (options.x) mfs.push(`CO(+1)${cTerm}$x${i}`);
  if (options.y) mfs.push(`H2(+1)${cTerm}$y${i}`);
  if (options.z) mfs.push(`N-1H-1(+1)${cTerm}$z${i}`);
}
