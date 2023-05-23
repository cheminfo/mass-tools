import { appendAllDBRefs } from "./appendAllDBRefs.js"
import { postFetchJSON } from "./postFetchJSON.js"

/**
 * Load the DBrefs and create a new property `data` for each DBRef
 * @param {any} object
 * @param {object} [options={}]
 * @param {string[]|undefined} [options.collections] - List of collections to include
 * @param {boolean} [options.force=false] - Force the inclusion of the data even if it is already present
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 */
export async function includeDBRefs(object, options = {}) {
  const {
    collections,
    force = false,
    baseURL = 'https://octochemdb.cheminfo.org/',
  } = options
  let allDBRefs = []
  appendAllDBRefs(object, allDBRefs)
  if (collections) {
    allDBRefs = allDBRefs.filter((dbRef) => collections.includes(dbRef.$ref))
  }
  if (!force) {
    allDBRefs = allDBRefs.filter((dbRef) => !dbRef.data)
  }
  const groups = groupsByCollection(allDBRefs)
  const promises = []
  for (const [collection, entries] of Object.entries(groups)) {
    promises.push(addDataForOneCollection(collection, baseURL, entries))
  }
  await Promise.allSettled(promises)
}

async function addDataForOneCollection(collection, baseURL, entries) {
  const url = new URL(`${collection}/v1/ids`, baseURL).toString();
  const searchParams = {}
  searchParams.ids = entries.map((entry) => entry.$id).join(',')
  const data = {};
  const result = await postFetchJSON(url, searchParams)
  if (!result.data) {
    console.error('No results for ', url, searchParams, result)
    throw new Error(`No data for ${url}`)
  }
  result.data.forEach(
    (entry) => {
      data[entry._id] = entry.data;
    },
  );
  for (let datum of entries) {
    datum.data = data[datum.$id];
  }
}

function groupsByCollection(allDBRefs) {
  const groups = {}
  for (let dbRef of allDBRefs) {
    if (!groups[dbRef.$ref]) groups[dbRef.$ref] = []
    groups[dbRef.$ref].push(dbRef)
  }
  return groups
}



