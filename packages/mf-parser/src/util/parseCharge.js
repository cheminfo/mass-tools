/**
 * Parse a string to extract the charge.
 * The charge may be in the form --, +++, +3, -2, 4+, 2-
 * @param {*} charge
 */

export function parseCharge(charge) {
  charge = charge.replaceAll(/[()]/g, '');
  let chargeNumber = 0;
  if (charge.match(/^[+-]+$/)) {
    for (let i = 0; i < charge.length; i++) {
      if (charge.charAt(i) === '+') chargeNumber++;
      else chargeNumber--;
    }
  } else if (charge.match(/^\d+[+-]$/)) {
    chargeNumber = Number(
      // eslint-disable-next-line unicorn/prefer-at
      charge.charAt(charge.length - 1) + charge.slice(0, -1),
    );
  } else {
    chargeNumber = Number(charge);
  }
  return chargeNumber;
}
