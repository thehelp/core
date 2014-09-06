
'use strict';

var winston = require('winston');
var test = require('thehelp-test');
var expect = test.expect;

var index = require('../../../src/server/index');

describe('index', function() {
  it('should have logs property', function() {
    expect(index).to.have.property('logs').that.exist;
  });

  it('isNode should be true', function() {
    expect(index).to.have.property('isNode', true);
  });

  it('isClient should be false', function() {
    expect(index).to.have.property('isClient', false);
  });

  it('setupConsole should not crash', function() {
    expect(function() {
      index.logs.setupConsole();
    }).not.to.throw();
    winston.info('test info log!');
  });

  it('setupFile should not crash', function() {
    expect(function() {
      index.logs.setupFile('logs/verbose.log');
    }).not.to.throw();
    winston.warn('test warn log!');
  });
});
