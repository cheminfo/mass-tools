import type {
  GetInfoOptions,
  GetInfoOptionsAllowed,
  MFInfo,
  MFInfoWithParts,
} from './getInfo.types';
import { getInfoInternal } from './getInfoInternal';

// TODO: replace any with the actual type from `./toParts`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Part = any;

export function getInfo<GIO extends GetInfoOptionsAllowed = GetInfoOptions>(
  parts: Part[][],
  options?: GIO,
): MFInfo<GIO> | MFInfoWithParts<GIO> {
  return getInfoInternal(parts, options);
}
