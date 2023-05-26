import { activeOrNaturalDetails } from '../activeOrNaturalDetails.js';

test('activeOrNaturalDetails', async () => {
  const id = 'dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgEx\x7FRLjmcxX~F@';
  const entry = await activeOrNaturalDetails(id, {});
  const fields = Object.keys(entry.data).sort();
  console.log(fields)
  expect(fields).toStrictEqual([
    'activities', 'bioactive',
    'cas', 'charge',
    'em', 'kwActiveAgainst',
    'kwBioassays', 'kwMeshTerms',
    'kwTaxonomies', 'massSpectra',
    'mf', 'molecules',
    'naturalProduct', 'nbActivities',
    'nbMassSpectra', 'nbMolecules',
    'nbPatents', 'nbPubmeds',
    'nbTaxonomies', 'noStereoOCL',
    'patents', 'pubmeds',
    'taxonomies', 'unsaturation'
  ]);
});
