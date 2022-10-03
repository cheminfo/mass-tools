'use strict';

const crossFetch = require('cross-fetch');

module.exports = async function fetchJSONBrowser(url) {
  const controller = new AbortController();

  // 5 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 300000);
  const result = await crossFetch(url, { signal: controller.signal }).then(
    (response) => {
      if (response) {
        clearTimeout(timeoutId);
      }
    },
  );
  return result.json();
};
