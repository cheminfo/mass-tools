import * as EMDBPkg from 'emdb';
import * as SpectrumPkg from 'ms-spectrum';

export { groups, groupsObject } from 'chemical-groups';
export { elements, elementsObject } from 'chemical-elements';
export { IsotopicDistribution } from 'isotopic-distribution';

EMDBPkg.EMDB.massShifts = EMDBPkg.massShifts;
EMDBPkg.EMDB.prototype.massShifts = EMDBPkg.massShifts;
export const EMDB = EMDBPkg.EMDB;

SpectrumPkg.Spectrum.JsGraph = SpectrumPkg.JsGraph;
SpectrumPkg.Spectrum.prototype.JsGraph = SpectrumPkg.JsGraph;
export const Spectrum = SpectrumPkg.Spectrum;
export const MSComparator = SpectrumPkg.MSComparator;
export const getBestPeaks = SpectrumPkg.getBestPeaks;

export { MF, ensureCase } from 'mf-parser';
export {
  getRangesForFragment,
  preprocessIonizations,
  preprocessRanges,
} from 'mf-utilities';
export { generateMFs } from 'mf-generator';

export { atomSorter } from 'atom-sorter';
export { mfFromEA } from 'mf-from-ea';
export { mfFromAtomicRatio } from 'mf-from-atomic-ratio';
export {
  ActiveOrNaturalSummarizer,
  OctoChemDB,
  createTaxonomyTree,
} from 'octochemdb';
export * as MassFragmentation from 'mass-fragmentation';
export * as Report from 'ms-report';
export * as MFSDeconvolution from 'mfs-deconvolution';
export * as Nucleotide from 'nucleotide';
export * as Peptide from 'peptide';
