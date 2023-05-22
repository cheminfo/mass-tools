import { fetchJSON } from './utils/fetchJSON.js';
import { postFetchJSON } from './utils/postFetchJSON.js';

/**
 * Search for a specific natural or active compound using its ID
 * @param {object} [options={}]
 * @param {string} [options.fields='_id,data'] - List of fields to retrieve
 * @param {string} [options.url='activesOrNaturals/v1/id'] - URL of the webservice
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 */

export async function activeOrNaturalDetails(id, options = {}) {
  const {
    url = 'activesOrNaturals/v1/id',
    baseURL = 'https://octochemdb.cheminfo.org/',
    fields = '_id,data',
  } = options;

  const activeOrNatural = await fetchActiveOrNatural(id, {
    url: new URL(url, baseURL).toString(),
    fields,
  });

  await appendMedline(activeOrNatural, { baseURL });
  await appendCompounds(activeOrNatural, { baseURL });
  await appendActivities(activeOrNatural, { baseURL });
  await appendPatents(activeOrNatural, { baseURL });

  return activeOrNatural;
}

async function fetchActiveOrNatural(id, options) {
  const { fields, url } = options;
  const searchParams = {}
  searchParams.id = id
  if (fields) {
    searchParams.fields = fields
  }
  return (await fetchJSON(url, searchParams)).data;
}

async function appendMedline(activeOrNatural, options) {
  const { baseURL } = options;
  const url = new URL('pubmeds/v1/ids', baseURL).toString();

  const pubmedIDs = activeOrNatural.data.pubmeds?.map((pubmed) => pubmed.$id);
  if (!pubmedIDs) return;

  const searchParams = {}
  searchParams.ids = pubmedIDs.join(',')
  const medlines = {};
  (await fetchJSON(url, searchParams)).data.forEach(
    (medline) => {
      medlines[medline._id] = medline.data;
    },
  );

  for (let pubmed of activeOrNatural.data.pubmeds) {
    pubmed.data = medlines[pubmed.$id];
    pubmed.url = ` https://pubmed.ncbi.nlm.nih.gov/${pubmed.$id}`;
  }
}

async function appendActivities(activeOrNatural, options) {
  const { baseURL } = options;

  if (!activeOrNatural.data.activities) return;

  // activities may come from 3 different tables
  const activities = {};

  // TODO dbRef level will be removed
  activeOrNatural.data.activities = activeOrNatural.data.activities.map(
    (activity) => activity.dbRef,
  );

  for (let activity of activeOrNatural.data.activities) {
    if (!activities[activity.$ref]) activities[activity.$ref] = [];
    activities[activity.$ref].push(activity);
  }

  for (const [collection, group] of Object.entries(activities)) {
    const url = new URL(`${collection}/v1/ids`, baseURL).toString();
    const searchParams = {}
    searchParams.ids = group.map((activity) => activity.$id).join(',')

    const data = {};
    (await fetchJSON(url, searchParams)).data.forEach(
      (activity) => {
        data[activity._id] = activity.data;
      },
    );
    for (let activity of group) {
      activity.data = data[activity.$id];
    }
  }

  for (const activity of activeOrNatural.data.activities) {
    appendActivityURL(activity);
  }
}

async function appendCompounds(activeOrNatural, options) {
  const { baseURL } = options;
  const url = new URL('compounds/v1/ids', baseURL).toString();

  if (!activeOrNatural.data.compounds) return;

  const compoundIDss = activeOrNatural.data.compounds.map(
    (compouund) => compouund.$id,
  );

  const searchParams = {}
  searchParams.ids = compoundIDss.join(',')

  const compounds = {};
  (await fetchJSON(url, searchParams)).data.forEach(
    (compound) => {
      compounds[compound._id] = compound.data;
    },
  );
  for (let compound of activeOrNatural.data.compounds) {
    compound.data = compounds[compound.$id];
  }
}

async function appendPatents(activeOrNatural, options) {
  const { baseURL } = options;

  if (!activeOrNatural.data.patents) return;

  // activities may come from 3 different tables

  const url = new URL('patents/v1/ids', baseURL).toString();

  const patentsIDs = activeOrNatural.data.patents.map((patent) => patent.$id);

  const searchParams = {}
  searchParams.ids = patentsIDs.join(',')

  const patents = {};
  (
    await postFetchJSON(url, searchParams)
  ).data.forEach((patent) => {
    patents[patent._id] = patent.data;
  });
  for (let patent of activeOrNatural.data.patents) {
    patent.data = patents[patent.$id];
    patent.url = `https://pubchem.ncbi.nlm.nih.gov/patent/${patent.$id}`;
  }
}

function appendActivityURL(activity) {
  const kind = activity.$ref;
  const id = activity.$id;
  switch (kind) {
    case 'bioassays':
      activity.url = `https://pubchem.ncbi.nlm.nih.gov/bioassay/${id.replace(
        /.*_/,
        '',
      )}`;
      break;
    case 'npasses':
      activity.url = `http://bidd.group/NPASS/compound.php?compoundID=${id}`;
      break;
    case 'cmaups':
      activity.url = `http://bidd.group/CMAUP/ingredient.php?ingredient=${id}`;
      break;
    case 'coconuts':
      activity.url = `https://coconut.naturalproducts.net/compound/coconut_id/${id}`;
      break;
    case 'lotuses':
      activity.url = `https://lotus.naturalproducts.net/compound/lotus_id/${id}`;
      break;
    case 'npAtlases':
      activity.url = `https://www.npatlas.org/explore/compounds/${id}`;
      break;
    default:
      console.error('Unknown activity kind, can not appendActivityURL', kind);
      break;
  }
}
