(function() {

  'use strict';

  const webpack = require('webpack');
  const config = require('../webpack.config');
  const path = require('path');
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

  if (process.argv[2] && process.argv[2] === '--analyze') {
    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.resolve(__dirname, '..', 'reports', 'build-analysis', 'report.html')
    }));
  }

  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if(err) {
      console.error(err);
    }
    console.log('Build complete');
  });

}());
