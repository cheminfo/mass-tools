'use strict';

const elements = require('chemical-elements').elementsAndStableIsotopesObject;

function getIsotopeRatioInfo(value) {
  let result = { mass: 0, monoisotopicMass: 0 };
  let element = elements[value.atom];
  if (!element) throw new Error(`Element not found: ${value.atom}`);
  let isotopesArray = element.isotopes;
  let ratios = normalize(value.ratio);
  let max = Math.max(...ratios);
  if (ratios.length > isotopesArray.length) {
    throw new Error(
      `the number of specified ratios is bigger that the number of stable isotopes: ${value.atom}`,
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

module.exports = getIsotopeRatioInfo;
