'use strict';

const baseLoss = require('./baseLoss');

function addThreeTermBaseLoss(mfs, threeTerm, i, options) {
  if (!options.wxyzBaseLoss) return;
  let loss = baseLoss(threeTerm);

  loss.forEach((mf, index) => {
    mf = mf.replace(/\$.*$/, '');
    if (options.w) {
      mfs.push(`HO${mf}$w${i}-B${index + 1}`);
    }
    if (options.x) {
      mfs.push(`H-1${mf}$x${i}-B${index + 1}`);
    }
    if (options.y) {
      mfs.push(`O-2P-1${mf}$y${i}-B${index + 1}`);
    }
    if (options.z) {
      mfs.push(`O-3H-1P-1(+)${mf}-B${index + 1}`);
    }
  });
}

module.exports = addThreeTermBaseLoss;
