import { baseLoss } from '.';

export function addFiveTermBaseLoss(mfs, fiveTerm, i, options) {
  if (!options.abcdBaseLoss) return;
  let loss = baseLoss(fiveTerm);

  loss.forEach((mf) => {
    if (options.a) {
      mfs.push(`${mf}`.replace('$', `O-1H-1$a${i} `));
    }
    if (options.b) {
      mfs.push(`${mf}`.replace('$', `H-1$b${i} `));
    }
    if (options.c) {
      mfs.push(`${mf}`.replace('$', `PO2$c${i} `));
    }
    if (options.d) {
      mfs.push(`${mf}`.replace('$', `PO3H2$d${i} `));
    }
  });
}
