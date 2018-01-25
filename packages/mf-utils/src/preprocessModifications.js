'use strict';

const MF = require('mf-parser/src/MF');

module.exports = function preprocessModifications(modificationsString = '') {
    let modifications = modificationsString.split(/ *[.,;\t\r\n]+ */).map((mf) => ({ mf }));

    for (let modification of modifications) {
        let info = new MF(modification.mf).getInfo();
        modification.em = info.monoisotopicMass;
        modification.charge = info.charge;
    }

    return modifications;
};
