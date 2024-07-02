import { aminoAcids } from './aminoAcids';
import * as IEP from './isoElectricPoint';
import { splitPeptide } from './splitPeptide.js';

export * from './allowNeutralLoss.js';
export * from './chargePeptide.js';
export * from './sequenceToMF.js';
export * from './generatePeptideFragments.js';
export * from './digestPeptide.js';
export * from './splitPeptide.js';

export function getInfo() {
  return aminoAcids;
}

// sequence should be in the "right" format like HAlaGlyProOH

export function calculateIEP(sequence) {
  let aas = splitPeptide(sequence);
  let result = IEP.calculateIEP(aas);
  return result;
}

export function calculateIEPChart(sequence) {
  let aas = splitPeptide(sequence);
  let result = IEP.calculateChart(aas);
  return result;
}

export function getColorForIEP(iep) {
  return IEP.getColor(iep);
}

export function calculateCharge(sequence, ph) {
  let aas = splitPeptide(sequence);
  return IEP.calculateCharge(aas, ph);
}
