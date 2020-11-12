(async function() {

  'use strict';

  const typeDoc = require('typedoc');
  const typeDocConfig = require('../typedoc.json');
  const helper = require('./helper');
  const path = require('path');

  const outputPath = path.resolve(__dirname, '..', 'documentation');
  const app = new typeDoc.Application(typeDocConfig);

  await helper.generateFileList(path.resolve(__dirname, '..', 'src'), '.spec.ts')
    .then((fileList) => {
      app.generateDocs(fileList, outputPath);
    });

}());
