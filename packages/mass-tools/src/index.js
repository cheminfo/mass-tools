import * as EMDBPkg from 'emdb';
import * as ReportPkg from 'ms-report';
import * as SpectrumPkg from 'ms-spectrum';
import * as NucleotidePkg from 'nucleotide';
import * as PeptidePkg from 'peptide';

export const Nucleotide = NucleotidePkg;
export const Report = ReportPkg;
export const Peptide = PeptidePkg;

export { groups, groupsObject } from 'chemical-groups';
export { elements, elementsObject } from 'chemical-elements';
export { IsotopicDistribution } from 'isotopic-distribution';

EMDBPkg.EMDB.searchPubchem = EMDBPkg.searchPubchem;
EMDBPkg.EMDB.searchActivesOrNaturals = EMDBPkg.searchActivesOrNaturals;
EMDBPkg.EMDB.massShifts = EMDBPkg.massShifts;
EMDBPkg.EMDB.prototype.searchPubchem = EMDBPkg.searchPubchem;
EMDBPkg.EMDB.prototype.searchActivesOrNaturals =
  EMDBPkg.searchActivesOrNaturals;
EMDBPkg.EMDB.prototype.massShifts = EMDBPkg.massShifts;
export const EMDB = EMDBPkg.EMDB;

SpectrumPkg.Spectrum.JsGraph = SpectrumPkg.JsGraph;
SpectrumPkg.Spectrum.prototype.JsGraph = SpectrumPkg.JsGraph;
export const Spectrum = SpectrumPkg.Spectrum;
export const MSComparator = SpectrumPkg.MSComparator;

export { MF } from 'mf-parser';
export { preprocessRanges, getRangesForFragment } from 'mf-utilities';
export { generateMFs } from 'mf-generator';

export { atomSorter } from 'atom-sorter';
export { mfFromEA } from 'mf-from-ea';
