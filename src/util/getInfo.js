'use strict';

const partToMF = require('./partToMF');
const elements = require('chemical-elements/src/elementsObject.js');
const Kind = require('../Kind');

module.exports = function getInfo(parts) {
    var result = {
        parts: []
    };
    for (let part of parts) {
        let currentPart = {
            mass: 0,
            monoisotopicMass: 0,
            charge: 0
        };
        result.parts.push(currentPart);
        currentPart.mf = partToMF(part);
        for (let line of part) {
            switch (line.kind) {
                case Kind.ATOM:
                    currentPart.monoisotopicMass += elements[line.value].monoisotopicMass;
                    currentPart.mass += elements[line.value].mass;
                    break;
                case Kind.CHARGE:
                    currentPart.charge = line.value;
                    break;
                case Kind.ISOTOPE:

                    break;
                default:

            }
        }
        // need to calculate the observedMonoisotopicMass
        if (currentPart.charge) currentPart.observedMonoisotopicMass = currentPart.monoisotopicMass / currentPart.charge;
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

