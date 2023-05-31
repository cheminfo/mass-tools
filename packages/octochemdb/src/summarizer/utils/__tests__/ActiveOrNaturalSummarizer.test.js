import { readFileSync } from 'fs';
import { join } from 'path';

import { normalizeActivities } from '../../../utils/normalizeActivities.js';
import { ActiveOrNaturalSummarizer } from '../../ActiveOrNaturalSummarizer.js';

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
      '1.172060050051001',
    );
    expect(result).toMatchSnapshot();
  });
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
  expect(result).toMatchSnapshot();
});
