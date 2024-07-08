import { ELECTRON_MASS } from 'chemical-elements';
import { MF } from 'mf-parser';
import { getMsInfo, preprocessIonizations } from 'mf-utilities';

import { fetchJSON } from './fetchJSON.js';
import { getAllowedEMs } from './getAllowedEMs.js';
import { parseMasses } from './parseMasses.js';

export async function searchWithIonizations(options) {
  const {
    realURL,
    fields,
    precision = 100,
    limit = 1000,
    searchParams = {},
    ranges,
  } = options;

  searchParams.precision = String(precision);
  searchParams.limit = String(limit);
  if (fields) searchParams.fields = fields;

  let ionizations = preprocessIonizations(options.ionizations);
  const masses = parseMasses(options.masses || [0]);

  // if we have ranges we need to filter the allowed EMs
  const allowedEMs = await getAllowedEMs({
    ranges,
    masses,
    precision,
    ionizations,
  });
  const promises = [];
  for (let ionization of ionizations) {
    for (let mass of masses) {
      if (mass !== 0) {
        const realMass =
          mass * Math.abs(ionization.charge || 1) -
          ionization.em +
          ELECTRON_MASS * ionization.charge;
        searchParams.em = String(realMass);
      }
      promises.push(fetchJSON(realURL, searchParams));
    }
  }
  const results = await Promise.all(promises);

  const entries = [];
  let counter = 0;
  for (const result of results) {
    const ionization = ionizations[Math.floor(counter / masses.length)];
    const targetMass = masses[counter % masses.length];
    counter++;
    for (const entry of result.data) {
      if (
        allowedEMs &&
        !allowedEMs.some((em) => Math.abs(em - entry.data.em) < 0.0000001)
      ) {
        continue;
      }
      try {
        entry.mfInfo = new MF(entry.data?.mf || entry._id).getInfo({
          emFieldName: 'em',
          msemFieldName: 'msem',
        });
        entry.ionization = ionization;
        entry.ms = getMsInfo(entry.mfInfo, {
          targetMass,
          ionization,
        }).ms;
        entries.push(entry);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`${error}`);
      }
    }
  }

  if (entries.length > limit) {
    entries.length = limit;
  }

  return entries;
}
