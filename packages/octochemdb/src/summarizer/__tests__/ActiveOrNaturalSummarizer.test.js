import { readFileSync } from 'fs';
import { join } from 'path';

import { normalizeActivities } from '../../utils/normalizeActivities.js';
import { ActiveOrNaturalSummarizer } from '../ActiveOrNaturalSummarizer.js';

describe('ActiveOrNaturalSummarizer', () => {
  it('multiple terms', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);
    const options = {
      pubmeds: {
        queryFields: ['title', 'abstract'],
      },
    };
    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(
      entry,
      options,
    );

    const result = await activeOrNaturalSummarizer.summarize(
      'Apoptosis ethylene inhibition',
    );
    expect(result.data.patents[0].score).toBeGreaterThan(
      result.data.patents[1].score,
    );

    expect(result.data.pubmeds[0].data.article.title).toMatchInlineSnapshot(
      '"Apoptosis induced by an endogenous neurotoxin, N-methyl(R)salsolinol, in dopamine neurons."',
    );
    result.data.patents.forEach((patent) => {
      // round score to 2 decimals
      patent.score = Math.round(patent.score * 100) / 100;
    });
    result.data.pubmeds.forEach((pubmed) => {
      // round score to 2 decimals
      pubmed.score = Math.round(pubmed.score * 100) / 100;
    });
    result.data.activities.forEach((activity) => {
      // round score to 2 decimals
      activity.score = Math.round(activity.score * 100) / 100;
    });
    expect(result).toMatchSnapshot();
  });

  it('empty terms', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const options = {
      activities: {
        maxNbEntries: 2,
      },
      patents: {
        maxNbEntries: 50,
      },
      pubmeds: {
        maxNbEntries: 65,
      },
    };
    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(
      entry,
      options,
    );
    const result = await activeOrNaturalSummarizer.summarize('');

    expect(result.data.pubmeds[0].data.compounds.length).toBeLessThan(
      result.data.pubmeds[1].data.compounds.length,
    );
    expect(result.data.patents.length).toBe(options.patents.maxNbEntries);
    expect(result.data.pubmeds.length).toBe(options.pubmeds.maxNbEntries);
    expect(result.data.activities.length).toBe(options.activities.maxNbEntries);

    expect(result).toMatchSnapshot();
  });

  it('empty terms, no options', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('');

    expect(result.data.pubmeds[0].data.compounds.length).toBeLessThan(
      result.data.pubmeds[1].data.compounds.length,
    );

    expect(result).toMatchSnapshot();
  });
  it('terms:ethylene', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('ethylene');

    expect(result.data.patents[0].score).toBeGreaterThan(
      result.data.patents[1].score,
    );

    expect(result.data.pubmeds).toHaveLength(0);
    expect(result.data.activities).toHaveLength(0);
    result.data.patents.forEach((patent) => {
      // round score to 2 decimals
      patent.score = Math.round(patent.score * 100) / 100;
    });
    result.data.pubmeds.forEach((pubmed) => {
      // round score to 2 decimals
      pubmed.score = Math.round(pubmed.score * 100) / 100;
    });
    result.data.activities.forEach((activity) => {
      // round score to 2 decimals
      activity.score = Math.round(activity.score * 100) / 100;
    });
    expect(result).toMatchSnapshot();
  });
  it('terms:inhibition', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('inhibition');
    expect(result.data.activities[0].data.assay).toMatchInlineSnapshot(
      '"Inhibition : 10.75 %"',
    );
    expect(result.data.activities[0].score).toMatchInlineSnapshot(
      '1.2384627327427395',
    );
    result.data.patents.forEach((patent) => {
      // round score to 2 decimals
      patent.score = Math.round(patent.score * 100) / 100;
    });
    result.data.pubmeds.forEach((pubmed) => {
      // round score to 2 decimals
      pubmed.score = Math.round(pubmed.score * 100) / 100;
    });
    result.data.activities.forEach((activity) => {
      // round score to 2 decimals
      activity.score = Math.round(activity.score * 100) / 100;
    });
    expect(result).toMatchSnapshot();
  });
  it('terms:Apoptosis', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('Apoptosis');

    expect(result.data.pubmeds[0].data.article.title).toMatchInlineSnapshot(
      '"Apoptosis induced by an endogenous neurotoxin, N-methyl(R)salsolinol, in dopamine neurons."',
    );

    expect(result.data.pubmeds[0].data.article.title).toContain('Apoptosis');
    result.data.patents.forEach((patent) => {
      // round score to 2 decimals
      patent.score = Math.round(patent.score * 100) / 100;
    });
    result.data.pubmeds.forEach((pubmed) => {
      // round score to 2 decimals
      pubmed.score = Math.round(pubmed.score * 100) / 100;
    });
    result.data.activities.forEach((activity) => {
      // round score to 2 decimals
      activity.score = Math.round(activity.score * 100) / 100;
    });
    expect(result).toMatchSnapshot();
  });
  it('abstractsLimit', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);
    const options = {
      pubmeds: {
        abstractsLimit: 2,
      },
      patents: {
        abstractsLimit: 2,
      },
    };
    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(
      entry,
      options,
    );
    // terms present only on abstracts: "alternative", "pipeline"
    const result = await activeOrNaturalSummarizer.summarize(
      'alternative pipeline Potency',
    );
    expect(result.data.pubmeds).toHaveLength(0);
    expect(result.data.patents).toHaveLength(0);
    expect(result.data.activities).toHaveLength(3);
  });
  it('taxonomies', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('Caryophyllales');
    result.data.patents.forEach((patent) => {
      // round score to 2 decimals
      patent.score = Math.round(patent.score * 100) / 100;
    });
    result.data.pubmeds.forEach((pubmed) => {
      // round score to 2 decimals
      pubmed.score = Math.round(pubmed.score * 100) / 100;
    });
    result.data.activities.forEach((activity) => {
      // round score to 2 decimals
      activity.score = Math.round(activity.score * 100) / 100;
    });
    expect(result.data.taxonomies).toMatchSnapshot();
    expect(result.data.taxonomies[0]).toMatchInlineSnapshot(`
      {
        "class": "Magnoliopsida",
        "dbRef": {
          "$id": "LTS0005803",
          "$ref": "lotuses",
          "data": {
            "iupacName": "(1S)-7-methoxy-1-methyl-1,2,3,4-tetrahydroisoquinolin-6-ol",
            "ocl": {
              "coordinates": "!BbGvw__y?bOrw?Xa}bGvH@hc|bGvH__x@bOp",
              "idCode": "dg~D@MBdin]V^G[hHBjbbX@",
              "noStereoTautomerID": "dg~D@MBdin]V^G[jjjjj@MQSFXKEX[GXgExRLjmcxX~F@",
            },
            "taxonomies": [
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "LTS0005803",
                  "$ref": "lotuses",
                  "url": "https://lotus.naturalproducts.net/compound/lotus_id/LTS0005803",
                },
                "family": "Chenopodiaceae",
                "genus": "Xylosalsola",
                "kingdom": "Viridiplantae",
                "order": "Caryophyllales",
                "phylum": "Streptophyta",
                "species": "Xylosalsola paletzkiana",
                "superkingdom": "Eukaryota",
              },
            ],
          },
          "url": "https://lotus.naturalproducts.net/compound/lotus_id/LTS0005803",
        },
        "family": "Chenopodiaceae",
        "genus": "Xylosalsola",
        "kingdom": "Viridiplantae",
        "order": "Caryophyllales",
        "phylum": "Streptophyta",
        "score": 0.6614957054446614,
        "species": "Xylosalsola paletzkiana",
        "superkingdom": "Eukaryota",
      }
    `);
  });
});
