'use strict';

const partToMF = require('./partToMF');
const elements = require('chemical-elements/src/elementsObject.js');
const isotopes = require('chemical-elements/src/stableIsotopesObject.js');
const Kind = require('../Kind');
const {ELECTRON_MASS} = require('chemical-elements/src/constants');

module.exports = function getInfo(parts) {
    if (parts.length === 0) return {};
    if (parts.length === 1) return getProcessedPart(parts[0]);

    var result = {
        parts: []
    };
    for (let part of parts) {
        result.parts.push(getProcessedPart(part));
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

function getProcessedPart(part) {
    let currentPart = {
        mass: 0,
        monoisotopicMass: 0,
        charge: 0
    };
    currentPart.mf = partToMF(part);
    for (let line of part) {
        switch (line.kind) {
            case Kind.ATOM: {
                let element = elements[line.value];
                if (!element) throw new Error('Unknown element', line.value);
                currentPart.monoisotopicMass += element.monoisotopicMass * line.multiplier;
                currentPart.mass += element.mass * line.multiplier;
                break;
            }
            case Kind.ISOTOPE: {
                let isotope = isotopes[line.value.isotope + line.value.atom];
                if (!isotope) throw new Error('Unknown isotope', line.value.isotope + line.value.atom);
                currentPart.monoisotopicMass += isotope.mass * line.multiplier;
                currentPart.mass += isotope.mass * line.multiplier;
                break;
            }
            case Kind.CHARGE:
                currentPart.charge = line.value;
                break;

            default:
                throw new Error('Unimplemented Kind in getInfo', line.kind);
        }
    }
    // need to calculate the observedMonoisotopicMass
    if (currentPart.charge) {
        currentPart.observedMonoisotopicMass = (currentPart.monoisotopicMass - currentPart.charge * ELECTRON_MASS) / Math.abs(currentPart.charge);
    }
    return currentPart;
}
