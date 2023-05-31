import { create, insert } from '@orama/orama';

export async function getTaxonomiesDB(taxonomies, options = {}) {
  const {
    queryFields = [
      'superKingdom',
      'kingdom',
      'phylum',
      'class',
      'order',
      'family',
      'genus',
      'species',
    ],
  } = options;
  const taxonomiesDB = await create({
    schema: {
      $id: 'string',
      ...(queryFields.includes('superKingdom')
        ? { superKingdom: 'string' }
        : null),
      ...(queryFields.includes('kingdom') ? { kingdom: 'string' } : null),
      ...(queryFields.includes('phylum') ? { phylum: 'string' } : null),
      ...(queryFields.includes('class') ? { class: 'string' } : null),
      ...(queryFields.includes('order') ? { order: 'string' } : null),
      ...(queryFields.includes('family') ? { family: 'string' } : null),
      ...(queryFields.includes('genus') ? { genus: 'string' } : null),
      ...(queryFields.includes('species') ? { species: 'string' } : null),
    },
  });
  for (const taxonomy of taxonomies) {
    let level = Object.keys(taxonomy);
    let taxonomyEntry = {
      $id: taxonomy.dbRef.$id,
      ...(level.includes('superKingdom')
        ? { superKingdom: taxonomy.superKingdom }
        : null),
      ...(level.includes('kingdom') ? { kingdom: taxonomy.kingdom } : null),
      ...(level.includes('phylum') ? { phylum: taxonomy.phylum } : null),
      ...(level.includes('class') ? { class: taxonomy.class } : null),
      ...(level.includes('order') ? { order: taxonomy.order } : null),
      ...(level.includes('family') ? { family: taxonomy.family } : null),
      ...(level.includes('genus') ? { genus: taxonomy.genus } : null),
      ...(level.includes('species') ? { species: taxonomy.species } : null),
    };

    await insert(taxonomiesDB, taxonomyEntry);
  }
  return taxonomiesDB;
}
