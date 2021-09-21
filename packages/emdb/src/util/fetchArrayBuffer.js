'use strict';

const fetch = require('cross-fetch');

module.exports = async function fetchArrayBufferBrowser(url) {
  const result = await fetch(url);
  return result.arrayBuffer();
};
