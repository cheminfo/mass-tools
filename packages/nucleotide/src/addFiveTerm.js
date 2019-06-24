'use strict';

const furanThreeTerm = require('./furanThreeTerm');

function addFiveTerm(mfs, fiveTerm, i, options) {
  if (options.a) mfs.push(`${fiveTerm}O-1H-1$a${i}`); // neutral ok
  if (options.ab) mfs.push(`${furanThreeTerm(fiveTerm)}$a${i} - B`); // A minus base
  if (options.b) mfs.push(`${fiveTerm}H-1$b${i}`);
  if (options.c) mfs.push(`${fiveTerm}PO2$c${i}`); // neutral ok
  if (options.d) mfs.push(`${fiveTerm}PO3H2$d${i}`);
  if (options.dh2o) mfs.push(`${fiveTerm}PO2$d-H2O${i}`);
}

module.exports = addFiveTerm;
