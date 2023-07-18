import { writeFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

const { Molecule } = OCL;

describe('ReactionFragmentation', async () => {
  it('Alpha cleavage: MDMAH+', async () => {
    const molecule = Molecule.fromSmiles('C[NH2+]C(C)Cc2ccc1OCOc1c2');
    const options = {
      maxDepth: 20,
    };
    const { masses, trees, products } = reactionFragmentation(
      molecule,
      options,
    );

    expect(Object.keys(products[0])).toMatchInlineSnapshot(`
      [
        "idCode",
        "mf",
        "trees",
        "reactions",
        "minSteps",
        "monoisotopicMass",
      ]
    `);
    expect(masses).toHaveLength(17);
    expect(trees).toMatchSnapshot();
  });
  it('tropylium rearrangement: MDMA after Alpha cleavage', async () => {
    const molecule = Molecule.fromSmiles('[CH2+]c2ccc1OCOc1c2');
    const options = {
      maxDepth: 20,
    };
    const { masses, trees, products } = reactionFragmentation(
      molecule,
      options,
    );
    expect(Object.keys(products[0])).toMatchInlineSnapshot(`
      [
        "idCode",
        "mf",
        "trees",
        "reactions",
        "minSteps",
        "monoisotopicMass",
      ]
    `);
    expect(masses).toHaveLength(17);
    expect(trees).toMatchSnapshot();
  });

  it('Full fragmentation: MDMA', async () => {
    const molecule = Molecule.fromSmiles('CC(CC1=CC2=C(C=C1)OCO2)NC');
    const options = {
      maxDepth: 5,
    };
    let { masses, trees, products } = reactionFragmentation(molecule, options);
    expect(masses).toMatchInlineSnapshot(`
      [
        194.1176,
        31.0422,
        32.0495,
        163.0754,
        135.0441,
        68.0257,
        45.6862,
        30.0106,
        31.0178,
        105.0335,
        53.0204,
        30.047,
        28.0313,
        82.0413,
        55.03,
        97.5624,
        65.3774,
        193.1103,
        65.0414,
        68.5296,
        97.0585,
        58.0651,
        136.0519,
        193.1097,
        135.0446,
      ]
    `);
    expect(products[0]).toMatchInlineSnapshot(`
      {
        "idCode": "dg~DBMBmeJYW]gJxZB@jj@@",
        "mf": "C11H16NO2(+)",
        "minSteps": 1,
        "monoisotopicMass": 194.1176,
        "reactions": [
          "eM\`BN\`~b@!eM\`\`fN\`~c@#Q[ Q[#!R@AM?DquRo@ !R@AM?Dqtzo@",
        ],
        "trees": [
          {
            "products": [
              {
                "children": [],
                "flag": true,
                "idCode": "dg~DBMBmeJYW]gJxZB@jj@@",
                "mf": "C11H16NO2(+)",
                "molfile": "
      Actelion Java MolfileCreator 1.0

       14 15  0  0  0  0  0  0  0  0999 V2000
         18.7073   -7.2671   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         19.5677   -7.7768   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         19.5565   -8.7767   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         18.6849   -9.2670   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         18.6737  -10.2669   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         17.8021  -10.7572   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         16.9417  -10.2475   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         16.9529   -9.2475   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         17.8245   -8.7573   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         16.1911  -10.9082   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
         16.5876  -11.8263   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         17.5832  -11.7329   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
         20.4444   -7.2836   -0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
         21.3075   -7.7768   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        3  4  1  0  0  0  0
        4  5  2  0  0  0  0
        5  6  1  0  0  0  0
        6  7  2  0  0  0  0
        7  8  1  0  0  0  0
        8  9  2  0  0  0  0
        4  9  1  0  0  0  0
        7 10  1  0  0  0  0
       10 11  1  0  0  0  0
       11 12  1  0  0  0  0
        6 12  1  0  0  0  0
       13  2  1  0  0  0  0
       13 14  1  0  0  0  0
      M  CHG  1  13   1
      M  END
      ",
              },
            ],
            "reactant": {
              "idCode": "dg~D@MBdie]v\\\\kahHBjh@@",
              "mf": "C11H15NO2",
              "molfile": "
      Actelion Java MolfileCreator 1.0

       14 15  0  0  0  0  0  0  0  0999 V2000
          1.7321   -1.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          1.7321   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          2.5981   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          3.4641   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          4.3301   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          5.1962   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          5.1962   -1.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          4.3301   -2.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          3.4641   -1.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          6.1472   -1.8090   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
          6.7350   -1.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          6.1472   -0.1910   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
          0.8660   -0.0000   -0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
          0.0000   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        3  4  1  0  0  0  0
        4  5  2  0  0  0  0
        5  6  1  0  0  0  0
        6  7  2  0  0  0  0
        7  8  1  0  0  0  0
        8  9  2  0  0  0  0
        4  9  1  0  0  0  0
        7 10  1  0  0  0  0
       10 11  1  0  0  0  0
       11 12  1  0  0  0  0
        6 12  1  0  0  0  0
        2 13  1  0  0  0  0
       13 14  1  0  0  0  0
      M  END
      ",
            },
            "reaction": {
              "Label": "Ionization",
              "rxnCode": "eM\`BN\`~b@!eM\`\`fN\`~c@#Q[ Q[#!R@AM?DquRo@ !R@AM?Dqtzo@",
            },
          },
        ],
      }
    `);
    expect(trees).toMatchSnapshot();
  });
});
