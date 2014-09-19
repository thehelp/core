// # thehelp-core
// This file pulls in components for the client side.

if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'src/both/thehelp-core/breadcrumbs'
], function(
  Breadcrumbs
) {

  'use strict';

  return {
    isNode: false,
    isClient: true,
    breadcrumbs: new Breadcrumbs()
  };

});
