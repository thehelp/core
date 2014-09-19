if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'thehelp-test',
  '../../../src/both/thehelp-core/breadcrumbs',
  'winston'
], function(
  test,
  Breadcrumbs,
  winston
) {

  'use strict';

  var expect = test.expect;
  var sinon = test.sinon;

  describe('breadcrumbs', function() {
    var breadcrumbs;

    beforeEach(function() {
      breadcrumbs = new Breadcrumbs();
    });

    // Public API
    // ========

    describe('#newError', function() {
      it('is well-formed', function wellFormed() {
        var err = breadcrumbs.newError('random', {x: 1, y: 2});
        winston.info(err.stack);

        var message = err.message || err.description;
        expect(message).to.equal('random');

        expect(err).to.have.property('x', 1);
        expect(err).to.have.property('y', 2);

        var stack = err.stack;
        expect(stack).to.exist;
        expect(stack).to.match(/test_breadcrumbs.js/);

        var lines = stack.split('\n');
        if (lines[0] === 'Error: random') {
          expect(lines[1]).to.match(/test_breadcrumbs.js/);
        }
        else {
          expect(lines[0]).to.match(/test_breadcrumbs.js/);
        }
      });
    });

    describe('#add', function() {
      it('adds current file into error\'s stack', function addCurrent() {
        var err = breadcrumbs.newError('something');
        breadcrumbs.add(err, null, {left: 1, right: 2});
        winston.info(err.stack);

        expect(err).to.have.property('stack').that.match(/test_breadcrumbs.js/);

        var lines = err.stack.split('\n');
        if (lines[0] === 'Error: random') {
          expect(lines[1]).to.match(/\*\*breadcrumb:/);
          expect(lines[1]).to.match(/test_breadcrumbs.js/);
          expect(lines[2]).not.to.match(/\*\*breadcrumb:/);
          expect(lines[2]).to.match(/test_breadcrumbs.js/);
        }
        else {
          expect(lines[0]).to.match(/\*\*breadcrumb:/);
          expect(lines[0]).to.match(/test_breadcrumbs.js/);
          expect(lines[1]).not.to.match(/\*\*breadcrumb:/);
          expect(lines[1]).to.match(/test_breadcrumbs.js/);
        }
      });

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

      it('does not call callback and returns false if err provided', function() {
        var cb = sinon.stub();
        var actual = breadcrumbs.add(null, cb);

        expect(actual).to.equal(false);
        expect(cb).to.have.property('callCount', 0);
      });
    });

    describe('#toString', function() {
      var err;

      beforeEach(function() {
        err = breadcrumbs.newError('Error Message', {one: 1, two: 'two'});
        err.stack = 'overridden stack';
      });

      it('returns empty string if err is null', function() {
        var actual = breadcrumbs.toString();

        expect(actual).to.equal('');
      });

      it('includes callstack when log is not set', function() {
        var actual = breadcrumbs.toString(err);

        winston.info(actual);
        expect(actual).to.match(/overridden stack/);
      });

      it('include callstack if log is "error"', function() {
        err.log = 'error';

        var actual = breadcrumbs.toString(err);

        expect(actual).to.match(/overridden stack/);
      });

      it('include callstack if log is "warn"', function() {
        err.log = 'warn';

        var actual = breadcrumbs.toString(err);

        expect(actual).to.match(/overridden stack/);
      });

      it('does not include callstack if log is "info"', function() {
        err.log = 'info';

        var actual = breadcrumbs.toString(err);

        expect(actual).not.to.match(/overridden stack/);
      });
    });

    // Helper functions
    // ========

    describe('#_get', function() {
      it('returns the current line', function currentLine() {
        var actual = breadcrumbs._get();
        winston.info(actual);
        expect(actual).to.match(/test_breadcrumbs.js/);
      });

      it('removes " at " at start of breadcrumb', function() {
        breadcrumbs._getStackTrace = sinon.stub().returns([' at blah']);
        var actual = breadcrumbs._get();
        expect(actual).to.equal('**breadcrumb: blah\n');
      });

      it('handles a no " at " breadcrumb', function() {
        breadcrumbs._getStackTrace = sinon.stub().returns(['blah']);
        var actual = breadcrumbs._get();
        expect(actual).to.equal('**breadcrumb: blah\n');
      });

      it('empty returned if no stacktrace', function() {
        breadcrumbs._getStackTrace = sinon.stub().returns([]);
        var actual = breadcrumbs._get();
        expect(actual).to.equal('**breadcrumb: <empty>\n');
      });
    });

    describe('#_insert', function() {
      var toInsert;

      beforeEach(function() {
        toInsert = 'randomString\n';
        breadcrumbs._get = sinon.stub().returns(toInsert);
      });

      it('puts current file into stack', function() {
        var err = {
          stack: 'Error: something\n' +
            '   at line 1\n' +
            '   at line 2\n'
        };
        breadcrumbs._insert(err);

        expect(err).to.have.property('stack').that.match(/randomString/);
        var lines = err.stack.split('\n');
        expect(lines).to.have.property('1', '  at randomString');
      });

      it('does just fine with an err with no " at " lines', function() {
        var err = {
          stack: 'some random text'
        };
        breadcrumbs._insert(err);

        expect(err).to.have.property('stack').that.match(/randomString/);
        var lines = err.stack.split('\n');
        expect(lines).to.have.property('0', 'randomString');
      });

      it('does just fine with no err', function() {
        breadcrumbs._insert();
      });
    });

    describe('#_prepareStack', function() {
      it('removes everything up to first at "Error:"', function() {
        var err = {
          stack: 'Error: error message\nsecond part of error\nthird part of error\n' +
            '  at second line\n' +
            '  at third line'
        };
        var expected = '  at second line\n' +
            '  at third line';

        var actual = breadcrumbs._prepareStack(err);
        expect(actual).to.equal(expected);
      });

      it('doesn\'t remove first line if no "Error"', function() {
        var err = {
          stack: '  at second line\n' +
            '  at third line'
        };

        var actual = breadcrumbs._prepareStack(err);
        expect(actual).to.equal(err.stack);
      });

      if (typeof process !== 'undefined') {
        it('removes process.cwd()', function() {
          var err = {
            stack: process.cwd() + '  ' + process.cwd() + '  ' + process.cwd()
          };

          var actual = breadcrumbs._prepareStack(err);
          expect(actual).to.equal('    ');
        });
      }
    });

  });
});
