'use strict';

module.exports = function parseCharge(charge) {
    charge = charge.replace(/[()]/g, '');
    var chargeNumber = 0;
    if (charge.match(/^[+-]+$/)) {
        for (var i = 0; i < charge.length; i++) {
            if (charge.charAt(i) === '+') chargeNumber++;
            else chargeNumber--;
        }
    } else {
        chargeNumber = Number(charge);
    }
    return chargeNumber;
};
