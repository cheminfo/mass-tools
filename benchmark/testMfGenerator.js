'use strict';

var generateMFs = require('../packages/mf-generator/src/index');

var mfsArray = ['C0-100', 'O0-100', 'N0-10', 'N0-10'];

var result = generateMFs(mfsArray, {
    filter: {
        minEM: 100,
        maxEM:1000
    }
});
console.log(result.length);