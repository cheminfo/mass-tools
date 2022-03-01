'use strict';

const EMDB = require('../packages/emdb/src/index.js');

let emdb = new EMDB();

/* by default:
    canonizeMF=true
    uniqueMFs=true
*/

emdb.fromArray(['C0-9 H0-9 Cl0-9 N0-9']);

console.log(emdb.get('generated').length);

let result = emdb.search({
  minEM: 300,
  maxEM: 301,
});

result.generated.forEach((entry) => {
  console.log(entry.ionization);
});
