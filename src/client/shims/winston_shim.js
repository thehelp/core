// # winston_shim
// Kinda replicates winston on the client side.

// Dependencies and [strict mode](http://mzl.la/1fRhnam)
define(function() {

  'use strict';

  // Damn Internet Explorer. If the dev tools are not active, console.log isn't
  // anything, and will throw an error if you try to call it. This shims it out
  // with a no-op.
  if (typeof window !== 'undefined' && typeof window.console === 'undefined') {
    window.console = {
      log: function log() {}
    };
  }

  var winston = {
    levels: {
      verbose: 1,
      info: 2,
      warn: 3,
      error: 4,
      none: 5
    },

    // `addLevel` puts a function on `winston` for the `level` specified. Each of those
    // functions logs if the current log level permits it. On Internet Explorer that's
    // a no-op without the dev tools active. Boo IE.
    _addLevel: function(level) {
      this[level] = function(text) {
        if (this.levels[level] >= (this.levels[window.winstonLevel] || 0)) {
          var now = new Date();
          console.log(now.toISOString() + ' ' + level + ': ' + text);
        }
      };

    }
  };

  // If the page hasn't set a logging level, we set it to "warn."
  if (!window.winstonLevel) {
    window.winstonLevel = 'warn';
  }

  // Here we set up all five default logging methods.
  for (var level in winston.levels) {
    if (winston.levels.hasOwnProperty(level)) {
      winston._addLevel(level);
    }
  }

  return winston;
});
