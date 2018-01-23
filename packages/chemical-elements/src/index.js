'use strict';

const elements = require('./elementsAndStableIsotopes.js');
const groups = require('./groups.js');
const { ELECTRON_MASS } = require('./constants');

function getElementsObject() {
    var object = {};
    elements.forEach((e) => {
        object[e.symbol] = e;
    });
    return object;
}

function getGroupsObject() {
    var object = {};
    groups.forEach((e) => {
        object[e.symbol] = e;
    });
    return object;
}

module.exports = {
    elements,
    groups,
    getElementsObject,
    getGroupsObject,
    ELECTRON_MASS
};
