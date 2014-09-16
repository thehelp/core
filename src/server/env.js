// # env
// Functionality to help you deal with environment variables

// [strict mode](http://mzl.la/1fRhnam)
'use strict';

var fs = require('fs');

var _ = require('lodash');

module.exports = {
  // `merge` loads a json file at the path you specify ('./env.json' by default), parses
  // it, then merges it with `process.env` favoring values already in `process.env`.
  merge: function merge(path) {
    path = path || './env.json';
    var contents = fs.readFileSync(path);
    var data = JSON.parse(contents);
    process.env = _.merge(data, process.env);
  }
};
