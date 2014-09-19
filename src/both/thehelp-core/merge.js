// # merge
// Quick little helper function

if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {

  'use strict';

  return function merge(target, source) {
    if (target && source && typeof source === 'object') {
      for (var key in source) {
        if (source.hasOwnProperty(key) && typeof target[key] === 'undefined') {
          target[key] = source[key];
        }
      }
    }
  };

});
