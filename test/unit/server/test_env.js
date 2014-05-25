
'use strict';

var test = require('thehelp-test');
var expect = test.core.expect;

var env = require('../../../src/server/env');

describe('env', function() {
  it('should not overwrite existing env', function() {
    process.env.HOST = 'something';
    env.merge();
    expect(process).to.have.deep.property('env.HOST', 'something');
  });

  it('should load value overwrite existing env', function() {
    delete process.env.HOST;
    env.merge();
    expect(process).to.have.deep.property('env.HOST', 'anything');
  });

  it('should load from custom path', function() {
    env.merge('test/custom.json');
    expect(process).to.have.deep.property('env.CUSTOM', 'value');
  });
});
