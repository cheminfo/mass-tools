'use strict';

const elements = require('chemical-elements').elementsObject;
const groups = require('chemical-groups').getGroupsObject();

const isMF = require('../../../mf-utilities/src/isMF');

/**
 * Try to capitalize a molecular formula based on what end users 'would' expect
 */

module.exports = function capitalizeMF(mf) {
  if (!mf.match(/^[0-9a-zA-Z ]+/)) return mf;
  if (isMF(mf)) return mf;
  let oldMF = mf
    .replace(/co/, 'C O')
    .replace(/mn/, ' Mn ')
    .replace(/cd/, ' C D ')
    .replace(/([0-9])([a-zA-Z])/, '$1 $2');
  let newMF = '';
  let parts = oldMF.split(/ +/);

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '') continue;
    let label = parts[i].replace(/[0-9]*$/, '');
    let number = parts[i].replace(/^[a-zA-Z]*/, '');

    let casedLabel = getCasedLabel(label);

    if (casedLabel) {
      newMF += casedLabel + number;
    } else {
      return mf;
    }
  }
  return newMF;
};

function getCasedLabel(label) {
  if (elements[label]) return label;
  if (groups[label]) return label;

  if (label === '') return label;

  let casedLabel =
    label.substr(0, 1).toUpperCase() + label.substr(1).toLowerCase();
  if (elements[label]) return casedLabel;
  if (groups[label]) return casedLabel;

  // we would like to cover chcl3, ch2o, ch2cl2, ccl4
  let newLabel = label
    .toLowerCase()
    .replace(/cl/g, 'Cl')
    .replace(/br/g, 'Br')
    .replace(/na/g, 'Na')
    .replace(/li/g, 'Li')
    .replace(/si/g, 'Si')
    .replace(/cr/g, 'Cr')
    .replace(/c/g, 'C')
    .replace(/o/g, 'O')
    .replace(/n/g, 'N')
    .replace(/h/g, 'H')
    .replace(/k/g, 'K')
    .replace(/s/g, 'S');
  if (isMF(newLabel)) return newLabel;
  return label;
}
