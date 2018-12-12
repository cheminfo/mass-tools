'use strict';

const fs = require('fs');

const Papa = require('papaparse');

const MODULE = "'use strict';\nmodule.exports=";

var names = Papa.parse(`${fs.readFileSync(`${__dirname}/names.tsv`)}`, { header: true }).data;

var elementsAndIsotopes = JSON.parse(fs.readFileSync(`${__dirname}/isotopes.json`));

for (let i = 0; i < elementsAndIsotopes.length; i++) {
  let element = elementsAndIsotopes[i];
  let name = names[i];
  if (element.symbol !== name.symbol) {
    // eslint-disable-next-line no-console
    console.log('Symbol inconsistency:', i + 1, element.symbol, name.symbol);
    element.symbol = name.symbol;
  }
  element.name = name.name;

  let massFromIsotopes = getMass(element);
  // need to decide which element mass to give, we calculate it ourself
  element.mass = (massFromIsotopes) ? massFromIsotopes : null;
}

fs.writeFileSync(`${__dirname}/../src/elementsAndIsotopes.js`, MODULE + JSON.stringify(elementsAndIsotopes));

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
  e.monoisotopicMass = getMonoisotopicMass(e);
});
fs.writeFileSync(`${__dirname}/../src/elementsAndStableIsotopes.js`, MODULE + JSON.stringify(elementsAndStableIsotopes));
fs.writeFileSync(`${__dirname}/../src/stableIsotopesObject.js`, MODULE + JSON.stringify(stableIsotopesObject));


var elements = JSON.parse(JSON.stringify(elementsAndStableIsotopes));
elements.forEach((e) => {
  e.isotopes = undefined;
});
fs.writeFileSync(`${__dirname}/../src/elements.js`, MODULE + JSON.stringify(elements));


var elementsObject = {};
elements.forEach((e) => {
  elementsObject[e.symbol] = e;
  e.symbol = undefined;
});
fs.writeFileSync(`${__dirname}/../src/elementsObject.js`, MODULE + JSON.stringify(elementsObject));


var elementsAndIsotopesObject = {};
elementsAndIsotopes.forEach((e) => {
  elementsAndIsotopesObject[e.symbol] = e;
  e.symbol = undefined;
});
fs.writeFileSync(`${__dirname}/../src/elementsAndIsotopesObject.js`, MODULE + JSON.stringify(elementsAndIsotopesObject));

var elementsAndStableIsotopesObject = {};
elementsAndStableIsotopes.forEach((e) => {
  elementsAndStableIsotopesObject[e.symbol] = e;
  e.symbol = undefined;
});
fs.writeFileSync(`${__dirname}/../src/elementsAndStableIsotopesObject.js`, MODULE + JSON.stringify(elementsAndStableIsotopesObject));


function getMass(element) {
  var stable = element.isotopes.filter((a) => a.abundance > 0);
  var mass = 0;
  stable.forEach((a) => {
    mass += a.abundance * a.mass;
  });
  return mass;
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
