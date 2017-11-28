'use strict';

var CC = require('chemcalc');


let info = {mf: ''};
for (let i = 0; i < 10000; i++) {
    let mf = info.mf + 'H' + i + 'C' + i;
    info = CC.analyseMF(mf);

}

console.log(info);
