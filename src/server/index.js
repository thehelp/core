// index
// ========
// Pulls in everything needed for use via npm.

'use strict';

module.exports = {
  isNode: true,
  isClient: false,
  color: require('../both/color'),
  string: require('../both/string'),
  logs: require('./logs.js'),
  env: require('./env.js')
};
