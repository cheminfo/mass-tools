'use strict';

module.exports = function formatCharge(charge) {
    if (charge === 1) return '+';
    if (charge > 1) return `+${charge}`;
    if (charge < 0) return String(charge);
    return '';
};
