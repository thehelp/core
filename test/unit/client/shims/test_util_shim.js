if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'util'], function(test, util) {

  'use strict';

  var sinon = test.sinon;
  var expect = test.expect;

  describe('util_shim', function() {

    describe('#inspect', function() {
      it('calls an object\'s inspect property if it\'s a function', function() {
        var target = {
          left: 'yes',
          right: 'no',
          inspect: function() {
            return this.left + '/' + this.right;
          }
        };

        var expected = 'yes/no';
        var actual = util.inspect(target);
        expect(actual).to.equal(expected);
      });

      it('prints out the innards of a object', function() {
        /*jshint -W053 */
        var date = new Date();
        var dateString = date.toISOString();
        var regexString = '^hello$';
        var fn = function(x) {
          return x;
        };

        var target = {
          rawString: 'value1',
          stringObj: new String('value2'),
          regex: new RegExp(regexString),
          date: date,
          nullValue: null,
          undefinedValue: undefined,
          bool: true,
          boolObj: Boolean(true),
          fn: fn,
          inspect: 'non-function'
        };

        var expected = '{\n' +
        '  rawString: "value1",\n' +
        '  stringObj: "value2",\n' +
        '  regex: /' + regexString + '/,\n' +
        '  date: "' + dateString + '",\n' +
        '  nullValue: null,\n' +
        '  undefinedValue: undefined,\n' +
        '  bool: true,\n' +
        '  boolObj: true,\n' +
        '  fn: ' + fn.toString() + ',\n' +
        '  inspect: "non-function"\n' +
        '}';
        var actual = util.inspect(target);
        expect(actual).to.equal(expected);
      });

      it('prints out the message from a plain Error', function() {
        var error = new Error('this is the error message');
        var expected = '[Error: this is the error message]';
        var actual = util.inspect(error);
        expect(actual).to.equal(expected);
      });

      it('prints out any keys added to an Error', function() {
        var error = new Error('this is the error message');
        error.value = 'value #1';
        error.nested = {
          value: 'value #2'
        };
        var expected =
          '{ [Error: this is the error message]\n' +
          '  value: "value #1",\n' +
          '  nested: {\n' +
          '    value: "value #2"\n' +
          '  }\n' +
          '}';
        var actual = util.inspect(error);
        expect(actual).to.equal(expected);
      });

      it('prints out a tree of properties, default depth is three', function() {
        var obj = {
          left: 'yes',
          right: {
            left: 'yes',
            right: {
              left: 'yes',
              right: {
                left: 'yes',
                right: 'no'
              }
            }
          }
        };
        var expected = '{\n' +
        '  left: "yes",\n' +
        '  right: {\n' +
        '    left: "yes",\n' +
        '    right: {\n' +
        '      left: "yes",\n' +
        '      right: [object Object]\n' +
        '    }\n' +
        '  }\n' +
        '}';
        var actual = util.inspect(obj);
        expect(actual).to.equal(expected);
      });

      it('can set depth to less', function() {
        var obj = {
          left: 'yes',
          right: {
            left: 'yes',
            right: {
              left: 'yes',
              right: {
                left: 'yes',
                right: 'no'
              }
            }
          }
        };
        var expected = '{\n' +
        '  left: "yes",\n' +
        '  right: {\n' +
        '    left: "yes",\n' +
        '    right: [object Object]\n' +
        '  }\n' +
        '}';
        var actual = util.inspect(obj, {depth: 2});
        expect(actual).to.equal(expected);
      });

      it('handles an array', function() {
        var obj = ['one', 'two', 'three'];
        var expected = '["one", "two", "three"]';
        var actual = util.inspect(obj);
        expect(actual).to.equal(expected);
      });
    });

    describe('#inherits', function() {
      it('attaches String methods to target prototype', function() {
        function Target() {}
        Target.prototype.target = sinon.stub();

        function Source() {}
        Source.prototype.source = sinon.stub();

        util.inherits(Target, Source);

        var target = new Target();
        target.source();

        expect(Source).to.have.deep.property('prototype.source.callCount', 1);
      });
    });
  });
});
