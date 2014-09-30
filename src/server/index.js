// index
// ========
// Pulls in everything needed for use via npm.

'use strict';

var Breadcrumbs = require('../both/thehelp-core/breadcrumbs.js');

module.exports = {
  isNode: true,
  isClient: false,
  logs: require('./logs.js'),
  env: require('./env.js'),
  breadcrumbs: new Breadcrumbs()
};
