## 2.0.2 (2014-09-29)

* `breadcrumbs` on the server is now an instance instead of the class. Long day.

## 2.0.1 (2014-09-29)

* Actually expose `breadcrumbs` on the server

## 2.0.0 (2014-09-19)

* Breaking: Remove `general`, `time`, `string` and `color` root keys and all of their methods
* Breaking: `env.merge()` no longer supports relative paths
* New: `breadcrumbs` key and three public methods on it, available client and server
* New: `env.merge()` first looks for env.js and then env.json in `process.cwd()`
* New: `env.merge()` supports js files in addition to json files
* New: `isNode` and `isClient` keys on root `thehelp-core` object client and server

## 1.6.1  (2014-07-31)

* Really get rid of the old source map files in npm package

## 1.6.0  (2014-07-29)

* Default set of time zones on the server is now taken from tz/min.json. To return to the comprehensive set of timezones, set the TIME\_ZONE\_DATA environment variable to point to tz/all.json.
* Minor version update: `moment` (client and server)
* Update to latest timezone data
* Remove source map files from npm package
* Update dev dependencies

## 1.5.5 (2014-07-28)

* Streamlined implementation of `time.getTimezone()` (no more ugly lookup list), which should also make it more reliable
* New method: `time.getTimezones()` returns a list of timezones, good for user select boxes

## 1.5.4 (2014-06-08)

* All time zone data moved from 'dist/tz' to 'tz' since many projects copy entire contents of 'dist/' directory into their 'lib/vendor' (and tz data is 1MB!)
* Remove timezones.txt from npm package
* Update dev dependencies

## 1.5.3 (2014-05-27)

* Pare down what's in npm package
* All time zone data moved from 'lib/vendor/tz' to 'dist/tz' since 'lib' is now excluded from npm package

## 1.5.2 (2014-05-24)

* Patch version update: `timezone-js` (both client and server)
* Update timezone data
* Update dev dependencies

## 1.5.1 (2014-05-02)

* Minor version update: `moment` (both npm and bower)
* Bower dev dependency update: `jquery`
* Update to gruntfile to copy jquery into 'lib/vendor'

## 1.5.0 (2014-05-01)

* New: server methods to merge environment variables with data in 'env.json' (preferring real environment): `env.merge()`

## 1.4.0 (2014-04-23)

* New: server methods to set up logs easily: `logs.setupConsole()` and `logs.setupFile()`

## 1.3.0 (2014-04-11)

* Updated time zone data
* Patch version update to `timezone-js`
* General version numbers for `winston` and `amdefine`
* Updates of dev dependencies: `blanket`,`thehelp-project`, `thehelp-test`

## 1.2.3 (2014-03-21)

* Patch upgrades (bower): moment
* Dev dependencies: lodash, jquery, requirejs, grunt, thehelp-project, thehelp-test

## 1.2.2 (2014-03-09)

* Source maps now in dist/ with an upgrade to `thehelp-project` dependency

## 1.2.1 (2014-03-08)

* Patch version updates: timezone-js, grunt, lodash
* Minor version updates: moment, thehelp-project, thehelp-test
* Fixing too-long lines

## 1.2.0 (2013-12-02)

* instead of looking for timezone data at '[cwd]/lib/vendor/tz' if TIME\_ZONE\_DATA environment variable is not set, we now look inside this node module
* dist/tz folder no longer has server time zone data
* expose moment and timezone js on the time object for direct use
* adding readme

## 1.1.0 (2013-11-19)

* dist/ now has three final versions of thehelp-core - one with all.json timezone data injected, one with min.json timezone data injected, and one that requires jquery/zepto/other to load it dynamically.
* including server timezone data in dist/tz folder

## 1.0.0 (2013-11-18)

* Initial release
* Core logic is all there!
