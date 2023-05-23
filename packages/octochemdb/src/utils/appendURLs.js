
import { appendAllDBRefs } from "./appendAllDBRefs.js"

export async function appendURLs(object, options = {}) {
  const {
    collections,
    force = false,
  } = options

  let allDBRefs = []

  appendAllDBRefs(object, allDBRefs)
  if (collections) {
    allDBRefs = allDBRefs.filter((dbRef) => collections.includes(dbRef.$ref))
  }
  if (!force) {
    allDBRefs = allDBRefs.filter((dbRef) => !dbRef.url)
  }

  const unknowns = {}

  for (const entry of allDBRefs) {
    switch (entry.$ref) {
      case 'compounds':
        entry.url = `https://pubchem.ncbi.nlm.nih.gov/compound/${entry.$id}`;
        break
      case 'pubmeds':
        entry.url = `https://pubmed.ncbi.nlm.nih.gov/${entry.$id}`;
        break
      case 'gnps':
        entry.url = `https://gnps.ucsd.edu/ProteoSAFe/gnpslibraryspectrum.jsp?SpectrumID=${entry.$id}`;
        break
      case 'patents':
        entry.url = `https://pubchem.ncbi.nlm.nih.gov/patent/${entry.$id}`;
        break;
      case 'bioassays':
        entry.url = `https://pubchem.ncbi.nlm.nih.gov/bioassay/${entry.$id.replace(
          /.*_/,
          '',
        )}`;
        break;
      case 'npasses':
        entry.url = `http://bidd.group/NPASS/compound.php?compoundID=${entry.$id}`;
        break;
      case 'cmaups':
        entry.url = `http://bidd.group/CMAUP/ingredient.php?ingredient=${entry.$id}`;
        break;
      case 'coconuts':
        entry.url = `https://coconut.naturalproducts.net/compound/coconut_id/${entry.$id}`;
        break;
      case 'lotuses':
        entry.url = `https://lotus.naturalproducts.net/compound/lotus_id/${entry.$id}`;
        break;
      case 'npAtlases':
        entry.url = `https://www.npatlas.org/explore/compounds/${entry.$id}`;
        break;
      case 'massBank':
        entry.url = `https://massbank.eu/MassBank/RecordDisplay?id=${entry.$id}`;
        break;
      default:
        unknowns[entry.$ref] = true
        break;
    }

  }
  if (Object.keys(unknowns).length) {
    console.log('Unknown url to original data for the following collections: ', unknowns)
  }
}

