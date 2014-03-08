// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;
var grunt;

// `injectTzInfo` injects all/min.json (timezone information) into src/both/time.js.
// This increases the size of the javascript (by a lot in the case of all.json)
// but reduces the number of client/server roundtrips.
var injectTzInfo = function() {
  var time = grunt.file.read('src/both/time.js');
  var all = grunt.file.read('lib/vendor/tz/all.json').replace('\n', '');
  var min = grunt.file.read('lib/vendor/tz/min.json').replace('\n', '');

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

/*
`generateDist` contains all the grunt registration required to assemble
the dist folder, for users of the-help on the client side:

1. inject time zone information into src/client/time-all/min.js
2. optimize thehelp-core.js into three different versions: raw, with min.json
included, and with all.json included.
3. copy all shims to dist/shims folder
*/
var generateDist = function(config, grunt) {
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

  grunt.config('copy.shims-to-dist', {
    files: [{
      expand: true,
      cwd: 'src/client/shims',
      src: ['*.js'],
      dest: 'dist/shims',
    }]
  });

  grunt.registerTask('inject-tz-json', injectTzInfo);
  grunt.registerTask('dist', ['inject-tz-json', 'copy:shims-to-dist', 'requirejs']);
};

// ## Overall setup
// We can't call `config.standardSetup()` because we need to customize set of
// files we process for documentation (we have to exclude the generated time.js files
// - 1. they're dupes 2. they hang groc). So we call a number of methods on `config`.
module.exports = function(g) {
  grunt = g;
  var config = new GruntConfig(grunt);

  config.setupTimeGrunt();
  config.registerWatch();
  config.registerEnv();
  config.registerClean();

  config.registerTest();
  config.registerStaticAnalysis(['src/**/*.js', '*.js', '!src/both/time-*.js']);
  config.registerConnect();

  config.registerDoc(['src/**/*.js', '*.js', 'README.md', '!src/both/time-*.js']);

  // ## Generate dist/ folder
  generateDist(config, grunt);

  // ## Client testing
  config.registerMocha([
    'http://localhost:3001/test/integration/dev.html',
    'http://localhost:3001/test/integration/dist.html',
    'http://localhost:3001/test/integration/dist_min.html',
    'http://localhost:3001/test/integration/dist_all.html'
  ]);
  grunt.registerTask('client-test', ['connect:test', 'mocha']);

  // ## Pulling in dependencies
  config.registerInstall();
  config.registerCopyFromDist(['thehelp-test']);
  config.registerCopyFromBower();

  grunt.config('copy.timezonejs', {
    files: {
      'lib/vendor/timezone.js': 'node_modules/timezone-js/src/date.js'
    }
  });
  grunt.registerTask('setup', ['shell:npm-install', 'shell:bower-install',
    'copy:timezonejs', 'copy:from-bower', 'copy:from-dist']);

  // ## Default task

  // This is what runs when you type just 'grunt' on the command line
  grunt.registerTask('default', ['test', 'staticanalysis', 'doc', 'dist', 'client-test']);
};
