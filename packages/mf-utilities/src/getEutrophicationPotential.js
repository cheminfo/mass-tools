'use strict';

const MF = require('mf-parser').MF;

function getEutrophicationPotential(mfString) {
  let parsed = new MF(mfString);
  let info = parsed.getInfo();
  let mf = info.mf;
  let mw = info.mass;
  let nC = info.atoms.C || 0;
  let nO = info.atoms.O || 0;
  let nN = info.atoms.N || 0;
  let nP = info.atoms.P || 0;
  let nH = info.atoms.H || 0;
  let atoms = Object.keys(info.atoms);
  for (let atom of atoms) {
    if (!['C', 'H', 'N', 'O', 'P'].includes(atom)) {
      return {
        log:
          'EP can not be calculated because the MF contains the element: ' +
          atom
      };
    }
  }

  var vRef = 1;
  var mwRef = 94.97;

  var thOD = nC + (nH - 3 * nN) / 4 - nO / 2;
  var v = nP + nN / 16 + thOD / 138;
  var ep = v / mw / (vRef / mwRef);

  return {
    v,
    thOD,
    ep,
    mf,
    mw,
    log: 'Successful calculation'
  };
}

module.exports = getEutrophicationPotential;
