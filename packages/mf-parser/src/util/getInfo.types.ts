import type { AtomsMap } from './partToAtoms';

type CustomNameFields<Options extends GetInfoOptions<string, string>> = Record<
  Exclude<Options['emFieldName'], undefined>,
  number
> &
  Record<Exclude<Options['msemFieldName'], undefined>, number>;

export type PartInfo<Options extends GetInfoOptions<string, string>> = {
  mass: number;
  charge: number;
  mf: string;
  atoms: AtomsMap;
  unsaturation?: number;
} & CustomNameFields<Options>;

export type PartInfoWithParts<Options extends GetInfoOptions<string, string>> =
  {
    parts: Array<PartInfo<Options>>;
    mass: number;
    charge: number;
    unsaturation: number;
    atoms: AtomsMap;
    mf: string;
  } & CustomNameFields<Options>;

export interface GetInfoOptions<
  EM extends string = 'monoisotopicMass',
  MSEM extends string = 'observedMonoisotopicMass',
> {
  customUnsaturations?: object;
  emFieldName?: EM;
  msemFieldName?: MSEM;
}
