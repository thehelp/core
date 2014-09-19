# thehelp-core

Basic logging, environment and error management functionality for javascript client/server applications.

## Features

* `breadcrumbs` to help with errors:
  * `add()` tracking them propagating through your callbacks
  * `newError()` ensuring callstacks on the client
  * `toString()` preparing them for logs

Client-only:

* `winston` and `util` shims for use with [`requirejs`](http://requirejs.org/)

Server-only:

* `logs.setupFile()/setupConsole()` for quick `winston` setup on the server
* `env.merge()` method to merge data from 'env.json' with values already on `process.env`

## Setup

First install the project as a dependency:

```
npm install thehelp-core --save
```

### Usage

On the server, just require it and start using it!

```
var core = require('thehelp-core');
core.env.merge();
```

On the client side, you'll just need to tell `requirejs` a few things:

```
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

## Detailed Documentation

Detailed docs be found at this project's GitHub Pages, thanks to `groc`: [http://thehelp.github.io/core](http://thehelp.github.io/core)


## Contributing changes

The client-side `dev` and `dist` tests under 'test/integration' will be your friend. :0) They'll help you ensure that the client-side part of this library is working properly. Use `grunt connect:keepalive` to test it in your browser.

Please cover as many browsers as you can, or use `grunt cross-browser` with your [Sauce Credentials in env.json](https://github.com/thehelp/client-project). When you have some changes ready, please submit a pull request with:

* Justification - why is this change worthwhile? Link to issues, use code samples, etc.
* Documentation changes for your code updates. Be sure to check the groc-generated HTML with `grunt doc`
* A description of how you tested the change. Don't forget about the very-useful `npm link` command :0)

I may ask you to use a `git rebase` to ensure that your commits are not interleaved with commits already in the history. And of course, make sure `grunt` completes successfully. :0)

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
