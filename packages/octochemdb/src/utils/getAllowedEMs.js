import { findMFs } from 'mf-finder';

export async function getAllowedEMs(options) {
  const { ranges, masses, precision, ionizations } = options;
  if (!ranges) return;
  const allowedEMs = [];
  for (let mass of masses) {
    const { mfs } = await findMFs(mass, {
      ionizations,
      precision,
      ranges,
      limit: 100000,
    });
    for (const mf of mfs) {
      allowedEMs.push(mf.em);
    }
  }
  return Float64Array.from(allowedEMs).sort();
}
