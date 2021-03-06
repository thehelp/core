
'use strict';

define(['../../../src/client/config'], function(config) {

  config.baseUrl = '/';

  config.paths['thehelp-test'] = 'node_modules/thehelp-test/dist/thehelp-test';
  config.paths['thehelp-test-coverage'] =
    'node_modules/thehelp-test/dist/thehelp-test-coverage';
  config.paths['grunt-mocha-bridge'] =
    'node_modules/thehelp-test/dist/grunt-mocha-bridge';

  requirejs.config(config);

  require([window.entrypoint], function() {});

});
