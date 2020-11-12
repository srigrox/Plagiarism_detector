(async function() {

  'use strict';

  const Mocha = require('mocha');
  const path = require('path');
  const mochaConfig = require('../.mocharc.json');
  const tsnodeRegister = require('ts-node/register');
  const helper = require('./helper');

  const mocha = new Mocha(Object.assign(mochaConfig, { "_require": [tsnodeRegister] }));

  await helper.generateFileList(path.resolve(__dirname, '..', 'src'))
    .then((fileList) => {
      fileList.forEach((file) => {
        mocha.addFile(file);
      });
      Promise.resolve();
    }).then(() => {
      mocha.run((failures) => {
        if (failures) {
          console.log(failures);
        }
        console.log('Mocha completed.');
      });
    });
  
}());
