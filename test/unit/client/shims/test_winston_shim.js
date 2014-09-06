if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'winston'], function(test, winston) {

  'use strict';

  var expect = test.expect;

  describe('winston_shim', function() {
    describe('#error', function() {
      it('should not crash', function() {
        expect(function() {
          winston.error('something');
        }).not.to['throw']();
      });
    });

    describe('#warn', function() {
      it('should not crash', function() {
        expect(function() {
          winston.warn('something');
        }).not.to['throw']();
      });
    });

    describe('#info', function() {
      it('should not crash', function() {
        expect(function() {
          winston.info('something');
        }).not.to['throw']();
      });
    });

    describe('#verbose', function() {
      it('should not crash', function() {
        expect(function() {
          winston.verbose('something');
        }).not.to['throw']();
      });
    });

  });
});
