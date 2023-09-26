export function appendResults(data, analysisResult, options = {}) {
  const numberResidues = data.residues.residues.length;
  const { merge = {}, filter = {} } = options;

  let results = JSON.parse(JSON.stringify(analysisResult));
  results = results.filter((result) => !result.type.match(/^-B[0-9]$/));
  // we calculate all the lines based on the results
  for (let result of results) {
    let parts = result.type.split(/:|(?=[a-z])/); // we may have ':' but not mandatory
    if (parts.length === 2) {
      result.internal = true;
      if (parts[1].match(/^[abcd][1-9]/)) {
        [parts[0], parts[1]] = [parts[1], parts[0]];
      }
      result.to = getNumber(parts[0]) - 1;
      result.from = numberResidues - getNumber(parts[1]);
    } else {
      if (parts[0].match(/^[abcd][1-9]/)) {
        result.fromBegin = true;
        result.position = getNumber(parts[0]) - 1;
      }
      if (parts[0].match(/^[wxyz][1-9]/)) {
        result.fromEnd = true;
        result.position = numberResidues - 1 - getNumber(parts[0]);
      }
    }

    if (result.fromEnd) result.color = 'red';
    if (result.fromBegin) result.color = 'blue';
    if (result.internal) {
      switch (result.type.substring(0, 1)) {
        case 'a':
          result.color = 'green';
          break;
        case 'b':
          result.color = 'orange';
          break;
        case 'c':
          result.color = 'cyan';
          break;
        default:
          result.color = 'green';
      }
    }
  }

  if (merge.charge) {
    const unique = {};
    for (let result of results) {
      if (!unique[result.type]) {
        unique[result.type] = [];
      }
      unique[result.type].push(result);
    }
    results = [];
    for (let key in unique) {
      let current = unique[key][0];
      current.similarity = unique[key].reduce(
        (previous, item) => previous + item.similarity,
        0,
      );
      current.similarity = current.similarity / unique[key].length;
      results.push(current);
      current.charge = '';
    }
  }

  for (let result of results) {
    if (result.similarity > 0.95) {
      result.textColor = 'black';
    } else if (result.similarity > 0.9) {
      result.textColor = '#333';
    } else if (result.similariy > 0.8) {
      result.textColor = '#666';
    } else {
      result.textColor = '#999';
    }
  }

  results = filterResults(results, filter);

  // sort by residue length
  results.sort((a, b) => a.length - b.length);
  data.results = results;
}

function getNumber(text) {
  return Number(text.replace(/^.([0-9]+).*$/, '$1'));
}

function filterResults(results, filter) {
  if (!filter) return;
  let {
    minRelativeQuantity = 0,
    minSimilarity = 0,
    minQuantity = 0,
    showInternals = true,
  } = filter;

  if (minRelativeQuantity) {
    minQuantity =
      Math.max(...results.map((entry) => entry.quantity)) * minRelativeQuantity;
  }

  if (minSimilarity) {
    results = results.filter(
      (result) => !result.similarity || result.similarity >= minSimilarity,
    );
  }
  if (minQuantity) {
    results = results.filter(
      (result) => !result.quantity || result.quantity >= minQuantity,
    );
  }

  if (!showInternals) {
    results = results.filter((result) => !result.internal);
  }
  return results;
}
