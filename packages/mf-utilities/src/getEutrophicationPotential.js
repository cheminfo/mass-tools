import { MF } from 'mf-parser';

export function getEutrophicationPotential(mfString) {
  let parsed = new MF(mfString);
  let info = parsed.getInfo();
  let mf = info.mf;
  let mw = info.mass;
  let nC = info.atoms.C || 0;
  let nO = info.atoms.O || 0;
  let nN = info.atoms.N || 0;
  let nP = info.atoms.P || 0;
  let nH = info.atoms.H || 0;
  let atoms = Object.keys(info.atoms);
  for (let atom of atoms) {
    if (!['C', 'H', 'N', 'O', 'P'].includes(atom)) {
      return {
        log: `EP can not be calculated because the MF contains the element: ${atom}`,
      };
    }
  }

  let vRef = 1;
  let mwRef = 94.97;

  let thOD = nC + (nH - 3 * nN) / 4 - nO / 2;
  let v = nP + nN / 16 + thOD / 138;
  let ep = v / mw / (vRef / mwRef);

  return {
    v,
    thOD,
    ep,
    mf,
    mw,
    log: 'Successful calculation',
  };
}
