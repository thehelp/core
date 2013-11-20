// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.setupTimeGrunt();
  config.registerWatch();
  config.registerEnv();
  config.registerClean();

  config.registerTest();
  config.registerStaticAnalysis();

  // Need to exclude the generated time.js files - 1) they're dupes 2) they hang groc
  config.registerDoc(['src/**/*.js', '*.js', 'README.md', '!src/both/time-*.js']);

  config.registerConnect();
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
    expand: true,
    cwd: 'lib/vendor/tz',
    src: ['*'],
    dest: 'dist/tz',
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


  grunt.registerTask('default', ['test', 'staticanalysis', 'doc', 'dist', 'client-test']);
};
