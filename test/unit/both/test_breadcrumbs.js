if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', '../../../src/both/breadcrumbs'], function(test, breadcrumbs) {

  'use strict';

  var expect = test.expect;
  var sinon = test.sinon;

  describe('breadcrumbs', function() {

    describe('#get', function() {
      it('returns the current line', function() {
        var actual = breadcrumbs.get();
        expect(actual).to.match(/test_breadcrumbs.js/);
      });
    });

    describe('#insert', function() {
      it('puts current file into stack', function() {
        var err = new Error();
        breadcrumbs.insert(err);

        expect(err).to.have.property('stack').that.match(/test_breadcrumbs.js/);
      });

      it('does just fine with no err', function() {
        breadcrumbs.insert();
      });

      it('does just fine with an err with no " at " lines', function() {
        var err = {
          stack: 'some random text'
        };
        breadcrumbs.insert(err);

        expect(err).to.have.property('stack').that.match(/test_breadcrumbs.js/);
      });
    });

    describe('#add', function() {
      it('merges keys into error', function() {
        var err = new Error();
        breadcrumbs.add(err, null, {left: 1, right: 2});

        expect(err).to.have.property('left', 1);
        expect(err).to.have.property('right', 2);
      });

      it('does not overwrite message', function() {
        var err = new Error('original message');
        breadcrumbs.add(err, null, {message: 'new message'});

        expect(err).to.have.property('message', 'original message');
      });

      it('does just fine with no err', function() {
        breadcrumbs.add();
      });

      it('calls callback and returns true if err provided', function() {
        var cb = sinon.stub();
        var actual = breadcrumbs.add({}, cb);

        expect(actual).to.equal(true);
        expect(cb).to.have.property('callCount', 1);
      });

      it('does not callback and returns false if err provided', function() {
        var cb = sinon.stub();
        var actual = breadcrumbs.add(null, cb);

        expect(actual).to.equal(false);
        expect(cb).to.have.property('callCount', 0);
      });
    });

    describe('#prepareStack', function() {
      it('includes callstack when log is not set', function() {
        var err;
        try {
          throw new Error('Error Message');
        }
        catch (e) {
          err = e;
        }
        var actual = breadcrumbs.toString(err);

        expect(actual).to.match(/test_breadcrumbs.js/);
      });

      it('include callstack if log is "warn"', function() {
        var err;
        try {
          throw new Error('Error Message');
        }
        catch (e) {
          err = e;
        }
        err.log = 'warn';
        var actual = breadcrumbs.toString(err);

        expect(actual).to.match(/test_breadcrumbs.js/);
      });

      it('does not include callstack if log is "info"', function() {
        var err;
        try {
          throw new Error('Error Message');
        }
        catch (e) {
          err = e;
        }
        err.log = 'info';
        var actual = breadcrumbs.toString(err);

        expect(actual).not.to.match(/test_breadcrumbs.js/);
      });

    });

  });
});
