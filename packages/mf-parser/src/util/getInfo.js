'use strict';

const partToMF = require('./partToMF');
const elements = require('chemical-elements/src/elementsAndStableIsotopesObject.js');
const groups = require('chemical-elements/src/groupsObject.js');
const unsaturations = require('chemical-elements/src/unsaturationsObject.js');
const Kind = require('../Kind');
const { ELECTRON_MASS } = require('chemical-elements/src/constants');
const partToAtoms = require('./partToAtoms');

const isotopes = require('./getIsotopesObject');

/**
 *
 * @param {*} parts
 * @param {*} options
 */
module.exports = function getInfo(parts, options = {}) {
    let { customUnsaturations = {} } = options;
    if (parts.length === 0) return {};
    if (parts.length === 1) {
        return getProcessedPart(parts[0], customUnsaturations);
    }

    var result = {
        parts: []
    };
    for (let part of parts) {
        result.parts.push(getProcessedPart(part, customUnsaturations));
    }

    result.monoisotopicMass = 0;
    result.mass = 0;
    result.charge = 0;
    result.mf = result.parts.map((a) => a.mf).join('.');
    result.parts.forEach((a) => {
        result.mass += a.mass;
        result.monoisotopicMass += a.monoisotopicMass;
        result.charge += a.charge;
    });
    return result;
};

function getProcessedPart(part, customUnsaturations) {
    let currentPart = {
        mass: 0,
        monoisotopicMass: 0,
        charge: 0,
        mf: '',
        atoms: partToAtoms(part)
    };
    let unsaturation = 0;
    let validUnsaturation = true;
    currentPart.mf = partToMF(part);
    for (let line of part) {
        let currentElement = '';
        switch (line.kind) {
            case Kind.ATOM: {
                currentElement = line.value;
                let element = elements[line.value];
                // todo should we have a kind GROUP ?
                if (!element) {
                    element = groups[line.value];
                    if (!element) throw Error(`Unknown element: ${line.value}`);
                    if (!customUnsaturations[line.value]) {
                        customUnsaturations[line.value] = element.unsaturation;
                    }
                }

                if (!element) throw new Error(`Unknown element: ${line.value}`);
                currentPart.monoisotopicMass +=
                    element.monoisotopicMass * line.multiplier;
                currentPart.mass += element.mass * line.multiplier;
                break;
            }
            case Kind.ISOTOPE: {
                currentElement = line.value.atom;
                let isotope = isotopes[line.value.isotope + line.value.atom];
                if (!isotope) {
                    throw new Error(
                        `Unknown isotope: ${line.value.isotope}${
                            line.value.atom
                        }`
                    );
                }
                currentPart.monoisotopicMass += isotope.mass * line.multiplier;
                currentPart.mass += isotope.mass * line.multiplier;
                break;
            }
            case Kind.ISOTOPE_RATIO: {
                currentElement = line.value.atom;
                let isotopeRatioInfo = getIsotopeRatioInfo(line.value);
                currentPart.monoisotopicMass +=
                    isotopeRatioInfo.monoisotopicMass * line.multiplier;
                currentPart.mass += isotopeRatioInfo.mass * line.multiplier;
                break;
            }
            case Kind.CHARGE:
                currentPart.charge = line.value;
                if (validUnsaturation) {
                    unsaturation -= line.value;
                }
                break;
            default:
                throw new Error('Unimplemented Kind in getInfo', line.kind);
        }
        if (currentElement) {
            if (customUnsaturations[currentElement] !== undefined) {
                unsaturation +=
                    customUnsaturations[currentElement] * line.multiplier;
            } else if (unsaturations[currentElement] !== undefined) {
                unsaturation += unsaturations[currentElement] * line.multiplier;
            } else {
                validUnsaturation = false;
            }
        }
    }

    // need to calculate the observedMonoisotopicMass
    if (currentPart.charge) {
        currentPart.observedMonoisotopicMass =
            (currentPart.monoisotopicMass -
                currentPart.charge * ELECTRON_MASS) /
            Math.abs(currentPart.charge);
    }
    if (validUnsaturation) {
        currentPart.unsaturation = unsaturation / 2 + 1;
    }
    return currentPart;
}

function getIsotopeRatioInfo(value) {
    let result = {
        mass: 0,
        monoisotopicMass: 0
    };
    let element = elements[value.atom];
    if (!element) throw new Error(`Element not found: ${value.atom}`);
    let isotopesArray = element.isotopes;
    let ratios = normalize(value.ratio);
    let max = Math.max(...ratios);
    if (ratios.length > isotopesArray.length) {
        throw new Error(
            `the number of specified ratios is bigger that the number of stable isotopes: ${
                value.atom
            }`
        );
    }
    for (let i = 0; i < ratios.length; i++) {
        result.mass += ratios[i] * isotopesArray[i].mass;
        if (max === ratios[i] && result.monoisotopicMass === 0) {
            result.monoisotopicMass = isotopesArray[i].mass;
        }
    }
    return result;
}

function normalize(array) {
    let sum = array.reduce((prev, current) => prev + current, 0);
    return array.map((a) => a / sum);
}
