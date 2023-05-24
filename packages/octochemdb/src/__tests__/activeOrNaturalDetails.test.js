import { activeOrNaturalDetails } from '../activeOrNaturalDetails.js';

jest.setTimeout(30000);

test('activeOrNaturalDetails', async () => {
  const id = 'dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgEx\x7FRLjmcxX~F@';
  const entry = await activeOrNaturalDetails(id, {});
  const fields = Object.keys(entry.data).sort();
  expect(fields).toStrictEqual([
    'activities',
    'bioactive',
    'cas',
    'charge',
    'compounds',
    'em',
    'kwActiveAgainst',
    'kwBioassays',
    'kwMeshTerms',
    'kwTaxonomies',
    'massSpectra',
    'mf',
    'naturalProduct',
    'nbActivities',
    'nbMassSpectra',
    'nbPatents',
    'nbPubmeds',
    'nbTaxonomies',
    'noStereoOCL',
    'patents',
    'pubmeds',
    'taxonomies',
    'unsaturation',
  ]);
});
