
'use strict';

var fs = require('fs');
var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var winston;

try {
  winston = require('winston');
}
catch (e) {}

var logs = require('../../../src/server/logs');

describe('logs', function() {
  it('setupConsole should not crash, even when called twice', function() {
    expect(function() {
      logs.setupConsole({
        level: 'verbose'
      });
      logs.setupConsole({
        level: 'warn'
      });
    }).not.to.throw();

    if (winston) {
      winston.verbose('default logger: verbose should not show up');
      winston.info('default collection: info should not show up');
      winston.warn('default logger: warn!');

      var logger = winston.loggers.get('consoleTest');
      logger.verbose('default collection: verbose should not show up');
      logger.info('default collection: info should not show up');
      logger.warn('default collection: warn!');
    }
  });

  it('setupFile should not crash, even when called twice', function(done) {
    var log = path.join(__dirname, '../../../logs/verbose.log');
    try {
      fs.unlinkSync(log);
    }
    catch (e) {}

    expect(function() {
      logs.setupFile(log, {
        level: 'error'
      });
      logs.setupFile(log, {
        level: 'info'
      });
    }).not.to.throw();

    if (!winston) {
      return done();
    }
    else {
      winston.verbose('default logger: verbose!');
      winston.info('default logger: info!');
      winston.warn('default logger: warn!');

      // note that we need to request a different logger from above, because that
      // 'consoleTest' logger is stuck with the defaults around when it was created
      var logger = winston.loggers.get('fileTest');
      logger.verbose('default collection: verbose!');
      logger.info('default collection: info!');
      logger.warn('default collection: warn!');

      // need to wait a little for the logs to flush to disk
      setTimeout(function() {
        fs.readFile(log, function(err, contents) {
          if (err) {
            throw err;
          }

          contents = contents.toString();
          expect(contents).not.to.match(/default logger: verbose/);
          expect(contents).not.to.match(/default collection: verbose/);

          expect(contents).to.match(/default logger: info/);
          expect(contents).to.match(/default collection: info/);
          done();
        });
      }, 250);
    }
  });
});
