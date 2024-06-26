export interface MFFinderOptions {
  /**
   * Maximum number of iterations
   * @default 10_000_000
   */
  maxIterations?: number;
  /**
   * @default true
   */
  allowNeutral?: boolean;
  /**
   * @default true
   */
  uniqueMFs?: boolean;
  /**
   * Maximum number of results
   * @default 1000
   */
  limit?: number;
  /**
   * String containing a comma separated list of modifications
   */
  ionizations?: string | Array<{ mf: string; min: number; max: number }>;
  /**
   * Range of mfs to search
   * @default 'C0-100 H0-100 O0-100 N0-100'
   */
  ranges?: string;
  /**
   * @default 100
   */
  precision?: number;
  filter?: MFrFilter;
}

export interface MFrFilter {
  /**
   * Minimal charge.
   * @default Number.NEGATIVE_INFINITY
   */
  minCharge?: number;
  /**
   * Maximal charge.
   * @default Number.POSITIVE_INFINITY
   */
  maxCharge?: number;
  /**
   * If true, the charge is absolute (so between 0 and +Infinity by default).
   * @default false
   */
  absoluteCharge?: boolean;
  unsaturation?: UnsaturationFilter;
}

export interface UnsaturationFilter {
  /**
   * Minimal unsaturation
   * @default Number.NEGATIVE_INFINITY
   */
  min?: number;
  /**
   * Maximal unsaturation
   * @default Number.POSTIVE_INFINITY
   */
  max?: number;
  /**
   * Integer unsaturation
   * @default false
   */
  onlyInteger?: boolean;
  /**
   * Non integer unsaturation
   * @default false
   */
  onlyNonInteger?: boolean;
  /**
   * Object of atom:{min, max}.
   */
  atoms?: Record<string, { min: number; max: number }>;
  /**
   * A function to filter the MF.
   */
  callback?: (...args: any[]) => any;
}

export interface MFResult {
  em: number;
  unsaturation: number;
  mf: string;
  charge: number;
  ionization?: {
    mf: string;
    em: number;
    charge: number;
    atoms: Record<string, number>;
  };
  atoms: Record<string, number>;
  groups: Record<string, number>;
  ms: {
    ionization: string;
    em: number;
    charge: number;
    delta: number;
    ppm: number;
  };
}
