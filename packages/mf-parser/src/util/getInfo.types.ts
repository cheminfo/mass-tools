import type { AtomsMap } from './partToAtoms';

export interface PartInfo {
  mass: number;
  charge: number;
  mf: string;
  atoms: AtomsMap;
  unsaturation?: number;
}

export interface PartInfoWithParts {
  parts: PartInfo[];
  mass: number;
  charge: number;
  unsaturation: number;
  atoms: AtomsMap;
  mf: string;
}
