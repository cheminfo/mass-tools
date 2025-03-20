import type { AtomsMap } from './partToAtoms.types';

type ImpossibleCustomNames =
  | 'mass'
  | 'charge'
  | 'mf'
  | 'atoms'
  | 'unsaturation'
  | 'parts';
type AllowedCustomNames = Exclude<string, ImpossibleCustomNames> | undefined;

type GetEM<GIO extends GetInfoOptionsAllowed> =
  GIO extends GetInfoOptions<infer em, string>
    ? em extends undefined
      ? 'monoisotopicMass'
      : em
    : never;
type GetMSEM<GIO extends GetInfoOptionsAllowed> =
  GIO extends GetInfoOptions<string, infer msem>
    ? msem extends undefined
      ? 'observedMonoisotopicMass'
      : msem
    : never;

type CustomNameFields<GIO extends GetInfoOptionsAllowed> = Record<
  GetEM<GIO>,
  number
> &
  Record<GetMSEM<GIO>, number | undefined>;

export type PartInfo<GIO extends GetInfoOptionsAllowed> = {
  /**
   * Molecular weight of the molecule formula
   */
  mass: number;
  /**
   * Charge of the molecule formula
   */
  charge: number;
  mf: string;
  /**
   * Object containing the atom and the number of atoms
   * This object will take only the atom label and will not take into account isotopic enrichments
   */
  atoms: AtomsMap;
  /**
   * Theoretical number of isotopologues not taking into account the abundance of isotopes
   */
  nbIsotopologues: number;
  /**
   * Double bond equivalent (DBE) or unsaturation index (UI)
   * This value can be undefined if some not supported atoms are present
   */
  unsaturation?: number;
} & CustomNameFields<GIO>;

export type PartInfoWithParts<GIO extends GetInfoOptionsAllowed> = Omit<
  PartInfo<GIO>,
  'unsaturation'
> & {
  parts: Array<PartInfo<GIO>>;
  unsaturation: number;
} & CustomNameFields<GIO>;

/**
 * final options type for the `getInfo` function
 *
 * @example
 * ```ts
 * const options: GetInfoOptions<'em', 'msem'> = {emFieldName: 'em', msemFieldName: 'msem'};
 * const info = getInfo(parts, options);
 *
 * // info.em should exists
 * // info.parts[0].msem should exists
 * ```
 */
export interface GetInfoOptions<
  EM extends AllowedCustomNames = 'monoisotopicMass',
  MSEM extends AllowedCustomNames = 'observedMonoisotopicMass',
> {
  customUnsaturations?: object;
  emFieldName?: EM;
  msemFieldName?: MSEM;
}

/**
 * Guard type to check if the provided options are allowed
 * @example
 * ```ts
 * function getInfo<GIO extends GetInfoOptionsAllowed = GetInfoOptions>(options?: GIO): PartInfo<GIO> | PartInfoWithParts<GIO>;`
 * ```
 */
export type GetInfoOptionsAllowed = GetInfoOptions<
  AllowedCustomNames,
  AllowedCustomNames
>;
