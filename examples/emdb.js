'use strict';

const EMDB = require('../packages/emdb/src/index.js');

let emdb = new EMDB();

/* by default:
    canonizeMF=true
    uniqueMFs=true
*/
/*
emdb.fromArray(['C0-9 H0-9 Cl0-9 N0-9']);

console.log(emdb.get('generated').length);

let result = emdb.search({
    minEM: 300,
    maxEM: 301
});

console.log(result);
*/

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
