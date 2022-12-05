import { mfFromGoogleSheet } from 'mf-from-google-sheet';

export async function loadGoogleSheet(options = {}) {
  let {
    refUUID = '1C_H9aiJyu9M9in7sHMOaz-d3Sv758rE72oLxEKH9ioA',
    uuid = '1LrJCl9-xSZKhGA9Y8nKVkYwB-mEOHBkTXg5qYXeFpZY',
  } = options;
  if (options.uuid && !options.refUUID) refUUID = '';

  let url = `https://googledocs.cheminfo.org/spreadsheets/d/${uuid}/export?format=tsv`;
  let refURL = refUUID
    ? `https://googledocs.cheminfo.org/spreadsheets/d/${refUUID}/export?format=tsv`
    : '';
  let data = await mfFromGoogleSheet(url, refURL);
  data.sort((a, b) => a.em - b.em);
  return data;
}
