'use strict';

function allowNeutralLoss(mf, options) {
  if (Array.isArray(mf)) {
    for (let i = 0; i < mf.length; i++) {
      mf[i] = allowOneNeutralLoss(mf[i], options);
    }
    return mf;
  } else {
    return allowOneNeutralLoss(mf, options);
  }
}

function allowOneNeutralLoss(mf) {
  mf = mf.replace(/(Ser|Thr|Asp|Glu)(?!\()/g, '$1(H-2O-1)0-1');
  mf = mf.replace(/(Arg|Lys|Asn|Gln)(?!\()/g, '$1(N-1H-3)0-1');

  return mf;
}

module.exports = allowNeutralLoss;
