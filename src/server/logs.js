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

  // `setupConsole` has just one optional options parameter. Default for `level` is
  // 'info', default for `colorize` is `true`.
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

    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
      level: options.level,
      colorize: options.colorize,
      timestamp: this.timestamp
    });
  },

  /*
  `setupFile` takes a required path and an options object. Default for `level` is
  'verbose', default `maxsize` (when file rolls over) is `50000000`.

  _Note: assumes that no file setup has been done previously in this process._
  */
  setupFile: function setupFile(path, options) {
    if (!winston) {
      console.error('warning: install winston node module to call logs.setupFile()');
      return;
    }

    options = options || {};
    options.level = options.level || 'verbose';
    options.maxsize = options.maxsize || 50000000;

    //so we don't crash if File transport is already registered
    try {
      winston.remove(winston.transports.File);
    }
    catch (e) {}

    winston.add(winston.transports.File, {
      level: options.level,
      filename: path,
      maxsize: options.maxsize,
      timestamp: this.timestamp
    });
  }
};
