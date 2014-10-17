[![Build Status](https://travis-ci.org/thehelp/core.svg?branch=master)](https://travis-ci.org/thehelp/core)

# thehelp-core

Basic logging, environment and error management functionality for javascript client/server applications.

## Features

* `breadcrumbs` to help with errors:
  * `add()` tracking them propagating through your callbacks
  * `newError()` ensuring callstacks on the client
  * `toString()` preparing them for logs

#### Client-only:

* Basic `winston` and `util` shims for use with [`requirejs`](http://requirejs.org/)

#### Server-only:

* `logs.setupFile()/setupConsole()` for quick `winston` setup on the server (if `winston` is installed - if not, these methods do nothing. Tested with `winston@0.7.x` and `winston@0.8.x`)
* `env.merge()` method to merge data from '&lt;CWD>/env.js' (or '&lt;CWD>/env.json', or a path you specify) with values already on `process.env`

## Supported browsers

[![Sauce Test Status](https://saucelabs.com/browser-matrix/thehelp-core.svg)](https://saucelabs.com)

Sadly, IE9 and Safari5 are both unwilling to give us callstacks. We won't crash, but you'll get empty strings for stacks and breadcrumbs like this: '**breadcrumb: &lt;empty>'. Android 4.0 has two extra keys printed out from exceptions: `arguments` and `type`.

(please pardon the sauce labs bug - errors in these downlevel browsers aren't resulting in highlights for the right versions...)

## Setup

First install the project as a dependency:

```bash
npm install thehelp-core --save
```

### Usage

On the server, just require it and start using it!

```javascript
var core = require('thehelp-core');
core.env.merge();
```

On the client side, you'll just need to tell `requirejs` a few things:

```javascript
requirejs.config({
  baseUrl: '/',
  paths: {
    'thehelp-core': 'node_modules/thehelp-core/dist/thehelp-core',

    // you can use the provided shims like this:
    util: 'node_modules/thehelp-core/dist/shims/util_shim',
    winston: 'node_modules/thehelp-core/dist/shims/winston_shim'
  }
})
```

Then you can use `thehelp-core` in your client code (or code that works client/server):

```javascript
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-core'], function(core) {

  return function(param, cb) {
    asyncMethod(param, function(err, result) {
      if (core.breadcrumbs.add(err, cb, {param: param})) {
        return;
      }

      return cb(null, result):
    });

  };

});
```

## Detailed Documentation

Detailed docs be found at this project's GitHub Pages, thanks to [`groc`](https://github.com/nevir/groc): [http://thehelp.github.io/core](http://thehelp.github.io/core)


## Contributing changes

The client-side `dev` and `dist` tests under 'test/integration' will be your friend. :0) They'll help you ensure that the client-side part of this library is working properly. Use `grunt connect:keepalive` to test it in your browser.

Please cover as many browsers as you can, or use `grunt cross-browser` with your [Sauce Credentials in env.json](https://github.com/thehelp/client-project). When you have some changes ready, please submit a pull request with:

* Justification - why is this change worthwhile? Link to issues, use code samples, etc.
* Documentation changes for your code updates. Be sure to check the groc-generated HTML with `grunt doc`
* A description of how you tested the change. Don't forget about the very-useful `npm link` command :0)

I may ask you to use a `git rebase` to ensure that your commits are not interleaved with commits already in the history. And of course, make sure `grunt` completes successfully (take a look at the requirements for [`thehelp-project`](https://github.com/thehelp/project)). :0)

## License

(The MIT License)

Copyright (c) 2013 Scott Nonnenberg &lt;scott@nonnenberg.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
