'use strict';

const fetch = require('node-fetch');

module.exports = async function fetchJSONBrowser(url) {
  const result = await fetch(url);
  return result.json();
};
