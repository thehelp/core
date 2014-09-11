// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;
require('thehelp-client-project').mixin(GruntConfig);

var internals = {};

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.registerCopy();

  internals.setupDist(config, grunt);
  internals.setupClientTest(config, grunt);

  // This is what runs when you type just 'grunt' on the command line
  var tasks = config.defaultTasks.concat(['dist', 'client-test']);
  grunt.registerTask('default', tasks);
};

/*
`setupDist` contains all the grunt registration required to assemble
the dist folder, for users of `thehelp-core` on the client side:

1. optimize thehelp-core.js
2. copy all shims to 'dist/shims' folder
*/
internals.setupDist = function(config, grunt) {
  var requireJsOptions = require('./src/client/config');
  var optimize = {
    source: 'thehelp-core',
    targetPath: 'dist',
    empty: ['winston', 'util'],
    config: requireJsOptions
  };
  config.registerOptimizeLibrary(optimize);

  grunt.config('copy.shims-to-dist', {
    files: [{
      expand: true,
      cwd: 'src/client/shims',
      src: ['*.js'],
      dest: 'dist/shims'
    }]
  });

  grunt.registerTask('dist', ['copy:shims-to-dist', 'requirejs']);
};

// `setupClientTest` provides a 'client-test' task that runs client-side tests
// via `phantomjs`.
internals.setupClientTest = function(config, grunt) {
  config.registerMocha({
    urls: [
      'http://localhost:3001/test/integration/dev.html',
      'http://localhost:3001/test/integration/dist.html'
    ]
  });
  grunt.registerTask('client-test', ['connect:test', 'mocha']);
};
