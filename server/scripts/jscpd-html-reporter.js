(function() {

  'use strict';
  const jscpdHtmlReporter = require('jscpd-html-reporter');
 
  const config = {
    outDir: 'reports/code-duplicity', // Output directory for report. Relative to project root.
    outFileName: 'jscpd-report.html', // Name of final html file generated.
    files: 'src/**/*.{js,jsx,ts,tsx}', // Glob specifying files to check for duplicity.
    exclude: ['**/*.spec.ts'], // Globs which should be excluded from the report. 
    minLines: 5, // Minimum lines to qualify as duplicate.
    minTokens: 70, // Minimum tokens to qualify as duplicate.
    blame: true // Set to true to add information of author with each duplicate line (for Git).
  }

  jscpdHtmlReporter(config);

}());
