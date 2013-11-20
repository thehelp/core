
define(function() {
  'use strict';

  return {
    baseUrl: '/',
    paths: {
      'thehelp-core': 'dist/thehelp-core',

      lodash: 'lib/vendor/lodash',

      winston: 'src/client/shims/winston_shim',
      util: 'src/client/shims/util_shim',

      jquery: 'lib/vendor/jquery',
      'thehelp-test': 'lib/vendor/thehelp-test',
      'thehelp-test-coverage': 'lib/vendor/thehelp-test-coverage',
      'grunt-mocha-bridge': 'lib/vendor/grunt-mocha-bridge'
    }
  };

});
