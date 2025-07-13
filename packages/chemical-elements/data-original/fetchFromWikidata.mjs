import wikiBase from 'wikibase-sdk';

const wikidata = wikiBase({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
});

const url = wikidata.sparqlQuery(`
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    
    SELECT ?element ?symbol ?neutrons ?protons ?atomicNumber ?halfLife ?halfLife_unitLabel ?decaysToLabel ?decaysModel ?decaysProportion
    WHERE
    {
      ?element wdt:P31 wd:Q11344;
               wdt:P1086 ?protons;
               wdt:P246 ?symbol.
      ?isotope wdt:P279 ?element;
               wdt:P1086 ?atomicNumber;
               p:P2114 ?halfLife_statement;
               p:P816 ?decaysTo_statement;
               wdt:P1148 ?neutrons.
      ?halfLife_statement ps:P2114 ?halfLife;
                          psv:P2114/wikibase:quantityUnit ?halfLife_unit .
      OPTIONAL { ?halfLife_statement pq:P817 ?halfLife_unit .}
      
    
      ?decaysTo_statement ps:P816 ?decaysTo .
      OPTIONAL { ?decaysTo_statement pq:P817 ?decaysMode .}
      OPTIONAL { ?decaysTo_statement pq:P1107 ?decaysProportion .}
      
      SERVICE wikibase:label {
         bd:serviceParam wikibase:language "en" .
      }
    }
    ORDER BY ?protons
    LIMIT 10
       `);

const result = await fetch(url, {
  headers: {
    'User-Agent': 'cheminfo/mass-tools',
  },
});
const data = await result.text();

// eslint-disable-next-line no-console
console.log(data);
