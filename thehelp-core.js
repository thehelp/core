// # thehelp-core
// This file pulls in color, general, string and time for the client side.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'src/both/color',
  'src/both/general',
  'src/both/string',
  'src/both/time'
],
  function(
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
