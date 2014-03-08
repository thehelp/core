// Sometimes you need more than one empty module. And RequireJS
// [doesn't like it](http://requirejs.org/docs/errors.html#timeout) when you reference the
// same module with two different paths/names. Annoying, certainly. But, you know, we're
// practical around here.
define(function() {
  'use strict';

  return {};
});

