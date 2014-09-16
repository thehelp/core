// index
// ========
// Pulls in everything needed for use via npm.

'use strict';

module.exports = {
  isNode: true,
  isClient: false,
  logs: require('./logs.js'),
  env: require('./env.js')
};
