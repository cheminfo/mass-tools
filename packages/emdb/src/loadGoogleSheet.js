'use strict';

const DB = require('./DB');

var ab = require('mf-from-google-sheet');
console.log('---------', ab);
const mfFromGoogleSheet = require('mf-from-google-sheet');

module.exports = async function loadGoogleSheet(options = {}) {
    let {
        refUUID = '1C_H9aiJyu9M9in7sHMOaz-d3Sv758rE72oLxEKH9ioA',
        uuid = '1LrJCl9-xSZKhGA9Y8nKVkYwB-mEOHBkTXg5qYXeFpZY'
    } = options;
    if (options.uuid && !options.refUUID) refUUID = '';

    var url = 'https://googledocs.cheminfo.org/spreadsheets/d/' + uuid + '/export?format=tsv';
    var refURL = (refUUID) ? refURL = 'https://googledocs.cheminfo.org/spreadsheets/d/' + refUUID + '/export?format=tsv' : '';
    let data = await mfFromGoogleSheet(url, refURL);
    console.log(data);
    return new DB(data, {
        filter: datum => ({
            id: datum.id,
            em: datum.structure.em,
            mf: datum.structure.mf,
            idCode: datum.structure.idCode,
            names: datum.names,
            url: 'http://kanaya.naist.jp/knapsack_jsp/information.jsp?word=' + datum.id
        })
    });
};

