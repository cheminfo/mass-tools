import { activeOrNaturalDetails } from '../activeOrNaturalDetails.js';

jest.setTimeout(30000);

test('activeOrNaturalDetails', async () => {
  const id = 'dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgEx\x7FRLjmcxX~F@';
  const entry = await activeOrNaturalDetails(id, {});
  const fields = Object.keys(entry.data);
  expect(fields).toStrictEqual([
    'naturalProduct',
    'em',
    'charge',
    'unsaturation',
    'mf',
    'bioactive',
    'noStereoOCL',
    'nbPatents',
    'patents',
    'cas',
    'nbPubmeds',
    'nbMassSpectra',
    'nbTaxonomies',
    'nbActivities',
    'kwMeshTerms',
    'pubmeds',
    'kwBioassays',
    'kwActiveAgainst',
    'kwTaxonomies',
    'activities',
    'taxonomies',
    'compounds',
    'massSpectra',
  ]);
});
