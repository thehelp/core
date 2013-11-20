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

  // Copy all shims, and all time zone data
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

  // This injects all/min.json (timezone information) into src/both/time.js.
  // This increases the size of the javascript (by a lot in the case of all.json)
  // but reduces the number of client/server roundtrips.
  grunt.registerTask('inject-tz-json', function() {
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
  });

  grunt.registerTask('dist', ['inject-tz-json', 'copy:default', 'requirejs']);


  // Client testing
  // ========
  config.registerMocha([
    'http://localhost:3001/test/integration/dev.html',
    'http://localhost:3001/test/integration/dist.html',
    'http://localhost:3001/test/integration/dist_min.html',
    'http://localhost:3001/test/integration/dist_all.html'
  ]);
  grunt.registerTask('client-test', ['connect:test', 'mocha']);


  // Pulling in dependencies
  // ========
  config.registerCopyFromDist(['thehelp-test']);

  //use grunt shell to pull the entire 'install dependencies workflow' into grunt?
  //npm install
  //bower install
  //./bower_install.sh - perhaps this could be deconstructed into copy tasks (and the occasional shell)
  //what else?
  //pull down latest timzone data
  //generate all.json/min.json

  grunt.registerTask('default', ['test', 'staticanalysis', 'doc', 'dist', 'client-test']);
};
