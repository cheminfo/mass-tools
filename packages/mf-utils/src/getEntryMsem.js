'use strict';

const getMsem = require('./getMsem');

module.exports = function getEntryMsem(entry, ionization) {
    let em = entry.em + ionization ? ionization.em : 0;
    let charge = entry.charge + ionization ? ionization.charge : 0;
    return getMsem(em, charge);
};
