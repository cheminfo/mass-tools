import JSZip from "jszip/dist/jszip";

import fetchArrayBuffer from "./util/fetchArrayBuffer";

const loadingPromises = {};

module.exports = async function loadCommercials(options = {}) {
  const {
    url = 'https://couch.cheminfo.org/cheminfo-public/d2eb480198c80275a1d05dd3609414f9/upload/commercials.zip',
  } = options;

  if (!loadingPromises[url]) {
    loadingPromises[url] = fetchArrayBuffer(url);
  }
  const buffer = await loadingPromises[url];
  const jsZip = new JSZip();
  let zip = await jsZip.loadAsync(buffer);
  let fileData = await zip.files['commercials.json'].async('string');
  let data = JSON.parse(fileData);

  data.sort((a, b) => a.em - b.em);

  return data;
};
