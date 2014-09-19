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

  Config can be structured like this, either in raw JSON or a commonjs-style .js file
  (providing values via `module.exports`):
  ```
  {
    "NODE_ENV": "development"
    "VAR": "value",
    "VAR2": "value2"
  }
  ```

  All values will be coerced to string as part of being attached to `process.env`.

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

    mergeObjects(process.env, data);
  }
};
