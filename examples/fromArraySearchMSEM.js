'use strict';

const EMDB = require('../packages/emdb/src/index.js');

let emdb = new EMDB();

/* by default:
    canonizeMF=true
    uniqueMFs=true
*/

emdb.fromArray(['C0-9 H0-9 Cl0-9 N0-9']);

let results = emdb.searchMSEM(36, {
    ionizations: '+,++,H+',
    filter: {
        precision: 100,
        forceIonization: true
    }
});

console.log(results.generated);
