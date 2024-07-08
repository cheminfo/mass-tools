import JSZip from 'jszip';

import { fetchArrayBuffer } from './util/fetchArrayBuffer';

const loadingPromises = {};

export async function loadKnapSack(options = {}) {
  const {
    url = 'https://couch.cheminfo.org/cheminfo-public/d2eb480198c80275a1d05dd3609414f9/upload/ms.zip',
  } = options;

  if (!loadingPromises[url]) {
    loadingPromises[url] = fetchArrayBuffer(url);
  }
  const buffer = await loadingPromises[url];

  const jsZip = new JSZip();
  let zip = await jsZip.loadAsync(buffer);
  let fileData = await zip.files['ms.json'].async('string');
  let data = JSON.parse(fileData);

  for (const d of data) {
    d.url = `http://kanaya.naist.jp/knapsack_jsp/information.jsp?word=${d.id}`;
  }

  data.sort((a, b) => a.em - b.em);

  return data;
}
