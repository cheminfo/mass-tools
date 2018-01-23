'use strict';

const Kind = require('../Kind');


module.exports = function partToMF(part) {
    var mf = [];
    for (let line of part) {
        switch (line.kind) {
            case Kind.ISOTOPE:
                mf.push(`[${line.value.isotope}${line.value.atom}]${(line.multiplier !== 1) ? line.multiplier : ''}`);
                break;
            case Kind.ISOTOPE_RATIO:
                mf.push(`${line.value.atom}{${line.value.ratio.join(',')}}${(line.multiplier !== 1) ? line.multiplier : ''}`);
                break;
            case Kind.ATOM:
                mf.push(line.value + ((line.multiplier !== 1) ? line.multiplier : ''));
                break;
            case Kind.CHARGE:
                mf.push(`(${(line.value > 0) ? `+${line.value}` : line.value})`);
                break;
            default:
        }
    }
    return mf.join('');
};
