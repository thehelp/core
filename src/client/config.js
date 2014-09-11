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
      winston: 'src/client/shims/winston_shim',
      util: 'src/client/shims/util_shim'
    }
  };

});
