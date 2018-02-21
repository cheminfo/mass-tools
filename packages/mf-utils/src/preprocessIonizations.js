'use strict';

const MF = require('mf-parser/src/MF');

module.exports = function preprocessIonizations(ionizationsString = '') {
    let ionizations = ionizationsString.split(/ *[.,;\t\r\n]+ */).map((mf) => ({ mf }));
    for (let ionization of ionizations) {
        let info = new MF(ionization.mf).getInfo();
        ionization.em = info.monoisotopicMass;
        ionization.charge = info.charge;
    }

    return ionizations;
};
