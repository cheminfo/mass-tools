import { readFileSync } from 'fs';
import { join } from 'path';

import { activeOrNaturalSummarize } from '../activeOrNaturalSummarize.js';

describe('activeOrNaturalSummarize', () => {
  it('term:anti', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );

    let options = {
      term: 'anti',
      fieldsPubMed: ['title', 'abstract', 'meshHeadings'],
      boostPubMed: {
        title: 2,
        abstract: 1,
        meshHeadings: 1,
      },
      fieldsPatent: ['title', 'abstract'],
      boostPatent: {
        title: 2,
        abstract: 1,
      },
      fieldsActivities: ['assay'],

      relevance: {
        k: 1.2,
        b: 0.75,
        d: 0.5,
      },
    };

    const result = await activeOrNaturalSummarize(entry, options);
    expect(result).toMatchSnapshot();
  });
  it('term:inhibition', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );

    let options = {
      term: 'inhibition',
      fieldsPubMed: ['title', 'abstract', 'meshHeadings'],
      boostPubMed: {
        title: 2,
        abstract: 1,
        meshHeadings: 1,
      },
      fieldsPatent: ['title', 'abstract'],
      boostPatent: {
        title: 2,
        abstract: 1,
      },
      fieldsActivities: ['assay'],

      relevance: {
        k: 1.2,
        b: 0.75,
        d: 0.5,
      },
    };

    const result = await activeOrNaturalSummarize(entry, options);
    expect(result).toMatchSnapshot();
  });
});
