import { postFetchJSON } from "./postFetchJSON.js"



export async function includeDBRefs(object, options = {}) {
  const {
    collections,
    forceReload = false,
    baseURL = 'https://octochemdb.cheminfo.org/',
  } = options
  let allDBRefs = []
  appendAllDBRefs(object, allDBRefs)
  if (collections) {
    allDBRefs = allDBRefs.filter((dbRef) => collections.includes(dbRef.$ref))
  }
  if (!forceReload) {
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



function appendAllDBRefs(object, allDBRefs) {
  if (Array.isArray(object)) {
    for (let item of object) {
      appendAllDBRefs(item, allDBRefs)
    }
  } else if (typeof object === 'object' && object !== null) {
    if (object.$ref && object.$id) {
      allDBRefs.push(object)
    }
    for (let key of Object.keys(object)) {
      appendAllDBRefs(object[key], allDBRefs)
    }
  }
}