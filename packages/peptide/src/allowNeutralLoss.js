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
  mf = mf.replace(/(?<t1>Ser|Thr|Asp|Glu)(?!\()/g, '$<t1>(H-2O-1)0-1');
  mf = mf.replace(/(?<t1>Arg|Lys|Asn|Gln)(?!\()/g, '$<t1>(N-1H-3)0-1');

  return mf;
}
