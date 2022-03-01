'use strict';

const EMDB = require('../packages/emdb/src/index.js');

let emdb = new EMDB();

let result = emdb.fromMonoisotopicMass(13, {
  precision: 1000,
  ranges: 'C0-50 H0-50 ',
  ionizations: '+,H+',
  minCharge: 1,
  maxCharge: 5,
  unsaturation: {
    min: 0,
    max: 10,
    integer: true,
    nonInteger: false,
  },
});

result.mfs.forEach((entry) => {
  console.log(entry.mf, entry.em, entry.ms);
});

// console.log(result.mfs[0]);

console.log(result.info, result.mfs.length);
