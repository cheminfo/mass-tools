import type { AtomsMap } from './partToAtoms';

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
