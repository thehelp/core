
define(function() {
  'use strict';

  return {
    baseUrl: '/',
    paths: {
      'thehelp-core': 'dist/thehelp-core',

      lodash: 'bower_components/lodash/dist/lodash.compat',

      winston: 'src/client/shims/winston_shim',
      util: 'src/client/shims/util_shim',

      'thehelp-test': 'node_modules/thehelp-test/dist/thehelp-test',
      'thehelp-test-coverage': 'node_modules/thehelp-test/dist/thehelp-test-coverage',
      'grunt-mocha-bridge': 'node_modules/thehelp-test/dist/grunt-mocha-bridge'
    }
  };

});
