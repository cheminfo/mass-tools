import { activeOrNaturalDetails } from '../activeOrNaturalDetails.js';

import { server } from './testServer';

// Enable request interception.
beforeAll(() => {
  server.listen();
});
// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers());

// Don't forget to clean up afterwards.
afterAll(() => {
  server.close();
});

test('activeOrNaturalDetails', async () => {
  const id = 'dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgEx\x7FRLjmcxX~F@';
  const url = 'http://localhost/data/activeOrNaturalDetails.json';

  const entry = await activeOrNaturalDetails(id, {
    url,
    fields: '_id,data',
  });

  const fields = Object.keys(entry.data).sort();
  expect(fields).toStrictEqual([
    'activities',
    'bioactive',
    'cas',
    'charge',
    'em',
    'kwActiveAgainst',
    'kwBioassays',
    'kwMeshTerms',
    'kwTaxonomies',
    'kwTitles',
    'massSpectra',
    'mf',
    'molecules',
    'naturalProduct',
    'nbActivities',
    'nbMassSpectra',
    'nbMolecules',
    'nbPatents',
    'nbPubmeds',
    'nbTaxonomies',
    'noStereoOCL',
    'patents',
    'pubmeds',
    'taxonomies',
    'titles',
    'unsaturation',
  ]);
  const activities = entry.data.activities;
  expect(activities[0]).toMatchInlineSnapshot(`
    {
      "$id": "NPC294249",
      "$ref": "npasses",
      "data": {
        "assay": "Potency = 12589.3 nM",
        "ocl": {
          "coordinates": "!Bm?vH?_y?mpJH?[_}m?vw@k\\\\Bm?vw?_x@m?p",
          "idCode": "dg~D@MBdin]V^G[hHBjbbX@",
          "noStereoTautomerID": "dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgExRLjmcxX~F@",
        },
        "targetTaxonomies": [
          {
            "class": "Bacilli",
            "family": "Bacillaceae",
            "genus": "Bacillus",
            "order": "Bacillales",
            "phylum": "Bacillota",
            "species": "Bacillus anthracis",
            "superkingdom": "Bacteria",
          },
        ],
      },
      "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC294249",
    }
  `);
}, 100000);
