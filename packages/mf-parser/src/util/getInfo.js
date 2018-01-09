'use strict';

const partToMF = require('./partToMF');
const elements = require('chemical-elements/src/elementsAndStableIsotopesObject.js');
const groups = require('chemical-elements/src/groupsObject.js');
const unsaturations = require('chemical-elements/src/unsaturationsObject.js');
const Kind = require('../Kind');
const {ELECTRON_MASS} = require('chemical-elements/src/constants');

const isotopes = {};
Object.keys(elements).forEach((key) => {
    let e = elements[key];

    e.monoisotopicMass = getMonoisotopicMass(e);
    e.isotopes.forEach((i) => {
        isotopes[i.nominal + key] = {
            abundance: i.abundance,
            mass: i.mass
        };
    });
});

/**
 * 
 * @param {*} parts 
 * @param {*} options 
 */
module.exports = function getInfo(parts, options={
    customUnsaturation={}
}) {
    if (parts.length === 0) return {};
    if (parts.length === 1) return getProcessedPart(parts[0],customUnsaturation);

    var result = {
        parts: []
    };
    for (let part of parts) {
        result.parts.push(getProcessedPart(part),customUnsaturation);
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

function getProcessedPart(part, customUnsaturation) {
    let currentPart = {
        mass: 0,
        monoisotopicMass: 0,
        charge: 0,
        mf: ''
    };
    let unsaturation = 0;
    let validUnsaturation=true;
    currentPart.mf = partToMF(part);
    for (let line of part) {
        let currentElement='';
        switch (line.kind) {
            case Kind.ATOM: {
                currentElement=line.value;
                element = elements[line.value];
                // todo should we have a kind GROUP ?
                if (!element) element = groups[line.value];
                if (!element) throw new Error('Unknown element: ' + line.value);
                currentPart.monoisotopicMass += element.monoisotopicMass * line.multiplier;
                currentPart.mass += element.mass * line.multiplier;
                break;
            }
            case Kind.ISOTOPE: {
                currentElement=line.value.atom;
                let isotope = isotopes[line.value.isotope + line.value.atom];
                if (!isotope) throw new Error('Unknown isotope: ' + line.value.isotope + line.value.atom);
                currentPart.monoisotopicMass += isotope.mass * line.multiplier;
                currentPart.mass += isotope.mass * line.multiplier;
                break;
            }
            case Kind.ISOTOPE_RATIO: {
                currentElement=line.value.isotope;
                let isotopeRatioInfo = getIsotopeRatioInfo(line.value);
                currentPart.monoisotopicMass += isotopeRatioInfo.monoisotopicMass * line.multiplier;
                currentPart.mass += isotopeRatioInfo.mass * line.multiplier;
                break;
            }
            case Kind.CHARGE:
                currentPart.charge = line.value;
                unsaturation+=line.value;
                break;
            default:
                throw new Error('Unimplemented Kind in getInfo', line.kind);
        }
    }
    if (currentElement) {
        if (customUnsaturation[currentElement]) {
            unsaturation+=customUnsaturation[currentElement];
        } else if (unsaturations[currentElement]) {
            unsaturation+=customUnsaturation[currentElement];
        } else {
            validUnsaturation=false;
        }
    }
    // need to calculate the observedMonoisotopicMass
    if (currentPart.charge) {
        currentPart.observedMonoisotopicMass = (currentPart.monoisotopicMass - currentPart.charge * ELECTRON_MASS) / Math.abs(currentPart.charge);
    }
    if (validUnsaturation) {
        currentPart.unsaturation=unsaturation/2+1;
    }
    return currentPart;
}



function getIsotopeRatioInfo(value) {
    let result = {
        mass: 0,
        monoisotopicMass: 0
    };
    let element = elements[value.atom];
    if (!element) throw new Error('Element not found: ' + value.atom);
    let isotopes = element.isotopes;
    let ratios = normalize(value.ratio);
    let max = Math.max(...ratios);
    if (ratios.length > isotopes.length) {
        throw new Error('the number of specified ratios is bigger that the number of stable isotopes: ' + value.atom);
    }
    for (let i = 0; i < ratios.length; i++) {
        result.mass += ratios[i] * isotopes[i].mass;
        if (max === ratios[i] && result.monoisotopicMass === 0) {
            result.monoisotopicMass = isotopes[i].mass;
        }
    }
    return result;
}

function normalize(array) {
    let sum = array.reduce((prev, current) => prev + current, 0);
    return array.map(a => a / sum);
}

function getMonoisotopicMass(element) {
    var monoisotopicMass;
    var maxAbundance = 0;
    for (let isotope of element.isotopes) {
        if (isotope.abundance > maxAbundance) {
            maxAbundance = isotope.abundance;
            monoisotopicMass = isotope.mass;
        }
    }
    return monoisotopicMass;
}
