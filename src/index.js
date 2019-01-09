'use strict';

module.exports = {
  EMDB: require('../packages/emdb'),
  Groups: require('../packages/chemical-groups/src/groups'),
  Elements: require('../packages/chemical-elements/src/elementsAndIsotopes'),
  IsotopicDistribution: require('../packages/isotopic-distribution'),
  MF: require('../packages/mf-parser/src/MF.js'),
  Peptide: require('peptide'),
  Nucleotide: require('../packages/nucleotide'),
  Spectrum: require('../packages/ms-spectrum').Spectrum
};
