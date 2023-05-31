export function summarizeEmptyTerms(
  activities,
  patents,
  pubmeds,
  taxonomies,
  options,
) {
  activities = activities.slice();
  patents = patents.slice();
  pubmeds = pubmeds.slice();
  // PATENTS
  const patentsMaxNbEntries = options?.patents?.maxNbEntries || 100;
  patents.sort((a, b) => {
    const nbCompoundsEntryA = a.data.nbCompounds + 2 || 2;
    const nbCompoundsEntryB = b.data.nbCompounds + 2 || 2;
    return 1 / Math.log2(nbCompoundsEntryB) - 1 / Math.log2(nbCompoundsEntryA);
  });
  if (patents.length > patentsMaxNbEntries) {
    patents.length = patentsMaxNbEntries;
  }
  // PUBMEDS
  const pubmedsMaxNbEntries = options?.pubmeds?.maxNbEntries || 100;

  pubmeds.sort((a, b) => {
    const nbCompoundsEntryA = a.data.compounds.length + 2 || 2;
    const nbCompoundsEntryB = b.data.compounds.length + 2 || 2;
    return 1 / Math.log2(nbCompoundsEntryB) - 1 / Math.log2(nbCompoundsEntryA);
  });
  if (pubmeds.length > pubmedsMaxNbEntries) {
    pubmeds.length = pubmedsMaxNbEntries;
  }
  // ACTIVITIES
  const activitiesMaxNbEntries = options?.activities?.maxNbEntries || 100;
  if (activities.length > activitiesMaxNbEntries) {
    activities.length = activitiesMaxNbEntries;
  }
  // TAXONOMIES
  const taxonomiesMaxNbEntries = options?.taxonomies?.maxNbEntries || 50;
  if (taxonomies.length > taxonomiesMaxNbEntries) {
    taxonomies.length = activitiesMaxNbEntries;
  }

  return { activities, patents, pubmeds, taxonomies };
}
