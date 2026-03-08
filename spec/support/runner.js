const Jasmine = require('jasmine');

const jasmine = new Jasmine();

jasmine.loadConfig({
  spec_dir: 'build/tests',
  spec_files: ['**/*[sS]pec.js'],
  stopSpecOnExpectationFailure: false,
  random: false,
});

jasmine.configureDefaultReporter({
  showColors: true,
});

jasmine.execute();

