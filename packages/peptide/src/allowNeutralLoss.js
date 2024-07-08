/**
 * Add neutral loss on natural amino acids
 * @param {*} mf
 * @returns
 */
export function allowNeutralLoss(mf) {
  if (Array.isArray(mf)) {
    for (let i = 0; i < mf.length; i++) {
      mf[i] = allowOneNeutralLoss(mf[i]);
    }
    return mf;
  } else {
    return allowOneNeutralLoss(mf);
  }
}

function allowOneNeutralLoss(mf) {
  mf = mf.replaceAll(/(Ser|Thr|Asp|Glu)(?!\()/g, '$1(H-2O-1)0-1');
  mf = mf.replaceAll(/(Arg|Lys|Asn|Gln)(?!\()/g, '$1(N-1H-3)0-1');

  return mf;
}
