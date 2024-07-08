import { readFileSync } from 'node:fs';
import path from 'node:path';

import { normalizeActivities } from '../utils/normalizeActivities.js';

describe('normalizeActivities', () => {
  it('normalize Activities', () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
    );

    const result = normalizeActivities(entry);
    expect(result.data.activities[0]).toMatchInlineSnapshot(`
      {
        "$id": "NPC294249",
        "$ref": "npasses",
        "data": {
          "assay": "Potency : 12589.3 nM",
          "ocl": {
            "coordinates": "!BbOvw?_y?bOrw?Xa}bGvH@hc|bGvH?_x@bOp",
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
    expect(result.data.activities[5]).toMatchInlineSnapshot(`
      {
        "$id": "442356_589",
        "$ref": "bioassays",
        "data": {
          "aid": 589,
          "assay": "qHTS Assay for Spectroscopic Profiling in 4-MU Spectral Region",
          "cid": 442356,
          "ocl": {
            "coordinates": "!BmpK~_?x@m?vH@k\\BmpJw?X?Cc}qO_Gy?SpL",
            "noStereoID": "dg~D@MBdin]V^G[hHBjb@@",
            "noStereoTautomerID": "dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgExRLjmcxX~F@",
          },
        },
        "url": "https://pubchem.ncbi.nlm.nih.gov/bioassay/589",
      }
    `);

    expect(Object.keys(result.data.activities[0])).toStrictEqual(
      Object.keys(result.data.activities[5]),
    );
  }, 30000);
});
