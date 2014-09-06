// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;
require('thehelp-client-project').mixin(GruntConfig);

var internals = {};

/*
## Overall setup

We need to customize set of files we process for documentation/style/jshint to exclude
the generated time.js files:

1. they're dupes, copies of time.js
2. they have really long lines (jshint/jscs errors, hangs groc)
*/
module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup({
    staticAnalysis: {
      src: ['src/**/*.js', '*.js', '!src/both/time-*.js']
    },
    style: {
      all: ['src/**/*.js', '*.js', 'test/**/*.js', '!src/both/time-*.js']
    },
    doc: {
      all: ['src/**/*.js', '*.js', 'README.md', '!src/both/time-*.js']
    }
  });

  config.registerCopy();

  internals.setupDist(config, grunt);
  internals.setupSetup(config, grunt);
  internals.setupClientTest(config, grunt);

  // This is what runs when you type just 'grunt' on the command line
  var tasks = config.defaultTasks.concat(['dist', 'client-test']);
  grunt.registerTask('default', tasks);
};

// `injectTzInfo` returns a function which injects timezone information into
// 'src/both/time.js'. This increases the size of the javascript (by a lot in the case of
// 'all.json') but reduces the number of client/server roundtrips.
internals.injectTzInfo = function(grunt) {
  return function() {
    var time = grunt.file.read('src/both/time.js');
    var all = grunt.file.read('tz/all.json').replace('\n', '');
    var min = grunt.file.read('tz/min.json').replace('\n', '');

    var start = 'var json = \'';
    var end = '\';\n' +
      '    tz.transport = function() {\n' +
      '      return json;\n' +
      '    };\n' +
      '    tz.loadZoneJSONData(null, true);';

    var replace = /\/\/-----[\w\W]+\/\/-----/g;

    var timeAll = time.replace(replace, start + all + end);
    grunt.file.write('src/both/time-all.js', timeAll);

    var timeMin = time.replace(replace, start + min + end);
    grunt.file.write('src/both/time-min.js', timeMin);
  };
};


/*
`setupDist` contains all the grunt registration required to assemble
the dist folder, for users of `thehelp-core` on the client side:

1. inject time zone information into 'src/client/time-all/min.js'
2. optimize thehelp-core.js into three different versions: raw, with 'tz/min.json'
included, and with 'tz/all.json' included.
3. copy all shims to 'dist/shims' folder
*/
internals.setupDist = function(config, grunt) {
  var requireJsOptions = require('./src/client/config');
  var optimize = {
    source: 'thehelp-core',
    targetPath: 'dist',
    empty: ['winston', 'util', 'lodash'],
    config: requireJsOptions
  };
  config.registerOptimizeLibrary(optimize);

  requireJsOptions.paths['src/both/time'] = 'src/both/time-min';
  optimize.target = 'thehelp-core-tz-min';
  config.registerOptimizeLibrary(optimize);

  requireJsOptions.paths['src/both/time'] = 'src/both/time-all';
  optimize.target = 'thehelp-core-tz-all';
  config.registerOptimizeLibrary(optimize);

  grunt.config('copy.shims-to-dist', {
    files: [{
      expand: true,
      cwd: 'src/client/shims',
      src: ['*.js'],
      dest: 'dist/shims'
    }]
  });

  grunt.registerTask('inject-tz-json', internals.injectTzInfo(grunt));
  grunt.registerTask('dist', ['inject-tz-json', 'copy:shims-to-dist', 'requirejs']);
};

// `setupSetup` captures the set of tasks that need to be run after new versions of
// dependencies are installed.
internals.setupSetup = function(config, grunt) {
  grunt.config('copy.timezonejs', {
    files: {
      'lib/vendor/timezone.js': 'node_modules/timezone-js/src/date.js'
    }
  });
  grunt.registerTask('setup', ['copy:timezonejs']);
};

// `setupClientTest` provides a 'client-test' task that runs client-side tests
// via `phantomjs`.
internals.setupClientTest = function(config, grunt) {
  config.registerMocha({
    urls: [
      'http://localhost:3001/test/integration/dev.html',
      'http://localhost:3001/test/integration/dist.html',
      'http://localhost:3001/test/integration/dist_min.html',
      'http://localhost:3001/test/integration/dist_all.html'
    ]
  });
  grunt.registerTask('client-test', ['connect:test', 'mocha']);
};
