'use strict';

let fetch = require('cross-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
let Wikidata = require('wikidata-sdk');

async function compileIsotopes() {
  let url = Wikidata.sparqlQuery(`
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

  let result = await fetch(url);
  let data = await result.text();

  // eslint-disable-next-line no-console
  console.log(data);

  return true;
}

compileIsotopes();
