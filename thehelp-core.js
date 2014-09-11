// # thehelp-core
// This file pulls in components for the client side.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'src/both/color',
  'src/both/string'
], function(
  color,
  string
) {

  'use strict';

  return {
    isNode: false,
    isClient: true,
    color: color,
    string: string
  };

});
