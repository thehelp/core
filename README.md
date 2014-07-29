# thehelp-core

This project provides basic functionality that almost all javascript apps will need, available both on the server and in the client.

## Features

* date formatting and manipuation functions, including a Duration class to make it easy to track timings.
* timezone.js, and time zone data - min.json with a minimum set, and all.json with comprehensive data
* basic string manipulation functions
* basic color manipulation functions
* `winston` and `util` shims for use on the client side

Server-only:

* `logs.setupFile()/setupConsole()` for quick `winston` setup on the server
* `env.merge()` method to merge data from 'env.json' with values already on `process.env`

## Jump in!

### Install

Include the project in your dependencies:

```
npm install thehelp-core --save
```

If you're using `thehelp-client-project` you'll want to pull in the contents of this project's dist folder for your client-side javascript by adding this line in your Gruntfile:

```
config.registerCopyFromDist({
  modules: ['thehelp-core']
})
```

### Usage

On the server, just require it and start using it!

```
var core = require('thehelp-core');
var timezone = core.time.getTimezone();
```

On the client side, it's easiest to pull in `thehelp-core-tz-min.min.js` If you're using `registerCopyFromDist()` method described above, it's already in your 'lib/vendor' directory. Lastly you'll need to ensure that `lodash`, `winston` and `util` are available - you can use the shim files in 'dist/shims.'

## Development

To successfully run tests, you'll need an 'env.json' file in the root directory with this in it - it's where `core.general.getHost()` gets its value on the client side:

```
{
  "HOST": "anything"
}
```

On the client-side, `getHost()` returns the value of `window.host`.

## History

### 1.5.5 (2014-07-28)

* Streamlined implementation of `time.getTimezone()` (no more ugly lookup list), which should also make it more reliable
* New method: `time.getTimezones()` returns a list of timezones, good for user select boxes

### 1.5.4 (2014-06-08)

* All time zone data moved from 'dist/tz' to 'tz' since many projects copy entire contents of 'dist/' directory into their 'lib/vendor' (and tz data is 1MB!)
* Remove timezones.txt from npm package
* Update dev dependencies

### 1.5.3 (2014-05-27)

* Pare down what's in npm package
* All time zone data moved from 'lib/vendor/tz' to 'dist/tz' since 'lib' is now excluded from npm package

### 1.5.2 (2014-05-24)

* Patch version update: `timezone-js` (both client and server)
* Update timezone data
* Update dev dependencies

### 1.5.1 (2014-05-02)

* Minor version update: `moment` (both npm and bower)
* Bower dev dependency update: `jquery`
* Update to gruntfile to copy jquery into 'lib/vendor'

### 1.5.0 (2014-05-01)

* New: server methods to merge environment variables with data in 'env.json' (preferring real environment): `env.merge()`

### 1.4.0 (2014-04-23)

* New: server methods to set up logs easily: `logs.setupConsole()` and `logs.setupFile()`

### 1.3.0 (2014-04-11)

* Updated time zone data
* Patch version update to `timezone-js`
* General version numbers for `winston` and `amdefine`
* Updates of dev dependencies: `blanket`,`thehelp-project`, `thehelp-test`

### 1.2.3 (2014-03-21)

* Patch upgrades (bower): moment
* Dev dependencies: lodash, jquery, requirejs, grunt, thehelp-project, thehelp-test

### 1.2.2 (2014-03-09)

* Source maps now in dist/ with an upgrade to `thehelp-project` dependency

### 1.2.1 (2014-03-08)

* Patch version updates: timezone-js, grunt, lodash
* Minor version updates: moment, thehelp-project, thehelp-test
* Fixing too-long lines

### 1.2.0 (2013-12-02)

* instead of looking for timezone data at '[cwd]/lib/vendor/tz' if TIME\_ZONE\_DATA environment variable is not set, we now look inside this node module
* dist/tz folder no longer has server time zone data
* expose moment and timezone js on the time object for direct use
* adding readme

### 1.1.0 (2013-11-19)

* dist/ now has three final versions of thehelp-core - one with all.json timezone data injected, one with min.json timezone data injected, and one that requires jquery/zepto/other to load it dynamically.
* including server timezone data in dist/tz folder

### 1.0.0 (2013-11-18)

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
