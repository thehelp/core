
define(function() {
  'use strict';

  return {
    baseUrl: '/',
    paths: {
      'thehelp-core': 'dist/thehelp-core',

      winston: 'src/client/shims/winston_shim',
      util: 'src/client/shims/util_shim',

      'thehelp-test': 'node_modules/thehelp-test/dist/thehelp-test',
      'thehelp-test-coverage': 'node_modules/thehelp-test/dist/thehelp-test-coverage',
      'grunt-mocha-bridge': 'node_modules/thehelp-test/dist/grunt-mocha-bridge'
    }
  };

});
