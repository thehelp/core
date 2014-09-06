// # config
// This file supplies needed configuration to requirejs both
// during client-side testing scenarios and during optimization.

'use strict';

if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {

  var baseUrl = './';
  if (typeof window !== 'undefined') {
    baseUrl = window.host || '/';
  }

  return {
    baseUrl: baseUrl,
    name: 'thehelp-core',
    paths: {
      lodash: 'bower_components/lodash/dist/lodash',

      moment: 'bower_components/moment/moment',
      'timezone-js': 'lib/vendor/timezone',

      fs: 'src/client/shims/empty',
      winston: 'src/client/shims/winston_shim',
      util: 'src/client/shims/util_shim'
    },
    shim: {
      'timezone-js': {exports: 'window.timezoneJS'}
    }
  };

});
