'use strict';

const fetch = require('./util/fetchArrayBuffer');
const JSZip = require('jszip');

module.exports = async function loadCommercials(options = {}) {
    const {
        url = 'https://couch.cheminfo.org/cheminfo-public/d2eb480198c80275a1d05dd3609414f9/upload/commercials.zip'
    } = options;

    const buffer = await fetch(url);

    const jsZip = new JSZip();
    var zip = await jsZip.loadAsync(buffer);
    let fileData = await zip.files['commercials.json'].async('string');
    let data = JSON.parse(fileData);

    data.sort((a, b) => a.em - b.em);

    return data;
};

