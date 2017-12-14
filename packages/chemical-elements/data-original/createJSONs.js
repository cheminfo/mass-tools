'use strict';

const Papa = require('papaparse');
const fs = require('fs');
const {MF, Kind} = require('mf-parser');


var names = Papa.parse(fs.readFileSync(__dirname + '/names.tsv') + '', {header: true}).data;

var elementsAndIsotopes = JSON.parse(fs.readFileSync(__dirname + '/isotopes.json'));

for (var i = 0; i < elementsAndIsotopes.length; i++) {
    let element = elementsAndIsotopes[i];
    let name = names[i];
    if (element.symbol !== name.symbol) {
        console.log('Symbol inconsistency:', i + 1, element.symbol, name.symbol);
        element.symbol = name.symbol;
    }
    element.name = name.name;

    let massFromIsotopes = getMass(element);
    // need to decide which element mass to give, we calculate it ourself
    element.mass = (massFromIsotopes) ? massFromIsotopes : null;
}

fs.writeFileSync(__dirname + '/../src/elementsAndIsotopes.js', 'module.exports=' + JSON.stringify(elementsAndIsotopes));

var elementsAndStableIsotopes = JSON.parse(JSON.stringify(elementsAndIsotopes));
// we remove all the unstable isotopes
var stableIsotopesObject = {};
elementsAndStableIsotopes.forEach((e) => {
    e.isotopes = e.isotopes.filter((i) => i.abundance > 0);
    e.isotopes.forEach((i) => {
        stableIsotopesObject[i.nominal + e.symbol] = {
            abundance: i.abundance,
            mass: i.mass
        };
    });
});
fs.writeFileSync(__dirname + '/../src/elementsAndStableIsotopes.js', 'module.exports=' + JSON.stringify(elementsAndStableIsotopes));
fs.writeFileSync(__dirname + '/../src/stableIsotopesObject.js', 'module.exports=' + JSON.stringify(stableIsotopesObject));


var elements = JSON.parse(JSON.stringify(elementsAndStableIsotopes));
elements.forEach((e) => {
    e.monoisotopicMass = getMonoisotopicMass(e);
    e.isotopes = undefined;
});
fs.writeFileSync(__dirname + '/../src/elements.js', 'module.exports=' + JSON.stringify(elements));


var elementsObject = {};
elements.forEach((e) => {
    elementsObject[e.symbol] = e;
    e.symbol = undefined;
});
fs.writeFileSync(__dirname + '/../src/elementsObject.js', 'module.exports=' + JSON.stringify(elementsObject));


var elementsAndIsotopesObject = {};
elementsAndIsotopes.forEach((e) => {
    elementsAndIsotopesObject[e.symbol] = e;
    e.symbol = undefined;
});
fs.writeFileSync(__dirname + '/../src/elementsAndIsotopesObject.js', 'module.exports=' + JSON.stringify(elementsAndIsotopesObject));

var elementsAndStableIsotopesObject = {};
elementsAndStableIsotopes.forEach((e) => {
    elementsAndStableIsotopesObject[e.symbol] = e;
    e.symbol = undefined;
});
fs.writeFileSync(__dirname + '/../src/elementsAndStableIsotopesObject.js', 'module.exports=' + JSON.stringify(elementsAndStableIsotopesObject));


var groups = Papa.parse(fs.readFileSync(__dirname + '/groups.tsv') + '', {header: true}).data;
// we will create an object for the elements
for (let group of groups) {
    let mf = group.mf;
    let mfObject = new MF(mf);
    let parts = mfObject.toParts()[0];
    group.mass = 0;
    group.monoisotopicMass = 0;
    group.elements = parts.map(part => {
        let number = part.multiplier;
        let symbol;
        switch (part.kind) {
            case Kind.ATOM: {
                symbol = part.value;
                let element = elementsObject[symbol];
                if (!element) throw new Error('element unknown: ' + symbol + ' - ' + part);
                group.mass += element.mass * number;
                group.monoisotopicMass += element.monoisotopicMass * number;
            }
                break;
            case Kind.ISOTOPE: {
                symbol = '[' + part.value.isotope + part.value.atom + ']';
                let element = elementsAndIsotopesObject[part.value.atom];
                if (!element) throw new Error('element unknown: ' + part.value.atom + ' - ' + part);
                let isotope = element.isotopes.filter(a => a.nominal === part.value.isotope)[0];
                if (!isotope) throw new Error('isotope unknown: ' + part.value.isotope + ' - ' + part);
                group.mass += isotope.mass * number;
                group.monoisotopicMass += isotope.mass * number;
            }
                break;
            default:
                throw new Error('unknown type: ' + part.kind);
        }

        return {
            symbol,
            number
        };
    });
}

fs.writeFileSync(__dirname + '/../src/groups.js', 'module.exports=' + JSON.stringify(groups));


var groupsObject = {};
groups.forEach((e) => {
    groupsObject[e.symbol] = e;
    e.symbol = undefined;
});
fs.writeFileSync(__dirname + '/../src/groupsObject.js', 'module.exports=' + JSON.stringify(groupsObject));


function getMass(element) {
    var stable = element.isotopes.filter((a) => a.abundance > 0);
    var mass = 0;
    stable.forEach(a => mass += a.abundance * a.mass);
    return mass;
}

function getMonoisotopicMass(element) {
    var monoisotopicMass = undefined;
    var maxAbundance = 0;
    for (let isotope of element.isotopes) {
        if (isotope.abundance > maxAbundance) {
            maxAbundance = isotope.abundance;
            monoisotopicMass = isotope.mass;
        }
    }
    return monoisotopicMass;
}
