
'use strict';

define(['../../../src/client/config'], function(config) {

  config.baseUrl = '/';

  config.paths.jquery = 'lib/vendor/jquery';
  config.paths['thehelp-test'] = 'lib/vendor/thehelp-test';
  config.paths['thehelp-test-coverage'] = 'lib/vendor/thehelp-test-coverage';
  config.paths['grunt-mocha-bridge'] = 'lib/vendor/grunt-mocha-bridge';

  requirejs.config(config);

  require([window.entrypoint], function() {});

});
