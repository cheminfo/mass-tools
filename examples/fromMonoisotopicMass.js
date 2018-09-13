'use strict';

const EMDB = require('../packages/emdb/src/index.js');

let emdb = new EMDB();

let result = emdb.fromMonoisotopicMass(300, {
    precision: 1,
    ranges: 'C0-50 H0-50 Cl0-50 O0-50 N0-50 Br0-50 Na0-50',
    ionizations: 'H+, Na+, NH4+, (H+)2, (Na+)2',
    minCharge: 1,
    maxCharge: 5,
    unsaturation: {
        min: 0,
        max: 10,
        integer: true,
        nonInteger: false
    }
});

result.mfs.forEach((entry) => {
    console.log(entry.mf, entry.em, entry.ms.em);
});

// console.log(result.mfs[0]);

console.log(result.info, result.mfs.length);
