import { MF } from 'mf-parser';

export function preprocessIonizations(ionizationsString = '') {
  if (Array.isArray(ionizationsString)) return ionizationsString;
  let ionizations = ionizationsString.split(/ *[\t\n\r,.;]+ */);

  // it is allowed to have ranges in Ionizations. We need to explode them.

  let results = [];

  for (let ionization of ionizations) {
    let parts = new MF(ionization).flatten();
    for (let part of parts) {
      let info = new MF(part).getInfo();
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
