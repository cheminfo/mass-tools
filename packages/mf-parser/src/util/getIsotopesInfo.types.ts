interface IsotopeInfo {
  atom: string;
  number: number;
  distribution: Array<{ x: number; y: number }>;
}

export interface IsotopesInfo {
  charge: number;
  isotopes: IsotopeInfo[];
}
