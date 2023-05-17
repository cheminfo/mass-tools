import { activeOrNaturalDetails } from '../activeOrNaturalDetails.js';

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
    'massSpectraRefs',
    'kwBioassays',
    'kwActiveAgainst',
    'kwTaxonomies',
    'activities',
    'taxonomies',
    'compounds',
  ]);

});
