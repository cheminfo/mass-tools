'use strict';

const fetch = require('cross-fetch');

module.exports = async function fetchJSONBrowser(url) {
  const result = await fetch(url);
  return result.json();
};
