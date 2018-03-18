'use strict';

const elements = require('chemical-elements/src/elementsAndStableIsotopesObject.js');
const Kind = require('../Kind');

const isotopes = require('./getIsotopesObject');

/**
 *
 * @param {*} parts
 * @param {*} options
 */
module.exports = function getIsotopesInfo(parts) {
    if (parts.length === 0) return [];
    if (parts.length > 1) throw new Error('getIsotopesInfo can not be applied on multipart MF');

    return getProcessedPart(parts[0]);

};

function getProcessedPart(part) {
    let result = {
        charge: 0,
        isotopes: []
    };
    for (let line of part) {
        switch (line.kind) {
            case Kind.ISOTOPE: {
                let isotope = isotopes[line.value.isotope + line.value.atom];
                if (!isotope) throw Error('unknown isotope:', line.value.atom, line.value.isotope);
                result.isotopes.push({
                    atom: `[${line.value.isotope}${line.value.atom}]`,
                    number: line.multiplier,
                    distribution: [
                        { x: isotope.mass, y: 1 }
                    ]
                });
                break;
            }
            case Kind.ISOTOPE_RATIO: {
                let element = elements[line.value.atom];
                if (!element) throw new Error('unknown element:', line.value);

                let distribution = getDistribution(element.isotopes, line.value.ratio);
                result.isotopes.push({
                    atom: `${line.value.atom}{${line.value.ratio.join(',')}}`,
                    number: line.multiplier,
                    distribution
                });
            }
                break;
            case Kind.ATOM: {
                let element = elements[line.value];
                if (!element) throw new Error('unknown element:', line.value);
                result.isotopes.push({
                    atom: line.value,
                    number: line.multiplier,
                    distribution: element.isotopes.map((e) => ({ x: e.mass, y: e.abundance }))
                });
                break;
            }
            case Kind.CHARGE:
                result.charge += line.value;
                break;
            default:
                throw new Error('partToMF unhandled Kind: ', line.kind);
        }
    }
    return result;
}


function getDistribution(isotopesArray, ratio) {
    let ratios = normalize(ratio);
    let result = [];
    if (ratios.length > isotopesArray.length) {
        throw new Error(`the number of specified ratios is bigger that the number of stable isotopes: ${isotopes}`);
    }
    for (let i = 0; i < ratios.length; i++) {
        result.push({
            x: isotopesArray[i].mass,
            y: ratios[i]
        });
    }
    return result;
}

function normalize(array) {
    let sum = array.reduce((prev, current) => prev + current, 0);
    return array.map((a) => a / sum);
}
