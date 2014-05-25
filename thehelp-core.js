// # thehelp-core
// This file pulls in color, general, string and time for the client side.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'src/both/color',
  'src/both/general',
  'src/both/string',
  'src/both/time'
], function(
  color,
  general,
  string,
  time
) {

  'use strict';

  return {
    color: color,
    general: general,
    string: string,
    time: time
  };

});
