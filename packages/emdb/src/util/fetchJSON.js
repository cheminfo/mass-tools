'use strict';

const crossFetch = require('cross-fetch');

module.exports = async function fetchJSONBrowser(url) {
  const result = await crossFetch(url);
  return result.json();
};
