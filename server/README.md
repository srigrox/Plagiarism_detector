
# server

Project scaffold for server

This is a customized Typescript 3.9 project starter which includes the following features:
* Webpack bunding
* Webpack bundle analyzer
* Unit test with Mocha/Chai/Sinon
* Coverage report with nyc
* TSLint Html Report
* Code Duplicity Html Report (with git integration)
* Documentation with Typedoc

## Running the code

Run *`npm run start`* to execute the code.  
This command will first build the project using *`npm run build`* (see below).  
Then, the the generated code will be executed as *`node dist/server.js`*.  
*Note:* Entry point for project is set to index.ts.


## Build the code

Run *`npm run build`* to build the project with [Webpack](https://webpack.js.org/).  
The build artifacts will be stored in the `dist/` directory.  
To execute the code, run *`node dist/server.js`*.  
*Note:* Entry point for project is set to index.ts.

## Running unit tests

Run *`npm run mocha`* to execute the unit tests via [Mocha](https://mochajs.org/)/[Chai](https://www.chaijs.com/)/[Sinon](https://sinonjs.org/).  
Note: CLI output only, no files generated.


## Generate Code coverage Report for unit tests

Run *`npm run test`* to generate unit test coverage report using [nyc](https://github.com/istanbuljs/nyc).  
Report location: `reports/coverage`.


## Generate Webpack Bundle Analysis Report

Run *`npm run build:analysis`* to generate Webpack bundle Analysis report using [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer).    
Report location: `reports/build-analysis`.


## Generate TSLint Html Report

Run *`npm run lint`* to generate a json and html lint report using [TSLint-Html-report](https://www.npmjs.com/package/tslint-html-report).  
Report location: `reports/tslint-html-report`


## Generate Code-Duplicity Report

Run *`npm run jscpd`* to generate a json and html duplicity report using [JSCPD-Html-report](https://www.npmjs.com/package/jscpd-html-reporter).  
Report location: `reports/code-duplicity`  


## Generate Documentation

Run *`npm run docs`* to generate documentation for the code using [Typedoc](https://typedoc.org/).  
Information for Params and Returns of functions is generated automatically.  
Use JSDoc comment format to provide description for functions:
```Javascript
  /**
   * This is the description for my method
   * */  
```
Report location: `documentation`  
