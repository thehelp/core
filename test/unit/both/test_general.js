if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'winston',
  'thehelp-core'
],
  function(test, winston,
    core
  ) {
  'use strict';

  var general = core.general;

  describe('General', function() {

    describe('#isNode', function() {
      it('doesn\'t crash', function() {
        general.isNode();
      });
    });

    describe('#getHost', function() {
      it('returns something', function() {
        (!!general.getHost()).should.equal(true, 'host should return something');
      });
    });

    describe('#checkError', function() {

      beforeEach(function() {
        general.winston = new test.WinstonTestHelper({showLogs: false});
      });

      it('returns false when error is null', function() {
        var actual = general.checkError('method', null);

        actual.should.equal(false, 'checkError should return false');
      });

      it('returns true when error is something', function() {
        var error = new Error('You cannot do that!');
        error.level = 'timeout';
        var actual = general.checkError('someone@email.com (method)', error);

        general.winston.error.callCount.should.equal(1, 'winston.error should be called');
        actual.should.equal(true, 'checkError should return true');
      });

      it('doesn\'t call callback when provided and error is null', function() {
        var cb = test.sinon.stub();
        var actual = general.checkError('someone@email.com (method)', null, cb);

        actual.should.equal(false, 'checkError should return false');
        cb.callCount.should.equal(0, 'cb should not be called');
      });

      it('calls callback when provided and error is something', function() {
        var cb = test.sinon.stub();
        var actual = general.checkError(
          'someone@email.com (method)',
          new Error('You cannot do that!'),
          cb
        );

        general.winston.error.callCount.should.equal(1, 'winston.error should be called');
        actual.should.equal(true, 'checkError should return true');
        cb.calledOnce.should.equal(true, 'cb should be called once');
      });
    });

    describe('#checkPrecondition', function() {
      it('returns false when precondition is true', function() {
        var actual = general.checkPrecondition(true, 'method');

        actual.should.equal(false, 'checkPrecondition should return false');
      });

      it('returns true when precondition is false', function() {
        var actual = general.checkPrecondition(false, 'method');

        actual.should.equal(true, 'checkPrecondition should return true');
      });

      it('returns false and doesn\'t call cb when precondition is true', function() {
        var cb = test.sinon.stub();
        var actual = general.checkPrecondition(true, 'method', cb);

        cb.callCount.should.equal(0, 'cb should not be called');
        actual.should.equal(false, 'checkPrecondition should return false');
      });

      it('returns true and calls cb with error when precondition is false', function() {
        var expected = new Error('method');
        var cb = test.sinon.spy(function(err, result) {
          err.should.deep.equal(expected);
          (!result).should.equal(true, 'result should be null');
        });
        var actual = general.checkPrecondition(false, 'method', cb);

        cb.calledOnce.should.equal(true, 'cb should be called once');
        actual.should.equal(true, 'checkPrecondition should return true');
      });
    });

    describe('#setTimeout', function() {
      it('calls provided function', function(done) {
        var cb = function () {
          return done();
        };

        general.setTimeout(1, cb);
      });
    });

    describe('#setInterval', function() {
      it('calls provided function', function(done) {
        var cb = test.sinon.stub();

        var interval = general.setInterval(25, cb);

        general.setTimeout(100, function() {
          cb.callCount.should.be.above(2);
          clearInterval(interval);
          return done();
        });
      });
    });
  });
});
