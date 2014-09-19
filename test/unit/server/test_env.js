
'use strict';

var test = require('thehelp-test');
var expect = test.expect;

var env = require('../../../src/server/env');

describe('env', function() {
  it('doesn\'t overwrite existing env', function() {
    process.env.HOST = 'something';
    env.merge();

    expect(process.env).to.have.deep.property('HOST', 'something');
  });

  it('loads value', function() {
    delete process.env.HOST;
    env.merge();

    expect(process.env).to.have.property('HOST', 'anything');
  });

  it('throws exception if it can\'t find user-provided path', function() {
    expect(function() {
      env.merge('nonexistent.json');
    }).to['throw']().that.match(/nonexistent\.json/);
  });

  it('loads from custom path', function() {
    env.merge(__dirname + '/custom.json');

    expect(process.env).to.have.property('CUSTOM', 'value');
  });

  it('supports a javascript file', function() {
    env.merge(__dirname + '/env.js');

    expect(process.env).to.have.property('NODE_ENV', 'production');
    expect(process.env).to.have.property('one', '1');
    expect(process.env).to.have.property('two', 'two');
    expect(process.env).to.have.property('three', '/BLAH/');
  });
});
