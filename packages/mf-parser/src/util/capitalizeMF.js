import { elementsObject } from 'chemical-elements';
import { groupsObject } from 'chemical-groups';

import { isMF } from './isMF.js';

/**
 * Try to capitalize a molecular formula based on what end users 'would' expect
 */

export function capitalizeMF(mf) {
  if (!mf.match(/^[\d A-Za-z]+/)) return mf;
  if (isMF(mf)) return mf;
  let oldMF = mf
    .replace(/co/, 'C O')
    .replace(/mn/, ' Mn ')
    .replace(/cd/, ' C D ')
    .replace(/(\d)([A-Za-z])/, '$1 $2');
  let newMF = '';
  let parts = oldMF.split(/ +/);

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '') continue;
    let label = parts[i].replace(/\d*$/, '');
    let number = parts[i].replace(/^[A-Za-z]*/, '');

    let casedLabel = getCasedLabel(label);

    if (casedLabel) {
      newMF += casedLabel + number;
    } else {
      return mf;
    }
  }
  return newMF;
}

function getCasedLabel(label) {
  if (elementsObject[label]) return label;
  if (groupsObject[label]) return label;

  if (label === '') return label;

  let casedLabel =
    label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
  if (elementsObject[label]) return casedLabel;
  if (groupsObject[label]) return casedLabel;

  // we would like to cover chcl3, ch2o, ch2cl2, ccl4
  let newLabel = label
    .toLowerCase()
    .replaceAll('cl', 'Cl')
    .replaceAll('br', 'Br')
    .replaceAll('na', 'Na')
    .replaceAll('li', 'Li')
    .replaceAll('si', 'Si')
    .replaceAll('cr', 'Cr')
    .replaceAll('c', 'C')
    .replaceAll('o', 'O')
    .replaceAll('n', 'N')
    .replaceAll('h', 'H')
    .replaceAll('k', 'K')
    .replaceAll('s', 'S');
  if (isMF(newLabel)) return newLabel;
  return label;
}
