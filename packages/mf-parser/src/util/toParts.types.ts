import type { Kind } from '../Kind';
import type { MFParsedPartOfKind } from '../parse.types';

export interface ToPartsOptions {
  /**
   * @default true
   */
  expand?: boolean;
}

interface ToPartsMultipliersBase {
  value: number;
  fromIndex: number;
}

type ToPartsLine = MFParsedPartOfKind<
  | (typeof Kind)['ATOM']
  | (typeof Kind)['ISOTOPE_RATIO']
  | (typeof Kind)['ISOTOPE']
  | (typeof Kind)['CHARGE']
> & { multiplier: number };

interface ToPartsBase extends ToPartsMultipliersBase {
  multipliers: ToPartsMultipliersBase[];
  lines: ToPartsLine[];
  multiplier: number;
  keys: Array<{ key: string; value: ToPartsLine }>;
  kind:
    | (typeof Kind)['ATOM']
    | (typeof Kind)['ISOTOPE_RATIO']
    | (typeof Kind)['ISOTOPE']
    | (typeof Kind)['CHARGE'];
}

export type ToPartsPart = ToPartsBase & ToPartsLine;
