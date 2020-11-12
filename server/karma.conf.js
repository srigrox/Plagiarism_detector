// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon', 'karma-typescript'],

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),
      require('karma-html-reporter'),
      require('karma-spec-tally-reporter'),
      require('karma-typescript')
    ],

    client: {
      clearContext: true // leave Jasmine Spec Runner output visible in browser
    },

    files: [
      { pattern: 'src/**/*.ts' }
    ],

    proxies: { },

    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.ts$/,
        transforms: [
          require('karma-typescript-es6-transform')()
        ]
      },
      tsconfig: './tsconfig.json',
      reports: {
        html: {
          directory: './reports/karma',
          subdirectory: 'html'
        },
        'json-summary': {
          directory: './reports/karma',
          subdirectory: 'json'
        }
      }
    },

    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: false,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: true // print the time elapsed for each spec
    },

    htmlReporter: {
      reportName: 'execution-summary-app', // report summary filename; browser info by default
      outputDir: __dirname + '/reports/test-execution-summary', // where to put the reports  
      templatePath: null, // set if you moved jasmine_template.html 
      focusOnFailures: false, // reports show failures on start 
      namedFiles: true, // name files instead of creating sub-directories 
      pageTitle: 'Test Execution Summary', // page title for reports; browser info by default 
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs 

      // experimental 
      preserveDescribeNesting: true, // folded suites stay folded  
      foldAll: true, // reports start folded (only with preserveDescribeNesting) 
    },

    specTallyReporter: {
      console: false, // show error logs on console
      fileName: 'spec-tally-report',
      outDir: 'reports/spec-tally-report',
      writeLog: true, // write logs to given fileName
      bail: true // invokes process.exit if spec tally mismatch
    },

    reporters: ['spec', 'karma-typescript', 'html', 'spec-tally'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['ChromeHeadless'],

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222'
        ]
      }
    },

    singleRun: true

  });
};