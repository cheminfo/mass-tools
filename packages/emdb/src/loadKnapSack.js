'use strict';

const fetch = require('./util/fetchArrayBuffer');
const JSZip = require('jszip');
const DB = require('./DB');


module.exports = async function loadKnapSack(options = {}) {
    const {
        url = 'https://couch.cheminfo.org/cheminfo-public/d2eb480198c80275a1d05dd3609414f9/upload/data.zip'
    } = options;

    const buffer = await fetch(url);

    const jsZip = new JSZip();
    var zip = await jsZip.loadAsync(buffer);
    let fileData = await zip.files['data.json'].async('string');
    let data = JSON.parse(fileData);

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

