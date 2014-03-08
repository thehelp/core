# thehelp-core

This project provides basic functionality that almost all javascript apps will need. In fact, all this should be included in future javascript implementations, in my humble opinion. :0)

## Features

* some basic string manipulation functions
* some basic color manipulation functions
* timezone.js, and time zone data - min.json with a minimum set, and all.json with comprehensive data
* time.js date formatting and manipuation functions, including a Duration class to make it easy to track timings.
* winston and util shims for use on the client side

## Jump in!

### Install

Include the project in your dependencies:

```
  "thehelp-core": "git+ssh://git@infra:thehelp-core#v1.0.0"
```

### Usage

On the server, just require it and start using it! You will likely need to set the HOST environment variable for everything to work smoothly.

```
var core = require('thehelp-core');
var timezone = core.time.getTimezone();
```

On the client side, it's easiest to pull in `thehelp-core-tz-min.min.js` You can very quickly add it to lib/vendor with the `registerCopyFromDist()` method from `thehelp-project`. Lastly you'll need to ensure that `winston` and `util` are available - you can use the shim files in 'dist/shims.'

## History

### 1.2.1

* Patch version updates: timezone-js, grunt, lodash
* Minor version updates: moment, thehelp-project, thehelp-test
* Fixing too-long lines

### 1.2.0

* instead of looking for timezone data at '[cwd]/lib/vendor/tz' if TIME\_ZONE\_DATA environment variable is not set, we now look inside this node module
* dist/tz folder no longer has server time zone data
* expose moment and timezone js on the time object for direct use
* adding readme

### 1.1.0

* dist/ now has three final versions of thehelp-core - one with all.json timezone data injected, one with min.json timezone data injected, and one that requires jquery/zepto/other to load it dynamically.
* including server timezone data in dist/tz folder

### 1.0.0

* Initial release
* Core logic is all there!


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
