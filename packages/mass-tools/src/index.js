'use strict';

module.exports = {
  EMDB: require('emdb'),
  groups: require('chemical-groups/src/groups'),
  groupsObject: require('chemical-groups/src/groupsObject'),
  elements: require('chemical-elements/src/elementsAndIsotopes'),
  elementsObject: require('chemical-elements/src/elementsAndIsotopesObject'),
  IsotopicDistribution: require('isotopic-distribution'),
  MF: require('mf-parser/src/MF.js'),
  Peptide: require('peptide'),
  Nucleotide: require('nucleotide'),
  Spectrum: require('ms-spectrum/src/Spectrum'),
  preprocessRanges: require('mf-utilities/src/preprocessRanges'),
  getRangeForFragment: require('mf-utilities/src/getRangeForFragment'),
  getPeaks: require('ms-spectrum/src//getPeaks'),
  getBestPeaks: require('ms-spectrum/src/getBestPeaks'),
  generateMFs: require('mf-generator'),
  Report: require('ms-report'),
  atomSorter: require('atom-sorter'),
  mfFromEA: require('mf-from-ea'),
};
