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
  it('taxonomies Bis', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './detailsTestBis.json'), 'utf8'),
    );
    normalizeActivities(entry);
    const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(entry);

    const result = await activeOrNaturalSummarizer.summarize('Emericellopsis');
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
        "class": "Sordariomycetes",
        "dbRef": {
          "$id": "NPC189903",
          "$ref": "npasses",
          "data": {
            "activities": [
              {
                "assay": "IC12 = 49.0 ug ml-1",
                "assayOrganism": "Saccharomyces cerevisiae",
                "externalRef": "PMID : 541989",
                "targetName": "Saccharomyces cerevisiae",
                "targetOrganism": "Saccharomyces cerevisiae",
                "targetTaxonomies": {
                  "class": "Saccharomycetes",
                  "family": "Saccharomycetaceae",
                  "genus": "Saccharomyces",
                  "kingdom": "Fungi",
                  "order": "Saccharomycetales",
                  "phylum": "Ascomycota",
                  "species": "Saccharomyces cerevisiae",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Organism",
              },
              {
                "assay": "IC12 > 2000.0 ug ml-1",
                "assayOrganism": "Saccharomyces cerevisiae",
                "externalRef": "PMID : 541989",
                "targetName": "Saccharomyces cerevisiae",
                "targetOrganism": "Saccharomyces cerevisiae",
                "targetTaxonomies": {
                  "class": "Saccharomycetes",
                  "family": "Saccharomycetaceae",
                  "genus": "Saccharomyces",
                  "kingdom": "Fungi",
                  "order": "Saccharomycetales",
                  "phylum": "Ascomycota",
                  "species": "Saccharomyces cerevisiae",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Organism",
              },
              {
                "assay": "IC12 > 2000.0 ug ml-1",
                "assayOrganism": "Saccharomyces cerevisiae",
                "externalRef": "PMID : 541989",
                "targetName": "Saccharomyces cerevisiae",
                "targetOrganism": "Saccharomyces cerevisiae",
                "targetTaxonomies": {
                  "class": "Saccharomycetes",
                  "family": "Saccharomycetaceae",
                  "genus": "Saccharomyces",
                  "kingdom": "Fungi",
                  "order": "Saccharomycetales",
                  "phylum": "Ascomycota",
                  "species": "Saccharomyces cerevisiae",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Organism",
              },
              {
                "assay": "Activity = 29.0 %",
                "assayOrganism": "Homo sapiens",
                "externalRef": "PMID : 541989",
                "targetName": "DNA topoisomerase I",
                "targetOrganism": "Homo sapiens",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Hominidae",
                  "genus": "Homo",
                  "kingdom": "Metazoa",
                  "order": "Primates",
                  "phylum": "Chordata",
                  "species": "Homo sapiens",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Individual Protein",
              },
              {
                "assay": "IC50 = 100000.0 nM",
                "assayOrganism": "Mus musculus",
                "externalRef": "PMID : 541989",
                "targetName": "P388",
                "targetOrganism": "Mus musculus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Mus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Mus musculus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
              {
                "assay": "IC50 = 100000.0 nM",
                "assayOrganism": "Mus musculus",
                "externalRef": "PMID : 541989",
                "targetName": "P388",
                "targetOrganism": "Mus musculus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Mus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Mus musculus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
              {
                "assay": "Activity = 111.1 %",
                "assayOrganism": "Rattus norvegicus",
                "externalRef": "PMID : 541990",
                "targetName": "Aorta",
                "targetOrganism": "Rattus norvegicus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Rattus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Rattus norvegicus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Tissue",
              },
              {
                "assay": "Activity = 89.7 %",
                "assayOrganism": "Rattus norvegicus",
                "externalRef": "PMID : 541990",
                "targetName": "Aorta",
                "targetOrganism": "Rattus norvegicus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Rattus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Rattus norvegicus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Tissue",
              },
              {
                "assay": "Activity = 64.0 %",
                "assayOrganism": "Rattus norvegicus",
                "externalRef": "PMID : 541990",
                "targetName": "Aorta",
                "targetOrganism": "Rattus norvegicus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Rattus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Rattus norvegicus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Tissue",
              },
              {
                "assay": "Activity = 112.4 %",
                "assayOrganism": "Rattus norvegicus",
                "externalRef": "PMID : 541991",
                "targetName": "Aorta",
                "targetOrganism": "Rattus norvegicus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Rattus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Rattus norvegicus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Tissue",
              },
              {
                "assay": "Activity = 102.1 %",
                "assayOrganism": "Rattus norvegicus",
                "externalRef": "PMID : 541991",
                "targetName": "Aorta",
                "targetOrganism": "Rattus norvegicus",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Muridae",
                  "genus": "Rattus",
                  "kingdom": "Metazoa",
                  "order": "Rodentia",
                  "phylum": "Chordata",
                  "species": "Rattus norvegicus",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Tissue",
              },
              {
                "assay": "IC50 > 10000.0 nM",
                "assayOrganism": "Homo sapiens",
                "externalRef": "PMID : 541992",
                "targetName": "MCF7",
                "targetOrganism": "Homo sapiens",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Hominidae",
                  "genus": "Homo",
                  "kingdom": "Metazoa",
                  "order": "Primates",
                  "phylum": "Chordata",
                  "species": "Homo sapiens",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
              {
                "assay": "IC50 > 10000.0 nM",
                "assayOrganism": "Homo sapiens",
                "externalRef": "PMID : 541992",
                "targetName": "HCT-116",
                "targetOrganism": "Homo sapiens",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Hominidae",
                  "genus": "Homo",
                  "kingdom": "Metazoa",
                  "order": "Primates",
                  "phylum": "Chordata",
                  "species": "Homo sapiens",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
              {
                "assay": "IC50 > 10000.0 nM",
                "assayOrganism": "Homo sapiens",
                "externalRef": "PMID : 541992",
                "targetName": "HepG2",
                "targetOrganism": "Homo sapiens",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Hominidae",
                  "genus": "Homo",
                  "kingdom": "Metazoa",
                  "order": "Primates",
                  "phylum": "Chordata",
                  "species": "Homo sapiens",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
              {
                "assay": "IC50 > 10000.0 nM",
                "assayOrganism": "Homo sapiens",
                "externalRef": "PMID : 541992",
                "targetName": "HL-60",
                "targetOrganism": "Homo sapiens",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Hominidae",
                  "genus": "Homo",
                  "kingdom": "Metazoa",
                  "order": "Primates",
                  "phylum": "Chordata",
                  "species": "Homo sapiens",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
              {
                "assay": "IC50 > 10000.0 nM",
                "assayOrganism": "Homo sapiens",
                "externalRef": "PMID : 541992",
                "targetName": "MRC5",
                "targetOrganism": "Homo sapiens",
                "targetTaxonomies": {
                  "class": "Mammalia",
                  "family": "Hominidae",
                  "genus": "Homo",
                  "kingdom": "Metazoa",
                  "order": "Primates",
                  "phylum": "Chordata",
                  "species": "Homo sapiens",
                  "superkingdom": "Eukaryota",
                },
                "targetType": "Cell Line",
              },
            ],
            "cid": "177744",
            "ocl": {
              "coordinates": "!B?\`BH@k\\\\BbGw~@Ox@m?vH?K_|bOrw?K_|?\`C~@Ox@m?vw_[mTb@Jw@k\\\\BtmBYpK]}",
              "idCode": "fiwaP@B@bdoTfYeeUWmUYIUcA}eoV\`@@@BbjhB@@",
              "noStereoTautomerID": "fiwaP@B@bdoTfYeeUWmUYIUcA}eoV\`@@@BbjhB@@",
            },
            "taxonomies": [
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Tephroseris",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Tephroseris kirilowii",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Fabaceae",
                "genus": "Hedysarum",
                "kingdom": "Viridiplantae",
                "order": "Fabales",
                "phylum": "Streptophyta",
                "species": "Hedysarum gmelini",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Lecanoromycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Stereocaulaceae",
                "genus": "Stereocaulon",
                "kingdom": "Fungi",
                "order": "Lecanorales",
                "phylum": "Ascomycota",
                "species": "Stereocaulon sterile",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Sordariomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Xylariaceae",
                "genus": "Creosphaeria",
                "kingdom": "Fungi",
                "order": "Xylariales",
                "phylum": "Ascomycota",
                "species": "Creosphaeria sassafras",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Poaceae",
                "genus": "Avena",
                "kingdom": "Viridiplantae",
                "order": "Poales",
                "phylum": "Streptophyta",
                "species": "Avena fatua",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Papaveraceae",
                "genus": "Papaver",
                "kingdom": "Viridiplantae",
                "order": "Ranunculales",
                "phylum": "Streptophyta",
                "species": "Papaver pseudocanescens",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Helenium",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Helenium integrifolium",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Burseraceae",
                "genus": "Bursera",
                "kingdom": "Viridiplantae",
                "order": "Sapindales",
                "phylum": "Streptophyta",
                "species": "Bursera kerberi",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Actinomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Streptomycetaceae",
                "genus": "Streptomyces",
                "order": "Kitasatosporales",
                "phylum": "Actinomycetota",
                "species": "Streptomyces parvisporogenes",
                "superkingdom": "Bacteria",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Fabaceae",
                "genus": "Crotalaria",
                "kingdom": "Viridiplantae",
                "order": "Fabales",
                "phylum": "Streptophyta",
                "species": "Crotalaria stolzii",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Hernandiaceae",
                "genus": "Illigera",
                "kingdom": "Viridiplantae",
                "order": "Laurales",
                "phylum": "Streptophyta",
                "species": "Illigera luzonensis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Artemisia",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Artemisia pectinata",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Ophiuroidea",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteronychidae",
                "genus": "Asteronyx",
                "kingdom": "Metazoa",
                "order": "Euryalida",
                "phylum": "Echinodermata",
                "species": "Asteronyx loveni",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Insecta",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Limoniidae",
                "genus": "Ormosia",
                "kingdom": "Metazoa",
                "order": "Diptera",
                "phylum": "Arthropoda",
                "species": "Ormosia dasycarpa",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Zingiberaceae",
                "genus": "Renealmia",
                "kingdom": "Viridiplantae",
                "order": "Zingiberales",
                "phylum": "Streptophyta",
                "species": "Renealmia alpinia",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Actinomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Micromonosporaceae",
                "genus": "Micromonospora",
                "order": "Micromonosporales",
                "phylum": "Actinomycetota",
                "species": "Micromonospora echinospora",
                "superkingdom": "Bacteria",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Heliotropiaceae",
                "genus": "Euploca",
                "kingdom": "Viridiplantae",
                "order": "Boraginales",
                "phylum": "Streptophyta",
                "species": "Euploca racemosa",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Eurotiomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Aspergillaceae",
                "genus": "Aspergillus",
                "kingdom": "Fungi",
                "order": "Eurotiales",
                "phylum": "Ascomycota",
                "species": "Aspergillus microcysticus",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Menispermaceae",
                "genus": "Sinomenium",
                "kingdom": "Viridiplantae",
                "order": "Ranunculales",
                "phylum": "Streptophyta",
                "species": "Sinomenium acutum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Zingiberaceae",
                "genus": "Curcuma",
                "kingdom": "Viridiplantae",
                "order": "Zingiberales",
                "phylum": "Streptophyta",
                "species": "Curcuma aeruginosa",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Annonaceae",
                "genus": "Annona",
                "kingdom": "Viridiplantae",
                "order": "Magnoliales",
                "phylum": "Streptophyta",
                "species": "Annona cherimola",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Caprifoliaceae",
                "genus": "Valeriana",
                "kingdom": "Viridiplantae",
                "order": "Dipsacales",
                "phylum": "Streptophyta",
                "species": "Valeriana ficariifolia",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Fabaceae",
                "genus": "Baptisia",
                "kingdom": "Viridiplantae",
                "order": "Fabales",
                "phylum": "Streptophyta",
                "species": "Baptisia australis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Celastraceae",
                "genus": "Euonymus",
                "kingdom": "Viridiplantae",
                "order": "Celastrales",
                "phylum": "Streptophyta",
                "species": "Euonymus fortunei",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Hymenothrix",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Hymenothrix wislizeni",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Senecio",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Senecio congestus",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Verbenaceae",
                "genus": "Verbena",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Verbena littoralis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Pinopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Cupressaceae",
                "genus": "Juniperus",
                "kingdom": "Viridiplantae",
                "order": "Cupressales",
                "phylum": "Streptophyta",
                "species": "Juniperus scopulorum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Menispermaceae",
                "genus": "Stephania",
                "kingdom": "Viridiplantae",
                "order": "Ranunculales",
                "phylum": "Streptophyta",
                "species": "Stephania tetrandra",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Piperaceae",
                "genus": "Piper",
                "kingdom": "Viridiplantae",
                "order": "Piperales",
                "phylum": "Streptophyta",
                "species": "Piper brachystachyum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Helichrysum",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Helichrysum fulvum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Caryophyllaceae",
                "genus": "Silene",
                "kingdom": "Viridiplantae",
                "order": "Caryophyllales",
                "phylum": "Streptophyta",
                "species": "Silene viridiflora",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Amaryllidaceae",
                "genus": "Zephyranthes",
                "kingdom": "Viridiplantae",
                "order": "Asparagales",
                "phylum": "Streptophyta",
                "species": "Zephyranthes flava",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Lauraceae",
                "genus": "Ocotea",
                "kingdom": "Viridiplantae",
                "order": "Laurales",
                "phylum": "Streptophyta",
                "species": "Ocotea leucoxylon",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Anthozoa",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Alcyoniidae",
                "genus": "Sarcophyton",
                "kingdom": "Metazoa",
                "order": "Malacalcyonacea",
                "phylum": "Cnidaria",
                "species": "Sarcophyton flexuosum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Thymelaeaceae",
                "genus": "Wikstroemia",
                "kingdom": "Viridiplantae",
                "order": "Malvales",
                "phylum": "Streptophyta",
                "species": "Wikstroemia hainanensis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Lasianthaea",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Lasianthaea podocephala",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Sordariomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Sporocadaceae",
                "genus": "Pestalotiopsis",
                "kingdom": "Fungi",
                "order": "Xylariales",
                "phylum": "Ascomycota",
                "species": "Pestalotiopsis oenotherae",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Annonaceae",
                "genus": "Duguetia",
                "kingdom": "Viridiplantae",
                "order": "Magnoliales",
                "phylum": "Streptophyta",
                "species": "Duguetia surinamensis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Apocynaceae",
                "genus": "Alstonia",
                "kingdom": "Viridiplantae",
                "order": "Gentianales",
                "phylum": "Streptophyta",
                "species": "Alstonia angustiloba",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Pentzia",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Pentzia albida",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Brassicaceae",
                "genus": "Cardamine",
                "kingdom": "Viridiplantae",
                "order": "Brassicales",
                "phylum": "Streptophyta",
                "species": "Cardamine amara",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Sordariomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "genus": "Emericellopsis",
                "kingdom": "Fungi",
                "order": "Hypocreales",
                "phylum": "Ascomycota",
                "species": "Emericellopsis minima",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Polypodiopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Ophioglossaceae",
                "genus": "Botrychium",
                "kingdom": "Viridiplantae",
                "order": "Ophioglossales",
                "phylum": "Streptophyta",
                "species": "Botrychium ternatum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Orobanchaceae",
                "genus": "Boschniakia",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Boschniakia rossica",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Piperaceae",
                "genus": "Piper",
                "kingdom": "Viridiplantae",
                "order": "Piperales",
                "phylum": "Streptophyta",
                "species": "Piper sylvaticum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Ericaceae",
                "genus": "Rhododendron",
                "kingdom": "Viridiplantae",
                "order": "Ericales",
                "phylum": "Streptophyta",
                "species": "Rhododendron mucronulatum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Gutierrezia",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Gutierrezia dracunculoides",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Gastropoda",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Costasiellidae",
                "genus": "Costasiella",
                "kingdom": "Metazoa",
                "phylum": "Mollusca",
                "species": "Costasiella ocellifera",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Nassauvia",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Nassauvia uniflora",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Acanthaceae",
                "genus": "Clinacanthus",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Clinacanthus nutans",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Myrtaceae",
                "genus": "Eucalyptus",
                "kingdom": "Viridiplantae",
                "order": "Myrtales",
                "phylum": "Streptophyta",
                "species": "Eucalyptus albens",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Ranunculaceae",
                "genus": "Delphinium",
                "kingdom": "Viridiplantae",
                "order": "Ranunculales",
                "phylum": "Streptophyta",
                "species": "Delphinium giraldii",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Annonaceae",
                "genus": "Xylopia",
                "kingdom": "Viridiplantae",
                "order": "Magnoliales",
                "phylum": "Streptophyta",
                "species": "Xylopia championii",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Actinomycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Streptomycetaceae",
                "genus": "Streptomyces",
                "order": "Kitasatosporales",
                "phylum": "Actinomycetota",
                "species": "Streptomyces melanogenes",
                "superkingdom": "Bacteria",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Lauraceae",
                "genus": "Litsea",
                "kingdom": "Viridiplantae",
                "order": "Laurales",
                "phylum": "Streptophyta",
                "species": "Litsea sericea",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Apiaceae",
                "genus": "Selinum",
                "kingdom": "Viridiplantae",
                "order": "Apiales",
                "phylum": "Streptophyta",
                "species": "Selinum libanotis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Ranunculaceae",
                "genus": "Beesia",
                "kingdom": "Viridiplantae",
                "order": "Ranunculales",
                "phylum": "Streptophyta",
                "species": "Beesia calthifolia",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Caryophyllaceae",
                "genus": "Stellaria",
                "kingdom": "Viridiplantae",
                "order": "Caryophyllales",
                "phylum": "Streptophyta",
                "species": "Stellaria media",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Florideophyceae",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Bonnemaisoniaceae",
                "genus": "Delisea",
                "order": "Bonnemaisoniales",
                "phylum": "Rhodophyta",
                "species": "Delisea elegans",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Rubiaceae",
                "genus": "Coffea",
                "kingdom": "Viridiplantae",
                "order": "Gentianales",
                "phylum": "Streptophyta",
                "species": "Coffea liberica",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Myrtaceae",
                "genus": "Psidium",
                "kingdom": "Viridiplantae",
                "order": "Myrtales",
                "phylum": "Streptophyta",
                "species": "Psidium acutangulum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Melampodium",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Melampodium leucanthum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Asteraceae",
                "genus": "Baccharis",
                "kingdom": "Viridiplantae",
                "order": "Asterales",
                "phylum": "Streptophyta",
                "species": "Baccharis grandicapitulata",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Lecanoromycetes",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Lobariaceae",
                "genus": "Pseudocyphellaria",
                "kingdom": "Fungi",
                "order": "Peltigerales",
                "phylum": "Ascomycota",
                "species": "Pseudocyphellaria australiensis",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Fabaceae",
                "genus": "Lupinus",
                "kingdom": "Viridiplantae",
                "order": "Fabales",
                "phylum": "Streptophyta",
                "species": "Lupinus cosentinii",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Lamiaceae",
                "genus": "Sideritis",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Sideritis dasygnaphala",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Lamiaceae",
                "genus": "Clerodendrum",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Clerodendrum trichotomum",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Florideophyceae",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Gigartinaceae",
                "genus": "Mazzaella",
                "order": "Gigartinales",
                "phylum": "Rhodophyta",
                "species": "Mazzaella laminarioides",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Rhizophoraceae",
                "genus": "Pellacalyx",
                "kingdom": "Viridiplantae",
                "order": "Malpighiales",
                "phylum": "Streptophyta",
                "species": "Pellacalyx axillaris",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Oleaceae",
                "genus": "Phillyrea",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Phillyrea latifolia",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Myricaceae",
                "genus": "Morella",
                "kingdom": "Viridiplantae",
                "order": "Fagales",
                "phylum": "Streptophyta",
                "species": "Morella pensylvanica",
                "superkingdom": "Eukaryota",
              },
              {
                "class": "Magnoliopsida",
                "dbRef": {
                  "$id": "NPC189903",
                  "$ref": "npasses",
                  "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
                },
                "family": "Lamiaceae",
                "genus": "Phlomis",
                "kingdom": "Viridiplantae",
                "order": "Lamiales",
                "phylum": "Streptophyta",
                "species": "Phlomis crinita",
                "superkingdom": "Eukaryota",
              },
            ],
          },
          "url": "http://bidd.group/NPASS/compound.php?compoundID=NPC189903",
        },
        "genus": "Emericellopsis",
        "kingdom": "Fungi",
        "order": "Hypocreales",
        "phylum": "Ascomycota",
        "score": 9.391469811018718,
        "species": "Emericellopsis minima",
        "superkingdom": "Eukaryota",
      }
    `);
  });
});
