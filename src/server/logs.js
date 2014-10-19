// # logs
// Makes it a little quicker/easier to set up winston logging for a process.

'use strict';

var winston;

// Don't blow up if winston isn't installed
try {
  winston = require('winston');
  winston.stripColors = true;
}
catch (e) {}

module.exports = {
  // `timestamp` is a helper function used to ensure that winston timestamps aren't
  // timezone-specific.
  timestamp: function timestamp() {
    var date = new Date();
    return date.toISOString();
  },

  /*
  `setupConsole` has no required parameters. Defaults provided to the `winston` console
  transport:

  + `level` - `'info'`
  + `colorize` - `true`
  + `timestamp` - ISO-format date: `2014-10-19T19:28:32.584Z`

  */
  setupConsole: function setupConsole(options) {
    if (!winston) {
      console.error('warning: install winston node module to call logs.setupConsole()');
      return;
    }

    options = options || {};

    options.level = options.level || 'info';

    if (typeof options.colorize === 'undefined') {
      options.colorize = true;
    }

    options.timestamp = options.timestamp || this.timestamp;

    this._removeTransport(winston.transports.Console);
    var transport = new winston.transports.Console(options);
    this._addTransport(transport);

    return transport;
  },

  /*
  `setupFile` takes a required `path` and an `options` object. Defaults provided to
  the `winston` file transport:

  + `level` - `'verbose'`
  + `maxsize` - `50000000` (when this limit is reached, the file rolls over)
  + `timestamp` - ISO-format date: `2014-10-19T19:28:32.584Z`

  */
  setupFile: function setupFile(path, options) {
    if (!winston) {
      console.error('warning: install winston node module to call logs.setupFile()');
      return;
    }

    options = options || {};

    options.filename = options.filename || path;
    options.level = options.level || 'verbose';
    options.maxsize = options.maxsize || 50000000;
    options.timestamp = options.timestamp || this.timestamp;

    this._removeTransport(winston.transports.File);
    var transport = new winston.transports.File(options);
    this._addTransport(transport);

    return transport;
  },

  /*
  `_addTransport` adds a transport to both the default logger (top-level `winston.info()`
  calls) and all loggers created via the default collection (`winston.loggers.get()`).
  */
  _addTransport: function _addTransport(transport) {
    //for the default logger
    winston.add(transport, null, true);

    //for the default collection
    var defaultOptions = winston.loggers.options;
    defaultOptions.transports = defaultOptions.transports || [];
    defaultOptions.transports.push(transport);
  },

  /*
  `_removeTransport` removes a transport from the default logger and from the default
  collection.
  */
  _removeTransport: function _removeTransport(transportClass) {
    //for the default logger
    try {
      winston.remove(transportClass);
    }
    catch (e) {}

    //for the default collection
    var defaultOptions = winston.loggers.options;
    defaultOptions.transports = defaultOptions.transports || [];

    for (var i = 0, max = defaultOptions.transports.length; i < max; i += 1) {
      var defaultTransport = defaultOptions.transports[i];
      if (defaultTransport.constructor === transportClass) {
        defaultOptions.transports = defaultOptions.transports.slice(0, i).concat(
          defaultOptions.transports.slice(i + 1));
        return;
      }
    }
  }
};
