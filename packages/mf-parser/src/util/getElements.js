'use strict';

const {
  elementsObject,
  elementsAndIsotopesObject,
} = require('chemical-elements');

const Kind = require('../Kind');

/**
 *
 * @param {*} parts
 * @param {*} [options={}]
 */
module.exports = function getElements(parts) {
  const elements = [];
  for (const part of parts) {
    for (const line of part) {
      let number = line.multiplier;
      switch (line.kind) {
        case Kind.ATOM: {
          let symbol = line.value;
          let element = elementsObject[symbol];
          if (!element) {
            throw new Error(`element unknown: ${symbol} - ${line}`);
          }
          addElement(elements, { symbol, number });
          break;
        }
        case Kind.ISOTOPE: {
          let element = elementsAndIsotopesObject[line.value.atom];
          if (!element) {
            throw new Error(`element unknown: ${part.value.atom} - ${line}`);
          }
          let isotope = element.isotopes.filter(
            (a) => a.nominal === line.value.isotope,
          )[0];
          if (!isotope) {
            throw new Error(`isotope unknown: ${line.value.isotope} - ${line}`);
          }
          addElement(elements, {
            symbol: line.value.atom,
            number,
            isotope: line.value.isotope,
          });
          break;
        }
        default:
          throw new Error(`unknown type: ${line.kind}`);
      }
    }
  }
  return elements;
};

function addElement(elements, newElement) {
  for (let element of elements) {
    if (
      element.symbol === newElement.symbol &&
      element.isotope === newElement.isotope
    ) {
      element.number += newElement.number;
      return;
    }
  }
  elements.push(newElement);
}
