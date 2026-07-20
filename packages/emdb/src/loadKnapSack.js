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
    // the database moved away from kanaya.naist.jp, whose host does not answer
    // anymore, to its own domain. Same ids, same `word` parameter.
    d.url = `https://www.knapsackfamily.com/knapsack_core/information.php?word=${d.id}`;
  }

  data.sort((a, b) => a.em - b.em);

  return data;
}
