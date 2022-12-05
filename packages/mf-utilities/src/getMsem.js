import { ELECTRON_MASS } from 'chemical-elements';

export function getMsem(em, charge) {
  if (charge > 0) {
    return em / charge - ELECTRON_MASS;
  } else if (charge < 0) {
    return em / (charge * -1) + ELECTRON_MASS;
  } else {
    return 0;
  }
}
