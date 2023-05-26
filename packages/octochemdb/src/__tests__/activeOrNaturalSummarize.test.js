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
      tolerance: 1,

      relevance: {
        k: 1.2,
        b: 0.75,
        d: 0.5,
      },
    };
    const result = await activeOrNaturalSummarize(entry, options);
    expect(result[0].score).toBeGreaterThan(result[1].score);
    expect(result[1].document.url).toBe(
      'https://pubchem.ncbi.nlm.nih.gov/patent/CN-107043371-A',
    );
    expect(result[5].document.meshHeadings).toMatchInlineSnapshot(`
      [
        "Antioxidants",
        "Antiparkinson Agents",
        "Apoptosis",
        "DNA Damage",
        "DNA Fragmentation",
        "Humans",
        "Neurotoxins",
        "Parkinson Disease",
        "Salsoline Alkaloids",
        "Selegiline",
        "Structure-Activity Relationship",
        "Tetrahydroisoquinolines",
        "Tumor Cells, Cultured",
      ]
    `);
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
      tolerance: 1,

      relevance: {
        k: 1.2,
        b: 0.75,
        d: 0.5,
      },
    };

    const result = await activeOrNaturalSummarize(entry, options);
    expect(result[0].document.assay).toMatchInlineSnapshot(
      '"Inhibition : 10.75 %"',
    );
    expect(result).toMatchSnapshot();
  });
});
it('term:Apoptosis', async () => {
  const entry = JSON.parse(
    readFileSync(join(__dirname, './details.json'), 'utf8'),
  );

  let options = {
    term: 'Apoptosis',
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
    tolerance: 1,

    relevance: {
      k: 1.2,
      b: 0.75,
      d: 0.5,
    },
  };

  const result = await activeOrNaturalSummarize(entry, options);
  expect(result[0].document.title).toMatchInlineSnapshot(
    '"Apoptosis induced by an endogenous neurotoxin, N-methyl(R)salsolinol, in dopamine neurons."',
  );
  expect(result[0].document.meshHeadings).toContain('Apoptosis');
  expect(result).toMatchSnapshot();
});
