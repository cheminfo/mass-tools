'use strict';

const Kind = require('../Kind');

/**
 * Convert a MF part to an array of atoms
 * This procedure will suppress the isotpes !
 * This is mainly used to make queries
 */

module.exports = function partToAtoms(part) {
    var atoms = {};
    for (let line of part) {
        switch (line.kind) {
            case Kind.ISOTOPE:
                if (!atoms[line.value.atom]) atoms[line.value.atom] = 0;
                atoms[line.value.atom] += line.multiplier;
                break;
            case Kind.ISOTOPE_RATIO:
                if (!atoms[line.value.atom]) atoms[line.value.atom] = 0;
                atoms[line.value.atom] += line.multiplier;
                break;
            case Kind.ATOM:
                if (!atoms[line.value]) atoms[line.value] = 0;
                atoms[line.value] += line.multiplier;
                break;
            case Kind.CHARGE:
                break;
            default:
                throw new Error('partToMF unhandled Kind: ', line.kind);
        }
    }
    return atoms;
};
