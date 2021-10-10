'use strict';

const { stableIsotopesObject } = require('chemical-elements');
const { subscript, superscript } = require('mf-parser');

function getDerivedCompositionInfo(composition) {
  const shortComposition = {};
  let label = '';
  let shortLabel = '';
  for (let key in composition) {
    let isotopeLabel = '';
    for (let i = 0; i < key.length; i++) {
      if (superscript[key[i]]) {
        isotopeLabel += superscript[key[i]];
      } else {
        isotopeLabel += key[i];
      }
    }
    const number = String(composition[key]);
    for (let i = 0; i < number.length; i++) {
      isotopeLabel += subscript[number[i]];
    }
    label += isotopeLabel;
    if (stableIsotopesObject[key].mostAbundant) continue;
    shortLabel += isotopeLabel;
    shortComposition[key] = composition[key];
  }

  return { label, shortComposition, shortLabel };
}

module.exports = getDerivedCompositionInfo;
