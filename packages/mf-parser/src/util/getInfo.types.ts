import type { AtomsMap } from './partToAtoms';

type ImpossibleCustomNames =
  | 'mass'
  | 'charge'
  | 'mf'
  | 'atoms'
  | 'unsaturation'
  | 'parts';
type AllowedCustomNames = Exclude<string, ImpossibleCustomNames>;

type GetEM<GIO extends GetInfoOptions<AllowedCustomNames, AllowedCustomNames>> =
  GIO extends GetInfoOptions<infer em, string>
    ? em extends undefined
      ? 'monoisotopicMass'
      : em
    : never;
type GetMSEM<
  GIO extends GetInfoOptions<AllowedCustomNames, AllowedCustomNames>,
> =
  GIO extends GetInfoOptions<string, infer msem>
    ? msem extends undefined
      ? 'observedMonoisotopicMass'
      : msem
    : never;

type CustomNameFields<
  GIO extends GetInfoOptions<AllowedCustomNames, AllowedCustomNames>,
> = Record<GetEM<GIO>, number> & Record<GetMSEM<GIO>, number | undefined>;

export type PartInfo<GIO extends GetInfoOptionsAllowed> = {
  mass: number;
  charge: number;
  mf: string;
  atoms: AtomsMap;
  unsaturation?: number;
} & CustomNameFields<GIO>;

export type PartInfoWithParts<GIO extends GetInfoOptionsAllowed> = Omit<
  PartInfo<GIO>,
  'unsaturation'
> & {
  parts: Array<PartInfo<GIO>>;
  unsaturation: number;
} & CustomNameFields<GIO>;

export interface GetInfoOptions<
  EM extends AllowedCustomNames = 'monoisotopicMass',
  MSEM extends AllowedCustomNames = 'observedMonoisotopicMass',
> {
  customUnsaturations?: object;
  emFieldName?: EM;
  msemFieldName?: MSEM;
}

export type GetInfoOptionsAllowed = GetInfoOptions<
  AllowedCustomNames,
  AllowedCustomNames
>;
