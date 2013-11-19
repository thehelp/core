if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'winston'],
  function(test, winston) {
  'use strict';

  describe('winston_shim', function() {
    describe('#error', function() {
      it('should not crash', function() {
        (function() {
          winston.error('something');
        }).should.not['throw']();
      });
    });

    describe('#warn', function() {
      it('should not crash', function() {
        (function() {
          winston.warn('something');
        }).should.not['throw']();
      });
    });

    describe('#info', function() {
      it('should not crash', function() {
        (function() {
          winston.info('something');
        }).should.not['throw']();
      });
    });

    describe('#verbose', function() {
      it('should not crash', function() {
        (function() {
          winston.verbose('something');
        }).should.not['throw']();
      });
    });

  });
});
