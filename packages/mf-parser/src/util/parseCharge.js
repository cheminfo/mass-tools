'use strict';

/**
 * Parse a string to extract the charge
 * The charge may be in the form --, +++, +3, -2, 4+, 2-
 * @param {*} charge
 */

module.exports = function parseCharge(charge) {
  charge = charge.replace(/[()]/g, '');
  let chargeNumber = 0;
  if (charge.match(/^[+-]+$/)) {
    for (let i = 0; i < charge.length; i++) {
      if (charge.charAt(i) === '+') chargeNumber++;
      else chargeNumber--;
    }
  } else if (charge.match(/^[0-9]+[+-]$/)) {
    chargeNumber = Number(
      charge.charAt(charge.length - 1) + charge.substring(0, charge.length - 1),
    );
  } else {
    chargeNumber = Number(charge);
  }
  return chargeNumber;
};
