'use strict';

const fetch = require('node-fetch');

module.exports = async function fetchArrayBufferBrowser(url) {
  const result = await fetch(url);
  return result.arrayBuffer();
};
