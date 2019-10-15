'use strict';

function improveResults(analysisResult, residues) {
  let results = JSON.parse(JSON.stringify(analysisResult));

  // we calculate all the lines based on the results
  for (let result of results) {
    // internal fragment ?
    let parts = result.type.split(/(?=[a-z])/);
    let firstPart = parts[0];
    let secondPart = parts[1];

    if ('abc'.indexOf(firstPart.charAt(0)) > -1) {
      // n-terminal fragment
      result.to = firstPart.substr(1) * 1 - 1;
      if (secondPart) {
        result.internal = true;
      } else {
        result.fromNTerm = true;
      }
    } else {
      result.to = residues.length - 1;
      secondPart = firstPart;
      result.fromCTerm = true;
    }
    if (!secondPart) {
      result.from = 0;
    } else {
      result.from = residues.length - secondPart.substr(1) * 1 - 1;
    }
    result.length = result.to - result.from + 1;

    if (result.fromCTerm) result.color = 'red';
    if (result.fromNTerm) result.color = 'blue';
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
    if (result.similarity > 95) {
      result.textColor = 'black';
    } else if (result.similarity > 90) {
      result.textColor = '#333';
    } else if (result.similariy > 80) {
      result.textColor = '#666';
    } else {
      result.textColor = '#999';
    }
  }
  // sort by residue length
  results.sort((a, b) => a.length - b.length);

  return results;
}

module.exports = improveResults;
