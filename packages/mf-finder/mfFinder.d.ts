export type MFFinderOptions = {
  /**
   * Maximum number of iterations
   * @default 10000000
   */
  maxIterations: number;
  /**
   * @default true
   */
  allowNeutral: boolean;
  /**
   * @default true
   */
  uniqueMFs: boolean;
  /**
   * Maximum number of results
   * @default 1000
   */
  limit: number;
  /**
   *  string containing a comma separated list of modifications
   */
  ionizations: string;
  /**
   * range of mfs to search
   * @default 'C0-100 H0-100 O0-100 N0-100'
   */
  ranges: string;
  /**
   * @default 100
   */
  precision: number;
  filter: MFrFilter;
};

export type MFrFilter = {
  /**
   * Minimal charge
   * @default Number.NEGATIVE_INFINITY
   */
  minCharge: number;
  /**
   * Maximal charge
   * @default Number.POSITIVE_INFINITY
   */
  maxCharge: number;
  unsaturation: UnsaturationFilter;
};

export type UnsaturationFilter = {
  /**
   * Minimal unsaturation
   * @default Number.NEGATIVE_INFINITY
   */
  min: number;
  /**
   * Maximal unsaturation
   * @default Number.POSTIVE_INFINITY
   */
  max: number;
  /**
   * Integer unsaturation
   * @default false
   */
  onlyInteger: boolean;
  /**
   * Non integer unsaturation
   * @default false
   */
  onlyNonInteger: boolean;
  /**
   * object of atom:{min, max}
   */
  atoms: Recoard<string, { min: number; max: number }>;
  /**
   * a function to filter the MF
   */
  callback: function;
};

type MFResult = {
  em: number;
  unsaturation: number;
  mf: stirng;
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
};

export function findMFs(
  targetMass: number,
  options?: MFFinderOptions,
): MFResult[];
