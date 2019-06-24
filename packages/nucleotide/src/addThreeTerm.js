'use strict';

function addThreeTerm(mfs, threeTerm, i, options) {
  if (options.w) mfs.push(`HO${threeTerm}$w${i}`); // neutral ok
  if (options.x) mfs.push(`H-1${threeTerm}$x${i}`); // neutral ok
  if (options.y) mfs.push(`O-2P-1${threeTerm}$y${i}`); // neutral ok
  if (options.z) mfs.push(`O-3H-1P-1(+)${threeTerm}$z${i}`);
  if (options.zch2) mfs.push(`O-3H-3C-1P-1(+)${threeTerm}$z-CH2${i}`);
}

module.exports = addThreeTerm;
