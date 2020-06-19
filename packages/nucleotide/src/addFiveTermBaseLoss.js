'use strict';

const baseLoss = require('./baseLoss');

function addFiveTermBaseLoss(mfs, fiveTerm, i, options) {
  if (!options.abcdBaseLoss) return;
  let loss = baseLoss(fiveTerm);

  loss.forEach((mf) => {
    console.log(mf);

    if (options.a) {
      mfs.push(`${mf}O-1H-1`.replace('$', `$a${i}`));
    }
    if (options.b) {
      mfs.push(`${mf}H-1`.replace('$', `$b${i}`));
    }
    if (options.c) {
      mfs.push(`${mf}PO2`.replace('$', `$c${i}`));
    }
    if (options.d) {
      mfs.push(`${mf}PO3H2`.replace('$', `$d${i}`));
    }
  });
}

module.exports = addFiveTermBaseLoss;
