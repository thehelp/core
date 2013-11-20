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

  // Generate dist/
  // ========

  // Three versions of thehelp-core: raw, and with all/min.json tz data injected
  var options = require('./src/client/config');
  var optimize = {
    name: 'thehelp-core',
    empty: ['winston', 'util'],
    config: options
  };
  config.registerOptimize(optimize);

  options.paths['src/both/time'] = 'src/both/time-min';
  optimize.outName = 'thehelp-core-tz-min';
  config.registerOptimize(optimize);

  options.paths['src/both/time'] = 'src/both/time-all';
  optimize.outName = 'thehelp-core-tz-all';
  config.registerOptimize(optimize);
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
