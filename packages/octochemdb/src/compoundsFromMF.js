import { fetchJSON } from './utils/fetchJSON.js';
import { postFetchJSON } from './utils/postFetchJSON.js';

/**
 * Retrieve a list of molecular formulas from one or many monoisotopic mass that are present in pubchem compound.
 * in the database and a monoisotopic mass.
 * @param {string} mf - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.fields] - Fields to retrieve from the database
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {string} [options.route='mfs/v1/fromMF'] - URL of the webservice
 * @param {string} [options.titleCompoundsURL='titleCompounds/v1/ids'] - URL of the webservice
 * @param {number} [options.limit=50000] - Maximal number of entries to return
 */

export async function compoundsFromMF(mf, options = {}) {
  const {
    route = 'compounds/v1/fromMF',
    baseURL = 'https://octochemdb.cheminfo.org/',
    limit = 50000,
    fields = 'data.ocl.idCode,data.ocl.index,data.iupac',
  } = options;

  const searchParams = {
    limit,
    fields,
    mf,
  };

  const realURL = new URL(route, baseURL).toString();
  const { data } = await fetchJSON(realURL, searchParams);

  const ids = data.map((datum) => datum._id);

  const titles = await getTitles(ids, options);

  for (const datum of data) {
    if (titles[datum._id]) datum.data.title = titles[datum._id];
  }

  data.sort(
    (a, b) =>
      (a.data.title?.length || Number.MAX_SAFE_INTEGER) -
      (b.data.title?.length || Number.MAX_SAFE_INTEGER),
  );

  return data;
}

async function getTitles(ids, options) {
  let {
    titleCompoundsURL = 'titleCompounds/v1/ids',
    baseURL = 'https://octochemdb.cheminfo.org/',
  } = options;
  if (process.env.NODE_ENV === 'test') {
    baseURL = 'https://octochemdb.cheminfo.org/';
  }
  const titlesURL = new URL(titleCompoundsURL, baseURL).toString();
  const { data: titlesArray } = await postFetchJSON(titlesURL, { ids });
  const titles = {};
  for (const entry of titlesArray) {
    if (entry.data.title.match(/CID /)) continue;
    titles[entry._id] = entry.data.title;
  }

  return titles;
}
