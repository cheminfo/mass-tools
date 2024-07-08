import { readFileSync } from 'node:fs';
import path from 'node:path';

import { normalizeActivities } from '../../utils/normalizeActivities.js';
import { ActiveOrNaturalSummarizer } from '../ActiveOrNaturalSummarizer.js';

describe('ActiveOrNaturalSummarizer', () => {
  it('multiple terms', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
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

    expect(result.data.pubmeds[0].data.article.title).toMatchInlineSnapshot(
      '"Apoptosis induced by an endogenous neurotoxin, N-methyl(R)salsolinol, in dopamine neurons."',
    );

    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results).toMatchSnapshot();
  });

  it('empty terms', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
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

    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results).toMatchSnapshot();
  });

  it('empty terms, no options', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('');
    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results).toMatchSnapshot();
  });
  it('terms:ethylene', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('ethylene');
    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results.data.pubmeds).toHaveLength(0);
    expect(results.data.activities).toHaveLength(0);

    expect(results).toMatchSnapshot();
  });
  it('terms:inhibition', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('inhibition');
    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results.data.activities[0].data.assay).toMatchInlineSnapshot(
      '"Inhibition : 10.75 %"',
    );

    expect(results).toMatchSnapshot();
  });
  it('terms:Apoptosis', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('Apoptosis');
    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results.data.pubmeds[0].data.article.title).toMatchInlineSnapshot(
      '"Apoptosis induced by an endogenous neurotoxin, N-methyl(R)salsolinol, in dopamine neurons."',
    );

    expect(results.data.pubmeds[0].data.article.title).toContain('Apoptosis');

    expect(results).toMatchSnapshot();
  });
  it('abstractsLimit', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
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
      readFileSync(path.join(__dirname, './details.json'), 'utf8'),
    );
    normalizeActivities(entry);

    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);
    const result = await activeOrNaturalSummarizer.summarize('Caryophyllales');
    const results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results.data.taxonomies).toMatchSnapshot();
  });
  it('taxonomies Bis', async () => {
    const entry = JSON.parse(
      readFileSync(path.join(__dirname, './detailsTestBis.json'), 'utf8'),
    );
    normalizeActivities(entry);
    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);

    const result = await activeOrNaturalSummarizer.summarize('Emericellopsis');
    let results = recursiveRemoveScore(result);
    sliceResult(results);

    expect(results.data.taxonomies).toMatchSnapshot();
  });
});

// recursive remove score key from object
function recursiveRemoveScore(obj) {
  for (let k in obj) {
    if (k === 'score') {
      delete obj[k];
    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
      recursiveRemoveScore(obj[k]);
    }
  }
  return obj;
}

function sliceResult(entry) {
  if (entry.data?.activities.length > 2) {
    entry.data.activities = entry.data.activities.slice(0, 2);
  }
  if (entry.data?.pubmeds.length > 2) {
    entry.data.pubmeds = entry.data.pubmeds.slice(0, 2);
  }
  if (entry.data?.patents.length > 2) {
    entry.data.patents = entry.data.patents.slice(0, 2);
  }
  if (entry.data?.taxonomies.length > 2) {
    entry.data.taxonomies = entry.data.taxonomies.slice(0, 2);
  }
}
