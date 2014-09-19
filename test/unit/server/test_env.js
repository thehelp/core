
'use strict';

var test = require('thehelp-test');
var expect = test.expect;

var env = require('../../../src/server/env');

describe('env', function() {
  it('#data is empty to start', function() {
    expect(env.data).to.deep.equal({});
  });

  it('doesn\'t overwrite existing env', function() {
    process.env.HOST = 'something';
    env.merge();

    expect(process.env).to.have.deep.property('HOST', 'something');
    expect(process.env).to.have.property('NODE_ENV', 'development');
  });

  it('loads value', function() {
    delete process.env.HOST;
    env.merge();

    expect(process.env).to.have.property('HOST', 'anything');
    expect(process.env).to.have.property('NODE_ENV', 'development');
  });

  it('throws exception if it can\'t find user-provided path', function() {
    expect(function() {
      env.merge('nonexistent.json');
    }).to['throw']().that.match(/nonexistent\.json/);
  });

  it('loads from custom path', function() {
    env.merge(__dirname + '/custom.json');

    expect(process.env).to.have.property('CUSTOM', 'value');
    expect(process.env).to.have.property('NODE_ENV', 'development');
  });

  it('supports a javascript file, loads only config for NODE_ENV', function() {
    env.merge(__dirname + '/env.js');

    expect(process.env).to.have.property('NODE_ENV', 'production');
    expect(process.env).to.have.property('one', '1');
    expect(process.env).to.have.property('two', 'two');
    expect(process.env).to.have.property('three', '/BLAH/');

    expect(process.env).not.to.have.property('development');
    expect(process.env).not.to.have.property('production');
    expect(process.env).not.to.have.property('four');
  });

  it('supports a javascript file, loads top-level config', function() {
    env.merge(__dirname + '/env_top.js');

    expect(process.env).to.have.property('NODE_ENV', 'development');
    expect(process.env).to.have.property('one', '1');
    expect(process.env).to.have.property('two', 'two');
    expect(process.env).to.have.property('four', 'four');
  });

  it('makes loaded data available', function() {
    env.merge(__dirname + '/env_top.js');

    expect(process.env).to.have.property('NODE_ENV', 'development');
    expect(env).to.have.deep.property('data.nested.left', 'yes');
    expect(env).to.have.deep.property('data.nested.right', 'no');
  });
});
