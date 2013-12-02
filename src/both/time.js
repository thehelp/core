/*
# time
All things time. Uses [Moment](http://momentjs.com/) and [TimezoneJS](https://github.com/mde/timezone-js)
to present a number of simple time-related methods.

__Server__: On the server side, timezone data is loaded from either 'lib/vendor/tz' or a directory
you specify with the TIME\_ZONE\_DATA environment variable.

__Browser__: To make browser usage easier, this project has a [grunt task](../../Gruntfile.html)
which injects time zone data into the file itself. _NOTE: If you don't end up using one of
these versions of 'thehelp-core', `timezone-js` will need to use AJAX to pull in time zone
data. This will require Fleegix, jQuery or Zepto as well as `window.tzUrl` set to the
location of the JSON file containing timezone info._

__NOTE:__ In this file, when we talk about times being in the _default timezone_,
we mean that they are "correct", the right UTC time. When they are "in a
local timezone" they are no longer correct, and should not be used for anything
but display. They have been shifted so as to be printed out correctly, but their
UTC values are are no longer correct.
*/

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['moment', 'winston', 'util', 'fs', 'timezone-js', './string'],
  function(moment, winston, util, fs, timezonejs, string) {
  'use strict';

  // Setup
  // --------

  // In the browser we synchronously load timezone data from `window.tzUrl`.
  var tz = timezonejs.timezone;
  if (typeof window !== 'undefined') {
    //----- marking this section for injection of timezone JSON
    if (!window.tzUrl) {
      winston.warn('JSON file containing time zone data was not specified via window.tzUrl');
    }
    else {
      tz.loadingScheme = tz.loadingSchemes.MANUAL_LOAD;
      //true here signifies that we want to load the JSON synchronously
      tz.loadZoneJSONData(window.tzUrl, true);
    }
    //-----
  }
  // On the server we load timezone data at the TIME\_ZONE\_DATA environment variable
  // or 'lib/vendor/tz.' We use a synchronous file load to avoid race conditions.
  else {
    tz.loadingScheme = tz.loadingSchemes.PRELOAD_ALL;
    tz.zoneFileBasePath = process.env.TIME_ZONE_DATA || __dirname + '/../../lib/vendor/tz';
    tz.transport = function(options) {
      return fs.readFileSync(options.url).toString();
    };
    tz.init({async: false});
  }

  // Duration
  // --------

  // The `time.Duration` class helps keep track of a span of time.
  // Create a new instance of the class, then use the result of `duration.end()`
  // in your logs to get the amount of time elapsed.
  function Duration() {
    this.start = time.now();
  }

  // `end` can return the raw milliseconds elapsed if `render` is set to false.
  // Otherwise it renders that milliseconds number with `time.renderTimespan`.
  Duration.prototype.end = function(render) {
    if (typeof render === 'undefined') {
      render = true;
    }
    this.end = time.now();
    this.result = this.end.getTime() - this.start.getTime();

    if (!render) {
      return this.result;
    }
    return time.renderTimespan(this.result, true);
  };

  var time = {
    moment: moment,
    timezonejs: timezonejs,
    Duration: Duration,

    // Date Formatting
    // --------

    /*
    `easyLong` produces strings like 'Friday July 26 at 8:15am', or
    'Friday July 26 2012 at 8:15am' if the year is different from
    the current year.

    If you pass in a `timezone`, the `date` passed
    in is assumed to be in the _default timezone_.
    */
    easyLong: function(timezone, date) {
      var now = time.now();
      if (!date) {
        date = time.now();
      }
      if (timezone) {
        date = time.toTimezone(date, timezone);
        now = time.toTimezone(now, timezone);
      }
      if (date.getFullYear() === now.getFullYear()) {
        return moment(date).format('dddd MMM D [at] h:mma');
      }
      else {
        return moment(date).format('dddd MMM D YYYY [at] h:mma');
      }
    },

    /*
    `shortDate` produces strings like 'July 1' or 'July 1 2012' if
    the year is different from the current year.

    If you pass in a `timezone`, the `date` passed
    in is assumed to be in the _default timezone_.
    */
    shortDate: function(timezone, date) {
      var now = time.now();
      if (!date) {
        date = time.now();
      }
      if (timezone) {
        date = time.toTimezone(date, timezone);
        now = time.toTimezone(now, timezone);
      }
      if (date.getFullYear() === now.getFullYear()) {
        return moment(date).format('MMM D');
      }
      else {
        return moment(date).format('MMM D YYYY');
      }
    },

    /*
    `dayOfWeek` produces the full, capitalized day of the week.

    If you pass in a `timezone`, the `date` passed
    in is assumed to be in the _default timezone_.
    */
    dayOfWeek: function(timezone, date) {
      if (!date) {
        date = time.now();
      }
      if (timezone) {
        date = time.toTimezone(date, timezone);
      }
      return moment(date).format('dddd');
    },

    /*
    `parse` tries to generate a date from the provided `text`, `timezone`
    and `now` (base time). 'today', 'tomorrow' and 'yesterday' are accepted, and fully
    qualified dates are supported [by Moment](http://momentjs.com/docs/#/parsing/string/).
    If the date cannot be parsed, this method will return `null`.

    If you pass in a `timezone`, the returned date will in the _default timezone_.
    */
    parse: function(text, timezone, now) {
      if (!now) {
        now = time.now();
      }

      if (text.toLowerCase() === 'today') {
        return now;
      }
      else if (text.toLowerCase() === 'tomorrow') {
        return new Date(now.getTime() + time.DAY_IN_MIL);
      }
      else if (text.toLowerCase() === 'yesterday') {
        return new Date(now.getTime() - time.DAY_IN_MIL);
      }

      var momentParsed = moment(text);
      if (momentParsed.isValid()) {
        var result = momentParsed.toDate();
        if (timezone) {
          result = time.fromTimezone(result, timezone);
        }
        return result;
      }
      else {
        return null;
      }
    },

    // `englishTimespan` produces an easily human-readable phrase describing the amount
    // of time described by `mil` milliseconds. It produces basic strings like
    // "30 seconds" or "2 hours", never including anything but the biggest unit.
    // The next step after "1 hour" is "2 hours", nothing in between.
    englishTimespan: function(mil) {
      if (mil < time.SECOND_IN_MIL) {
        return 'now';
      }

      var steps = [
        {divisor: time.SECOND_IN_MIL, single: 'second', plural: 'seconds'},
        {divisor: time.MINUTE_IN_MIL, single: 'minute', plural: 'minutes'},
        {divisor: time.HOUR_IN_MIL, single: 'hour', plural: 'hours'},
        {divisor: time.DAY_IN_MIL, single: 'day', plural: 'days'},
        {divisor: time.WEEK_IN_MIL, single: 'week', plural: 'weeks'},
        {divisor: time.MONTH_IN_MIL, single: 'month', plural: 'months'},
        {divisor: time.DAY_IN_MIL * 365, single: 'year', plural: 'years'}
      ];

      var index = 0;
      var step = function () {
        var units = Math.floor(mil / steps[index].divisor);
        var next = Math.floor(mil / steps[index + 1].divisor);

        if (next > 0) {
          index = index + 1;
          return step();
        }
        else {
          return string.pluralize(units, steps[index].single, steps[index].plural);
        }
      };

      return step();
    },

    // `renderTimespan` formats `mil` milliseconds as a human-readable
    // time string, like ":02.031" (two seconds and 31 milliseconds)
    // or "4:00" (four minutes). Milliseconds will not be shown unless
    // `withMil` is truthy and the timespan is under one minute.
    renderTimespan: function(mil, withMil) {
      var result = '';

      var hours = Math.floor(mil / time.HOUR_IN_MIL);
      if (hours > 0) {
        result += hours;
        result += ':';
      }

      mil -= time.HOUR_IN_MIL * hours;

      var minutes = Math.floor(mil / time.MINUTE_IN_MIL);
      if (hours > 0) {
        result += time.addPadding(minutes, 2);
      } else if (minutes > 0) {
        result += minutes;
      }
      mil -= time.MINUTE_IN_MIL * minutes;

      var seconds = Math.floor(mil / time.SECOND_IN_MIL);
      result += ':';
      result += time.addPadding(seconds, 2);

      if (withMil && hours === 0 && minutes === 0) {
        mil -= time.SECOND_IN_MIL * seconds;
        result += '.';
        result += time.addPadding(mil, 3);
      }

      return result;
    },

    // Timezone Manipulation
    // --------

    // `toTimezone` takes a `date` and a `timezone`, converting the provided date
    // to the new timezone from the _default timezone_. Useful in rendering times
    // in the user's timezone on a server.
    toTimezone: function(date, timezone) {
      var source = new timezonejs.Date(date.getTime());
      var target = new timezonejs.Date(date.getTime(), timezone);
      return new Date(date.getTime() +
        (source.getTimezoneOffset() - target.getTimezoneOffset()) * time.MINUTE_IN_MIL);
    },

    // `fromTimezone` takes a `date` and a `timezone`, converting the provided
    // date to the _default timezone_, assuming that `date` was previously in
    // the provided `timezone`.
    fromTimezone: function(date, timezone) {
      var source = new timezonejs.Date(date.getTime(), timezone);
      var target = new timezonejs.Date(date.getTime());
      return new Date(date.getTime() -
        (target.getTimezoneOffset() - source.getTimezoneOffset()) * time.MINUTE_IN_MIL);
    },

    // `timezoneAwareDate` is a wrapper around the instantiation of a new
    // `timezoneJS.Date`.
    timezoneAwareDate: function(date, timezone) {
      return new timezonejs.Date(date.getTime(), timezone);
    },

    /*
    `getTimezone` looks up the current timezone. Because timezonejs doesn't
    have a reverse timezone lookup function, we set up a reverse lookup table
    first:

    _TODO: Build this reverse lookup table from timezone data itself._
    */
    getTimezone: function() {
      if (!time.timezoneLookup) {
        var t = {};
        t[-11] = ['Pacific/Pago_Pago'];
        t[-10] = ['US/Hawaii', 'US/Aleutian'];
        t[-9] = ['US/Aleutian', 'Pacific/Gambier', 'US/Alaska'];
        t[-8] = ['US/Pacific', 'US/Alaska', 'Pacific/Pitcairn'];
        t[-7] = ['US/Mountain', 'US/Pacific', 'US/Arizona'];
        t[-6] = ['US/Central', 'US/Mountain', 'America/Costa_Rica'];
        t[-5] = ['US/Eastern', 'US/Central', 'EST'];
        t[-4] = ['US/Eastern', 'Brazil/West', 'Canada/Atlantic'];
        t[-3] = ['Canada/Atlantic', 'Atlantic/Stanley', 'Brazil/East'];
        t[-2] = ['Brazil/East', 'America/Noronha'];
        t[-1] = ['Atlantic/Cape_Verde', 'Atlantic/Azores'];
        t[0] = ['Europe/London', 'UTC', 'Atlantic/Azores'];
        t[1] = ['Europe/London', 'Europe/Rome', 'Africa/Algiers'];
        t[2] = ['Europe/Rome', 'Africa/Cairo', 'Europe/Istanbul'];
        t[3] = ['Europe/Istanbul', 'Africa/Asmara'];
        t[4] = ['Asia/Dubai', 'Asia/Baku'];
        t[5] = ['Asia/Baku', 'Indian/Maldives'];
        t[6] = ['Asia/Almaty'];
        t[7] = ['Asia/Bangkok'];
        t[8] = ['Australia/West'];
        t[9] = ['Asia/Tokyo'];
        t[10] = ['Australia/Sydney', 'Pacific/Guam'];
        t[11] = ['Australia/Sydney', 'Asia/Vladivostok'];
        t[12] = ['Pacific/Auckland', 'Asia/Kamchatka'];
        t[13] = ['Pacific/Auckland', 'Pacific/Enderbury'];
        t[14] = ['Pacific/Kiritimati'];

        time.timezoneLookup = t;
      }

      // Then we go through the potential timezones, changing the current
      // date to that timezone to see if it is changed. If it didn't change,
      // it'll work!
      var date = new Date();
      var tzDate = new timezonejs.Date(date);
      var offsetHours = -(tzDate.getTimezoneOffset() / 60);
      var timezones = time.timezoneLookup[offsetHours];

      for (var i = 0; i < timezones.length; i += 1) {
        var z = timezones[i];
        var offsetDate = time.toTimezone(date, z);

        if (offsetDate.getTime() === date.getTime()) {
          return z;
        }
      }
      return null;
    },

    // Date Manipulation
    // --------

    // `now` returns the current time. Mostly useful to allow for dependency
    // injection while unit testing.
    now: function() {
      return new Date();
    },

    // `offset` just adds `milliseconds` to either the `date` you provide
    // or the current date, and returns a new `Date` object.
    offset: function(milliseconds, date) {
      if (!date) {
        date = time.now();
      }
      var millis = date.getTime() + milliseconds;
      return new Date(millis);
    },

    // `nextDay` looks for the next instance of `day`, where day is something like 'Monday.'
    // You can set the start `date` for the search; otherwise it will use the current time.
    // `timezone` is required to ensure our determination of the day is correct in the
    // user's timezone.
    nextDay: function(day, timezone, date) {
      return this.searchDay(1, day, timezone, date);
    },

    // `lastDay` is exactly like `nextDay`; it just searches in the opposite direction.
    lastDay: function(day, timezone, date) {
      return this.searchDay(-1, day, timezone, date);
    },

    /*
    `searchDay` does the day searching for `nextDay` and `lastDay`.

    _TODO: Think about doing this without basic iteration. Could do it with
    math and indices._
    */
    searchDay: function(direction, day, timezone, date) {
      /*jshint maxcomplexity: 8 */

      if (!time.daysLookup) {
        time.daysLookup = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6
        };
      }

      if (!date) {
        date = time.now();
      }
      if (timezone) {
        date = new timezonejs.Date(date.getTime(), timezone);
      }

      var index = time.daysLookup[day.toLowerCase()];
      if (!index && index !== 0) {
        return null;
      }

      while (date.getDay() !== index) {
        date = time.offset(direction * time.DAY_IN_MIL, date);
        if (timezone) {
          date = new timezonejs.Date(date.getTime(), timezone);
        }
      }
      if (timezone) {
        date = new Date(date.getTime());
      }

      return date;
    },

    // `toMidnight` returns midnight of the day provided, in the target
    // `timezone`. `date` is optional, but assumed to be in the _default
    // timezone_ if provided.
    toMidnight: function(timezone, date) {
      return time.toHour(0, timezone, date);
    },

    // `toHour` truncates the current time or `date` at hour `hour` in the
    // provided `timezone`. `date` is optional, but assumed to be in the _default
    // timezone_ if provided.
    toHour: function(hour, timezone, date) {
      if (!date) {
        date = time.now();
      }

      date = time.timezoneAwareDate(date, timezone);
      date = new timezonejs.Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, timezone);
      return new Date(date.getTime());
    },

    // `toFirstOfMonth` returns the date of the first of the current month
    // for now or the provided `date`.`date` is optional, but assumed to be
    // in the _default timezone_ if provided.
    toFirstOfMonth: function(timezone, date) {
      if (!date) {
        date = time.now();
      }
      date = time.timezoneAwareDate(date, timezone);
      date = new timezonejs.Date(date.getFullYear(), date.getMonth(), 1, timezone);

      return new Date(date.getTime());
    },

    // `isLastDayOfMonth` tells you whether it's the last of the current month
    // for now or the provided `date`.`date` is optional, but assumed to be in
    // the _default timezone_ if provided.
    isLastDayOfMonth: function(timezone, date) {
      if (!date) {
        date = time.now();
      }

      var nextDay = new Date(date.valueOf() + time.DAY_IN_MIL);
      nextDay = time.timezoneAwareDate(nextDay, timezone);
      return nextDay.getDate() === 1;
    },

    // Other
    // --------

    /*
    `addPadding` takes an integer and a number of `digits`, adding leading
    zeros to the string until it gets to the desired length.

    _TODO: Doesn't currently handle negative numbers_
    */
    addPadding: function(number, digits) {
      var result = parseInt(number, 10).toString();
      if (result.length >= digits) {
        return result;
      }
      for (var i = result.length + 1; i <= digits; i += 1) {
        result = '0' + result;
      }
      return result;
    }
  };

  // Useful constants
  time.SECOND_IN_MIL = 1000;
  time.MINUTE_IN_MIL = time.SECOND_IN_MIL * 60;
  time.HOUR_IN_MIL = time.MINUTE_IN_MIL * 60;
  time.DAY_IN_MIL = time.HOUR_IN_MIL * 24;
  time.WEEK_IN_MIL = time.DAY_IN_MIL * 7;
  time.MONTH_IN_MIL = time.DAY_IN_MIL * 30;
  time.YEAR_IN_MIL = time.DAY_IN_MIL * 365;

  return time;
});
