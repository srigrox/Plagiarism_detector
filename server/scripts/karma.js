(function () {

  'use strict';

  const Server = require('karma').Server
  const path = require('path');
  
  var server = new Server({
      configFile: path.resolve(__dirname, '..', 'karma.conf.js'),
    }, (exitCode) => {
      console.log('Karma completed.');
      process.exit(exitCode);
  });
  
  server.start();

}());
