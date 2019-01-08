'use strict';

const EMDB = require('emdb');

let mf = new EMDB.Util.MF('Et3N');

console.log(mf.getIsotopesInfo());

var a = {
  mass: 101.19022990269394,
  monoisotopicMass: 101.12044948788001,
  charge: 0,
  mf: 'C6H15N',
  atoms: { C: 6, H: 15, N: 1 },
  unsaturation: 0
};
