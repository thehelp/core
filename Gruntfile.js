// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();

  // Produce files in the dist/ folder
  var options = require('./src/client/config');
  config.registerOptimize({
    name: 'thehelp-core',
    empty: ['winston', 'util'],
    config: options
  });

  config.registerCopy([{
    expand: true,
    cwd: 'src/client/shims',
    src: ['*.js'],
    dest: 'dist/shims',
  }, {
    'dist/tz/min.json': 'lib/vendor/tz/min.json',
    'dist/tz/all.json': 'lib/vendor/tz/all.json'
  }]);

  grunt.registerTask('dist', ['copy:default', 'requirejs']);


  // Client testing
  config.registerMocha([
    'http://localhost:3001/test/integration/dev.html',
    'http://localhost:3001/test/integration/dist.html'
  ]);
  grunt.registerTask('client-test', ['connect:test', 'mocha']);


  // Pulling in dependencies
  config.registerCopyFromDist(['thehelp-test']);
};
