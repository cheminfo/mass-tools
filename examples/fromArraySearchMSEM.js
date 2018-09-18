'use strict';

const EMDB = require('../packages/emdb/src/index.js');

let emdb = new EMDB();

/* by default:
    canonizeMF=true
    uniqueMFs=true
*/

emdb.fromArray(['(CH2CH2O)0-10 H0-10 N0-10 O0-10', 'F, Br, Cl, I, '], {
    ionizations: 'H+, Na+, K+, (H+)2',
    filter: {
        minMSEM: 30,
        maxMSEM: 40
    }
});

console.log(emdb.get('generated').length);

let results = emdb.searchMSEM(36, {
    ionizations: '+,++,H+',
    filter: {
        precision: 10000,
        forceIonization: true
    }
});

console.log(results.generated);
