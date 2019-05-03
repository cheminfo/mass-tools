'use strict';

const phantom = require('phantom');

(async function () {
  const instance = await phantom.create();
  const page = await instance.createPage();
  console.log(page);
  console.log(page.window, instance.window, instance.document);

  await instance.exit();
})();
