'use strict';

const baseLoss = require('./baseLoss');

function addFiveTermBaseLoss(mfs, fiveTerm, i, options) {
  if (!options.abcdBaseLoss) return;
  let loss = baseLoss(fiveTerm);
  loss.forEach((mf, index) => {
    mf = mf.replace(/\$.*$/, '');
    if (options.a) {
      mfs.push(`${mf}O-1H-1$a${i}-B${index + 1}`);
    }
    if (options.b) {
      mfs.push(`${mf}H-1$b${i}-B${index + 1}`);
    }
    if (options.c) {
      mfs.push(`${mf}PO2$c${i}-B${index + 1}`);
    }
    if (options.d) {
      mfs.push(`${mf}PO3H2$d${i}-B${index + 1}`);
    }
  });
}

module.exports = addFiveTermBaseLoss;
