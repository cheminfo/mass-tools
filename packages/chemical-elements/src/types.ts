export interface Element {
  number: number;
  symbol: string;
  mass: number | null;
  name: string;
  monoisotopicMass?: number;
}

interface Isotope {
  nominal: number;
  mass: number;
  abundance?: number;
}

export interface ElementAndIsotopes extends Element {
  isotopes: Isotope[];
}
