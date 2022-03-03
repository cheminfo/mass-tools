'use strict';

const JSZip = require('jszip/dist/jszip');

const fetch = require('./util/fetchArrayBuffer');

const loadingPromises = {};

module.exports = async function loadCommercials(options = {}) {
  const {
    url = 'https://couch.cheminfo.org/cheminfo-public/d2eb480198c80275a1d05dd3609414f9/upload/commercials.zip',
  } = options;

  if (!loadingPromises[url]) {
    loadingPromises[url] = fetch(url);
  }
  const buffer = await loadingPromises[url];
  const jsZip = new JSZip();
  let zip = await jsZip.loadAsync(buffer);
  let fileData = await zip.files['commercials.json'].async('string');
  let data = JSON.parse(fileData);

  data.sort((a, b) => a.em - b.em);

  return data;
};
