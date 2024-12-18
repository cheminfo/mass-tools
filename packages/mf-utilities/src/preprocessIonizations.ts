import { MF } from 'mf-parser';
import type { AtomsMap } from 'mf-parser';

export interface Ionization {
  mf: string;
  em: number;
  charge: number;
  atoms: AtomsMap;
}

export function preprocessIonizations(
  ionizationsString: string | Ionization[] = '',
): Ionization[] {
  if (Array.isArray(ionizationsString)) return ionizationsString;
  const ionizations = ionizationsString.split(/ *[\t\n\r,.;]+ */);

  // it is allowed to have ranges in Ionizations. We need to explode them.

  const results: Ionization[] = [];

  for (const ionization of ionizations) {
    const parts = new MF(ionization).flatten();
    for (const part of parts) {
      const info = new MF(part).getInfo();
      results.push({
        mf: part,
        em: info.monoisotopicMass,
        charge: info.charge,
        atoms: info.atoms,
      });
    }
  }

  return results;
}
