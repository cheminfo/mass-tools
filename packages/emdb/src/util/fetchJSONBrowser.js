'use strict';

/* eslint-env browser */

module.exports = async function fetchJSONBrowser(url) {
  const result = await fetch(url);
  return result.json();
};
