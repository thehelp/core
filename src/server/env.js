// # env
// Functionality to help you deal with environment variables

'use strict';

var path = require('path');

var mergeObjects = require('../both/thehelp-core/merge');


module.exports = {
  /*
  merge` loads a js/json file at the path you specify (defaults to '<CWD>/env.js',
  failing to '<CWD>/env.json'), `require()`s it, then merges it with `process.env`
  favoring values already in place.

  _Note: we prefer .js files over .json because you can actually put comments in .js
  files. That's the worst thing about JSON. No comments._
  */
  merge: function merge(original) {
    var data;
    var file = original || path.join(process.cwd(), 'env.js');

    try {
      data = require(file);
    }
    catch (e) {
      // If the user didn't provide a path, we try env.json before giving up.
      if (!original) {
        file = path.join(process.cwd(), 'env.json');
        data = require(file);
      }
      else {
        throw e;
      }
    }

    // NODE_ENV is set to 'development' by default. But we try `process.env` then the
    // results of the `require()` first.
    var env = process.NODE_ENV || data.NODE_ENV || 'development';
    process.env.NODE_ENV = env;

    // We support sub-configuration - just put development/production config into the
    // right sub-key named for the NODE_ENV value in question.
    if (data[env]) {
      data = data[env];
    }

    mergeObjects(process.env, data);
  }
};
