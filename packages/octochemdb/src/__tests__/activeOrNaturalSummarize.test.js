import { readFileSync } from 'fs';
import { join } from 'path';

import { activeOrNaturalSummarize } from '../activeOrNaturalSummarize.js';

describe('activeOrNaturalSummarize', () => {


  it.only('empty term', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );

    const result = await activeOrNaturalSummarize(entry, '');
    expect(result.data.patents[0].score).toBeGreaterThan(
      result.data.patents[1].score,
    );

    expect(result.data.patents).toHaveLength(0);
    expect(result.data.pubmeds).toHaveLength(0);
    expect(result.data.activities).toHaveLength(0);
  });

  it('term:anti', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );

    const result = await activeOrNaturalSummarize(entry, 'ethylene');
    expect(result.data.patents[0].score).toBeGreaterThan(
      result.data.patents[1].score,
    );

    expect(result.data.pubmeds).toHaveLength(0);
    expect(result.data.activities).toHaveLength(0);
    expect(result).toMatchSnapshot();
  });
  it('term:inhibition', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );

    const result = await activeOrNaturalSummarize(entry, 'inhibition');
    expect(result.data.activities[0].assay).toMatchInlineSnapshot(
      '"Inhibition : 10.75 %"',
    );
    expect(result.data.activities[0].score).toMatchInlineSnapshot(
      '1.172060050051001',
    );
    expect(result).toMatchSnapshot();
  });
});
it('term:Apoptosis', async () => {
  const entry = JSON.parse(
    readFileSync(join(__dirname, './details.json'), 'utf8'),
  );

  const result = await activeOrNaturalSummarize(entry, 'Apoptosis');

  expect(result.data.pubmeds[0].data.article.title).toMatchInlineSnapshot(
    '"Apoptosis induced by an endogenous neurotoxin, N-methyl(R)salsolinol, in dopamine neurons."',
  );

  expect(result.data.pubmeds[0].data.article.title).toContain('Apoptosis');
  expect(result).toMatchSnapshot();
});
