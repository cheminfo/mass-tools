'use strict';

const MF = require('mf-parser').MF;

function mfDiff(mfString1, mfString2) {
  let mf1 = new MF(mfString1).getInfo().atoms;
  let mf2 = new MF(mfString2).getInfo().atoms;
  let atoms = Object.keys(mf1);
  Object.keys(mf2).forEach((atom) => {
    if (!atoms.includes(atom)) atoms.push(atom);
  });
  let mf = '';
  for (let atom of atoms) {
    let diff = (mf1[atom] || 0) - (mf2[atom] || 0);
    if (diff) mf += atom + diff;
  }
  return new MF(mf).toMF();
}

module.exports = mfDiff;
