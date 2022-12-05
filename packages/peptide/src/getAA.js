import { aminoAcids } from './aminoAcids';

export function getAA(code) {
  if (code.length === 1) {
    for (let i = 0; i < aminoAcids.length; i++) {
      if (aminoAcids[i].aa1 === code) {
        return aminoAcids[i];
      }
    }
  }
  if (code.length === 3) {
    for (let i = 0; i < aminoAcids.length; i++) {
      if (aminoAcids[i].aa3 === code) {
        return aminoAcids[i];
      }
    }
  }
}
