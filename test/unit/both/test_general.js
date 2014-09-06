if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'thehelp-test', 'winston', 'thehelp-core'
], function(
  test, winston, core
) {

  'use strict';

  var general = core.general;
  var expect = test.expect;

  describe('General', function() {

    describe('#isNode', function() {
      it('doesn\'t crash', function() {
        general.isNode();
      });
    });

    describe('#getHost', function() {
      it('returns something', function() {
        expect(general.getHost()).to.exist;
      });
    });

    describe('#checkError', function() {

      beforeEach(function() {
        general.winston = new test.WinstonTestHelper({showLogs: false});
      });

      it('returns false when error is null', function() {
        var actual = general.checkError('method', null);

        expect(actual).to.equal(false);
      });

      it('returns true when error is something', function() {
        var error = new Error('You cannot do that!');
        error.level = 'timeout';
        var actual = general.checkError('someone@email.com (method)', error);

        expect(general).to.have.deep.property('winston.error.callCount', 1);
        expect(actual).to.equal(true);
      });

      it('doesn\'t call callback when provided and error is null', function() {
        var cb = test.sinon.stub();
        var actual = general.checkError('someone@email.com (method)', null, cb);

        expect(actual).to.equal(false, 'checkError should return false');
        expect(cb).to.have.property('callCount', 0);
      });

      it('calls callback when provided and error is something', function() {
        var cb = test.sinon.stub();
        var actual = general.checkError(
          'someone@email.com (method)',
          new Error('You cannot do that!'),
          cb
        );

        expect(general).to.have.deep.property('winston.error.callCount', 1);
        expect(actual).to.equal(true, 'checkError should return true');
        expect(cb).to.have.property('calledOnce', true);
      });
    });

    describe('#checkPrecondition', function() {
      it('returns false when precondition is true', function() {
        var actual = general.checkPrecondition(true, 'method');

        expect(actual).to.equal(false, 'checkPrecondition should return false');
      });

      it('returns true when precondition is false', function() {
        var actual = general.checkPrecondition(false, 'method');

        expect(actual).to.equal(true, 'checkPrecondition should return true');
      });

      it('returns false and doesn\'t call cb when precondition is true', function() {
        var cb = test.sinon.stub();
        var actual = general.checkPrecondition(true, 'method', cb);

        expect(cb).to.have.property('callCount', 0);
        expect(actual).to.equal(false, 'checkPrecondition should return false');
      });

      it('returns true and calls cb with error when precondition is false', function() {
        var expected = new Error('method');
        var cb = test.sinon.spy(function(err, result) {
          expect(err).to.deep.equal(expected);
          expect(result).to.be.null;
        });
        var actual = general.checkPrecondition(false, 'method', cb);

        expect(cb).to.have.property('calledOnce', true);
        expect(actual).to.equal(true, 'checkPrecondition should return true');
      });
    });

    describe('#setTimeout', function() {
      it('calls provided function', function(done) {
        var cb = function() {
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
          expect(cb).to.have.property('callCount').that.above(2);
          clearInterval(interval);
          return done();
        });
      });
    });
  });
});
