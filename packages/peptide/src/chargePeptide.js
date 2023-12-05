import { getAA } from './getAA';

// SOURCE: https://en.wikipedia.org/wiki/Amino_acid

export function chargePeptide(mf, options = {}) {
  if (Array.isArray(mf)) {
    for (let i = 0; i < mf.length; i++) {
      mf[i] = chargeOnePeptide(mf[i], options);
    }
    return mf;
  } else {
    return chargeOnePeptide(mf, options);
  }
}

function chargeOnePeptide(mf, options) {
  const { pH = 0 } = options;
  // we will allow to charge the peptide at a specific pH

  // first amino acids (N-terminal)
  if (mf.match(/^H[A-Z][a-z]{2}/)) {
    let firstAA = mf.replace(/^H([A-Z][a-z]{2}).*/, '$1');
    if (getAA(firstAA) && pH < getAA(firstAA).pKaN) {
      mf = mf.replace(/^H([^+])/, 'H+H$1');
    }
  }

  // last amino acids (C-terminal)
  if (mf.match(/[A-Z][a-z]{2}OH$/)) {
    let lastAA = mf.replace(/.*([A-Z][a-z]{2})OH$/, '$1');
    if (getAA(lastAA) && pH > getAA(lastAA).pKaC) {
      mf = mf.replace(/OH$/, 'O-');
    }
  }

  // basic AA
  if (pH < getAA('Arg').sc.pKa) mf = mf.replace(/(Arg)(?!\()/g, '$1(H+)');
  if (pH < getAA('His').sc.pKa) mf = mf.replace(/(His)(?!\()/g, '$1(H+)');
  if (pH < getAA('Lys').sc.pKa) mf = mf.replace(/(Lys)(?!\()/g, '$1(H+)');

  // acid AA
  if (pH > getAA('Asp').sc.pKa) mf = mf.replace(/(Asp)(?!\()/g, '$1(H-1-)');
  if (pH > getAA('Glu').sc.pKa) mf = mf.replace(/(Glu)(?!\()/g, '$1(H-1-)');

  if (pH > getAA('Cys').sc.pKa) mf = mf.replace(/(Cys)(?!\()/g, '$1(H-1-)');

  return mf;
}
