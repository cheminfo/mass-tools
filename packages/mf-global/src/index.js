'use strict';

module.exports = {
  EMDB: require('emdb'),
  Groups: require('chemical-groups/src/groups'),
  Elements: require('chemical-elements/src/elementsAndIsotopes'),
  IsotopicDistribution: require('isotopic-distribution'),
  MF: require('mf-parser/src/MF.js'),
  Peptide: require('peptide'),
  Nucleotide: require('nucleotide'),
  Spectrum: require('ms-spectrum/src/Spectrum'),
  getPeaks: require('ms-spectrum/src//getPeaks'),
  getBestPeaks: require('ms-spectrum/src//getBestPeaks'),
  Report: require('ms-report'),
};
