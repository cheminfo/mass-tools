/**
 * The family a group belongs to. A group that is not part of a biopolymer —
 * a protecting group, a substituent, an isotope — carries no kind.
 *
 * - `aa` — amino acid residue, the unit a peptide chain is made of.
 * - `DNA` / `RNA` — deoxyribonucleoside / ribonucleoside, no phosphate.
 * - `…p` / `…pp` / `…ppp` — the same, as mono-, di- and triphosphate.
 * - `RNApMod` / `RNAppMod` — modified ribonucleotide, from Modomics. The
 *   diphosphates are the 5′ caps, joined by a 5′-5′ phosphate bridge.
 * - `RNAEnd` — a 5′ end. The only monoradicals: they close a chain where every
 *   other kind extends it.
 */
export type Kind =
  | 'aa'
  | 'DNA'
  | 'DNAp'
  | 'DNApp'
  | 'DNAppp'
  | 'RNA'
  | 'RNAp'
  | 'RNApp'
  | 'RNAppp'
  | 'RNApMod'
  | 'RNAppMod'
  | 'RNAEnd';

export interface GroupOcl {
  /** OCL idcode of the structure, R atoms included */
  value: string;
  /** OCL encoded 2D coordinates */
  coordinates?: string;
}

export interface GroupElement {
  /** Symbol of the element, like `C` or `Na` */
  symbol: string;
  /** Number of atoms of this element in the group */
  number: number;
  /** Nominal mass, only present for a specific isotope like `[3H]` */
  isotope?: number;
}

export interface Group {
  /** Symbol used in a molecular formula, like `Ala` or `Ph` */
  symbol: string;
  name: string;
  /** Molecular formula of the group, without the R atoms */
  mf: string;
  /** Family of the group, absent on the groups that belong to none */
  kind?: Kind;
  /** One letter code, for the groups that have one, like `A` for `Ala` */
  oneLetter?: string;
  /** Second one letter code, like `α` for `Ala` */
  alternativeOneLetter?: string;
  /**
   * Set on the groups whose structure was generated instead of drawn, and that
   * still have to be checked by a human. Removed once the group is checked.
   */
  toVerify?: boolean;
  /** Structure of the group, with its R attachment points */
  ocl?: GroupOcl;
  mass: number;
  monoisotopicMass: number;
  /**
   * Number of missing hydrogens, twice the double bond equivalent. `null` when
   * the formula contains an atom without a known unsaturation.
   */
  unsaturation: number | null;
  elements: GroupElement[];
}
