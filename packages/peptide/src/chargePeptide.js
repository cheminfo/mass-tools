import { getAA } from './getAA';

// SOURCE: https://en.wikipedia.org/wiki/Amino_acid

export function chargePeptide(mf, options = {}) {
  if (options.pH === undefined) options.pH = 0;
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
  let pH = options.pH;
  // we will allow to charge the peptide at a specific pH

  // first amino acids (N-terminal)
  if (mf.match(/^H[A-Z][a-z]{2}/)) {
    let firstAA = mf.replace(/^H(?<t1>[A-Z][a-z]{2}).*/, '$<t1>');
    if (getAA(firstAA) && pH < getAA(firstAA).pKaN) {
      mf = mf.replace(/^H(?<t1>[^+])/, 'H+H$<t1>');
    }
  }

  // last amino acids (C-terminal)
  if (mf.match(/[A-Z][a-z]{2}OH$/)) {
    let lastAA = mf.replace(/.*(?<t1>[A-Z][a-z]{2})OH$/, '$<t1>');
    if (getAA(lastAA) && pH > getAA(lastAA).pKaC) {
      mf = mf.replace(/OH$/, 'O-');
    }
  }

  // basic AA
  if (pH < getAA('Arg').sc.pKa) {
    mf = mf.replace(/(?<t1>Arg)(?!\()/g, '$<t1>(H+)');
  }
  if (pH < getAA('His').sc.pKa) {
    mf = mf.replace(/(?<t1>His)(?!\()/g, '$<t1>(H+)');
  }
  if (pH < getAA('Lys').sc.pKa) {
    mf = mf.replace(/(?<t1>Lys)(?!\()/g, '$<t1>(H+)');
  }

  // acid AA
  if (pH > getAA('Asp').sc.pKa) {
    mf = mf.replace(/(?<t1>Asp)(?!\()/g, '$<t1>(H-1-)');
  }
  if (pH > getAA('Glu').sc.pKa) {
    mf = mf.replace(/(?<t1>Glu)(?!\()/g, '$<t1>(H-1-)');
  }

  if (pH > getAA('Cys').sc.pKa) {
    mf = mf.replace(/(?<t1>Cys)(?!\()/g, '$<t1>(H-1-)');
  }

  return mf;
}
