// # color
// This module provides a number of methods for dealing with color.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)


define('src/both/color',[],function() {
  

  return {
    // `parse` takes a string `color` and turns it into its
    // components parts. An object with `red`, `green`, `blue`
    // (and perhaps `alpha`) keys.
    parse: function(color) {
      if (!color) {
        return;
      }
      if (color.substr(0, 1) === '#') {
        return this.parseHex(color);
      }
      else if (color.substr(0, 1) === 'r') {
        return this.parseRgb(color);
      }
      return null;
    },

    /*
    `parseRgb` parses an rgb string into its component parts.
    Like these strings, for example:

    + "rgba(255, 0, 0, 0.5)"
    + "rgb(255, 0, 0)"
    */
    parseRgb: function(color) {
      if (!this.rgbRegex) {
        this.rgbRegex = /rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?(0?[.\d]+))?\)/;
      }

      var match = this.rgbRegex.exec(color);
      if (!match || match.length < 1) {
        return null;
      }
      else {
        var digits = {
          red: parseInt(match[1], 10),
          green: parseInt(match[2], 10),
          blue: parseInt(match[3], 10)
        };
        if (match[5]) {
          digits.alpha = parseFloat(match[5]);
        }
        return digits;
      }
    },

    // `rgbToHex` turns an rgb string into its equivalent
    // hex string. Any alpha channel data will be discarded.
    rgbToHex: function(rgb) {
      if (rgb.substr(0, 1) === '#') {
        return rgb;
      }

      var digits = this.parseRgb(rgb);
      return this.makeHex(digits);
    },

    /*
    `parseHex` parses a hex string into its component parts.
    Like these strings, for example:

    + "#FF0022"
    + "#aa80ff"
    */
    parseHex: function(hex) {
      if (!this.hexRegex) {
        this.hexRegex = /\#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/;
      }

      var match = this.hexRegex.exec(hex);
      if (!match || match.length < 1) {
        return null;
      }
      else {
        return {
          red: parseInt(match[1], 16),
          green: parseInt(match[2], 16),
          blue: parseInt(match[3], 16)
        };
      }
    },

    // `hexToRgb` turns a hex string into its equivalent
    // rgb string.
    hexToRgb: function(hex) {
      if (hex.substr(0, 1) !== '#') {
        return hex;
      }

      var digits = this.parseHex(hex);
      return this.makeRgb(digits);
    },

    // `addTransparency` takes a color string (either hex or rgb)
    // and turns it into an rgba string with the given opacity.
    addTransparency: function(color, opacity) {
      var digits = this.parse(color);
      digits.alpha = opacity;
      return this.makeRgb(digits);
    },
    // `removeTransparency` takes an rgba string and returns
    // an rgb string with the opacity stripped.
    removeTransparency: function(color) {
      var digits = this.parseRgb(color);
      delete digits.alpha;
      return this.makeRgb(digits);
    },

    // `makeRgb` is a helper function to take a digits object
    // and turn it into an rgb or rgba string.
    makeRgb: function(digits) {
      var rgb = 'rgb';
      if (digits.alpha) {
        rgb += 'a';
      }
      rgb += '(' + digits.red + ', ' + digits.green + ', ' + digits.blue;
      if (digits.alpha) {
        rgb += ', ' + digits.alpha;
      }
      rgb += ')';
      return rgb;
    },

    // `makeHex` is a helper function to take a digits object
    // and turn it into a hex string.
    makeHex: function(digits) {
      /*jslint bitwise: true */
      var hex = digits.blue | (digits.green << 8) | (digits.red << 16);
      return '#' + hex.toString(16);
    }
  };
});

// # general
// A few quick utility methods useful just about everywhere.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)


define('src/both/general',['winston', 'util'], function(winston, util) {
  

  return {
    winston: winston,

    // `isNode` checks for `window`, `module` and `process` to make its decision.
    // we're on the client.
    isNode: function() {
      return typeof window === 'undefined' &&
        (typeof module !== 'undefined' || process !== 'undefined');
    },

    // `getHost` the location of this server. On the client, requires
    // `window.host` to be defined. On the server. the `HOST` environment
    // variable.
    getHost: function() {
      if (this.isNode()) {
        return process.env.HOST;
      }
      else {
        if (!window.host) {
          this.winston.warn('window.host not set, returning null!');
        }

        return window.host;
      }
    },

    // `checkError` will log, call a provided (optional) callback and return true
    // if `err` is truthy. Otherwise it will return false.
    checkError: function(message, err, cb) {
      if (err) {
        this.winston.error(util.inspect(err) + ' - ' + message +
         '; callstack: ' + err.stack);

        if (cb) {
          cb(err, null);
        }
        return true;
      }
      else {
        return false;
      }
    },

    // `checkPrecondition` will call the provided callback with an `Error` if the
    // condition isn't truthy.
    checkPrecondition: function(condition, message, cb) {
      if (condition) {
        return false;
      }
      else {
        if (cb) {
          cb(new Error(message), null);
        }
        return true;
      }
    },

    // `setTimeout` and `setInterval` - because it's annoying to pass the callback as the
    // first parameter.
    setTimeout: function(number, cb) {
      return setTimeout(cb, number);
    },

    setInterval: function(number, cb) {
      return setInterval(cb, number);
    }
  };
});

// # string
// A few quick string-related utility methods.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)


define('src/both/string',[],function() {
  

  return {
    // `splice` inserts one string into another at a specified location.
    splice: function(source, location, toInsert) {
      if (location < 0 || location > source.length) {
        throw new Error('location ' + location + ' out of range');
      }
      return source.slice(0, location) + toInsert + source.slice(location);
    },

    // `capitalize` takes the first character of the provided string and makes it
    // uppercase.
    capitalize: function(source) {
      return source.charAt(0).toUpperCase() + source.slice(1);
    },

    // `truncate` returns a string with `limit` characters or less. If the original string
    // was longer than `limit` characters, it will be truncated to fit. Any truncated
    // string will end with an ellipsis ("...") to signify that it's missing info.
    truncate: function(limit, text) {
      var result;
      if (text.length > limit) {
        result = text.substring(0, limit - 3);
        result += '...';
        return result;
      }
      return text;
    },

    // `pluralize` is very simple - it takes a `count` as well as `singular`
    // and `plural` strings. It then returns a string with both the count and the
    // appropriate singular or plural label.
    pluralize: function(count, singular, plural) {
      if (count === 1) {
        return count + ' ' + singular;
      }
      return count + ' ' + plural;
    },

    // `normalizePhoneNumber` takes a number like '(800) 555-3333'
    // and turns it into '+18005553333', which can be used with Twilio.
    normalizePhoneNumber: function(number) {
      number = number.replace(/[() +-]/gi, '');
      if (number.length < 11) {
        number = '1' + number;
      }
      number = '+' + number;
      return number;
    },

    // `formatPhoneNumber` takes a normalized phone number and makes it
    // human-reasonable again.
    formatPhoneNumber: function(number) {
      if (number.length !== 12) {
        return number;
      }
      number = this.splice(number, 2, ' (');
      number = this.splice(number, 7, ') ');
      number = this.splice(number, 12, '-');

      return number;
    },

    // `repeat` repeats the first parameter `n` times.
    repeat: function(target, n) {
      if (n > 0) {
        return target + this.repeat(target, n - 1);
      }
      else {
        return '';
      }
    }
  };
});


//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.5.1",
        global = this,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            mom.month(mom.month() + months * isAdding);
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                var int_val = parseInt(val, 10);
                return val ?
                  (val.length < 3 ? (int_val > 68 ? 1900 + int_val : 2000 + int_val) : int_val) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else {
            config._d = new Date(input);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function (input) {
        return moment(input).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var sod = makeAs(moment(), this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '',
                dayOfMonth;

            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }

                dayOfMonth = this.date();
                this.date(1);
                this._d['set' + utc + 'Month'](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));

                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function () {
            return Math.ceil((this.month() + 1.0) / 3.0);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(deprecate) {
        var warned = false, local_moment = moment;
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        if (deprecate) {
            global.moment = function () {
                if (!warned && console && console.warn) {
                    warned = true;
                    console.warn(
                            "Accessing Moment through the global scope is " +
                            "deprecated, and will be removed in an upcoming " +
                            "release.");
                }
                return local_moment.apply(null, arguments);
            };
            extend(global.moment, local_moment);
        } else {
            global['moment'] = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
        makeGlobal(true);
    } else if (typeof define === "function" && define.amd) {
        define("moment", ['require','exports','module'],function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal !== true) {
                // If user provided noGlobal, he is aware of global
                makeGlobal(module.config().noGlobal === undefined);
            }

            return moment;
        });
    } else {
        makeGlobal();
    }
}).call(this);

// Used for things that are `require()`'d on on the client side but never used.
// For example, [`ModelHelpers`](../../../both/model_helpers.html) loads
// `jugglingdb-postgres` on the client but actually uses a web-appropriate adapter.
define('fs',[],function() {
  

  return {};
});

// -----
// The `timezoneJS.Date` object gives you full-blown timezone support, independent from the timezone set on the end-user's machine running the browser. It uses the Olson zoneinfo files for its timezone data.
//
// The constructor function and setter methods use proxy JavaScript Date objects behind the scenes, so you can use strings like '10/22/2006' with the constructor. You also get the same sensible wraparound behavior with numeric parameters (like setting a value of 14 for the month wraps around to the next March).
//
// The other significant difference from the built-in JavaScript Date is that `timezoneJS.Date` also has named properties that store the values of year, month, date, etc., so it can be directly serialized to JSON and used for data transfer.

/*
 * Copyright 2010 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Credits: Ideas included from incomplete JS implementation of Olson
 * parser, "XMLDAte" by Philippe Goetz (philippe.goetz@wanadoo.fr)
 *
 * Contributions:
 * Jan Niehusmann
 * Ricky Romero
 * Preston Hunt (prestonhunt@gmail.com)
 * Dov. B Katz (dov.katz@morganstanley.com)
 * Peter Bergström (pbergstr@mac.com)
 * Long Ho
 */

 /*jslint laxcomma:true, laxbreak:true, expr:true*/
(function () {
  // Standard initialization stuff to make sure the library is
  // usable on both client and server (node) side.
  
  var root = this;

  // Export the timezoneJS object for Node.js, with backwards-compatibility for the old `require()` API
  var timezoneJS = {};
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = timezoneJS;
    }
    exports.timezoneJS = timezoneJS;
  } else {
    root.timezoneJS = timezoneJS;
  }

  timezoneJS.VERSION = '0.4.4';

  // Grab the ajax library from global context.
  // This can be jQuery, Zepto or fleegix.
  // You can also specify your own transport mechanism by declaring
  // `timezoneJS.timezone.transport` to a `function`. More details will follow
  var ajax_lib = root.$ || root.jQuery || root.Zepto
    , fleegix = root.fleegix
    // Declare constant list of days and months. Unfortunately this doesn't leave room for i18n due to the Olson data being in English itself
    , DAYS = timezoneJS.Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    , MONTHS = timezoneJS.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    , SHORT_MONTHS = {}
    , SHORT_DAYS = {}
    , EXACT_DATE_TIME = {};

  //`{ "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 }`
  for (var i = 0; i < MONTHS.length; i++) {
    SHORT_MONTHS[MONTHS[i].substr(0, 3)] = i;
  }

  //`{ "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 }`
  for (i = 0; i < DAYS.length; i++) {
    SHORT_DAYS[DAYS[i].substr(0, 3)] = i;
  }


  //Handle array indexOf in IE
  //From https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
  //Extending Array prototype causes IE to iterate thru extra element
  var _arrIndexOf = Array.prototype.indexOf || function (el) {
    if (this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === el) {
        return k;
      }
    }
    return -1;
  };

  // Format a number to the length = digits. For ex:
  //
  // `_fixWidth(2, 2) = '02'`
  //
  // `_fixWidth(1998, 2) = '98'`  // year, shorten it to the 2 digit representation
  //
  // `_fixWidth(23, 1) = '23'`  // hour, even with 1 digit specified, do not trim
  //
  // This is used to pad numbers in converting date to string in ISO standard.
  var _fixWidth = function (number, digits) {
    if (typeof number !== "number") { throw "not a number: " + number; }
    var trim = (number > 1000);   // only trim 'year', as the others don't make sense why anyone would want that
    var s = number.toString();
    var s_len = s.length;
    if (trim && s_len > digits) {
      return s.substr(s_len - digits, s_len);
    }
    s = [s];
    while (s_len < digits) {
      s.unshift('0');
      s_len++;
    }
    return s.join('');
  };

  // Abstraction layer for different transport layers, including fleegix/jQuery/Zepto
  //
  // Object `opts` include
  //
  // - `url`: url to ajax query
  //
  // - `async`: true for asynchronous, false otherwise. If false, return value will be response from URL. This is true by default
  //
  // - `success`: success callback function
  //
  // - `error`: error callback function
  // Returns response from URL if async is false, otherwise the AJAX request object itself
  var _transport = function (opts) {
    if ((!fleegix || typeof fleegix.xhr === 'undefined') && (!ajax_lib || typeof ajax_lib.ajax === 'undefined')) {
      throw new Error('Please use the Fleegix.js XHR module, jQuery ajax, Zepto ajax, or define your own transport mechanism for downloading zone files.');
    }
    if (!opts) return;
    if (!opts.url) throw new Error ('URL must be specified');
    if (!('async' in opts)) opts.async = true;
    if (!opts.async) {
      return fleegix && fleegix.xhr
      ? fleegix.xhr.doReq({ url: opts.url, async: false })
      : ajax_lib.ajax({ url : opts.url, async : false, dataType: 'text' }).responseText;
    }
    return fleegix && fleegix.xhr
    ? fleegix.xhr.send({
      url : opts.url,
      method : 'get',
      handleSuccess : opts.success,
      handleErr : opts.error
    })
    : ajax_lib.ajax({
      url : opts.url,
      dataType: 'text',
      method : 'GET',
      error : opts.error,
      success : opts.success
    });
  };

  // Constructor, which is similar to that of the native Date object itself
  timezoneJS.Date = function () {
    if(this === timezoneJS) {
      throw "timezoneJS.Date object must be constructed with 'new'";
    }
    var args = Array.prototype.slice.apply(arguments)
    , dt = null
    , tz = null
    , arr = []
    , valid = false
    ;


    //We support several different constructors, including all the ones from `Date` object
    // with a timezone string at the end.
    //
    //- `[tz]`: Returns object with time in `tz` specified.
    //
    // - `utcMillis`, `[tz]`: Return object with UTC time = `utcMillis`, in `tz`.
    //
    // - `Date`, `[tz]`: Returns object with UTC time = `Date.getTime()`, in `tz`.
    //
    // - `year, month, [date,] [hours,] [minutes,] [seconds,] [millis,] [tz]: Same as `Date` object
    // with tz.
    //
    // - `Array`: Can be any combo of the above.
    //
    //If 1st argument is an array, we can use it as a list of arguments itself
    if (Object.prototype.toString.call(args[0]) === '[object Array]') {
      args = args[0];
    }
    // If the last string argument doesn't parse as a Date, treat it as tz
    if (typeof args[args.length - 1] === 'string') {
      valid = Date.parse(args[args.length - 1].replace(/GMT[\+\-]\d+/, '')); 
      if (isNaN(valid) || valid === null) {  // Checking against null is required for compatability with Datejs
        tz = args.pop();
      }
    }
    var is_dt_local = false;
    switch (args.length) {
      case 0:
        dt = new Date();
        break;
      case 1:
        dt = new Date(args[0]);
        // Date strings are local if they do not contain 'Z', 'T' or timezone offsets like '+0200'
        //  - more info below
        if (typeof args[0] == 'string' && args[0].search(/[+-][0-9]{4}/) == -1
                && args[0].search(/Z/) == -1 && args[0].search(/T/) == -1) {
            is_dt_local = true;
        }
        break;
      case 2:
        dt = new Date(args[0], args[1]);
        is_dt_local = true;
        break;
      default:
        for (var i = 0; i < 7; i++) {
          arr[i] = args[i] || 0;
        }
        dt = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
        is_dt_local = true;
        break;
    }

    this._useCache = false;
    this._tzInfo = {};
    this._day = 0;
    this.year = 0;
    this.month = 0;
    this.date = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timezone = tz || null;
    // Tricky part:
    // The date is either given as unambiguous UTC date or otherwise the date is assumed
    // to be a date in timezone `tz` or a locale date if `tz` is not provided. Thus, to
    // determine how to use `dt` we distinguish between the following cases:
    //  - UTC   (is_dt_local = false)
    //    `timezoneJS.Date(millis, [tz])`
    //    `timezoneJS.Date(Date, [tz])`
    //    `timezoneJS.Date(dt_str_tz, [tz])`
    //  - local/timezone `tz`   (is_dt_local = true)
    //    `timezoneJS.Date(year, mon, day, [hour], [min], [second], [tz])`
    //    `timezoneJS.Date(dt_str, [tz])`
    //
    // `dt_str_tz` is a date string containing timezone information, i.e. containing 'Z', 'T' or
    // /[+-][0-9]{4}/ (e.g. '+0200'), while `dt_str` is a string which does not contain
    // timezone information. See: http://dygraphs.com/date-formats.html
    if (is_dt_local) {
       this.setFromDateObjProxy(dt);
    } else {
       this.setFromTimeProxy(dt.getTime(), tz);
    }
  };

  // Implements most of the native Date object
  timezoneJS.Date.prototype = {
    getDate: function () { return this.date; },
    getDay: function () { return this._day; },
    getFullYear: function () { return this.year; },
    getMonth: function () { return this.month; },
    getYear: function () { return this.year - 1900; },
    getHours: function () { return this.hours; },
    getMilliseconds: function () { return this.milliseconds; },
    getMinutes: function () { return this.minutes; },
    getSeconds: function () { return this.seconds; },
    getUTCDate: function () { return this.getUTCDateProxy().getUTCDate(); },
    getUTCDay: function () { return this.getUTCDateProxy().getUTCDay(); },
    getUTCFullYear: function () { return this.getUTCDateProxy().getUTCFullYear(); },
    getUTCHours: function () { return this.getUTCDateProxy().getUTCHours(); },
    getUTCMilliseconds: function () { return this.getUTCDateProxy().getUTCMilliseconds(); },
    getUTCMinutes: function () { return this.getUTCDateProxy().getUTCMinutes(); },
    getUTCMonth: function () { return this.getUTCDateProxy().getUTCMonth(); },
    getUTCSeconds: function () { return this.getUTCDateProxy().getUTCSeconds(); },
    // Time adjusted to user-specified timezone
    getTime: function () {
      return this._timeProxy + (this.getTimezoneOffset() * 60 * 1000);
    },
    getTimezone: function () { return this.timezone; },
    getTimezoneOffset: function () { return this.getTimezoneInfo().tzOffset; },
    getTimezoneAbbreviation: function () { return this.getTimezoneInfo().tzAbbr; },
    getTimezoneInfo: function () {
      if (this._useCache) return this._tzInfo;
      var res;
      // If timezone is specified, get the correct timezone info based on the Date given
      if (this.timezone) {
        res = this.timezone === 'Etc/UTC' || this.timezone === 'Etc/GMT'
          ? { tzOffset: 0, tzAbbr: 'UTC' }
          : timezoneJS.timezone.getTzInfo(this._timeProxy, this.timezone);
      }
      // If no timezone was specified, use the local browser offset
      else {
        res = { tzOffset: this.getLocalOffset(), tzAbbr: null };
      }
      this._tzInfo = res;
      this._useCache = true;
      return res;
    },
    getUTCDateProxy: function () {
      var dt = new Date(this._timeProxy);
      dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
      return dt;
    },
    setDate: function (date) {
      this.setAttribute('date', date);
      return this.getTime();
    },
    setFullYear: function (year, month, date) {
      if (date !== undefined) { this.setAttribute('date', 1); }
      this.setAttribute('year', year);
      if (month !== undefined) { this.setAttribute('month', month); }
      if (date !== undefined) { this.setAttribute('date', date); }
      return this.getTime();
    },
    setMonth: function (month, date) {
      this.setAttribute('month', month);
      if (date !== undefined) { this.setAttribute('date', date); }
      return this.getTime();
    },
    setYear: function (year) {
      year = Number(year);
      if (0 <= year && year <= 99) { year += 1900; }
      this.setUTCAttribute('year', year);
      return this.getTime();
    },
    setHours: function (hours, minutes, seconds, milliseconds) {
      this.setAttribute('hours', hours);
      if (minutes !== undefined) { this.setAttribute('minutes', minutes); }
      if (seconds !== undefined) { this.setAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setMinutes: function (minutes, seconds, milliseconds) {
      this.setAttribute('minutes', minutes);
      if (seconds !== undefined) { this.setAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setSeconds: function (seconds, milliseconds) {
      this.setAttribute('seconds', seconds);
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setMilliseconds: function (milliseconds) {
      this.setAttribute('milliseconds', milliseconds);
      return this.getTime();
    },
    setTime: function (n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      this.setFromTimeProxy(n, this.timezone);
      return this.getTime();
    },
    setUTCFullYear: function (year, month, date) {
      if (date !== undefined) { this.setUTCAttribute('date', 1); }
      this.setUTCAttribute('year', year);
      if (month !== undefined) { this.setUTCAttribute('month', month); }
      if (date !== undefined) { this.setUTCAttribute('date', date); }
      return this.getTime();
    },
    setUTCMonth: function (month, date) {
      this.setUTCAttribute('month', month);
      if (date !== undefined) { this.setUTCAttribute('date', date); }
      return this.getTime();
    },
    setUTCDate: function (date) {
      this.setUTCAttribute('date', date);
      return this.getTime();
    },
    setUTCHours: function (hours, minutes, seconds, milliseconds) {
      this.setUTCAttribute('hours', hours);
      if (minutes !== undefined) { this.setUTCAttribute('minutes', minutes); }
      if (seconds !== undefined) { this.setUTCAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCMinutes: function (minutes, seconds, milliseconds) {
      this.setUTCAttribute('minutes', minutes);
      if (seconds !== undefined) { this.setUTCAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCSeconds: function (seconds, milliseconds) {
      this.setUTCAttribute('seconds', seconds);
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCMilliseconds: function (milliseconds) {
      this.setUTCAttribute('milliseconds', milliseconds);
      return this.getTime();
    },
    setFromDateObjProxy: function (dt) {
      this.year = dt.getFullYear();
      this.month = dt.getMonth();
      this.date = dt.getDate();
      this.hours = dt.getHours();
      this.minutes = dt.getMinutes();
      this.seconds = dt.getSeconds();
      this.milliseconds = dt.getMilliseconds();
      this._day = dt.getDay();
      this._dateProxy = dt;
      this._timeProxy = Date.UTC(this.year, this.month, this.date, this.hours, this.minutes, this.seconds, this.milliseconds);
      this._useCache = false;
    },
    setFromTimeProxy: function (utcMillis, tz) {
      var dt = new Date(utcMillis);
      var tzOffset = tz ? timezoneJS.timezone.getTzInfo(utcMillis, tz, true).tzOffset : dt.getTimezoneOffset();
      dt.setTime(utcMillis + (dt.getTimezoneOffset() - tzOffset) * 60000);
      this.setFromDateObjProxy(dt);
    },
    setAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var dt = this._dateProxy;
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() + unit.substr(1);
      dt['set' + meth](n);
      this.setFromDateObjProxy(dt);
    },
    setUTCAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() + unit.substr(1);
      var dt = this.getUTCDateProxy();
      dt['setUTC' + meth](n);
      dt.setUTCMinutes(dt.getUTCMinutes() - this.getTimezoneOffset());
      this.setFromTimeProxy(dt.getTime() + this.getTimezoneOffset() * 60000, this.timezone);
    },
    setTimezone: function (tz) {
      var previousOffset = this.getTimezoneInfo().tzOffset;
      this.timezone = tz;
      this._useCache = false;
      // Set UTC minutes offsets by the delta of the two timezones
      this.setUTCMinutes(this.getUTCMinutes() - this.getTimezoneInfo().tzOffset + previousOffset);
    },
    removeTimezone: function () {
      this.timezone = null;
      this._useCache = false;
    },
    valueOf: function () { return this.getTime(); },
    clone: function () {
      return this.timezone ? new timezoneJS.Date(this.getTime(), this.timezone) : new timezoneJS.Date(this.getTime());
    },
    toGMTString: function () { return this.toString('EEE, dd MMM yyyy HH:mm:ss Z', 'Etc/GMT'); },
    toLocaleString: function () {},
    toLocaleDateString: function () {},
    toLocaleTimeString: function () {},
    toSource: function () {},
    toISOString: function () { return this.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'Etc/UTC') + 'Z'; },
    toJSON: function () { return this.toISOString(); },
    toDateString: function () { return this.toString('EEE MMM dd yyyy'); },
    toTimeString: function () { return this.toString('H:mm k'); },
    // Allows different format following ISO8601 format:
    toString: function (format, tz) {
      // Default format is the same as toISOString
      if (!format) format = 'yyyy-MM-dd HH:mm:ss';
      var result = format;
      var tzInfo = tz ? timezoneJS.timezone.getTzInfo(this.getTime(), tz) : this.getTimezoneInfo();
      var _this = this;
      // If timezone is specified, get a clone of the current Date object and modify it
      if (tz) {
        _this = this.clone();
        _this.setTimezone(tz);
      }
      var hours = _this.getHours();
      return result
      // fix the same characters in Month names
      .replace(/a+/g, function () { return 'k'; })
      // `y`: year
      .replace(/y+/g, function (token) { return _fixWidth(_this.getFullYear(), token.length); })
      // `d`: date
      .replace(/d+/g, function (token) { return _fixWidth(_this.getDate(), token.length); })
      // `m`: minute
      .replace(/m+/g, function (token) { return _fixWidth(_this.getMinutes(), token.length); })
      // `s`: second
      .replace(/s+/g, function (token) { return _fixWidth(_this.getSeconds(), token.length); })
      // `S`: millisecond
      .replace(/S+/g, function (token) { return _fixWidth(_this.getMilliseconds(), token.length); })
      // 'h': 12 hour format
      .replace(/h+/g, function (token) { return _fixWidth( ((hours%12) === 0) ? 12 : (hours % 12), token.length); })
      // `M`: month. Note: `MM` will be the numeric representation (e.g February is 02) but `MMM` will be text representation (e.g February is Feb)
      .replace(/M+/g, function (token) {
        var _month = _this.getMonth(),
        _len = token.length;
        if (_len > 3) {
          return timezoneJS.Months[_month];
        } else if (_len > 2) {
          return timezoneJS.Months[_month].substring(0, _len);
        }
        return _fixWidth(_month + 1, _len);
      })
      // `k`: AM/PM
      .replace(/k+/g, function () {
        if (hours >= 12) {
          if (hours > 12) {
            hours -= 12;
          }
          return 'PM';
        }
        return 'AM';
      })
      // `H`: hour
      .replace(/H+/g, function (token) { return _fixWidth(hours, token.length); })
      // `E`: day
      .replace(/E+/g, function (token) { return DAYS[_this.getDay()].substring(0, token.length); })
      // `Z`: timezone abbreviation
      .replace(/Z+/gi, function () { return tzInfo.tzAbbr; });
    },
    toUTCString: function () { return this.toGMTString(); },
    civilToJulianDayNumber: function (y, m, d) {
      var a;
      // Adjust for zero-based JS-style array
      m++;
      if (m > 12) {
        a = parseInt(m/12, 10);
        m = m % 12;
        y += a;
      }
      if (m <= 2) {
        y -= 1;
        m += 12;
      }
      a = Math.floor(y / 100);
      var b = 2 - a + Math.floor(a / 4)
        , jDt = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
      return jDt;
    },
    getLocalOffset: function () {
      return this._dateProxy.getTimezoneOffset();
    }
  };


  timezoneJS.timezone = new function () {
    var _this = this
      , regionMap = {'Etc':'etcetera','EST':'northamerica','MST':'northamerica','HST':'northamerica','EST5EDT':'northamerica','CST6CDT':'northamerica','MST7MDT':'northamerica','PST8PDT':'northamerica','America':'northamerica','Pacific':'australasia','Atlantic':'europe','Africa':'africa','Indian':'africa','Antarctica':'antarctica','Asia':'asia','Australia':'australasia','Europe':'europe','WET':'europe','CET':'europe','MET':'europe','EET':'europe'}
      , regionExceptions = {'Pacific/Honolulu':'northamerica','Atlantic/Bermuda':'northamerica','Atlantic/Cape_Verde':'africa','Atlantic/St_Helena':'africa','Indian/Kerguelen':'antarctica','Indian/Chagos':'asia','Indian/Maldives':'asia','Indian/Christmas':'australasia','Indian/Cocos':'australasia','America/Danmarkshavn':'europe','America/Scoresbysund':'europe','America/Godthab':'europe','America/Thule':'europe','Asia/Istanbul':'europe','Asia/Yekaterinburg':'europe','Asia/Omsk':'europe','Asia/Novosibirsk':'europe','Asia/Krasnoyarsk':'europe','Asia/Irkutsk':'europe','Asia/Yakutsk':'europe','Asia/Vladivostok':'europe','Asia/Sakhalin':'europe','Asia/Magadan':'europe','Asia/Kamchatka':'europe','Asia/Anadyr':'europe','Africa/Ceuta':'europe','America/Argentina/Buenos_Aires':'southamerica','America/Argentina/Salta':'southamerica','America/Argentina/San_Luis':'southamerica','America/Argentina/Cordoba':'southamerica','America/Argentina/Tucuman':'southamerica','America/Argentina/La_Rioja':'southamerica','America/Argentina/San_Juan':'southamerica','America/Argentina/Jujuy':'southamerica','America/Argentina/Catamarca':'southamerica','America/Argentina/Mendoza':'southamerica','America/Argentina/Rio_Gallegos':'southamerica','America/Argentina/Ushuaia':'southamerica','America/Aruba':'southamerica','America/La_Paz':'southamerica','America/Noronha':'southamerica','America/Belem':'southamerica','America/Fortaleza':'southamerica','America/Recife':'southamerica','America/Araguaina':'southamerica','America/Maceio':'southamerica','America/Bahia':'southamerica','America/Sao_Paulo':'southamerica','America/Campo_Grande':'southamerica','America/Cuiaba':'southamerica','America/Porto_Velho':'southamerica','America/Boa_Vista':'southamerica','America/Manaus':'southamerica','America/Eirunepe':'southamerica','America/Rio_Branco':'southamerica','America/Santiago':'southamerica','Pacific/Easter':'southamerica','America/Bogota':'southamerica','America/Curacao':'southamerica','America/Guayaquil':'southamerica','Pacific/Galapagos':'southamerica','Atlantic/Stanley':'southamerica','America/Cayenne':'southamerica','America/Guyana':'southamerica','America/Asuncion':'southamerica','America/Lima':'southamerica','Atlantic/South_Georgia':'southamerica','America/Paramaribo':'southamerica','America/Port_of_Spain':'southamerica','America/Montevideo':'southamerica','America/Caracas':'southamerica','GMT':'etcetera','Europe/Nicosia':'asia'};
    function invalidTZError(t) { throw new Error('Timezone "' + t + '" is either incorrect, or not loaded in the timezone registry.'); }
    function builtInLoadZoneFile(fileName, opts) {
      var url = _this.zoneFileBasePath + '/' + fileName;
      return !opts || !opts.async
      ? _this.parseZones(_this.transport({ url : url, async : false }))
      : _this.transport({
        async: true,
        url : url,
        success : function (str) {
          return _this.parseZones(str) && typeof opts.callback === 'function' && opts.callback();
        },
        error : function () {
          throw new Error('Error retrieving "' + url + '" zoneinfo files');
        }
      });
    }
    function getRegionForTimezone(tz) {
      var exc = regionExceptions[tz]
        , reg
        , ret;
      if (exc) return exc;
      reg = tz.split('/')[0];
      ret = regionMap[reg];
      // If there's nothing listed in the main regions for this TZ, check the 'backward' links
      if (ret) return ret;
      var link = _this.zones[tz];
      if (typeof link === 'string') {
        return getRegionForTimezone(link);
      }
      // Backward-compat file hasn't loaded yet, try looking in there
      if (!_this.loadedZones.backward) {
        // This is for obvious legacy zones (e.g., Iceland) that don't even have a prefix like "America/" that look like normal zones
        _this.loadZoneFile('backward');
        return getRegionForTimezone(tz);
      }
      invalidTZError(tz);
    }
    //str has format hh:mm, can be negative
    function parseTimeString(str) {
      var pat = /(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
      var hms = str.match(pat);
      hms[1] = parseInt(hms[1], 10);
      hms[2] = hms[2] ? parseInt(hms[2], 10) : 0;
      hms[3] = hms[3] ? parseInt(hms[3], 10) : 0;
      return hms.slice(1, 5);
    }
    //z is something like `[ '-3:44:40', '-', 'LMT', '1911', 'May', '15', '' ]` or `[ '-5:00', '-', 'EST', '1974', 'Apr', '28', '2:00' ]`
    function processZone(z) {
      if (!z[3]) { return; }
      var yea = parseInt(z[3], 10)
        , mon = 11
        , dat = 31;
      //If month is there
      if (z[4]) {
        mon = SHORT_MONTHS[z[4].substr(0, 3)];
        dat = parseInt(z[5], 10) || 1;
      }
      var t = z[6] ? parseTimeString(z[6]) : [0, 0, 0];
      return [yea, mon, dat, t[0], t[1], t[2]];
    }
    function getZone(dt, tz) {
      var utcMillis = typeof dt === 'number' ? dt : new Date(dt).getTime();
      var t = tz;
      var zoneList = _this.zones[t];
      // Follow links to get to an actual zone
      while (typeof zoneList === "string") {
        t = zoneList;
        zoneList = _this.zones[t];
      }
      if (!zoneList) {
        // Backward-compat file hasn't loaded yet, try looking in there
        if (!_this.loadedZones.backward) {
          //This is for backward entries like "America/Fort_Wayne" that
          // getRegionForTimezone *thinks* it has a region file and zone
          // for (e.g., America => 'northamerica'), but in reality it's a
          // legacy zone we need the backward file for.
          _this.loadZoneFile('backward');
          return getZone(dt, tz);
        }
        invalidTZError(t);
      }
      if (zoneList.length === 0) {
        throw new Error('No Zone found for "' + tz + '" on ' + dt);
      }
      //Do backwards lookup since most use cases deal with newer dates.
      for (var i = zoneList.length - 1; i >= 0; i--) {
        var z = zoneList[i];
        if (z[3] && utcMillis > z[3]) break;
      }
      return zoneList[i+1];
    }
    function getBasicOffset(time) {
      var off = parseTimeString(time)
        , adj = time.charAt(0) === '-' ? -1 : 1;
      off = adj * (((off[0] * 60 + off[1]) * 60 + off[2]) * 1000);
      return off/60/1000;
    }
    function getAdjustedOffset(off, min) {
      return -Math.ceil(min - off);
    }

    //if isUTC is true, date is given in UTC, otherwise it's given
    // in local time (ie. date.getUTC*() returns local time components)
    function getRule(dt, zone, isUTC) {
      var date = typeof dt === 'number' ? new Date(dt) : dt;
      var ruleset = zone[1];
      var basicOffset = zone[0];

      // If the zone has a DST rule like '1:00', create a rule and return it
      // instead of looking it up in the parsed rules
      var staticDstMatch = ruleset.match(/^([0-9]):([0-9][0-9])$/);
      if (staticDstMatch) {
        return [-1000000, 'max', '-', 'Jan', 1, [0, 0, 0], parseInt(staticDstMatch[1],10) * 60 + parseInt(staticDstMatch[2], 10), '-'];
      }

      //Convert a date to UTC. Depending on the 'type' parameter, the date
      // parameter may be:
      //
      // - `u`, `g`, `z`: already UTC (no adjustment).
      //
      // - `s`: standard time (adjust for time zone offset but not for DST)
      //
      // - `w`: wall clock time (adjust for both time zone and DST offset).
      //
      // DST adjustment is done using the rule given as third argument.
      var convertDateToUTC = function (date, type, rule) {
        var offset = 0;

        if (type === 'u' || type === 'g' || type === 'z') { // UTC
          offset = 0;
        } else if (type === 's') { // Standard Time
          offset = basicOffset;
        } else if (type === 'w' || !type) { // Wall Clock Time
          offset = getAdjustedOffset(basicOffset, rule[6]);
        } else {
          throw new Error("unknown type " + type);
        }
        offset *= 60 * 1000; // to millis

        return new Date(date.getTime() + offset);
      };

      //Step 1:  Find applicable rules for this year.
      //
      //Step 2:  Sort the rules by effective date.
      //
      //Step 3:  Check requested date to see if a rule has yet taken effect this year.  If not,
      //
      //Step 4:  Get the rules for the previous year.  If there isn't an applicable rule for last year, then
      // there probably is no current time offset since they seem to explicitly turn off the offset
      // when someone stops observing DST.
      //
      // FIXME if this is not the case and we'll walk all the way back (ugh).
      //
      //Step 5:  Sort the rules by effective date.
      //Step 6:  Apply the most recent rule before the current time.
      var convertRuleToExactDateAndTime = function (yearAndRule, prevRule) {
        var year = yearAndRule[0]
          , rule = yearAndRule[1];
          // Assume that the rule applies to the year of the given date.

        var hms = rule[5];
        var effectiveDate;

        if (!EXACT_DATE_TIME[year])
          EXACT_DATE_TIME[year] = {};

        // Result for given parameters is already stored
        if (EXACT_DATE_TIME[year][rule])
          effectiveDate = EXACT_DATE_TIME[year][rule];
        else {
          //If we have a specific date, use that!
          if (!isNaN(rule[4])) {
            effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]], rule[4], hms[0], hms[1], hms[2], 0));
          }
          //Let's hunt for the date.
          else {
            var targetDay
              , operator;
            //Example: `lastThu`
            if (rule[4].substr(0, 4) === "last") {
              // Start at the last day of the month and work backward.
              effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]] + 1, 1, hms[0] - 24, hms[1], hms[2], 0));
              targetDay = SHORT_DAYS[rule[4].substr(4, 3)];
              operator = "<=";
            }
            //Example: `Sun>=15`
            else {
              //Start at the specified date.
              effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]], rule[4].substr(5), hms[0], hms[1], hms[2], 0));
              targetDay = SHORT_DAYS[rule[4].substr(0, 3)];
              operator = rule[4].substr(3, 2);
            }
            var ourDay = effectiveDate.getUTCDay();
            //Go forwards.
            if (operator === ">=") {
              effectiveDate.setUTCDate(effectiveDate.getUTCDate() + (targetDay - ourDay + ((targetDay < ourDay) ? 7 : 0)));
            }
            //Go backwards.  Looking for the last of a certain day, or operator is "<=" (less likely).
            else {
              effectiveDate.setUTCDate(effectiveDate.getUTCDate() + (targetDay - ourDay - ((targetDay > ourDay) ? 7 : 0)));
            }
          }
          EXACT_DATE_TIME[year][rule] = effectiveDate;
        }


        //If previous rule is given, correct for the fact that the starting time of the current
        // rule may be specified in local time.
        if (prevRule) {
          effectiveDate = convertDateToUTC(effectiveDate, hms[3], prevRule);
        }
        return effectiveDate;
      };

      var findApplicableRules = function (year, ruleset) {
        var applicableRules = [];
        for (var i = 0; ruleset && i < ruleset.length; i++) {
          //Exclude future rules.
          if (ruleset[i][0] <= year &&
              (
                // Date is in a set range.
                ruleset[i][1] >= year ||
                // Date is in an "only" year.
                  (ruleset[i][0] === year && ruleset[i][1] === "only") ||
                //We're in a range from the start year to infinity.
                    ruleset[i][1] === "max"
          )
             ) {
               //It's completely okay to have any number of matches here.
               // Normally we should only see two, but that doesn't preclude other numbers of matches.
               // These matches are applicable to this year.
               applicableRules.push([year, ruleset[i]]);
             }
        }
        return applicableRules;
      };

      var compareDates = function (a, b, prev) {
        var year, rule;
        if (!(a instanceof Date)) {
          year = a[0];
          rule = a[1];
          a = (!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule])
            ? EXACT_DATE_TIME[year][rule]
            : convertRuleToExactDateAndTime(a, prev);
        } else if (prev) {
          a = convertDateToUTC(a, isUTC ? 'u' : 'w', prev);
        }
        if (!(b instanceof Date)) {
          year = b[0];
          rule = b[1];
          b = (!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule]) ? EXACT_DATE_TIME[year][rule]
            : convertRuleToExactDateAndTime(b, prev);
        } else if (prev) {
          b = convertDateToUTC(b, isUTC ? 'u' : 'w', prev);
        }
        a = Number(a);
        b = Number(b);
        return a - b;
      };

      var year = date.getUTCFullYear();
      var applicableRules;

      applicableRules = findApplicableRules(year, _this.rules[ruleset]);
      applicableRules.push(date);
      //While sorting, the time zone in which the rule starting time is specified
      // is ignored. This is ok as long as the timespan between two DST changes is
      // larger than the DST offset, which is probably always true.
      // As the given date may indeed be close to a DST change, it may get sorted
      // to a wrong position (off by one), which is corrected below.
      applicableRules.sort(compareDates);

      //If there are not enough past DST rules...
      if (_arrIndexOf.call(applicableRules, date) < 2) {
        applicableRules = applicableRules.concat(findApplicableRules(year-1, _this.rules[ruleset]));
        applicableRules.sort(compareDates);
      }
      var pinpoint = _arrIndexOf.call(applicableRules, date);
      if (pinpoint > 1 && compareDates(date, applicableRules[pinpoint-1], applicableRules[pinpoint-2][1]) < 0) {
        //The previous rule does not really apply, take the one before that.
        return applicableRules[pinpoint - 2][1];
      } else if (pinpoint > 0 && pinpoint < applicableRules.length - 1 && compareDates(date, applicableRules[pinpoint+1], applicableRules[pinpoint-1][1]) > 0) {

        //The next rule does already apply, take that one.
        return applicableRules[pinpoint + 1][1];
      } else if (pinpoint === 0) {
        //No applicable rule found in this and in previous year.
        return null;
      }
      return applicableRules[pinpoint - 1][1];
    }
    function getAbbreviation(zone, rule) {
      var base = zone[2];
      if (base.indexOf('%s') > -1) {
        var repl;
        if (rule) {
          repl = rule[7] === '-' ? '' : rule[7];
        }
        //FIXME: Right now just falling back to Standard --
        // apparently ought to use the last valid rule,
        // although in practice that always ought to be Standard
        else {
          repl = 'S';
        }
        return base.replace('%s', repl);
      } else if (base.indexOf('/') > -1) {
        //Chose one of two alternative strings.
        return base.split("/", 2)[rule ? (rule[6] ? 1 : 0) : 0];
      }
      return base;
    }

    this.zoneFileBasePath = null;
    this.zoneFiles = ['africa', 'antarctica', 'asia', 'australasia', 'backward', 'etcetera', 'europe', 'northamerica', 'pacificnew', 'southamerica'];
    this.loadingSchemes = {
      PRELOAD_ALL: 'preloadAll',
      LAZY_LOAD: 'lazyLoad',
      MANUAL_LOAD: 'manualLoad'
    };
    this.getRegionForTimezone = getRegionForTimezone;
    this.loadingScheme = this.loadingSchemes.LAZY_LOAD;
    this.loadedZones = {};
    this.zones = {};
    this.rules = {};

    this.init = function (o) {
      var opts = { async: true }
        , def = this.loadingScheme === this.loadingSchemes.PRELOAD_ALL
          ? this.zoneFiles
          : (this.defaultZoneFile || 'northamerica')
        , done = 0
        , callbackFn;
      //Override default with any passed-in opts
      for (var p in o) {
        opts[p] = o[p];
      }
      if (typeof def === 'string') {
        return this.loadZoneFile(def, opts);
      }
      //Wraps callback function in another one that makes
      // sure all files have been loaded.
      callbackFn = opts.callback;
      opts.callback = function () {
        done++;
        (done === def.length) && typeof callbackFn === 'function' && callbackFn();
      };
      for (var i = 0; i < def.length; i++) {
        this.loadZoneFile(def[i], opts);
      }
    };

    //Get the zone files via XHR -- if the sync flag
    // is set to true, it's being called by the lazy-loading
    // mechanism, so the result needs to be returned inline.
    this.loadZoneFile = function (fileName, opts) {
      if (typeof this.zoneFileBasePath === 'undefined') {
        throw new Error('Please define a base path to your zone file directory -- timezoneJS.timezone.zoneFileBasePath.');
      }
      //Ignore already loaded zones.
      if (this.loadedZones[fileName]) {
        return;
      }
      this.loadedZones[fileName] = true;
      return builtInLoadZoneFile(fileName, opts);
    };
    this.loadZoneJSONData = function (url, sync) {
      var processData = function (data) {
        data = eval('('+ data +')');
        for (var z in data.zones) {
          _this.zones[z] = data.zones[z];
        }
        for (var r in data.rules) {
          _this.rules[r] = data.rules[r];
        }
      };
      return sync
      ? processData(_this.transport({ url : url, async : false }))
      : _this.transport({ url : url, success : processData });
    };
    this.loadZoneDataFromObject = function (data) {
      if (!data) { return; }
      for (var z in data.zones) {
        _this.zones[z] = data.zones[z];
      }
      for (var r in data.rules) {
        _this.rules[r] = data.rules[r];
      }
    };
    this.getAllZones = function () {
      var arr = [];
      for (var z in this.zones) { arr.push(z); }
      return arr.sort();
    };
    this.parseZones = function (str) {
      var lines = str.split('\n')
        , arr = []
        , chunk = ''
        , l
        , zone = null
        , rule = null;
      for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        if (l.match(/^\s/)) {
          l = "Zone " + zone + l;
        }
        l = l.split("#")[0];
        if (l.length > 3) {
          arr = l.split(/\s+/);
          chunk = arr.shift();
          //Ignore Leap.
          switch (chunk) {
            case 'Zone':
              zone = arr.shift();
              if (!_this.zones[zone]) {
                _this.zones[zone] = [];
              }
              if (arr.length < 3) break;
              //Process zone right here and replace 3rd element with the processed array.
              arr.splice(3, arr.length, processZone(arr));
              if (arr[3]) arr[3] = Date.UTC.apply(null, arr[3]);
              arr[0] = -getBasicOffset(arr[0]);
              _this.zones[zone].push(arr);
              break;
            case 'Rule':
              rule = arr.shift();
              if (!_this.rules[rule]) {
                _this.rules[rule] = [];
              }
              //Parse int FROM year and TO year
              arr[0] = parseInt(arr[0], 10);
              arr[1] = parseInt(arr[1], 10) || arr[1];
              //Parse time string AT
              arr[5] = parseTimeString(arr[5]);
              //Parse offset SAVE
              arr[6] = getBasicOffset(arr[6]);
              _this.rules[rule].push(arr);
              break;
            case 'Link':
              //No zones for these should already exist.
              if (_this.zones[arr[1]]) {
                throw new Error('Error with Link ' + arr[1] + '. Cannot create link of a preexisted zone.');
              }
              //Create the link.
              _this.zones[arr[1]] = arr[0];
              break;
          }
        }
      }
      return true;
    };
    //Expose transport mechanism and allow overwrite.
    this.transport = _transport;
    this.getTzInfo = function (dt, tz, isUTC) {
      //Lazy-load any zones not yet loaded.
      if (this.loadingScheme === this.loadingSchemes.LAZY_LOAD) {
        //Get the correct region for the zone.
        var zoneFile = getRegionForTimezone(tz);
        if (!zoneFile) {
          throw new Error('Not a valid timezone ID.');
        }
        if (!this.loadedZones[zoneFile]) {
          //Get the file and parse it -- use synchronous XHR.
          this.loadZoneFile(zoneFile);
        }
      }
      var z = getZone(dt, tz);
      var off = z[0];
      //See if the offset needs adjustment.
      var rule = getRule(dt, z, isUTC);
      if (rule) {
        off = getAdjustedOffset(off, rule[6]);
      }
      var abbr = getAbbreviation(z, rule);
      return { tzOffset: off, tzAbbr: abbr };
    };
  };
}).call(this);

define("timezone-js", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.window.timezoneJS;
    };
}(this)));

/*
# time
All things time. Uses [Moment](http://momentjs.com/) and
[TimezoneJS](https://github.com/mde/timezone-js) to present a number of simple
time-related methods.

__Server__: On the server side, timezone data is loaded from either 'lib/vendor/tz' or a
directory you specify with the TIME\_ZONE\_DATA environment variable.

__Browser__: To make browser usage easier, this project has a
[grunt task](../../Gruntfile.html) which injects time zone data into the file itself.
_NOTE: If you don't end up using one of these versions of 'thehelp-core', `timezone-js`
will need to use AJAX to pull in time zone data. This will require Fleegix, jQuery or
Zepto as well as `window.tzUrl` set to the location of the JSON file containing timezone
info._

__NOTE:__ In this file, when we talk about times being in the _default timezone_,
we mean that they are "correct", the right UTC time. When they are "in a
local timezone" they are no longer correct, and should not be used for anything
but display. They have been shifted so as to be printed out correctly, but their
UTC values are are no longer correct.
*/

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)


define('src/both/time',['moment', 'winston', 'util', 'fs', 'timezone-js', './string'],
  function(moment, winston, util, fs, timezonejs, string) {
  

  // Setup
  // --------

  // In the browser we synchronously load timezone data from `window.tzUrl`.
  var tz = timezonejs.timezone;
  if (typeof window !== 'undefined') {
    var json = '{"zones":{"Africa/Algiers":[["-12.2","-","LMT","-2486678340000"],["-9.35","-","PMT","-1855958400000"],["0","Algeria","WE%sT","-942012000000"],["-60","Algeria","CE%sT","-733276800000"],["0","-","WET","-439430400000"],["-60","-","CET","-212025600000"],["0","Algeria","WE%sT","246240000000"],["-60","Algeria","CE%sT","309744000000"],["0","Algeria","WE%sT","357523200000"],["-60","-","CET",null]],"Africa/Luanda":[["-52.93333333333334","-","LMT","-2429913600000"],["-52.06666666666666","-","AOT","-1849392000000"],["-60","-","WAT",null]],"Africa/Porto-Novo":[["-10.466666666666667","-","LMT","-1798848000000"],["0","-","GMT","-1131235200000"],["-60","-","WAT",null]],"Africa/Gaborone":[["-103.66666666666667","-","LMT","-2650838400000"],["-90","-","SAST","-2109283200000"],["-120","-","CAT","-829519200000"],["-120","1:00","CAST","-813794400000"],["-120","-","CAT",null]],"Africa/Ouagadougou":[["6.066666666666667","-","LMT","-1798848000000"],["0","-","GMT",null]],"Africa/Bujumbura":[["-117.46666666666667","-","LMT","-2493072000000"],["-120","-","CAT",null]],"Africa/Douala":[["-38.8","-","LMT","-1798848000000"],["-60","-","WAT",null]],"Atlantic/Cape_Verde":[["94.06666666666668","-","LMT","-1956700800000"],["120","-","CVT","-862617600000"],["120","1:00","CVST","-764121600000"],["120","-","CVT","186112800000"],["60","-","CVT",null]],"Africa/Bangui":[["-74.33333333333333","-","LMT","-1798848000000"],["-60","-","WAT",null]],"Africa/Ndjamena":[["-60.2","-","LMT","-1798848000000"],["-60","-","WAT","308707200000"],["-60","1:00","WAST","321321600000"],["-60","-","WAT",null]],"Indian/Comoro":[["-173.06666666666666","-","LMT","-1846281600000"],["-180","-","EAT",null]],"Africa/Kinshasa":[["-61.2","-","LMT","-2276640000000"],["-60","-","WAT",null]],"Africa/Lubumbashi":[["-109.86666666666667","-","LMT","-2276640000000"],["-120","-","CAT",null]],"Africa/Brazzaville":[["-61.13333333333333","-","LMT","-1798848000000"],["-60","-","WAT",null]],"Africa/Abidjan":[["16.133333333333333","-","LMT","-1798848000000"],["0","-","GMT",null]],"Africa/Djibouti":[["-172.6","-","LMT","-1846281600000"],["-180","-","EAT",null]],"Africa/Cairo":[["-125.15","-","LMT","-2185401600000"],["-120","Egypt","EE%sT",null]],"Africa/Malabo":[["-35.13333333333333","-","LMT","-1798848000000"],["0","-","GMT","-190857600000"],["-60","-","WAT",null]],"Africa/Asmara":[["-155.53333333333333","-","LMT","-3124224000000"],["-155.53333333333333","-","AMT","-2493072000000"],["-155.33333333333334","-","ADMT","-1062201600000"],["-180","-","EAT",null]],"Africa/Addis_Ababa":[["-154.8","-","LMT","-3124224000000"],["-155.33333333333334","-","ADMT","-1062201600000"],["-180","-","EAT",null]],"Africa/Libreville":[["-37.8","-","LMT","-1798848000000"],["-60","-","WAT",null]],"Africa/Banjul":[["66.6","-","LMT","-1798848000000"],["66.6","-","BMT","-1073088000000"],["60","-","WAT","-157852800000"],["0","-","GMT",null]],"Africa/Accra":[["0.8666666666666666","-","LMT","-1609545600000"],["0","Ghana","%s",null]],"Africa/Conakry":[["54.86666666666667","-","LMT","-1798848000000"],["0","-","GMT","-1131235200000"],["60","-","WAT","-284083200000"],["0","-","GMT",null]],"Africa/Bissau":[["62.333333333333336","-","LMT","-1849392000000"],["60","-","WAT","189216000000"],["0","-","GMT",null]],"Africa/Nairobi":[["-147.26666666666665","-","LMT","-1309737600000"],["-180","-","EAT","-1230854400000"],["-150","-","BEAT","-915235200000"],["-165","-","BEAUT","-284083200000"],["-180","-","EAT",null]],"Africa/Maseru":[["-110","-","LMT","-2109283200000"],["-120","-","SAST","-829519200000"],["-120","1:00","SAST","-813794400000"],["-120","-","SAST",null]],"Africa/Monrovia":[["43.13333333333333","-","LMT","-2745532800000"],["43.13333333333333","-","MMT","-1604361600000"],["44.5","-","LRT","73526400000"],["0","-","GMT",null]],"Africa/Tripoli":[["-52.733333333333334","-","LMT","-1546387200000"],["-60","Libya","CE%sT","-315705600000"],["-120","-","EET","410140800000"],["-60","Libya","CE%sT","641779200000"],["-120","-","EET","844041600000"],["-60","Libya","CE%sT","875923200000"],["-120","-","EET","1352512800000"],["-60","Libya","CE%sT","1382666400000"],["-120","-","EET",null]],"Indian/Antananarivo":[["-190.06666666666666","-","LMT","-1846281600000"],["-180","-","EAT","-499914000000"],["-180","1:00","EAST","-492051600000"],["-180","-","EAT",null]],"Africa/Blantyre":[["-140","-","LMT","-2109283200000"],["-120","-","CAT",null]],"Africa/Bamako":[["32","-","LMT","-1798848000000"],["0","-","GMT","-1131235200000"],["60","-","WAT","-300844800000"],["0","-","GMT",null]],"Africa/Nouakchott":[["63.8","-","LMT","-1798848000000"],["0","-","GMT","-1131235200000"],["60","-","WAT","-286934400000"],["0","-","GMT",null]],"Indian/Mauritius":[["-230","-","LMT","-1956700800000"],["-240","Mauritius","MU%sT",null]],"Indian/Mayotte":[["-180.93333333333334","-","LMT","-1846281600000"],["-180","-","EAT",null]],"Africa/Casablanca":[["30.333333333333332","-","LMT","-1773014400000"],["0","Morocco","WE%sT","448243200000"],["-60","-","CET","536371200000"],["0","Morocco","WE%sT",null]],"Africa/El_Aaiun":[["52.8","-","LMT","-1136073600000"],["60","-","WAT","198288000000"],["0","Morocco","WE%sT",null]],"Africa/Maputo":[["-130.33333333333331","-","LMT","-2109283200000"],["-120","-","CAT",null]],"Africa/Windhoek":[["-68.4","-","LMT","-2458166400000"],["-90","-","SWAT","-2109283200000"],["-120","-","SAST","-860968800000"],["-120","1:00","SAST","-845244000000"],["-120","-","SAST","637977600000"],["-120","-","CAT","765331200000"],["-60","Namibia","WA%sT",null]],"Africa/Niamey":[["-8.466666666666667","-","LMT","-1798848000000"],["60","-","WAT","-1131235200000"],["0","-","GMT","-284083200000"],["-60","-","WAT",null]],"Africa/Lagos":[["-13.6","-","LMT","-1588464000000"],["-60","-","WAT",null]],"Indian/Reunion":[["-221.86666666666665","-","LMT","-1848873600000"],["-240","-","RET",null]],"Africa/Kigali":[["-120.26666666666667","-","LMT","-1091491200000"],["-120","-","CAT",null]],"Atlantic/St_Helena":[["22.8","-","LMT","-2493072000000"],["22.8","-","JMT","-568166400000"],["0","-","GMT",null]],"Africa/Sao_Tome":[["-26.933333333333334","-","LMT","-2682374400000"],["36.53333333333334","-","LMT","-1798848000000"],["0","-","GMT",null]],"Africa/Dakar":[["69.73333333333333","-","LMT","-1798848000000"],["60","-","WAT","-902102400000"],["0","-","GMT",null]],"Indian/Mahe":[["-221.8","-","LMT","-2006640000000"],["-240","-","SCT",null]],"Africa/Freetown":[["53","-","LMT","-2745532800000"],["53","-","FMT","-1785715200000"],["60","SL","%s","-378777600000"],["0","SL","%s",null]],"Africa/Mogadishu":[["-181.46666666666667","-","LMT","-2403561600000"],["-180","-","EAT","-1199318400000"],["-150","-","BEAT","-378777600000"],["-180","-","EAT",null]],"Africa/Johannesburg":[["-112","-","LMT","-2458166400000"],["-90","-","SAST","-2109283200000"],["-120","SA","SAST",null]],"Africa/Khartoum":[["-130.13333333333333","-","LMT","-1199318400000"],["-120","Sudan","CA%sT","947937600000"],["-180","-","EAT",null]],"Africa/Juba":"Africa/Khartoum","Africa/Mbabane":[["-124.4","-","LMT","-2109283200000"],["-120","-","SAST",null]],"Africa/Dar_es_Salaam":[["-157.13333333333335","-","LMT","-1199318400000"],["-180","-","EAT","-662774400000"],["-165","-","BEAUT","-252547200000"],["-180","-","EAT",null]],"Africa/Lome":[["-4.866666666666667","-","LMT","-2398377600000"],["0","-","GMT",null]],"Africa/Tunis":[["-40.733333333333334","-","LMT","-2797200000000"],["-9.35","-","PMT","-1855958400000"],["-60","Tunisia","CE%sT",null]],"Africa/Kampala":[["-129.66666666666669","-","LMT","-1309737600000"],["-180","-","EAT","-1230854400000"],["-150","-","BEAT","-662774400000"],["-165","-","BEAUT","-378777600000"],["-180","-","EAT",null]],"Africa/Lusaka":[["-113.13333333333333","-","LMT","-2109283200000"],["-120","-","CAT",null]],"Africa/Harare":[["-124.2","-","LMT","-2109283200000"],["-120","-","CAT",null]],"Antarctica/Casey":[["0","-","zzz","-86400000"],["-480","-","WST","1255831200000"],["-660","-","CAST","1267754400000"],["-480","-","WST","1319767200000"],["-660","-","CAST","1329843600000"],["-480","-","WST",null]],"Antarctica/Davis":[["0","-","zzz","-409190400000"],["-420","-","DAVT","-163036800000"],["0","-","zzz","-28857600000"],["-420","-","DAVT","1255831200000"],["-300","-","DAVT","1268251200000"],["-420","-","DAVT","1319767200000"],["-300","-","DAVT","1329854400000"],["-420","-","DAVT",null]],"Antarctica/Mawson":[["0","-","zzz","-501206400000"],["-360","-","MAWT","1255831200000"],["-300","-","MAWT",null]],"Indian/Kerguelen":[["0","-","zzz","-599702400000"],["-300","-","TFT",null]],"Antarctica/DumontDUrville":[["0","-","zzz","-694396800000"],["-600","-","PMT","-566956800000"],["0","-","zzz","-415497600000"],["-600","-","DDUT",null]],"Antarctica/Syowa":[["0","-","zzz","-407808000000"],["-180","-","SYOT",null]],"Antarctica/Troll":[["0","-","zzz","1108166400000"],["0","Troll","%s",null]],"Antarctica/Vostok":[["0","-","zzz","-380073600000"],["-360","-","VOST",null]],"Antarctica/Rothera":[["0","-","zzz","218246400000"],["180","-","ROTT",null]],"Antarctica/Palmer":[["0","-","zzz","-126316800000"],["240","ArgAQ","AR%sT","-7603200000"],["180","ArgAQ","AR%sT","389059200000"],["240","ChileAQ","CL%sT",null]],"Asia/Kabul":[["-276.8","-","LMT","-2493072000000"],["-240","-","AFT","-757468800000"],["-270","-","AFT",null]],"Asia/Yerevan":[["-178","-","LMT","-1441152000000"],["-180","-","YERT","-405129600000"],["-240","RussiaAsia","YER%sT","670384800000"],["-180","1:00","YERST","685584000000"],["-180","RussiaAsia","AM%sT","811908000000"],["-240","-","AMT","883526400000"],["-240","RussiaAsia","AM%sT","1332640800000"],["-240","-","AMT",null]],"Asia/Baku":[["-199.4","-","LMT","-1441152000000"],["-180","-","BAKT","-405129600000"],["-240","RussiaAsia","BAK%sT","670384800000"],["-180","1:00","BAKST","683510400000"],["-180","RussiaAsia","AZ%sT","715388400000"],["-240","-","AZT","851990400000"],["-240","EUAsia","AZ%sT","883526400000"],["-240","Azer","AZ%sT",null]],"Asia/Bahrain":[["-202.33333333333334","-","LMT","-1546387200000"],["-240","-","GST","76204800000"],["-180","-","AST",null]],"Asia/Dhaka":[["-361.6666666666667","-","LMT","-2493072000000"],["-353.3333333333333","-","HMT","-891561600000"],["-390","-","BURT","-872035200000"],["-330","-","IST","-862617600000"],["-390","-","BURT","-576115200000"],["-360","-","DACT","38793600000"],["-360","-","BDT","1262217600000"],["-360","Dhaka","BD%sT",null]],"Asia/Thimphu":[["-358.6","-","LMT","-706320000000"],["-330","-","IST","560044800000"],["-360","-","BTT",null]],"Indian/Chagos":[["-289.6666666666667","-","LMT","-1956700800000"],["-300","-","IOT","851990400000"],["-360","-","IOT",null]],"Asia/Brunei":[["-459.6666666666667","-","LMT","-1383436800000"],["-450","-","BNT","-1136160000000"],["-480","-","BNT",null]],"Asia/Rangoon":[["-384.6666666666667","-","LMT","-2808604800000"],["-384.6666666666667","-","RMT","-1546387200000"],["-390","-","BURT","-873244800000"],["-540","-","JST","-778377600000"],["-390","-","MMT",null]],"Asia/Phnom_Penh":[["-419.6666666666667","-","LMT","-2005948800000"],["-426.3333333333333","-","SMT","-1855958340000"],["-420","-","ICT","-1819929600000"],["-480","-","ICT","-1220400000000"],["-420","-","ICT",null]],"Asia/Harbin":[["-506.7333333333333","-","LMT","-1293926400000"],["-510","-","CHAT","-1194048000000"],["-480","-","CST","-915235200000"],["-540","-","CHAT","-115862400000"],["-510","-","CHAT","325987200000"],["-480","PRC","C%sT",null]],"Asia/Shanghai":[["-485.95","-","LMT","-1293926400000"],["-480","Shang","C%sT","-631238400000"],["-480","PRC","C%sT",null]],"Asia/Chongqing":[["-426.3333333333333","-","LMT","-1293926400000"],["-420","-","LONT","325987200000"],["-480","PRC","C%sT",null]],"Asia/Urumqi":[["-350.3333333333333","-","LMT","-1293926400000"],["-360","-","URUT","325987200000"],["-480","PRC","C%sT",null]],"Asia/Kashgar":[["-303.93333333333334","-","LMT","-1293926400000"],["-330","-","KAST","-915235200000"],["-300","-","KAST","325987200000"],["-480","PRC","C%sT",null]],"Asia/Hong_Kong":[["-456.7","-","LMT","-2056665600000"],["-480","HK","HK%sT","-884217600000"],["-540","-","JST","-766713600000"],["-480","HK","HK%sT",null]],"Asia/Taipei":[["-486","-","LMT","-2303683200000"],["-480","Taiwan","C%sT",null]],"Asia/Macau":[["-454.3333333333333","-","LMT","-1798848000000"],["-480","Macau","MO%sT","945648000000"],["-480","PRC","C%sT",null]],"Asia/Nicosia":[["-133.46666666666667","-","LMT","-1518912000000"],["-120","Cyprus","EE%sT","904608000000"],["-120","EUAsia","EE%sT",null]],"Europe/Nicosia":"Asia/Nicosia","Asia/Tbilisi":[["-179.26666666666665","-","LMT","-2808604800000"],["-179.26666666666665","-","TBMT","-1441152000000"],["-180","-","TBIT","-405129600000"],["-240","RussiaAsia","TBI%sT","670384800000"],["-180","1:00","TBIST","671155200000"],["-180","RussiaAsia","GE%sT","725760000000"],["-180","E-EurAsia","GE%sT","778377600000"],["-240","E-EurAsia","GE%sT","844128000000"],["-240","1:00","GEST","857174400000"],["-240","E-EurAsia","GE%sT","1088294400000"],["-180","RussiaAsia","GE%sT","1109642400000"],["-240","-","GET",null]],"Asia/Dili":[["-502.3333333333333","-","LMT","-1798848000000"],["-480","-","TLT","-879123600000"],["-540","-","JST","-766022400000"],["-540","-","TLT","199929600000"],["-480","-","WITA","969148800000"],["-540","-","TLT",null]],"Asia/Kolkata":[["-353.4666666666667","-","LMT","-2808604800000"],["-353.3333333333333","-","HMT","-891561600000"],["-390","-","BURT","-872035200000"],["-330","-","IST","-862617600000"],["-330","1:00","IST","-764121600000"],["-330","-","IST",null]],"Asia/Jakarta":[["-427.2","-","LMT","-3231273600000"],["-427.2","-","BMT","-1451693568000"],["-440","-","JAVT","-1172880000000"],["-450","-","WIB","-876614400000"],["-540","-","JST","-766022400000"],["-450","-","WIB","-683856000000"],["-480","-","WIB","-620784000000"],["-450","-","WIB","-157852800000"],["-420","-","WIB",null]],"Asia/Pontianak":[["-437.3333333333333","-","LMT","-1946160000000"],["-437.3333333333333","-","PMT","-1172880000000"],["-450","-","WIB","-881193600000"],["-540","-","JST","-766022400000"],["-450","-","WIB","-683856000000"],["-480","-","WIB","-620784000000"],["-450","-","WIB","-157852800000"],["-480","-","WITA","567993600000"],["-420","-","WIB",null]],"Asia/Makassar":[["-477.6","-","LMT","-1546387200000"],["-477.6","-","MMT","-1172880000000"],["-480","-","WITA","-880243200000"],["-540","-","JST","-766022400000"],["-480","-","WITA",null]],"Asia/Jayapura":[["-562.8","-","LMT","-1172880000000"],["-540","-","WIT","-799459200000"],["-570","-","CST","-157852800000"],["-540","-","WIT",null]],"Asia/Tehran":[["-205.73333333333335","-","LMT","-1672617600000"],["-205.73333333333335","-","TMT","-725932800000"],["-210","-","IRST","247190400000"],["-240","Iran","IR%sT","315446400000"],["-210","Iran","IR%sT",null]],"Asia/Baghdad":[["-177.66666666666666","-","LMT","-2493072000000"],["-177.6","-","BMT","-1609545600000"],["-180","-","AST","389059200000"],["-180","Iraq","A%sT",null]],"Asia/Jerusalem":[["-140.9","-","LMT","-2808604800000"],["-140.66666666666666","-","JMT","-1609545600000"],["-120","Zion","I%sT",null]],"Asia/Tokyo":[["-558.9833333333333","-","LMT","-2587712400000"],["-540","-","JST","-2303683200000"],["-540","-","CJT","-978393600000"],["-540","Japan","J%sT",null]],"Asia/Amman":[["-143.73333333333335","-","LMT","-1199318400000"],["-120","Jordan","EE%sT",null]],"Asia/Almaty":[["-307.8","-","LMT","-1441152000000"],["-300","-","ALMT","-1247529600000"],["-360","RussiaAsia","ALM%sT","694137600000"],["-360","-","ALMT","725760000000"],["-360","RussiaAsia","ALM%sT","1110844800000"],["-360","-","ALMT",null]],"Asia/Qyzylorda":[["-261.8666666666667","-","LMT","-1441152000000"],["-240","-","KIZT","-1247529600000"],["-300","-","KIZT","354931200000"],["-300","1:00","KIZST","370742400000"],["-360","-","KIZT","386467200000"],["-300","RussiaAsia","KIZ%sT","694137600000"],["-300","-","KIZT","692841600000"],["-300","-","QYZT","695786400000"],["-360","RussiaAsia","QYZ%sT","1110844800000"],["-360","-","QYZT",null]],"Asia/Aqtobe":[["-228.66666666666666","-","LMT","-1441152000000"],["-240","-","AKTT","-1247529600000"],["-300","-","AKTT","354931200000"],["-300","1:00","AKTST","370742400000"],["-360","-","AKTT","386467200000"],["-300","RussiaAsia","AKT%sT","694137600000"],["-300","-","AKTT","692841600000"],["-300","RussiaAsia","AQT%sT","1110844800000"],["-300","-","AQTT",null]],"Asia/Aqtau":[["-201.06666666666666","-","LMT","-1441152000000"],["-240","-","FORT","-1247529600000"],["-300","-","FORT","-189475200000"],["-300","-","SHET","370742400000"],["-360","-","SHET","386467200000"],["-300","RussiaAsia","SHE%sT","694137600000"],["-300","-","SHET","692841600000"],["-300","RussiaAsia","AQT%sT","794023200000"],["-240","RussiaAsia","AQT%sT","1110844800000"],["-300","-","AQTT",null]],"Asia/Oral":[["-205.4","-","LMT","-1441152000000"],["-240","-","URAT","-1247529600000"],["-300","-","URAT","354931200000"],["-300","1:00","URAST","370742400000"],["-360","-","URAT","386467200000"],["-300","RussiaAsia","URA%sT","606880800000"],["-240","RussiaAsia","URA%sT","694137600000"],["-240","-","URAT","692841600000"],["-240","RussiaAsia","ORA%sT","1110844800000"],["-300","-","ORAT",null]],"Asia/Bishkek":[["-298.4","-","LMT","-1441152000000"],["-300","-","FRUT","-1247529600000"],["-360","RussiaAsia","FRU%sT","670384800000"],["-300","1:00","FRUST","683604000000"],["-300","Kyrgyz","KG%sT","1123804800000"],["-360","-","KGT",null]],"Asia/Seoul":[["-507.8666666666667","-","LMT","-2493072000000"],["-510","-","KST","-2053900800000"],["-540","-","KST","-1293926400000"],["-510","-","KST","-1167696000000"],["-540","-","KST","-498096000000"],["-480","ROK","K%sT","-264902400000"],["-510","-","KST","-39484800000"],["-540","ROK","K%sT",null]],"Asia/Pyongyang":[["-503","-","LMT","-2493072000000"],["-510","-","KST","-2053900800000"],["-540","-","KST","-1293926400000"],["-510","-","KST","-1167696000000"],["-540","-","KST","-498096000000"],["-480","-","KST","-264902400000"],["-540","-","KST",null]],"Asia/Kuwait":[["-191.93333333333334","-","LMT","-599702400000"],["-180","-","AST",null]],"Asia/Vientiane":[["-410.4","-","LMT","-2005948800000"],["-426.3333333333333","-","SMT","-1855958340000"],["-420","-","ICT","-1819929600000"],["-480","-","ICT","-1220400000000"],["-420","-","ICT",null]],"Asia/Beirut":[["-142","-","LMT","-2808604800000"],["-120","Lebanon","EE%sT",null]],"Asia/Kuala_Lumpur":[["-406.7666666666667","-","LMT","-2177452800000"],["-415.4166666666667","-","SMT","-2038176000000"],["-420","-","MALT","-1167609600000"],["-420","0:20","MALST","-1073001600000"],["-440","-","MALT","-894153600000"],["-450","-","MALT","-879638400000"],["-540","-","JST","-766972800000"],["-450","-","MALT","378691200000"],["-480","-","MYT",null]],"Asia/Kuching":[["-441.3333333333333","-","LMT","-1383436800000"],["-450","-","BORT","-1136160000000"],["-480","NBorneo","BOR%sT","-879638400000"],["-540","-","JST","-766972800000"],["-480","-","BORT","378691200000"],["-480","-","MYT",null]],"Indian/Maldives":[["-294","-","LMT","-2808604800000"],["-294","-","MMT","-284083200000"],["-300","-","MVT",null]],"Asia/Hovd":[["-366.6","-","LMT","-2032905600000"],["-360","-","HOVT","283910400000"],["-420","Mongol","HOV%sT",null]],"Asia/Ulaanbaatar":[["-427.5333333333333","-","LMT","-2032905600000"],["-420","-","ULAT","283910400000"],["-480","Mongol","ULA%sT",null]],"Asia/Choibalsan":[["-458","-","LMT","-2032905600000"],["-420","-","ULAT","283910400000"],["-480","-","ULAT","418003200000"],["-540","Mongol","CHO%sT","1206921600000"],["-480","Mongol","CHO%sT",null]],"Asia/Kathmandu":[["-341.2666666666667","-","LMT","-1546387200000"],["-330","-","IST","536371200000"],["-345","-","NPT",null]],"Asia/Muscat":[["-234.4","-","LMT","-1546387200000"],["-240","-","GST",null]],"Asia/Karachi":[["-268.2","-","LMT","-1956700800000"],["-330","-","IST","-862617600000"],["-330","1:00","IST","-764121600000"],["-330","-","IST","-576115200000"],["-300","-","KART","38793600000"],["-300","Pakistan","PK%sT",null]],"Asia/Gaza":[["-137.86666666666665","-","LMT","-2185401600000"],["-120","Zion","EET","-682646400000"],["-120","EgyptAsia","EE%sT","-81302400000"],["-120","Zion","I%sT","851990400000"],["-120","Jordan","EE%sT","946598400000"],["-120","Palestine","EE%sT","1219968000000"],["-120","-","EET","1220227200000"],["-120","Palestine","EE%sT","1293753600000"],["-120","-","EET","1269648060000"],["-120","Palestine","EE%sT","1312156800000"],["-120","-","EET","1356912000000"],["-120","Palestine","EE%sT",null]],"Asia/Hebron":[["-140.38333333333335","-","LMT","-2185401600000"],["-120","Zion","EET","-682646400000"],["-120","EgyptAsia","EE%sT","-81302400000"],["-120","Zion","I%sT","851990400000"],["-120","Jordan","EE%sT","946598400000"],["-120","Palestine","EE%sT",null]],"Asia/Manila":[["956","-","LMT","-3944678400000"],["-484","-","LMT","-2229292800000"],["-480","Phil","PH%sT","-873244800000"],["-540","-","JST","-794188800000"],["-480","Phil","PH%sT",null]],"Asia/Qatar":[["-206.13333333333335","-","LMT","-1546387200000"],["-240","-","GST","76204800000"],["-180","-","AST",null]],"Asia/Riyadh":[["-186.86666666666665","-","LMT","-599702400000"],["-180","-","AST",null]],"Asia/Singapore":[["-415.4166666666667","-","LMT","-2177452800000"],["-415.4166666666667","-","SMT","-2038176000000"],["-420","-","MALT","-1167609600000"],["-420","0:20","MALST","-1073001600000"],["-440","-","MALT","-894153600000"],["-450","-","MALT","-879638400000"],["-540","-","JST","-766972800000"],["-450","-","MALT","-138758400000"],["-450","-","SGT","378691200000"],["-480","-","SGT",null]],"Asia/Colombo":[["-319.4","-","LMT","-2808604800000"],["-319.5333333333333","-","MMT","-1988236800000"],["-330","-","IST","-883267200000"],["-330","0:30","IHST","-862617600000"],["-330","1:00","IST","-764028000000"],["-330","-","IST","832982400000"],["-390","-","LKT","846289800000"],["-360","-","LKT","1145061000000"],["-330","-","IST",null]],"Asia/Damascus":[["-145.2","-","LMT","-1546387200000"],["-120","Syria","EE%sT",null]],"Asia/Dushanbe":[["-275.2","-","LMT","-1441152000000"],["-300","-","DUST","-1247529600000"],["-360","RussiaAsia","DUS%sT","670384800000"],["-300","1:00","DUSST","684381600000"],["-300","-","TJT",null]],"Asia/Bangkok":[["-402.06666666666666","-","LMT","-2808604800000"],["-402.06666666666666","-","BMT","-1570060800000"],["-420","-","ICT",null]],"Asia/Ashgabat":[["-233.53333333333333","-","LMT","-1441152000000"],["-240","-","ASHT","-1247529600000"],["-300","RussiaAsia","ASH%sT","670384800000"],["-240","RussiaAsia","ASH%sT","688521600000"],["-240","RussiaAsia","TM%sT","695786400000"],["-300","-","TMT",null]],"Asia/Dubai":[["-221.2","-","LMT","-1546387200000"],["-240","-","GST",null]],"Asia/Samarkand":[["-267.2","-","LMT","-1441152000000"],["-240","-","SAMT","-1247529600000"],["-300","-","SAMT","354931200000"],["-300","1:00","SAMST","370742400000"],["-360","-","TAST","386467200000"],["-300","RussiaAsia","SAM%sT","683683200000"],["-300","RussiaAsia","UZ%sT","725760000000"],["-300","-","UZT",null]],"Asia/Tashkent":[["-277.2","-","LMT","-1441152000000"],["-300","-","TAST","-1247529600000"],["-360","RussiaAsia","TAS%sT","670384800000"],["-300","RussiaAsia","TAS%sT","683683200000"],["-300","RussiaAsia","UZ%sT","725760000000"],["-300","-","UZT",null]],"Asia/Ho_Chi_Minh":[["-426.6666666666667","-","LMT","-2005948800000"],["-426.3333333333333","-","SMT","-1855958340000"],["-420","-","ICT","-1819929600000"],["-480","-","ICT","-1220400000000"],["-420","-","ICT",null]],"Asia/Aden":[["-179.9","-","LMT","-599702400000"],["-180","-","AST",null]],"Australia/Darwin":[["-523.3333333333333","-","LMT","-2364076800000"],["-540","-","CST","-2230156800000"],["-570","Aus","CST",null]],"Australia/Perth":[["-463.4","-","LMT","-2337897600000"],["-480","Aus","WST","-836438400000"],["-480","AW","WST",null]],"Australia/Eucla":[["-515.4666666666667","-","LMT","-2337897600000"],["-525","Aus","CWST","-836438400000"],["-525","AW","CWST",null]],"Australia/Brisbane":[["-612.1333333333333","-","LMT","-2335305600000"],["-600","Aus","EST","62985600000"],["-600","AQ","EST",null]],"Australia/Lindeman":[["-595.9333333333334","-","LMT","-2335305600000"],["-600","Aus","EST","62985600000"],["-600","AQ","EST","709948800000"],["-600","Holiday","EST",null]],"Australia/Adelaide":[["-554.3333333333334","-","LMT","-2364076800000"],["-540","-","CST","-2230156800000"],["-570","Aus","CST","62985600000"],["-570","AS","CST",null]],"Australia/Hobart":[["-589.2666666666667","-","LMT","-2345760000000"],["-600","-","EST","-1680472800000"],["-600","1:00","EST","-1669852800000"],["-600","Aus","EST","-63244800000"],["-600","AT","EST",null]],"Australia/Currie":[["-575.4666666666666","-","LMT","-2345760000000"],["-600","-","EST","-1680472800000"],["-600","1:00","EST","-1669852800000"],["-600","Aus","EST","47174400000"],["-600","AT","EST",null]],"Australia/Melbourne":[["-579.8666666666667","-","LMT","-2364076800000"],["-600","Aus","EST","62985600000"],["-600","AV","EST",null]],"Australia/Sydney":[["-604.8666666666667","-","LMT","-2364076800000"],["-600","Aus","EST","62985600000"],["-600","AN","EST",null]],"Australia/Broken_Hill":[["-565.8","-","LMT","-2364076800000"],["-600","-","EST","-2314915200000"],["-540","-","CST","-2230156800000"],["-570","Aus","CST","62985600000"],["-570","AN","CST","978220800000"],["-570","AS","CST",null]],"Australia/Lord_Howe":[["-636.3333333333334","-","LMT","-2364076800000"],["-600","-","EST","352252800000"],["-630","LH","LHST",null]],"Antarctica/Macquarie":[["0","-","zzz","-2214259200000"],["-600","-","EST","-1680472800000"],["-600","1:00","EST","-1669852800000"],["-600","Aus","EST","-1601683200000"],["0","-","zzz","-687052800000"],["-600","Aus","EST","-63244800000"],["-600","AT","EST","1270350000000"],["-660","-","MIST",null]],"Indian/Christmas":[["-422.8666666666667","-","LMT","-2364076800000"],["-420","-","CXT",null]],"Pacific/Rarotonga":[["639.0666666666666","-","LMT","-2146003200000"],["630","-","CKT","279676800000"],["600","Cook","CK%sT",null]],"Indian/Cocos":[["-387.6666666666667","-","LMT","-2177539200000"],["-390","-","CCT",null]],"Pacific/Fiji":[["-715.7333333333333","-","LMT","-1709942400000"],["-720","Fiji","FJ%sT",null]],"Pacific/Gambier":[["539.8","-","LMT","-1806710400000"],["540","-","GAMT",null]],"Pacific/Marquesas":[["558","-","LMT","-1806710400000"],["570","-","MART",null]],"Pacific/Tahiti":[["598.2666666666667","-","LMT","-1806710400000"],["600","-","TAHT",null]],"Pacific/Guam":[["861","-","LMT","-3944678400000"],["-579","-","LMT","-2146003200000"],["-600","-","GST","977529600000"],["-600","-","ChST",null]],"Pacific/Tarawa":[["-692.0666666666666","-","LMT","-2146003200000"],["-720","-","GILT",null]],"Pacific/Enderbury":[["684.3333333333334","-","LMT","-2146003200000"],["720","-","PHOT","307584000000"],["660","-","PHOT","820368000000"],["-780","-","PHOT",null]],"Pacific/Kiritimati":[["629.3333333333334","-","LMT","-2146003200000"],["640","-","LINT","307584000000"],["600","-","LINT","820368000000"],["-840","-","LINT",null]],"Pacific/Saipan":[["857","-","LMT","-3944678400000"],["-583","-","LMT","-2146003200000"],["-540","-","MPT","-7948800000"],["-600","-","MPT","977529600000"],["-600","-","ChST",null]],"Pacific/Majuro":[["-684.8","-","LMT","-2146003200000"],["-660","-","MHT","-7948800000"],["-720","-","MHT",null]],"Pacific/Kwajalein":[["-669.3333333333334","-","LMT","-2146003200000"],["-660","-","MHT","-7948800000"],["720","-","KWAT","745804800000"],["-720","-","MHT",null]],"Pacific/Chuuk":[["-607.1333333333333","-","LMT","-2146003200000"],["-600","-","CHUT",null]],"Pacific/Pohnpei":[["-632.8666666666667","-","LMT","-2146003200000"],["-660","-","PONT",null]],"Pacific/Kosrae":[["-651.9333333333334","-","LMT","-2146003200000"],["-660","-","KOST","-7948800000"],["-720","-","KOST","946598400000"],["-660","-","KOST",null]],"Pacific/Nauru":[["-667.6666666666666","-","LMT","-1545091200000"],["-690","-","NRT","-877305600000"],["-540","-","JST","-800928000000"],["-690","-","NRT","294364800000"],["-720","-","NRT",null]],"Pacific/Noumea":[["-665.8","-","LMT","-1829347200000"],["-660","NC","NC%sT",null]],"Pacific/Auckland":[["-699.0666666666666","-","LMT","-3192393600000"],["-690","NZ","NZ%sT","-757382400000"],["-720","NZ","NZ%sT",null]],"Pacific/Chatham":[["-733.8","-","LMT","-410227200000"],["-765","Chatham","CHA%sT",null]],"Antarctica/McMurdo":"Pacific/Auckland","Pacific/Niue":[["679.6666666666666","-","LMT","-2146003200000"],["680","-","NUT","-568166400000"],["690","-","NUT","276048000000"],["660","-","NUT",null]],"Pacific/Norfolk":[["-671.8666666666667","-","LMT","-2146003200000"],["-672","-","NMT","-568166400000"],["-690","-","NFT",null]],"Pacific/Palau":[["-537.9333333333334","-","LMT","-2146003200000"],["-540","-","PWT",null]],"Pacific/Port_Moresby":[["-588.6666666666666","-","LMT","-2808604800000"],["-588.5333333333334","-","PMMT","-2335305600000"],["-600","-","PGT",null]],"Pacific/Pitcairn":[["520.3333333333333","-","LMT","-2146003200000"],["510","-","PNT","893635200000"],["480","-","PST",null]],"Pacific/Pago_Pago":[["-757.2","-","LMT","-2855692800000"],["682.8","-","LMT","-1830470400000"],["690","-","SAMT","-599702400000"],["660","-","NST","-86918400000"],["660","-","BST","438998400000"],["660","-","SST",null]],"Pacific/Apia":[["-753.0666666666666","-","LMT","-2855692800000"],["686.9333333333334","-","LMT","-1830470400000"],["690","-","SAMT","-599702400000"],["660","-","WST","1285459200000"],["660","1:00","WSDT","1301716800000"],["660","-","WST","1316833200000"],["660","1:00","WSDT","1325203200000"],["-780","1:00","WSDT","1333252800000"],["-780","WS","WS%sT",null]],"Pacific/Guadalcanal":[["-639.8","-","LMT","-1806710400000"],["-660","-","SBT",null]],"Pacific/Fakaofo":[["684.9333333333334","-","LMT","-2146003200000"],["660","-","TKT","1325203200000"],["-780","-","TKT",null]],"Pacific/Tongatapu":[["-739.3333333333334","-","LMT","-2146003200000"],["-740","-","TOT","-883699200000"],["-780","-","TOT","946598400000"],["-780","Tonga","TO%sT",null]],"Pacific/Funafuti":[["-716.8666666666667","-","LMT","-2146003200000"],["-720","-","TVT",null]],"Pacific/Midway":[["709.4666666666666","-","LMT","-2146003200000"],["660","-","NST","-428544000000"],["660","1:00","NDT","-420681600000"],["660","-","NST","-86918400000"],["660","-","BST","438998400000"],["660","-","SST",null]],"Pacific/Wake":[["-666.4666666666666","-","LMT","-2146003200000"],["-720","-","WAKT",null]],"Pacific/Efate":[["-673.2666666666667","-","LMT","-1829347200000"],["-660","Vanuatu","VU%sT",null]],"Pacific/Wallis":[["-735.3333333333334","-","LMT","-2146003200000"],["-720","-","WFT",null]],"Africa/Asmera":"Africa/Asmara","Africa/Timbuktu":"Africa/Bamako","America/Argentina/ComodRivadavia":"America/Argentina/Catamarca","America/Atka":"America/Adak","America/Buenos_Aires":"America/Argentina/Buenos_Aires","America/Catamarca":"America/Argentina/Catamarca","America/Coral_Harbour":"America/Atikokan","America/Cordoba":"America/Argentina/Cordoba","America/Ensenada":"America/Tijuana","America/Fort_Wayne":"America/Indiana/Indianapolis","America/Indianapolis":"America/Indiana/Indianapolis","America/Jujuy":"America/Argentina/Jujuy","America/Knox_IN":"America/Indiana/Knox","America/Louisville":"America/Kentucky/Louisville","America/Mendoza":"America/Argentina/Mendoza","America/Porto_Acre":"America/Rio_Branco","America/Rosario":"America/Argentina/Cordoba","America/Shiprock":"America/Denver","America/Virgin":"America/Port_of_Spain","Antarctica/South_Pole":"Pacific/Auckland","Asia/Ashkhabad":"Asia/Ashgabat","Asia/Calcutta":"Asia/Kolkata","Asia/Chungking":"Asia/Chongqing","Asia/Dacca":"Asia/Dhaka","Asia/Katmandu":"Asia/Kathmandu","Asia/Macao":"Asia/Macau","Asia/Saigon":"Asia/Ho_Chi_Minh","Asia/Tel_Aviv":"Asia/Jerusalem","Asia/Thimbu":"Asia/Thimphu","Asia/Ujung_Pandang":"Asia/Makassar","Asia/Ulan_Bator":"Asia/Ulaanbaatar","Atlantic/Faeroe":"Atlantic/Faroe","Atlantic/Jan_Mayen":"Europe/Oslo","Australia/ACT":"Australia/Sydney","Australia/Canberra":"Australia/Sydney","Australia/LHI":"Australia/Lord_Howe","Australia/NSW":"Australia/Sydney","Australia/North":"Australia/Darwin","Australia/Queensland":"Australia/Brisbane","Australia/South":"Australia/Adelaide","Australia/Tasmania":"Australia/Hobart","Australia/Victoria":"Australia/Melbourne","Australia/West":"Australia/Perth","Australia/Yancowinna":"Australia/Broken_Hill","Brazil/Acre":"America/Rio_Branco","Brazil/DeNoronha":"America/Noronha","Brazil/East":"America/Sao_Paulo","Brazil/West":"America/Manaus","Canada/Atlantic":"America/Halifax","Canada/Central":"America/Winnipeg","Canada/East-Saskatchewan":"America/Regina","Canada/Eastern":"America/Toronto","Canada/Mountain":"America/Edmonton","Canada/Newfoundland":"America/St_Johns","Canada/Pacific":"America/Vancouver","Canada/Saskatchewan":"America/Regina","Canada/Yukon":"America/Whitehorse","Chile/Continental":"America/Santiago","Chile/EasterIsland":"Pacific/Easter","Cuba":"America/Havana","Egypt":"Africa/Cairo","Eire":"Europe/Dublin","Europe/Belfast":"Europe/London","Europe/Tiraspol":"Europe/Chisinau","GB":"Europe/London","GB-Eire":"Europe/London","GMT+0":"Etc/GMT","GMT-0":"Etc/GMT","GMT0":"Etc/GMT","Greenwich":"Etc/GMT","Hongkong":"Asia/Hong_Kong","Iceland":"Atlantic/Reykjavik","Iran":"Asia/Tehran","Israel":"Asia/Jerusalem","Jamaica":"America/Jamaica","Japan":"Asia/Tokyo","Kwajalein":"Pacific/Kwajalein","Libya":"Africa/Tripoli","Mexico/BajaNorte":"America/Tijuana","Mexico/BajaSur":"America/Mazatlan","Mexico/General":"America/Mexico_City","NZ":"Pacific/Auckland","NZ-CHAT":"Pacific/Chatham","Navajo":"America/Denver","PRC":"Asia/Shanghai","Pacific/Ponape":"Pacific/Pohnpei","Pacific/Samoa":"Pacific/Pago_Pago","Pacific/Truk":"Pacific/Chuuk","Pacific/Yap":"Pacific/Chuuk","Poland":"Europe/Warsaw","Portugal":"Europe/Lisbon","ROC":"Asia/Taipei","ROK":"Asia/Seoul","Singapore":"Asia/Singapore","Turkey":"Europe/Istanbul","UCT":"Etc/UCT","US/Alaska":"America/Anchorage","US/Aleutian":"America/Adak","US/Arizona":"America/Phoenix","US/Central":"America/Chicago","US/East-Indiana":"America/Indiana/Indianapolis","US/Eastern":"America/New_York","US/Hawaii":"Pacific/Honolulu","US/Indiana-Starke":"America/Indiana/Knox","US/Michigan":"America/Detroit","US/Mountain":"America/Denver","US/Pacific":"America/Los_Angeles","US/Samoa":"Pacific/Pago_Pago","UTC":"Etc/UTC","Universal":"Etc/UTC","W-SU":"Europe/Moscow","Zulu":"Etc/UTC","Etc/GMT":[["0","-","GMT",null]],"Etc/UTC":[["0","-","UTC",null]],"Etc/UCT":[["0","-","UCT",null]],"GMT":"Etc/GMT","Etc/Universal":"Etc/UTC","Etc/Zulu":"Etc/UTC","Etc/Greenwich":"Etc/GMT","Etc/GMT-0":"Etc/GMT","Etc/GMT+0":"Etc/GMT","Etc/GMT0":"Etc/GMT","Etc/GMT-14":[["-840","-","GMT-14",null]],"Etc/GMT-13":[["-780","-","GMT-13",null]],"Etc/GMT-12":[["-720","-","GMT-12",null]],"Etc/GMT-11":[["-660","-","GMT-11",null]],"Etc/GMT-10":[["-600","-","GMT-10",null]],"Etc/GMT-9":[["-540","-","GMT-9",null]],"Etc/GMT-8":[["-480","-","GMT-8",null]],"Etc/GMT-7":[["-420","-","GMT-7",null]],"Etc/GMT-6":[["-360","-","GMT-6",null]],"Etc/GMT-5":[["-300","-","GMT-5",null]],"Etc/GMT-4":[["-240","-","GMT-4",null]],"Etc/GMT-3":[["-180","-","GMT-3",null]],"Etc/GMT-2":[["-120","-","GMT-2",null]],"Etc/GMT-1":[["-60","-","GMT-1",null]],"Etc/GMT+1":[["60","-","GMT+1",null]],"Etc/GMT+2":[["120","-","GMT+2",null]],"Etc/GMT+3":[["180","-","GMT+3",null]],"Etc/GMT+4":[["240","-","GMT+4",null]],"Etc/GMT+5":[["300","-","GMT+5",null]],"Etc/GMT+6":[["360","-","GMT+6",null]],"Etc/GMT+7":[["420","-","GMT+7",null]],"Etc/GMT+8":[["480","-","GMT+8",null]],"Etc/GMT+9":[["540","-","GMT+9",null]],"Etc/GMT+10":[["600","-","GMT+10",null]],"Etc/GMT+11":[["660","-","GMT+11",null]],"Etc/GMT+12":[["720","-","GMT+12",null]],"Europe/London":[["1.25","-","LMT","-3852662400000"],["0","GB-Eire","%s","-37238400000"],["-60","-","BST","57722400000"],["0","GB-Eire","%s","851990400000"],["0","EU","GMT/BST",null]],"Europe/Jersey":"Europe/London","Europe/Guernsey":"Europe/London","Europe/Isle_of_Man":"Europe/London","Europe/Dublin":[["25","-","LMT","-2821651200000"],["25.35","-","DMT","-1691964000000"],["25.35","1:00","IST","-1680472800000"],["0","GB-Eire","%s","-1517011200000"],["0","GB-Eire","GMT/IST","-942012000000"],["0","1:00","IST","-733356000000"],["0","-","GMT","-719445600000"],["0","1:00","IST","-699487200000"],["0","-","GMT","-684972000000"],["0","GB-Eire","GMT/IST","-37238400000"],["-60","-","IST","57722400000"],["0","GB-Eire","GMT/IST","851990400000"],["0","EU","GMT/IST",null]],"WET":[["0","EU","WE%sT",null]],"CET":[["-60","C-Eur","CE%sT",null]],"MET":[["-60","C-Eur","ME%sT",null]],"EET":[["-120","EU","EE%sT",null]],"Europe/Tirane":[["-79.33333333333333","-","LMT","-1735776000000"],["-60","-","CET","-932342400000"],["-60","Albania","CE%sT","457488000000"],["-60","EU","CE%sT",null]],"Europe/Andorra":[["-6.066666666666667","-","LMT","-2146003200000"],["0","-","WET","-733881600000"],["-60","-","CET","481082400000"],["-60","EU","CE%sT",null]],"Europe/Vienna":[["-65.35","-","LMT","-2422051200000"],["-60","C-Eur","CE%sT","-1546387200000"],["-60","Austria","CE%sT","-938901600000"],["-60","C-Eur","CE%sT","-781048800000"],["-60","1:00","CEST","-780184800000"],["-60","-","CET","-725932800000"],["-60","Austria","CE%sT","378604800000"],["-60","EU","CE%sT",null]],"Europe/Minsk":[["-110.26666666666667","-","LMT","-2808604800000"],["-110","-","MMT","-1441152000000"],["-120","-","EET","-1247529600000"],["-180","-","MSK","-899769600000"],["-60","C-Eur","CE%sT","-804643200000"],["-180","Russia","MSK/MSD","662601600000"],["-180","-","MSK","670384800000"],["-120","1:00","EEST","686109600000"],["-120","-","EET","701827200000"],["-120","1:00","EEST","717552000000"],["-120","Russia","EE%sT","1301191200000"],["-180","-","FET",null]],"Europe/Brussels":[["-17.5","-","LMT","-2808604800000"],["-17.5","-","BMT","-2450952000000"],["0","-","WET","-1740355200000"],["-60","-","CET","-1693699200000"],["-60","C-Eur","CE%sT","-1613826000000"],["0","Belgium","WE%sT","-934668000000"],["-60","C-Eur","CE%sT","-799286400000"],["-60","Belgium","CE%sT","252374400000"],["-60","EU","CE%sT",null]],"Europe/Sofia":[["-93.26666666666667","-","LMT","-2808604800000"],["-116.93333333333332","-","IMT","-2369520000000"],["-120","-","EET","-857250000000"],["-60","C-Eur","CE%sT","-757468800000"],["-60","-","CET","-781045200000"],["-120","-","EET","291769200000"],["-120","Bulg","EE%sT","401853600000"],["-120","C-Eur","EE%sT","694137600000"],["-120","E-Eur","EE%sT","883526400000"],["-120","EU","EE%sT",null]],"Europe/Prague":[["-57.733333333333334","-","LMT","-3755376000000"],["-57.733333333333334","-","PMT","-2469398400000"],["-60","C-Eur","CE%sT","-798069600000"],["-60","Czech","CE%sT","315446400000"],["-60","EU","CE%sT",null]],"Europe/Copenhagen":[["-50.333333333333336","-","LMT","-2493072000000"],["-50.333333333333336","-","CMT","-2398291200000"],["-60","Denmark","CE%sT","-857253600000"],["-60","C-Eur","CE%sT","-781048800000"],["-60","Denmark","CE%sT","347068800000"],["-60","EU","CE%sT",null]],"Atlantic/Faroe":[["27.066666666666666","-","LMT","-1955750400000"],["0","-","WET","378604800000"],["0","EU","WE%sT",null]],"America/Danmarkshavn":[["74.66666666666667","-","LMT","-1686096000000"],["180","-","WGT","323834400000"],["180","EU","WG%sT","851990400000"],["0","-","GMT",null]],"America/Scoresbysund":[["87.86666666666667","-","LMT","-1686096000000"],["120","-","CGT","323834400000"],["120","C-Eur","CG%sT","354672000000"],["60","EU","EG%sT",null]],"America/Godthab":[["206.93333333333334","-","LMT","-1686096000000"],["180","-","WGT","323834400000"],["180","EU","WG%sT",null]],"America/Thule":[["275.1333333333333","-","LMT","-1686096000000"],["240","Thule","A%sT",null]],"Europe/Tallinn":[["-99","-","LMT","-2808604800000"],["-99","-","TMT","-1638316800000"],["-60","C-Eur","CE%sT","-1593820800000"],["-99","-","TMT","-1535932800000"],["-120","-","EET","-927936000000"],["-180","-","MSK","-892944000000"],["-60","C-Eur","CE%sT","-797644800000"],["-180","Russia","MSK/MSD","606880800000"],["-120","1:00","EEST","622605600000"],["-120","C-Eur","EE%sT","906422400000"],["-120","EU","EE%sT","941414400000"],["-120","-","EET","1014249600000"],["-120","EU","EE%sT",null]],"Europe/Helsinki":[["-99.86666666666667","-","LMT","-2890252800000"],["-99.86666666666667","-","HMT","-1535932800000"],["-120","Finland","EE%sT","441676800000"],["-120","EU","EE%sT",null]],"Europe/Mariehamn":"Europe/Helsinki","Europe/Paris":[["-9.35","-","LMT","-2486678340000"],["-9.35","-","PMT","-1855958340000"],["0","France","WE%sT","-932432400000"],["-60","C-Eur","CE%sT","-800064000000"],["0","France","WE%sT","-766616400000"],["-60","France","CE%sT","252374400000"],["-60","EU","CE%sT",null]],"Europe/Berlin":[["-53.46666666666666","-","LMT","-2422051200000"],["-60","C-Eur","CE%sT","-776556000000"],["-60","SovietZone","CE%sT","-725932800000"],["-60","Germany","CE%sT","347068800000"],["-60","EU","CE%sT",null]],"Europe/Busingen":"Europe/Zurich","Europe/Gibraltar":[["21.4","-","LMT","-2821651200000"],["0","GB-Eire","%s","-401320800000"],["-60","-","CET","410140800000"],["-60","EU","CE%sT",null]],"Europe/Athens":[["-94.86666666666667","-","LMT","-2344636800000"],["-94.86666666666667","-","AMT","-1686095940000"],["-120","Greece","EE%sT","-904867200000"],["-60","Greece","CE%sT","-812419200000"],["-120","Greece","EE%sT","378604800000"],["-120","EU","EE%sT",null]],"Europe/Budapest":[["-76.33333333333333","-","LMT","-2500934400000"],["-60","C-Eur","CE%sT","-1609545600000"],["-60","Hungary","CE%sT","-906933600000"],["-60","C-Eur","CE%sT","-757468800000"],["-60","Hungary","CE%sT","338954400000"],["-60","EU","CE%sT",null]],"Atlantic/Reykjavik":[["87.4","-","LMT","-4165603200000"],["87.8","-","RMT","-1925078400000"],["60","Iceland","IS%sT","-54774000000"],["0","-","GMT",null]],"Europe/Rome":[["-49.93333333333334","-","LMT","-3259094400000"],["-49.93333333333334","-","RMT","-2403561600000"],["-60","Italy","CE%sT","-857253600000"],["-60","C-Eur","CE%sT","-804816000000"],["-60","Italy","CE%sT","347068800000"],["-60","EU","CE%sT",null]],"Europe/Vatican":"Europe/Rome","Europe/San_Marino":"Europe/Rome","Europe/Riga":[["-96.4","-","LMT","-2808604800000"],["-96.4","-","RMT","-1632002400000"],["-96.4","1:00","LST","-1618693200000"],["-96.4","-","RMT","-1601676000000"],["-96.4","1:00","LST","-1597266000000"],["-96.4","-","RMT","-1377302400000"],["-120","-","EET","-928022400000"],["-180","-","MSK","-899510400000"],["-60","C-Eur","CE%sT","-795830400000"],["-180","Russia","MSK/MSD","604720800000"],["-120","1:00","EEST","620618400000"],["-120","Latvia","EE%sT","853804800000"],["-120","EU","EE%sT","951782400000"],["-120","-","EET","978393600000"],["-120","EU","EE%sT",null]],"Europe/Vaduz":"Europe/Zurich","Europe/Vilnius":[["-101.26666666666667","-","LMT","-2808604800000"],["-84","-","WMT","-1641081600000"],["-95.6","-","KMT","-1585094400000"],["-60","-","CET","-1561248000000"],["-120","-","EET","-1553558400000"],["-60","-","CET","-928195200000"],["-180","-","MSK","-900115200000"],["-60","C-Eur","CE%sT","-802137600000"],["-180","Russia","MSK/MSD","670384800000"],["-120","1:00","EEST","686109600000"],["-120","C-Eur","EE%sT","915062400000"],["-120","-","EET","891133200000"],["-60","EU","CE%sT","941331600000"],["-120","-","EET","1041379200000"],["-120","EU","EE%sT",null]],"Europe/Luxembourg":[["-24.6","-","LMT","-2069712000000"],["-60","Lux","CE%sT","-1612656000000"],["0","Lux","WE%sT","-1269813600000"],["0","Belgium","WE%sT","-935182800000"],["-60","C-Eur","WE%sT","-797979600000"],["-60","Belgium","CE%sT","252374400000"],["-60","EU","CE%sT",null]],"Europe/Malta":[["-58.06666666666666","-","LMT","-2403475200000"],["-60","Italy","CE%sT","-857253600000"],["-60","C-Eur","CE%sT","-781048800000"],["-60","Italy","CE%sT","102384000000"],["-60","Malta","CE%sT","378604800000"],["-60","EU","CE%sT",null]],"Europe/Chisinau":[["-115.33333333333333","-","LMT","-2808604800000"],["-115","-","CMT","-1637107200000"],["-104.4","-","BMT","-1213142400000"],["-120","Romania","EE%sT","-927158400000"],["-120","1:00","EEST","-898128000000"],["-60","C-Eur","CE%sT","-800150400000"],["-180","Russia","MSK/MSD","662601600000"],["-180","-","MSK","641952000000"],["-120","-","EET","694137600000"],["-120","Russia","EE%sT","725760000000"],["-120","E-Eur","EE%sT","883526400000"],["-120","EU","EE%sT",null]],"Europe/Monaco":[["-29.53333333333333","-","LMT","-2486678400000"],["-9.35","-","PMT","-1855958400000"],["0","France","WE%sT","-766616400000"],["-60","France","CE%sT","252374400000"],["-60","EU","CE%sT",null]],"Europe/Amsterdam":[["-19.53333333333333","-","LMT","-4228761600000"],["-19.53333333333333","Neth","%s","-1025740800000"],["-20","Neth","NE%sT","-935020800000"],["-60","C-Eur","CE%sT","-781048800000"],["-60","Neth","CE%sT","252374400000"],["-60","EU","CE%sT",null]],"Europe/Oslo":[["-43","-","LMT","-2366755200000"],["-60","Norway","CE%sT","-927507600000"],["-60","C-Eur","CE%sT","-781048800000"],["-60","Norway","CE%sT","347068800000"],["-60","EU","CE%sT",null]],"Arctic/Longyearbyen":"Europe/Oslo","Europe/Warsaw":[["-84","-","LMT","-2808604800000"],["-84","-","WMT","-1717027200000"],["-60","C-Eur","CE%sT","-1618693200000"],["-120","Poland","EE%sT","-1501718400000"],["-60","Poland","CE%sT","-931730400000"],["-60","C-Eur","CE%sT","-796867200000"],["-60","Poland","CE%sT","252374400000"],["-60","W-Eur","CE%sT","599529600000"],["-60","EU","CE%sT",null]],"Europe/Lisbon":[["36.53333333333334","-","LMT","-2682374400000"],["36.53333333333334","-","LMT","-1830384000000"],["0","Port","WE%sT","-118274400000"],["-60","-","CET","212547600000"],["0","Port","WE%sT","433299600000"],["0","W-Eur","WE%sT","717555600000"],["-60","EU","CE%sT","828234000000"],["0","EU","WE%sT",null]],"Atlantic/Azores":[["102.66666666666667","-","LMT","-2682374400000"],["114.53333333333333","-","HMT","-1849564800000"],["120","Port","AZO%sT","-118274400000"],["60","Port","AZO%sT","433299600000"],["60","W-Eur","AZO%sT","717555600000"],["0","EU","WE%sT","733280400000"],["60","EU","AZO%sT",null]],"Atlantic/Madeira":[["67.6","-","LMT","-2682374400000"],["67.6","-","FMT","-1849564800000"],["60","Port","MAD%sT","-118274400000"],["0","Port","WE%sT","433299600000"],["0","EU","WE%sT",null]],"Europe/Bucharest":[["-104.4","-","LMT","-2469398400000"],["-104.4","-","BMT","-1213142400000"],["-120","Romania","EE%sT","354679200000"],["-120","C-Eur","EE%sT","694137600000"],["-120","Romania","EE%sT","788832000000"],["-120","E-Eur","EE%sT","883526400000"],["-120","EU","EE%sT",null]],"Europe/Kaliningrad":[["-82","-","LMT","-2422051200000"],["-60","C-Eur","CE%sT","-757468800000"],["-120","Poland","CE%sT","-725932800000"],["-180","Russia","MSK/MSD","670384800000"],["-120","Russia","EE%sT","1301191200000"],["-180","-","FET",null]],"Europe/Moscow":[["-150.33333333333334","-","LMT","-2808604800000"],["-150","-","MMT","-1688256000000"],["-150.8","Russia","%s","-1593813600000"],["-180","Russia","MSK/MSD","-1491177600000"],["-120","-","EET","-1247529600000"],["-180","Russia","MSK/MSD","670384800000"],["-120","Russia","EE%sT","695786400000"],["-180","Russia","MSK/MSD","1301191200000"],["-240","-","MSK",null]],"Europe/Volgograd":[["-177.66666666666666","-","LMT","-1577750400000"],["-180","-","TSAT","-1411862400000"],["-180","-","STAT","-1247529600000"],["-240","-","STAT","-256867200000"],["-240","Russia","VOL%sT","606880800000"],["-180","Russia","VOL%sT","670384800000"],["-240","-","VOLT","701834400000"],["-180","Russia","VOL%sT","1301191200000"],["-240","-","VOLT",null]],"Europe/Samara":[["-200.6","-","LMT","-1593813600000"],["-180","-","SAMT","-1247529600000"],["-240","-","SAMT","-1102291200000"],["-240","Russia","KUY%sT","606880800000"],["-180","Russia","KUY%sT","670384800000"],["-120","Russia","KUY%sT","686109600000"],["-180","-","KUYT","687927600000"],["-240","Russia","SAM%sT","1269741600000"],["-180","Russia","SAM%sT","1301191200000"],["-240","-","SAMT",null]],"Asia/Yekaterinburg":[["-242.4","-","LMT","-1592596800000"],["-240","-","SVET","-1247529600000"],["-300","Russia","SVE%sT","670384800000"],["-240","Russia","SVE%sT","695786400000"],["-300","Russia","YEK%sT","1301191200000"],["-360","-","YEKT",null]],"Asia/Omsk":[["-293.6","-","LMT","-1582070400000"],["-300","-","OMST","-1247529600000"],["-360","Russia","OMS%sT","670384800000"],["-300","Russia","OMS%sT","695786400000"],["-360","Russia","OMS%sT","1301191200000"],["-420","-","OMST",null]],"Asia/Novosibirsk":[["-331.6666666666667","-","LMT","-1579456800000"],["-360","-","NOVT","-1247529600000"],["-420","Russia","NOV%sT","670384800000"],["-360","Russia","NOV%sT","695786400000"],["-420","Russia","NOV%sT","738115200000"],["-360","Russia","NOV%sT","1301191200000"],["-420","-","NOVT",null]],"Asia/Novokuznetsk":[["-348.8","-","NMT","-1577491200000"],["-360","-","KRAT","-1247529600000"],["-420","Russia","KRA%sT","670384800000"],["-360","Russia","KRA%sT","695786400000"],["-420","Russia","KRA%sT","1269741600000"],["-360","Russia","NOV%sT","1301191200000"],["-420","-","NOVT",null]],"Asia/Krasnoyarsk":[["-371.3333333333333","-","LMT","-1577491200000"],["-360","-","KRAT","-1247529600000"],["-420","Russia","KRA%sT","670384800000"],["-360","Russia","KRA%sT","695786400000"],["-420","Russia","KRA%sT","1301191200000"],["-480","-","KRAT",null]],"Asia/Irkutsk":[["-417.3333333333333","-","LMT","-2808604800000"],["-417.3333333333333","-","IMT","-1575849600000"],["-420","-","IRKT","-1247529600000"],["-480","Russia","IRK%sT","670384800000"],["-420","Russia","IRK%sT","695786400000"],["-480","Russia","IRK%sT","1301191200000"],["-540","-","IRKT",null]],"Asia/Yakutsk":[["-518.6666666666667","-","LMT","-1579392000000"],["-480","-","YAKT","-1247529600000"],["-540","Russia","YAK%sT","670384800000"],["-480","Russia","YAK%sT","695786400000"],["-540","Russia","YAK%sT","1301191200000"],["-600","-","YAKT",null]],"Asia/Vladivostok":[["-527.7333333333333","-","LMT","-1487289600000"],["-540","-","VLAT","-1247529600000"],["-600","Russia","VLA%sT","670384800000"],["-540","Russia","VLA%sST","695786400000"],["-600","Russia","VLA%sT","1301191200000"],["-660","-","VLAT",null]],"Asia/Khandyga":[["-542.2166666666666","-","LMT","-1579392000000"],["-480","-","YAKT","-1247529600000"],["-540","Russia","YAK%sT","670384800000"],["-480","Russia","YAK%sT","695786400000"],["-540","Russia","YAK%sT","1104451200000"],["-600","Russia","VLA%sT","1301191200000"],["-660","-","VLAT","1315872000000"],["-600","-","YAKT",null]],"Asia/Sakhalin":[["-570.8","-","LMT","-2031004800000"],["-540","-","CJT","-978393600000"],["-540","-","JST","-768528000000"],["-660","Russia","SAK%sT","670384800000"],["-600","Russia","SAK%sT","695786400000"],["-660","Russia","SAK%sT","857181600000"],["-600","Russia","SAK%sT","1301191200000"],["-660","-","SAKT",null]],"Asia/Magadan":[["-603.2","-","LMT","-1441152000000"],["-600","-","MAGT","-1247529600000"],["-660","Russia","MAG%sT","670384800000"],["-600","Russia","MAG%sT","695786400000"],["-660","Russia","MAG%sT","1301191200000"],["-720","-","MAGT",null]],"Asia/Ust-Nera":[["-572.9","-","LMT","-1579392000000"],["-480","-","YAKT","-1247529600000"],["-540","Russia","YAKT","354931200000"],["-660","Russia","MAG%sT","670384800000"],["-600","Russia","MAG%sT","695786400000"],["-660","Russia","MAG%sT","1301191200000"],["-720","-","MAGT","1315872000000"],["-660","-","VLAT",null]],"Asia/Kamchatka":[["-634.6","-","LMT","-1487721600000"],["-660","-","PETT","-1247529600000"],["-720","Russia","PET%sT","670384800000"],["-660","Russia","PET%sT","695786400000"],["-720","Russia","PET%sT","1269741600000"],["-660","Russia","PET%sT","1301191200000"],["-720","-","PETT",null]],"Asia/Anadyr":[["-709.9333333333334","-","LMT","-1441152000000"],["-720","-","ANAT","-1247529600000"],["-780","Russia","ANA%sT","386467200000"],["-720","Russia","ANA%sT","670384800000"],["-660","Russia","ANA%sT","695786400000"],["-720","Russia","ANA%sT","1269741600000"],["-660","Russia","ANA%sT","1301191200000"],["-720","-","ANAT",null]],"Europe/Belgrade":[["-82","-","LMT","-2682374400000"],["-60","-","CET","-905821200000"],["-60","C-Eur","CE%sT","-757468800000"],["-60","-","CET","-777938400000"],["-60","1:00","CEST","-766620000000"],["-60","-","CET","407203200000"],["-60","EU","CE%sT",null]],"Europe/Ljubljana":"Europe/Belgrade","Europe/Podgorica":"Europe/Belgrade","Europe/Sarajevo":"Europe/Belgrade","Europe/Skopje":"Europe/Belgrade","Europe/Zagreb":"Europe/Belgrade","Europe/Bratislava":"Europe/Prague","Europe/Madrid":[["14.733333333333334","-","LMT","-2177452800000"],["0","Spain","WE%sT","-733881600000"],["-60","Spain","CE%sT","315446400000"],["-60","EU","CE%sT",null]],"Africa/Ceuta":[["21.26666666666667","-","LMT","-2146003200000"],["0","-","WET","-1630112400000"],["0","1:00","WEST","-1616806800000"],["0","-","WET","-1420156800000"],["0","Spain","WE%sT","-1262390400000"],["0","SpainAfrica","WE%sT","448243200000"],["-60","-","CET","536371200000"],["-60","EU","CE%sT",null]],"Atlantic/Canary":[["61.6","-","LMT","-1509667200000"],["60","-","CANT","-733878000000"],["0","-","WET","323827200000"],["0","1:00","WEST","338947200000"],["0","EU","WE%sT",null]],"Europe/Stockholm":[["-72.2","-","LMT","-2871676800000"],["-60.233333333333334","-","SET","-2208988800000"],["-60","-","CET","-1692493200000"],["-60","1:00","CEST","-1680476400000"],["-60","-","CET","347068800000"],["-60","EU","CE%sT",null]],"Europe/Zurich":[["-34.13333333333333","-","LMT","-3675196800000"],["-29.76666666666667","-","BMT","-2385244800000"],["-60","Swiss","CE%sT","378604800000"],["-60","EU","CE%sT",null]],"Europe/Istanbul":[["-115.86666666666667","-","LMT","-2808604800000"],["-116.93333333333332","-","IMT","-1869868800000"],["-120","Turkey","EE%sT","277257600000"],["-180","Turkey","TR%sT","482803200000"],["-120","Turkey","EE%sT","1199059200000"],["-120","EU","EE%sT","1301187600000"],["-120","-","EET","1301274000000"],["-120","EU","EE%sT","1396141200000"],["-120","-","EET","1396227600000"],["-120","EU","EE%sT",null]],"Asia/Istanbul":"Europe/Istanbul","Europe/Kiev":[["-122.06666666666668","-","LMT","-2808604800000"],["-122.06666666666668","-","KMT","-1441152000000"],["-120","-","EET","-1247529600000"],["-180","-","MSK","-892512000000"],["-60","C-Eur","CE%sT","-825379200000"],["-180","Russia","MSK/MSD","646797600000"],["-120","1:00","EEST","686113200000"],["-120","E-Eur","EE%sT","820368000000"],["-120","EU","EE%sT",null]],"Europe/Uzhgorod":[["-89.2","-","LMT","-2500934400000"],["-60","-","CET","-915235200000"],["-60","C-Eur","CE%sT","-796867200000"],["-60","1:00","CEST","-794707200000"],["-60","-","CET","-773452800000"],["-180","Russia","MSK/MSD","662601600000"],["-180","-","MSK","646797600000"],["-60","-","CET","670388400000"],["-120","-","EET","725760000000"],["-120","E-Eur","EE%sT","820368000000"],["-120","EU","EE%sT",null]],"Europe/Zaporozhye":[["-140.66666666666666","-","LMT","-2808604800000"],["-140","-","CUT","-1441152000000"],["-120","-","EET","-1247529600000"],["-180","-","MSK","-894758400000"],["-60","C-Eur","CE%sT","-826416000000"],["-180","Russia","MSK/MSD","670384800000"],["-120","E-Eur","EE%sT","820368000000"],["-120","EU","EE%sT",null]],"Europe/Simferopol":[["-136.4","-","LMT","-2808604800000"],["-136","-","SMT","-1441152000000"],["-120","-","EET","-1247529600000"],["-180","-","MSK","-888883200000"],["-60","C-Eur","CE%sT","-811641600000"],["-180","Russia","MSK/MSD","662601600000"],["-180","-","MSK","646797600000"],["-120","-","EET","725760000000"],["-120","E-Eur","EE%sT","767750400000"],["-180","E-Eur","MSK/MSD","828241200000"],["-180","1:00","MSD","846385200000"],["-180","Russia","MSK/MSD","883526400000"],["-180","-","MSK","857178000000"],["-120","EU","EE%sT","1396144800000"],["-240","-","MSK",null]],"EST":[["300","-","EST",null]],"MST":[["420","-","MST",null]],"HST":[["600","-","HST",null]],"EST5EDT":[["300","US","E%sT",null]],"CST6CDT":[["360","US","C%sT",null]],"MST7MDT":[["420","US","M%sT",null]],"PST8PDT":[["480","US","P%sT",null]],"America/New_York":[["296.0333333333333","-","LMT","-2717668562000"],["300","US","E%sT","-1546387200000"],["300","NYC","E%sT","-852163200000"],["300","US","E%sT","-725932800000"],["300","NYC","E%sT","-63244800000"],["300","US","E%sT",null]],"America/Chicago":[["350.6","-","LMT","-2717668236000"],["360","US","C%sT","-1546387200000"],["360","Chicago","C%sT","-1067810400000"],["300","-","EST","-1045432800000"],["360","Chicago","C%sT","-852163200000"],["360","US","C%sT","-725932800000"],["360","Chicago","C%sT","-63244800000"],["360","US","C%sT",null]],"America/North_Dakota/Center":[["405.2","-","LMT","-2717667912000"],["420","US","M%sT","719978400000"],["360","US","C%sT",null]],"America/North_Dakota/New_Salem":[["405.65","-","LMT","-2717667939000"],["420","US","M%sT","1067133600000"],["360","US","C%sT",null]],"America/North_Dakota/Beulah":[["407.1166666666667","-","LMT","-2717668027000"],["420","US","M%sT","1289095200000"],["360","US","C%sT",null]],"America/Denver":[["419.93333333333334","-","LMT","-2717668796000"],["420","US","M%sT","-1546387200000"],["420","Denver","M%sT","-852163200000"],["420","US","M%sT","-725932800000"],["420","Denver","M%sT","-63244800000"],["420","US","M%sT",null]],"America/Los_Angeles":[["472.9666666666667","-","LMT","-2717668378000"],["480","US","P%sT","-725932800000"],["480","CA","P%sT","-63244800000"],["480","US","P%sT",null]],"America/Juneau":[["-902.3166666666666","-","LMT","-3225312000000"],["537.6833333333334","-","LMT","-2188987200000"],["480","-","PST","-852163200000"],["480","US","P%sT","-725932800000"],["480","-","PST","-86400000"],["480","US","P%sT","325648800000"],["540","US","Y%sT","341373600000"],["480","US","P%sT","436327200000"],["540","US","Y%sT","438998400000"],["540","US","AK%sT",null]],"America/Sitka":[["-898.7833333333334","-","LMT","-3225312000000"],["541.2166666666666","-","LMT","-2188987200000"],["480","-","PST","-852163200000"],["480","US","P%sT","-725932800000"],["480","-","PST","-86400000"],["480","US","P%sT","436327200000"],["540","US","Y%sT","438998400000"],["540","US","AK%sT",null]],"America/Metlakatla":[["-913.7","-","LMT","-3225312000000"],["526.3","-","LMT","-2188987200000"],["480","-","PST","-852163200000"],["480","US","P%sT","-725932800000"],["480","-","PST","-86400000"],["480","US","P%sT","436327200000"],["480","-","MeST",null]],"America/Yakutat":[["-881.0833333333334","-","LMT","-3225312000000"],["558.9166666666666","-","LMT","-2188987200000"],["540","-","YST","-852163200000"],["540","US","Y%sT","-725932800000"],["540","-","YST","-86400000"],["540","US","Y%sT","438998400000"],["540","US","AK%sT",null]],"America/Anchorage":[["-840.4","-","LMT","-3225312000000"],["599.6","-","LMT","-2188987200000"],["600","-","CAT","-852163200000"],["600","US","CAT/CAWT","-769395600000"],["600","US","CAT/CAPT","-725932800000"],["600","-","CAT","-86918400000"],["600","-","AHST","-86400000"],["600","US","AH%sT","436327200000"],["540","US","Y%sT","438998400000"],["540","US","AK%sT",null]],"America/Nome":[["-778.35","-","LMT","-3225312000000"],["661.6333333333333","-","LMT","-2188987200000"],["660","-","NST","-852163200000"],["660","US","N%sT","-725932800000"],["660","-","NST","-86918400000"],["660","-","BST","-86400000"],["660","US","B%sT","436327200000"],["540","US","Y%sT","438998400000"],["540","US","AK%sT",null]],"America/Adak":[["-733.35","-","LMT","-3225312000000"],["706.6333333333333","-","LMT","-2188987200000"],["660","-","NST","-852163200000"],["660","US","N%sT","-725932800000"],["660","-","NST","-86918400000"],["660","-","BST","-86400000"],["660","US","B%sT","436327200000"],["600","US","AH%sT","438998400000"],["600","US","HA%sT",null]],"Pacific/Honolulu":[["631.4333333333334","-","LMT","-2334139200000"],["630","-","HST","-1157320800000"],["630","1:00","HDT","-1155470400000"],["630","-","HST","-880236000000"],["630","1:00","HDT","-765410400000"],["630","-","HST","-712188000000"],["600","-","HST",null]],"Pacific/Johnston":"Pacific/Honolulu","America/Phoenix":[["448.3","-","LMT","-2717670498000"],["420","US","M%sT","-820540740000"],["420","-","MST","-812678340000"],["420","US","M%sT","-796867140000"],["420","-","MST","-63244800000"],["420","US","M%sT","-56246400000"],["420","-","MST",null]],"America/Boise":[["464.81666666666666","-","LMT","-2717667889000"],["480","US","P%sT","-1471816800000"],["420","US","M%sT","157680000000"],["420","-","MST","129088800000"],["420","US","M%sT",null]],"America/Indiana/Indianapolis":[["344.6333333333333","-","LMT","-2717667878000"],["360","US","C%sT","-1546387200000"],["360","Indianapolis","C%sT","-852163200000"],["360","US","C%sT","-725932800000"],["360","Indianapolis","C%sT","-463615200000"],["300","-","EST","-386805600000"],["360","-","CST","-368661600000"],["300","-","EST","-86400000"],["300","US","E%sT","62985600000"],["300","-","EST","1167523200000"],["300","US","E%sT",null]],"America/Indiana/Marengo":[["345.3833333333333","-","LMT","-2717667923000"],["360","US","C%sT","-568166400000"],["360","Marengo","C%sT","-273708000000"],["300","-","EST","-86400000"],["300","US","E%sT","126669600000"],["360","1:00","CDT","152071200000"],["300","US","E%sT","220838400000"],["300","-","EST","1167523200000"],["300","US","E%sT",null]],"America/Indiana/Vincennes":[["350.1166666666667","-","LMT","-2717668207000"],["360","US","C%sT","-725932800000"],["360","Vincennes","C%sT","-179359200000"],["300","-","EST","-86400000"],["300","US","E%sT","62985600000"],["300","-","EST","1143943200000"],["360","US","C%sT","1194141600000"],["300","US","E%sT",null]],"America/Indiana/Tell_City":[["347.05","-","LMT","-2717668023000"],["360","US","C%sT","-725932800000"],["360","Perry","C%sT","-179359200000"],["300","-","EST","-86400000"],["300","US","E%sT","62985600000"],["300","-","EST","1143943200000"],["360","US","C%sT",null]],"America/Indiana/Petersburg":[["349.1166666666667","-","LMT","-2717668147000"],["360","US","C%sT","-441936000000"],["360","Pike","C%sT","-147909600000"],["300","-","EST","-100130400000"],["360","US","C%sT","247024800000"],["300","-","EST","1143943200000"],["360","US","C%sT","1194141600000"],["300","US","E%sT",null]],"America/Indiana/Knox":[["346.5","-","LMT","-2717667990000"],["360","US","C%sT","-694396800000"],["360","Starke","C%sT","-242258400000"],["300","-","EST","-195084000000"],["360","US","C%sT","688528800000"],["300","-","EST","1143943200000"],["360","US","C%sT",null]],"America/Indiana/Winamac":[["346.4166666666667","-","LMT","-2717667985000"],["360","US","C%sT","-725932800000"],["360","Pulaski","C%sT","-273708000000"],["300","-","EST","-86400000"],["300","US","E%sT","62985600000"],["300","-","EST","1143943200000"],["360","US","C%sT","1173578400000"],["300","US","E%sT",null]],"America/Indiana/Vevay":[["340.2666666666667","-","LMT","-2717667616000"],["360","US","C%sT","-495064800000"],["300","-","EST","-86400000"],["300","US","E%sT","126144000000"],["300","-","EST","1167523200000"],["300","US","E%sT",null]],"America/Kentucky/Louisville":[["343.0333333333333","-","LMT","-2717667782000"],["360","US","C%sT","-1514851200000"],["360","Louisville","C%sT","-852163200000"],["360","US","C%sT","-725932800000"],["360","Louisville","C%sT","-266450400000"],["300","-","EST","-31622400000"],["300","US","E%sT","126669600000"],["360","1:00","CDT","152071200000"],["300","US","E%sT",null]],"America/Kentucky/Monticello":[["339.4","-","LMT","-2717667564000"],["360","US","C%sT","-725932800000"],["360","-","CST","-31622400000"],["360","US","C%sT","972784800000"],["300","US","E%sT",null]],"America/Detroit":[["332.18333333333334","-","LMT","-2019772800000"],["360","-","CST","-1724104800000"],["300","-","EST","-852163200000"],["300","US","E%sT","-725932800000"],["300","Detroit","E%sT","126144000000"],["300","US","E%sT","189216000000"],["300","-","EST","167796000000"],["300","US","E%sT",null]],"America/Menominee":[["350.45","-","LMT","-2659780800000"],["360","US","C%sT","-725932800000"],["360","Menominee","C%sT","-21506400000"],["300","-","EST","104896800000"],["360","US","C%sT",null]],"America/St_Johns":[["210.86666666666665","-","LMT","-2682374400000"],["210.86666666666665","StJohns","N%sT","-1609545600000"],["210.86666666666665","Canada","N%sT","-1578009600000"],["210.86666666666665","StJohns","N%sT","-1096934400000"],["210","StJohns","N%sT","-872380800000"],["210","Canada","N%sT","-725932800000"],["210","StJohns","N%sT","1320105600000"],["210","Canada","N%sT",null]],"America/Goose_Bay":[["241.66666666666666","-","LMT","-2682374400000"],["210.86666666666665","-","NST","-1609545600000"],["210.86666666666665","Canada","N%sT","-1578009600000"],["210.86666666666665","-","NST","-1096934400000"],["210","-","NST","-1041465600000"],["210","StJohns","N%sT","-872380800000"],["210","Canada","N%sT","-725932800000"],["210","StJohns","N%sT","-119916000000"],["240","StJohns","A%sT","1320105600000"],["240","Canada","A%sT",null]],"America/Halifax":[["254.4","-","LMT","-2131660800000"],["240","Halifax","A%sT","-1609545600000"],["240","Canada","A%sT","-1578009600000"],["240","Halifax","A%sT","-880236000000"],["240","Canada","A%sT","-725932800000"],["240","Halifax","A%sT","157680000000"],["240","Canada","A%sT",null]],"America/Glace_Bay":[["239.8","-","LMT","-2131660800000"],["240","Canada","A%sT","-505008000000"],["240","Halifax","A%sT","-473472000000"],["240","-","AST","94608000000"],["240","Halifax","A%sT","157680000000"],["240","Canada","A%sT",null]],"America/Moncton":[["259.1333333333333","-","LMT","-2715897600000"],["300","-","EST","-2131660800000"],["240","Canada","A%sT","-1136160000000"],["240","Moncton","A%sT","-852163200000"],["240","Canada","A%sT","-725932800000"],["240","Moncton","A%sT","126144000000"],["240","Canada","A%sT","757296000000"],["240","Moncton","A%sT","1199059200000"],["240","Canada","A%sT",null]],"America/Blanc-Sablon":[["228.46666666666667","-","LMT","-2682374400000"],["240","Canada","A%sT","31449600000"],["240","-","AST",null]],"America/Montreal":[["294.2666666666667","-","LMT","-2682374400000"],["300","Mont","E%sT","-1609545600000"],["300","Canada","E%sT","-1578009600000"],["300","Mont","E%sT","-880236000000"],["300","Canada","E%sT","-725932800000"],["300","Mont","E%sT","157680000000"],["300","Canada","E%sT",null]],"America/Toronto":[["317.5333333333333","-","LMT","-2335305600000"],["300","Canada","E%sT","-1578009600000"],["300","Toronto","E%sT","-880236000000"],["300","Canada","E%sT","-725932800000"],["300","Toronto","E%sT","157680000000"],["300","Canada","E%sT",null]],"America/Thunder_Bay":[["357","-","LMT","-2335305600000"],["360","-","CST","-1862006400000"],["300","-","EST","-852163200000"],["300","Canada","E%sT","31449600000"],["300","Toronto","E%sT","126144000000"],["300","-","EST","157680000000"],["300","Canada","E%sT",null]],"America/Nipigon":[["353.06666666666666","-","LMT","-2335305600000"],["300","Canada","E%sT","-923270400000"],["300","1:00","EDT","-880236000000"],["300","Canada","E%sT",null]],"America/Rainy_River":[["378.2666666666667","-","LMT","-2335305600000"],["360","Canada","C%sT","-923270400000"],["360","1:00","CDT","-880236000000"],["360","Canada","C%sT",null]],"America/Atikokan":[["366.4666666666667","-","LMT","-2335305600000"],["360","Canada","C%sT","-923270400000"],["360","1:00","CDT","-880236000000"],["360","Canada","C%sT","-765410400000"],["300","-","EST",null]],"America/Winnipeg":[["388.6","-","LMT","-2602281600000"],["360","Winn","C%sT","1167523200000"],["360","Canada","C%sT",null]],"America/Regina":[["418.6","-","LMT","-2030227200000"],["420","Regina","M%sT","-307749600000"],["360","-","CST",null]],"America/Swift_Current":[["431.3333333333333","-","LMT","-2030227200000"],["420","Canada","M%sT","-749599200000"],["420","Regina","M%sT","-599702400000"],["420","Swift","M%sT","70941600000"],["360","-","CST",null]],"America/Edmonton":[["453.8666666666667","-","LMT","-1998691200000"],["420","Edm","M%sT","567907200000"],["420","Canada","M%sT",null]],"America/Vancouver":[["492.4666666666667","-","LMT","-2682374400000"],["480","Vanc","P%sT","567907200000"],["480","Canada","P%sT",null]],"America/Dawson_Creek":[["480.93333333333334","-","LMT","-2682374400000"],["480","Canada","P%sT","-694396800000"],["480","Vanc","P%sT","83988000000"],["420","-","MST",null]],"America/Creston":[["466.06666666666666","-","LMT","-2682374400000"],["420","-","MST","-1680480000000"],["480","-","PST","-1627862400000"],["420","-","MST",null]],"America/Pangnirtung":[["0","-","zzz","-1514851200000"],["240","NT_YK","A%sT","796701600000"],["300","Canada","E%sT","941335200000"],["360","Canada","C%sT","972784800000"],["300","Canada","E%sT",null]],"America/Iqaluit":[["0","-","zzz","-865296000000"],["300","NT_YK","E%sT","941335200000"],["360","Canada","C%sT","972784800000"],["300","Canada","E%sT",null]],"America/Resolute":[["0","-","zzz","-704937600000"],["360","NT_YK","C%sT","972784800000"],["300","-","EST","986094000000"],["360","Canada","C%sT","1162087200000"],["300","-","EST","1173582000000"],["360","Canada","C%sT",null]],"America/Rankin_Inlet":[["0","-","zzz","-378777600000"],["360","NT_YK","C%sT","972784800000"],["300","-","EST","986094000000"],["360","Canada","C%sT",null]],"America/Cambridge_Bay":[["0","-","zzz","-1546387200000"],["420","NT_YK","M%sT","941335200000"],["360","Canada","C%sT","972784800000"],["300","-","EST","973382400000"],["360","-","CST","986094000000"],["420","Canada","M%sT",null]],"America/Yellowknife":[["0","-","zzz","-1073088000000"],["420","NT_YK","M%sT","347068800000"],["420","Canada","M%sT",null]],"America/Inuvik":[["0","-","zzz","-505008000000"],["480","NT_YK","P%sT","291780000000"],["420","NT_YK","M%sT","347068800000"],["420","Canada","M%sT",null]],"America/Whitehorse":[["540.2","-","LMT","-2189030400000"],["540","NT_YK","Y%sT","-110584800000"],["480","NT_YK","P%sT","347068800000"],["480","Canada","P%sT",null]],"America/Dawson":[["557.6666666666666","-","LMT","-2189030400000"],["540","NT_YK","Y%sT","120614400000"],["480","NT_YK","P%sT","347068800000"],["480","Canada","P%sT",null]],"America/Cancun":[["347.06666666666666","-","LMT","-1514764024000"],["360","-","CST","377913600000"],["300","Mexico","E%sT","902023200000"],["360","Mexico","C%sT",null]],"America/Merida":[["358.4666666666667","-","LMT","-1514764708000"],["360","-","CST","377913600000"],["300","-","EST","407635200000"],["360","Mexico","C%sT",null]],"America/Matamoros":[["400","-","LMT","-1514767200000"],["360","-","CST","599529600000"],["360","US","C%sT","631065600000"],["360","Mexico","C%sT","1293753600000"],["360","US","C%sT",null]],"America/Monterrey":[["401.2666666666667","-","LMT","-1514767276000"],["360","-","CST","599529600000"],["360","US","C%sT","631065600000"],["360","Mexico","C%sT",null]],"America/Mexico_City":[["396.6","-","LMT","-1514763396000"],["420","-","MST","-1343091600000"],["360","-","CST","-1234828800000"],["420","-","MST","-1220317200000"],["360","-","CST","-1207180800000"],["420","-","MST","-1191369600000"],["360","Mexico","C%sT","1001815200000"],["360","-","CST","1014163200000"],["360","Mexico","C%sT",null]],"America/Ojinaga":[["417.6666666666667","-","LMT","-1514764660000"],["420","-","MST","-1343091600000"],["360","-","CST","-1234828800000"],["420","-","MST","-1220317200000"],["360","-","CST","-1207180800000"],["420","-","MST","-1191369600000"],["360","-","CST","851990400000"],["360","Mexico","C%sT","915062400000"],["360","-","CST","891399600000"],["420","Mexico","M%sT","1293753600000"],["420","US","M%sT",null]],"America/Chihuahua":[["424.3333333333333","-","LMT","-1514765060000"],["420","-","MST","-1343091600000"],["360","-","CST","-1234828800000"],["420","-","MST","-1220317200000"],["360","-","CST","-1207180800000"],["420","-","MST","-1191369600000"],["360","-","CST","851990400000"],["360","Mexico","C%sT","915062400000"],["360","-","CST","891399600000"],["420","Mexico","M%sT",null]],"America/Hermosillo":[["443.8666666666667","-","LMT","-1514766232000"],["420","-","MST","-1343091600000"],["360","-","CST","-1234828800000"],["420","-","MST","-1220317200000"],["360","-","CST","-1207180800000"],["420","-","MST","-1191369600000"],["360","-","CST","-873849600000"],["420","-","MST","-661564800000"],["480","-","PST","31449600000"],["420","Mexico","M%sT","946598400000"],["420","-","MST",null]],"America/Mazatlan":[["425.6666666666667","-","LMT","-1514765140000"],["420","-","MST","-1343091600000"],["360","-","CST","-1234828800000"],["420","-","MST","-1220317200000"],["360","-","CST","-1207180800000"],["420","-","MST","-1191369600000"],["360","-","CST","-873849600000"],["420","-","MST","-661564800000"],["480","-","PST","31449600000"],["420","Mexico","M%sT",null]],"America/Bahia_Banderas":[["421","-","LMT","-1514764860000"],["420","-","MST","-1343091600000"],["360","-","CST","-1234828800000"],["420","-","MST","-1220317200000"],["360","-","CST","-1207180800000"],["420","-","MST","-1191369600000"],["360","-","CST","-873849600000"],["420","-","MST","-661564800000"],["480","-","PST","31449600000"],["420","Mexico","M%sT","1270346400000"],["360","Mexico","C%sT",null]],"America/Tijuana":[["468.06666666666666","-","LMT","-1514764084000"],["420","-","MST","-1420156800000"],["480","-","PST","-1343091600000"],["420","-","MST","-1234828800000"],["480","-","PST","-1222992000000"],["480","1:00","PDT","-1207267200000"],["480","-","PST","-873849600000"],["480","1:00","PWT","-769395600000"],["480","1:00","PPT","-761702400000"],["480","-","PST","-686102400000"],["480","1:00","PDT","-661564800000"],["480","-","PST","-473472000000"],["480","CA","P%sT","-252547200000"],["480","-","PST","220838400000"],["480","US","P%sT","851990400000"],["480","Mexico","P%sT","1009756800000"],["480","US","P%sT","1014163200000"],["480","Mexico","P%sT","1293753600000"],["480","US","P%sT",null]],"America/Santa_Isabel":[["459.4666666666667","-","LMT","-1514763568000"],["420","-","MST","-1420156800000"],["480","-","PST","-1343091600000"],["420","-","MST","-1234828800000"],["480","-","PST","-1222992000000"],["480","1:00","PDT","-1207267200000"],["480","-","PST","-873849600000"],["480","1:00","PWT","-769395600000"],["480","1:00","PPT","-761702400000"],["480","-","PST","-686102400000"],["480","1:00","PDT","-661564800000"],["480","-","PST","-473472000000"],["480","CA","P%sT","-252547200000"],["480","-","PST","220838400000"],["480","US","P%sT","851990400000"],["480","Mexico","P%sT","1009756800000"],["480","US","P%sT","1014163200000"],["480","Mexico","P%sT",null]],"America/Antigua":[["247.2","-","LMT","-1825113600000"],["300","-","EST","-568166400000"],["240","-","AST",null]],"America/Nassau":[["309.5","-","LMT","-1825113600000"],["300","Bahamas","E%sT","220838400000"],["300","US","E%sT",null]],"America/Barbados":[["238.48333333333335","-","LMT","-1420156800000"],["238.48333333333335","-","BMT","-1167696000000"],["240","Barb","A%sT",null]],"America/Belize":[["352.8","-","LMT","-1822521600000"],["360","Belize","C%sT",null]],"Atlantic/Bermuda":[["259.3","-","LMT","-1262296800000"],["240","-","AST","136346400000"],["240","Canada","A%sT","220838400000"],["240","US","A%sT",null]],"America/Cayman":[["325.5333333333333","-","LMT","-2493072000000"],["307.18333333333334","-","KMT","-1827705600000"],["300","-","EST",null]],"America/Costa_Rica":[["336.2166666666667","-","LMT","-2493072000000"],["336.2166666666667","-","SJMT","-1545091200000"],["360","CR","C%sT",null]],"America/Havana":[["329.4666666666667","-","LMT","-2493072000000"],["329.6","-","HMT","-1402833600000"],["300","Cuba","C%sT",null]],"America/Santo_Domingo":[["279.6","-","LMT","-2493072000000"],["280","-","SDMT","-1159790400000"],["300","DR","E%sT","152064000000"],["240","-","AST","972784800000"],["300","US","E%sT","975805200000"],["240","-","AST",null]],"America/El_Salvador":[["356.8","-","LMT","-1514851200000"],["360","Salv","C%sT",null]],"America/Guatemala":[["362.06666666666666","-","LMT","-1617062400000"],["360","Guat","C%sT",null]],"America/Port-au-Prince":[["289.3333333333333","-","LMT","-2493072000000"],["289","-","PPMT","-1670500800000"],["300","Haiti","E%sT",null]],"America/Tegucigalpa":[["348.8666666666667","-","LMT","-1538524800000"],["360","Hond","C%sT",null]],"America/Jamaica":[["307.18333333333334","-","LMT","-2493072000000"],["307.18333333333334","-","KMT","-1827705600000"],["300","-","EST","136346400000"],["300","US","E%sT","473299200000"],["300","-","EST",null]],"America/Martinique":[["244.33333333333334","-","LMT","-2493072000000"],["244.33333333333334","-","FFMT","-1851552000000"],["240","-","AST","323827200000"],["240","1:00","ADT","338947200000"],["240","-","AST",null]],"America/Managua":[["345.1333333333333","-","LMT","-2493072000000"],["345.2","-","MMT","-1121126400000"],["360","-","CST","105062400000"],["300","-","EST","161740800000"],["360","Nic","C%sT","694238400000"],["300","-","EST","717292800000"],["360","-","CST","757296000000"],["300","-","EST","883526400000"],["360","Nic","C%sT",null]],"America/Panama":[["318.1333333333333","-","LMT","-2493072000000"],["319.6","-","CMT","-1946937600000"],["300","-","EST",null]],"America/Puerto_Rico":[["264.4166666666667","-","LMT","-2233051200000"],["240","-","AST","-873072000000"],["240","US","A%sT","-725932800000"],["240","-","AST",null]],"America/Miquelon":[["224.66666666666666","-","LMT","-1850342400000"],["240","-","AST","325987200000"],["180","-","PMST","567907200000"],["180","Canada","PM%sT",null]],"America/Grand_Turk":[["284.5333333333333","-","LMT","-2493072000000"],["307.18333333333334","-","KMT","-1827705600000"],["300","TC","E%sT",null]],"US/Pacific-New":"America/Los_Angeles","Asia/Riyadh87":[["-187.06666666666666","-","zzz","567907200000"],["-187.06666666666666","sol87","zzz","599529600000"],["-187.06666666666666","-","zzz",null]],"Mideast/Riyadh87":"Asia/Riyadh87","Asia/Riyadh88":[["-187.06666666666666","-","zzz","599529600000"],["-187.06666666666666","sol88","zzz","631065600000"],["-187.06666666666666","-","zzz",null]],"Mideast/Riyadh88":"Asia/Riyadh88","Asia/Riyadh89":[["-187.06666666666666","-","zzz","631065600000"],["-187.06666666666666","sol89","zzz","662601600000"],["-187.06666666666666","-","zzz",null]],"Mideast/Riyadh89":"Asia/Riyadh89","America/Argentina/Buenos_Aires":[["233.8","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","Arg","AR%sT",null]],"America/Argentina/Cordoba":[["256.8","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","667958400000"],["240","-","WART","687916800000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","Arg","AR%sT",null]],"America/Argentina/Salta":[["261.66666666666663","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","667958400000"],["240","-","WART","687916800000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/Tucuman":[["260.8666666666667","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","667958400000"],["240","-","WART","687916800000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1086048000000"],["240","-","WART","1087084800000"],["180","Arg","AR%sT",null]],"America/Argentina/La_Rioja":[["267.4","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","667785600000"],["240","-","WART","673574400000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1086048000000"],["240","-","WART","1087689600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/San_Juan":[["274.06666666666666","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","667785600000"],["240","-","WART","673574400000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1085961600000"],["240","-","WART","1090713600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/Jujuy":[["261.2","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","636508800000"],["240","-","WART","657072000000"],["240","1:00","WARST","669168000000"],["240","-","WART","686707200000"],["180","1:00","ARST","725760000000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/Catamarca":[["263.1333333333333","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","667958400000"],["240","-","WART","687916800000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1086048000000"],["240","-","WART","1087689600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/Mendoza":[["275.2666666666667","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","636508800000"],["240","-","WART","655948800000"],["240","1:00","WARST","667785600000"],["240","-","WART","687484800000"],["240","1:00","WARST","699408000000"],["240","-","WART","719366400000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1085270400000"],["240","-","WART","1096156800000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/San_Luis":[["265.4","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","662601600000"],["180","1:00","ARST","637372800000"],["240","-","WART","655948800000"],["240","1:00","WARST","667785600000"],["240","-","WART","675734400000"],["180","-","ART","938908800000"],["240","1:00","WARST","952041600000"],["180","-","ART","1085961600000"],["240","-","WART","1090713600000"],["180","Arg","AR%sT","1200873600000"],["240","SanLuis","WAR%sT","1255219200000"],["180","-","ART",null]],"America/Argentina/Rio_Gallegos":[["276.8666666666667","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1086048000000"],["240","-","WART","1087689600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Argentina/Ushuaia":[["273.2","-","LMT","-2372112000000"],["256.8","-","CMT","-1567468800000"],["240","-","ART","-1233446400000"],["240","Arg","AR%sT","-7603200000"],["180","Arg","AR%sT","938908800000"],["240","Arg","AR%sT","952041600000"],["180","-","ART","1085875200000"],["240","-","WART","1087689600000"],["180","Arg","AR%sT","1224288000000"],["180","-","ART",null]],"America/Aruba":"America/Curacao","America/La_Paz":[["272.6","-","LMT","-2493072000000"],["272.6","-","CMT","-1205971200000"],["272.6","1:00","BOST","-1192320000000"],["240","-","BOT",null]],"America/Noronha":[["129.66666666666669","-","LMT","-1735776000000"],["120","Brazil","FN%sT","653529600000"],["120","-","FNT","938649600000"],["120","Brazil","FN%sT","971568000000"],["120","-","FNT","1000339200000"],["120","Brazil","FN%sT","1033430400000"],["120","-","FNT",null]],"America/Belem":[["193.93333333333334","-","LMT","-1735776000000"],["180","Brazil","BR%sT","590025600000"],["180","-","BRT",null]],"America/Santarem":[["218.8","-","LMT","-1735776000000"],["240","Brazil","AM%sT","590025600000"],["240","-","AMT","1214265600000"],["180","-","BRT",null]],"America/Fortaleza":[["154","-","LMT","-1735776000000"],["180","Brazil","BR%sT","653529600000"],["180","-","BRT","938649600000"],["180","Brazil","BR%sT","972172800000"],["180","-","BRT","1000339200000"],["180","Brazil","BR%sT","1033430400000"],["180","-","BRT",null]],"America/Recife":[["139.6","-","LMT","-1735776000000"],["180","Brazil","BR%sT","653529600000"],["180","-","BRT","938649600000"],["180","Brazil","BR%sT","971568000000"],["180","-","BRT","1000339200000"],["180","Brazil","BR%sT","1033430400000"],["180","-","BRT",null]],"America/Araguaina":[["192.8","-","LMT","-1735776000000"],["180","Brazil","BR%sT","653529600000"],["180","-","BRT","811036800000"],["180","Brazil","BR%sT","1064361600000"],["180","-","BRT","1350777600000"],["180","Brazil","BR%sT","1377993600000"],["180","-","BRT",null]],"America/Maceio":[["142.86666666666665","-","LMT","-1735776000000"],["180","Brazil","BR%sT","653529600000"],["180","-","BRT","813542400000"],["180","Brazil","BR%sT","841795200000"],["180","-","BRT","938649600000"],["180","Brazil","BR%sT","972172800000"],["180","-","BRT","1000339200000"],["180","Brazil","BR%sT","1033430400000"],["180","-","BRT",null]],"America/Bahia":[["154.06666666666666","-","LMT","-1735776000000"],["180","Brazil","BR%sT","1064361600000"],["180","-","BRT","1318723200000"],["180","Brazil","BR%sT","1350777600000"],["180","-","BRT",null]],"America/Sao_Paulo":[["186.46666666666667","-","LMT","-1735776000000"],["180","Brazil","BR%sT","-195436800000"],["180","1:00","BRST","-157852800000"],["180","Brazil","BR%sT",null]],"America/Campo_Grande":[["218.46666666666667","-","LMT","-1735776000000"],["240","Brazil","AM%sT",null]],"America/Cuiaba":[["224.33333333333334","-","LMT","-1735776000000"],["240","Brazil","AM%sT","1064361600000"],["240","-","AMT","1096588800000"],["240","Brazil","AM%sT",null]],"America/Porto_Velho":[["255.6","-","LMT","-1735776000000"],["240","Brazil","AM%sT","590025600000"],["240","-","AMT",null]],"America/Boa_Vista":[["242.66666666666666","-","LMT","-1735776000000"],["240","Brazil","AM%sT","590025600000"],["240","-","AMT","938649600000"],["240","Brazil","AM%sT","971568000000"],["240","-","AMT",null]],"America/Manaus":[["240.06666666666666","-","LMT","-1735776000000"],["240","Brazil","AM%sT","590025600000"],["240","-","AMT","749174400000"],["240","Brazil","AM%sT","780192000000"],["240","-","AMT",null]],"America/Eirunepe":[["279.4666666666667","-","LMT","-1735776000000"],["300","Brazil","AC%sT","590025600000"],["300","-","ACT","749174400000"],["300","Brazil","AC%sT","780192000000"],["300","-","ACT","1214265600000"],["240","-","AMT","1384041600000"],["300","-","ACT",null]],"America/Rio_Branco":[["271.2","-","LMT","-1735776000000"],["300","Brazil","AC%sT","590025600000"],["300","-","ACT","1214265600000"],["240","-","AMT","1384041600000"],["300","-","ACT",null]],"America/Santiago":[["282.7666666666667","-","LMT","-2493072000000"],["282.7666666666667","-","SMT","-1862006400000"],["300","-","CLT","-1688428800000"],["282.7666666666667","-","SMT","-1620000000000"],["240","-","CLT","-1593820800000"],["282.7666666666667","-","SMT","-1336003200000"],["300","Chile","CL%sT","-713664000000"],["240","Chile","CL%sT",null]],"Pacific/Easter":[["437.7333333333333","-","LMT","-2493072000000"],["437.4666666666667","-","EMT","-1178150400000"],["420","Chile","EAS%sT","384901200000"],["360","Chile","EAS%sT",null]],"America/Bogota":[["296.2666666666667","-","LMT","-2707689600000"],["296.2666666666667","-","BMT","-1739059200000"],["300","CO","CO%sT",null]],"America/Curacao":[["275.7833333333333","-","LMT","-1826755200000"],["270","-","ANT","-126316800000"],["240","-","AST",null]],"America/Lower_Princes":"America/Curacao","America/Kralendijk":"America/Curacao","America/Guayaquil":[["319.3333333333333","-","LMT","-2493072000000"],["314","-","QMT","-1199318400000"],["300","-","ECT",null]],"Pacific/Galapagos":[["358.4","-","LMT","-1199318400000"],["300","-","ECT","536371200000"],["360","-","GALT",null]],"Atlantic/Stanley":[["231.4","-","LMT","-2493072000000"],["231.4","-","SMT","-1824249600000"],["240","Falk","FK%sT","420595200000"],["180","Falk","FK%sT","495590400000"],["240","Falk","FK%sT","1283652000000"],["180","-","FKST",null]],"America/Cayenne":[["209.33333333333334","-","LMT","-1846281600000"],["240","-","GFT","-71107200000"],["180","-","GFT",null]],"America/Guyana":[["232.66666666666666","-","LMT","-1730592000000"],["225","-","GBGT","-113702400000"],["225","-","GYT","175996800000"],["180","-","GYT","694137600000"],["240","-","GYT",null]],"America/Asuncion":[["230.66666666666666","-","LMT","-2493072000000"],["230.66666666666666","-","AMT","-1206403200000"],["240","-","PYT","86745600000"],["180","-","PYT","134006400000"],["240","Para","PY%sT",null]],"America/Lima":[["308.2","-","LMT","-2493072000000"],["308.6","-","LMT","-1938556800000"],["300","Peru","PE%sT",null]],"Atlantic/South_Georgia":[["146.13333333333335","-","LMT","-2493072000000"],["120","-","GST",null]],"America/Paramaribo":[["220.66666666666666","-","LMT","-1830470400000"],["220.86666666666665","-","PMT","-1073088000000"],["220.6","-","PMT","-765331200000"],["210","-","NEGT","185673600000"],["210","-","SRT","465436800000"],["180","-","SRT",null]],"America/Port_of_Spain":[["246.06666666666666","-","LMT","-1825113600000"],["240","-","AST",null]],"America/Anguilla":"America/Port_of_Spain","America/Dominica":"America/Port_of_Spain","America/Grenada":"America/Port_of_Spain","America/Guadeloupe":"America/Port_of_Spain","America/Marigot":"America/Port_of_Spain","America/Montserrat":"America/Port_of_Spain","America/St_Barthelemy":"America/Port_of_Spain","America/St_Kitts":"America/Port_of_Spain","America/St_Lucia":"America/Port_of_Spain","America/St_Thomas":"America/Port_of_Spain","America/St_Vincent":"America/Port_of_Spain","America/Tortola":"America/Port_of_Spain","America/Montevideo":[["224.73333333333335","-","LMT","-2256681600000"],["224.73333333333335","-","MMT","-1567468800000"],["210","Uruguay","UY%sT","-853632000000"],["180","Uruguay","UY%sT",null]],"America/Caracas":[["267.7333333333333","-","LMT","-2493072000000"],["267.6666666666667","-","CMT","-1826755200000"],["270","-","VET","-126316800000"],["240","-","VET","1197169200000"],["270","-","VET",null]]},"rules":{"Algeria":[["1916","only","-","Jun","14",["23","0","0","s"],"60","S"],["1916","1919","-","Oct","Sun>=1",["23","0","0","s"],"0","-"],["1917","only","-","Mar","24",["23","0","0","s"],"60","S"],["1918","only","-","Mar","9",["23","0","0","s"],"60","S"],["1919","only","-","Mar","1",["23","0","0","s"],"60","S"],["1920","only","-","Feb","14",["23","0","0","s"],"60","S"],["1920","only","-","Oct","23",["23","0","0","s"],"0","-"],["1921","only","-","Mar","14",["23","0","0","s"],"60","S"],["1921","only","-","Jun","21",["23","0","0","s"],"0","-"],["1939","only","-","Sep","11",["23","0","0","s"],"60","S"],["1939","only","-","Nov","19",["1","0","0",null],"0","-"],["1944","1945","-","Apr","Mon>=1",["2","0","0",null],"60","S"],["1944","only","-","Oct","8",["2","0","0",null],"0","-"],["1945","only","-","Sep","16",["1","0","0",null],"0","-"],["1971","only","-","Apr","25",["23","0","0","s"],"60","S"],["1971","only","-","Sep","26",["23","0","0","s"],"0","-"],["1977","only","-","May","6",["0","0","0",null],"60","S"],["1977","only","-","Oct","21",["0","0","0",null],"0","-"],["1978","only","-","Mar","24",["1","0","0",null],"60","S"],["1978","only","-","Sep","22",["3","0","0",null],"0","-"],["1980","only","-","Apr","25",["0","0","0",null],"60","S"],["1980","only","-","Oct","31",["2","0","0",null],"0","-"]],"Egypt":[["1940","only","-","Jul","15",["0","0","0",null],"60","S"],["1940","only","-","Oct","1",["0","0","0",null],"0","-"],["1941","only","-","Apr","15",["0","0","0",null],"60","S"],["1941","only","-","Sep","16",["0","0","0",null],"0","-"],["1942","1944","-","Apr","1",["0","0","0",null],"60","S"],["1942","only","-","Oct","27",["0","0","0",null],"0","-"],["1943","1945","-","Nov","1",["0","0","0",null],"0","-"],["1945","only","-","Apr","16",["0","0","0",null],"60","S"],["1957","only","-","May","10",["0","0","0",null],"60","S"],["1957","1958","-","Oct","1",["0","0","0",null],"0","-"],["1958","only","-","May","1",["0","0","0",null],"60","S"],["1959","1981","-","May","1",["1","0","0",null],"60","S"],["1959","1965","-","Sep","30",["3","0","0",null],"0","-"],["1966","1994","-","Oct","1",["3","0","0",null],"0","-"],["1982","only","-","Jul","25",["1","0","0",null],"60","S"],["1983","only","-","Jul","12",["1","0","0",null],"60","S"],["1984","1988","-","May","1",["1","0","0",null],"60","S"],["1989","only","-","May","6",["1","0","0",null],"60","S"],["1990","1994","-","May","1",["1","0","0",null],"60","S"],["1995","2010","-","Apr","lastFri",["0","0","0","s"],"60","S"],["1995","2005","-","Sep","lastThu",["23","0","0","s"],"0","-"],["2006","only","-","Sep","21",["23","0","0","s"],"0","-"],["2007","only","-","Sep","Thu>=1",["23","0","0","s"],"0","-"],["2008","only","-","Aug","lastThu",["23","0","0","s"],"0","-"],["2009","only","-","Aug","20",["23","0","0","s"],"0","-"],["2010","only","-","Aug","11",["0","0","0",null],"0","-"],["2010","only","-","Sep","10",["0","0","0",null],"60","S"],["2010","only","-","Sep","lastThu",["23","0","0","s"],"0","-"]],"Ghana":[["1936","1942","-","Sep","1",["0","0","0",null],"20","GHST"],["1936","1942","-","Dec","31",["0","0","0",null],"0","GMT"]],"Libya":[["1951","only","-","Oct","14",["2","0","0",null],"60","S"],["1952","only","-","Jan","1",["0","0","0",null],"0","-"],["1953","only","-","Oct","9",["2","0","0",null],"60","S"],["1954","only","-","Jan","1",["0","0","0",null],"0","-"],["1955","only","-","Sep","30",["0","0","0",null],"60","S"],["1956","only","-","Jan","1",["0","0","0",null],"0","-"],["1982","1984","-","Apr","1",["0","0","0",null],"60","S"],["1982","1985","-","Oct","1",["0","0","0",null],"0","-"],["1985","only","-","Apr","6",["0","0","0",null],"60","S"],["1986","only","-","Apr","4",["0","0","0",null],"60","S"],["1986","only","-","Oct","3",["0","0","0",null],"0","-"],["1987","1989","-","Apr","1",["0","0","0",null],"60","S"],["1987","1989","-","Oct","1",["0","0","0",null],"0","-"],["1997","only","-","Apr","4",["0","0","0",null],"60","S"],["1997","only","-","Oct","4",["0","0","0",null],"0","-"],["2013","only","-","Mar","lastFri",["1","0","0",null],"60","S"],["2013","only","-","Oct","lastFri",["2","0","0",null],"0","-"]],"Mauritius":[["1982","only","-","Oct","10",["0","0","0",null],"60","S"],["1983","only","-","Mar","21",["0","0","0",null],"0","-"],["2008","only","-","Oct","lastSun",["2","0","0",null],"60","S"],["2009","only","-","Mar","lastSun",["2","0","0",null],"0","-"]],"Morocco":[["1939","only","-","Sep","12",["0","0","0",null],"60","S"],["1939","only","-","Nov","19",["0","0","0",null],"0","-"],["1940","only","-","Feb","25",["0","0","0",null],"60","S"],["1945","only","-","Nov","18",["0","0","0",null],"0","-"],["1950","only","-","Jun","11",["0","0","0",null],"60","S"],["1950","only","-","Oct","29",["0","0","0",null],"0","-"],["1967","only","-","Jun","3",["12","0","0",null],"60","S"],["1967","only","-","Oct","1",["0","0","0",null],"0","-"],["1974","only","-","Jun","24",["0","0","0",null],"60","S"],["1974","only","-","Sep","1",["0","0","0",null],"0","-"],["1976","1977","-","May","1",["0","0","0",null],"60","S"],["1976","only","-","Aug","1",["0","0","0",null],"0","-"],["1977","only","-","Sep","28",["0","0","0",null],"0","-"],["1978","only","-","Jun","1",["0","0","0",null],"60","S"],["1978","only","-","Aug","4",["0","0","0",null],"0","-"],["2008","only","-","Jun","1",["0","0","0",null],"60","S"],["2008","only","-","Sep","1",["0","0","0",null],"0","-"],["2009","only","-","Jun","1",["0","0","0",null],"60","S"],["2009","only","-","Aug","21",["0","0","0",null],"0","-"],["2010","only","-","May","2",["0","0","0",null],"60","S"],["2010","only","-","Aug","8",["0","0","0",null],"0","-"],["2011","only","-","Apr","3",["0","0","0",null],"60","S"],["2011","only","-","Jul","31",["0","0","0",null],"0","-"],["2012","2013","-","Apr","lastSun",["2","0","0",null],"60","S"],["2012","only","-","Sep","30",["3","0","0",null],"0","-"],["2012","only","-","Jul","20",["3","0","0",null],"0","-"],["2012","only","-","Aug","20",["2","0","0",null],"60","S"],["2013","only","-","Jul","7",["3","0","0",null],"0","-"],["2013","only","-","Aug","10",["2","0","0",null],"60","S"],["2013","2035","-","Oct","lastSun",["3","0","0",null],"0","-"],["2014","2022","-","Mar","lastSun",["2","0","0",null],"60","S"],["2014","only","-","Jun","29",["3","0","0",null],"0","-"],["2014","only","-","Jul","29",["2","0","0",null],"60","S"],["2015","only","-","Jun","18",["3","0","0",null],"0","-"],["2015","only","-","Jul","18",["2","0","0",null],"60","S"],["2016","only","-","Jun","7",["3","0","0",null],"0","-"],["2016","only","-","Jul","7",["2","0","0",null],"60","S"],["2017","only","-","May","27",["3","0","0",null],"0","-"],["2017","only","-","Jun","26",["2","0","0",null],"60","S"],["2018","only","-","May","16",["3","0","0",null],"0","-"],["2018","only","-","Jun","15",["2","0","0",null],"60","S"],["2019","only","-","May","6",["3","0","0",null],"0","-"],["2019","only","-","Jun","5",["2","0","0",null],"60","S"],["2020","only","-","Apr","24",["3","0","0",null],"0","-"],["2020","only","-","May","24",["2","0","0",null],"60","S"],["2021","only","-","Apr","13",["3","0","0",null],"0","-"],["2021","only","-","May","13",["2","0","0",null],"60","S"],["2022","only","-","Apr","3",["3","0","0",null],"0","-"],["2022","only","-","May","3",["2","0","0",null],"60","S"],["2023","only","-","Apr","22",["2","0","0",null],"60","S"],["2024","only","-","Apr","10",["2","0","0",null],"60","S"],["2025","only","-","Mar","31",["2","0","0",null],"60","S"],["2026","max","-","Mar","lastSun",["2","0","0",null],"60","S"],["2036","only","-","Oct","21",["3","0","0",null],"0","-"],["2037","only","-","Oct","11",["3","0","0",null],"0","-"],["2038","only","-","Sep","30",["3","0","0",null],"0","-"],["2038","only","-","Oct","30",["2","0","0",null],"60","S"],["2038","max","-","Oct","lastSun",["3","0","0",null],"0","-"]],"Namibia":[["1994","max","-","Sep","Sun>=1",["2","0","0",null],"60","S"],["1995","max","-","Apr","Sun>=1",["2","0","0",null],"0","-"]],"SL":[["1935","1942","-","Jun","1",["0","0","0",null],"40","SLST"],["1935","1942","-","Oct","1",["0","0","0",null],"0","WAT"],["1957","1962","-","Jun","1",["0","0","0",null],"60","SLST"],["1957","1962","-","Sep","1",["0","0","0",null],"0","GMT"]],"SA":[["1942","1943","-","Sep","Sun>=15",["2","0","0",null],"60","-"],["1943","1944","-","Mar","Sun>=15",["2","0","0",null],"0","-"]],"Sudan":[["1970","only","-","May","1",["0","0","0",null],"60","S"],["1970","1985","-","Oct","15",["0","0","0",null],"0","-"],["1971","only","-","Apr","30",["0","0","0",null],"60","S"],["1972","1985","-","Apr","lastSun",["0","0","0",null],"60","S"]],"Tunisia":[["1939","only","-","Apr","15",["23","0","0","s"],"60","S"],["1939","only","-","Nov","18",["23","0","0","s"],"0","-"],["1940","only","-","Feb","25",["23","0","0","s"],"60","S"],["1941","only","-","Oct","6",["0","0","0",null],"0","-"],["1942","only","-","Mar","9",["0","0","0",null],"60","S"],["1942","only","-","Nov","2",["3","0","0",null],"0","-"],["1943","only","-","Mar","29",["2","0","0",null],"60","S"],["1943","only","-","Apr","17",["2","0","0",null],"0","-"],["1943","only","-","Apr","25",["2","0","0",null],"60","S"],["1943","only","-","Oct","4",["2","0","0",null],"0","-"],["1944","1945","-","Apr","Mon>=1",["2","0","0",null],"60","S"],["1944","only","-","Oct","8",["0","0","0",null],"0","-"],["1945","only","-","Sep","16",["0","0","0",null],"0","-"],["1977","only","-","Apr","30",["0","0","0","s"],"60","S"],["1977","only","-","Sep","24",["0","0","0","s"],"0","-"],["1978","only","-","May","1",["0","0","0","s"],"60","S"],["1978","only","-","Oct","1",["0","0","0","s"],"0","-"],["1988","only","-","Jun","1",["0","0","0","s"],"60","S"],["1988","1990","-","Sep","lastSun",["0","0","0","s"],"0","-"],["1989","only","-","Mar","26",["0","0","0","s"],"60","S"],["1990","only","-","May","1",["0","0","0","s"],"60","S"],["2005","only","-","May","1",["0","0","0","s"],"60","S"],["2005","only","-","Sep","30",["1","0","0","s"],"0","-"],["2006","2008","-","Mar","lastSun",["2","0","0","s"],"60","S"],["2006","2008","-","Oct","lastSun",["2","0","0","s"],"0","-"]],"ArgAQ":[["1964","1966","-","Mar","1",["0","0","0",null],"0","-"],["1964","1966","-","Oct","15",["0","0","0",null],"60","S"],["1967","only","-","Apr","2",["0","0","0",null],"0","-"],["1967","1968","-","Oct","Sun>=1",["0","0","0",null],"60","S"],["1968","1969","-","Apr","Sun>=1",["0","0","0",null],"0","-"],["1974","only","-","Jan","23",["0","0","0",null],"60","S"],["1974","only","-","May","1",["0","0","0",null],"0","-"]],"ChileAQ":[["1972","1986","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1974","1987","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1987","only","-","Apr","12",["3","0","0","u"],"0","-"],["1988","1989","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1988","only","-","Oct","Sun>=1",["4","0","0","u"],"60","S"],["1989","only","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1990","only","-","Mar","18",["3","0","0","u"],"0","-"],["1990","only","-","Sep","16",["4","0","0","u"],"60","S"],["1991","1996","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1991","1997","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1997","only","-","Mar","30",["3","0","0","u"],"0","-"],["1998","only","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1998","only","-","Sep","27",["4","0","0","u"],"60","S"],["1999","only","-","Apr","4",["3","0","0","u"],"0","-"],["1999","2010","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["2000","2007","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["2008","only","-","Mar","30",["3","0","0","u"],"0","-"],["2009","only","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["2010","only","-","Apr","Sun>=1",["3","0","0","u"],"0","-"],["2011","only","-","May","Sun>=2",["3","0","0","u"],"0","-"],["2011","only","-","Aug","Sun>=16",["4","0","0","u"],"60","S"],["2012","max","-","Apr","Sun>=23",["3","0","0","u"],"0","-"],["2012","max","-","Sep","Sun>=2",["4","0","0","u"],"60","S"]],"Troll":[["2005","max","-","Mar","lastSun",["1","0","0","u"],"120","CEST"],["2004","max","-","Oct","lastSun",["1","0","0","u"],"0","UTC"]],"EUAsia":[["1981","max","-","Mar","lastSun",["1","0","0","u"],"60","S"],["1979","1995","-","Sep","lastSun",["1","0","0","u"],"0","-"],["1996","max","-","Oct","lastSun",["1","0","0","u"],"0","-"]],"E-EurAsia":[["1981","max","-","Mar","lastSun",["0","0","0",null],"60","S"],["1979","1995","-","Sep","lastSun",["0","0","0",null],"0","-"],["1996","max","-","Oct","lastSun",["0","0","0",null],"0","-"]],"RussiaAsia":[["1981","1984","-","Apr","1",["0","0","0",null],"60","S"],["1981","1983","-","Oct","1",["0","0","0",null],"0","-"],["1984","1991","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1985","1991","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1992","only","-","Mar","lastSat",["23","0","0",null],"60","S"],["1992","only","-","Sep","lastSat",["23","0","0",null],"0","-"],["1993","max","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1993","1995","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1996","max","-","Oct","lastSun",["2","0","0","s"],"0","-"]],"Azer":[["1997","max","-","Mar","lastSun",["4","0","0",null],"60","S"],["1997","max","-","Oct","lastSun",["5","0","0",null],"0","-"]],"Dhaka":[["2009","only","-","Jun","19",["23","0","0",null],"60","S"],["2009","only","-","Dec","31",["23","59","0",null],"0","-"]],"Shang":[["1940","only","-","Jun","3",["0","0","0",null],"60","D"],["1940","1941","-","Oct","1",["0","0","0",null],"0","S"],["1941","only","-","Mar","16",["0","0","0",null],"60","D"]],"PRC":[["1986","only","-","May","4",["0","0","0",null],"60","D"],["1986","1991","-","Sep","Sun>=11",["0","0","0",null],"0","S"],["1987","1991","-","Apr","Sun>=10",["0","0","0",null],"60","D"]],"HK":[["1941","only","-","Apr","1",["3","30","0",null],"60","S"],["1941","only","-","Sep","30",["3","30","0",null],"0","-"],["1946","only","-","Apr","20",["3","30","0",null],"60","S"],["1946","only","-","Dec","1",["3","30","0",null],"0","-"],["1947","only","-","Apr","13",["3","30","0",null],"60","S"],["1947","only","-","Dec","30",["3","30","0",null],"0","-"],["1948","only","-","May","2",["3","30","0",null],"60","S"],["1948","1951","-","Oct","lastSun",["3","30","0",null],"0","-"],["1952","only","-","Oct","25",["3","30","0",null],"0","-"],["1949","1953","-","Apr","Sun>=1",["3","30","0",null],"60","S"],["1953","only","-","Nov","1",["3","30","0",null],"0","-"],["1954","1964","-","Mar","Sun>=18",["3","30","0",null],"60","S"],["1954","only","-","Oct","31",["3","30","0",null],"0","-"],["1955","1964","-","Nov","Sun>=1",["3","30","0",null],"0","-"],["1965","1976","-","Apr","Sun>=16",["3","30","0",null],"60","S"],["1965","1976","-","Oct","Sun>=16",["3","30","0",null],"0","-"],["1973","only","-","Dec","30",["3","30","0",null],"60","S"],["1979","only","-","May","Sun>=8",["3","30","0",null],"60","S"],["1979","only","-","Oct","Sun>=16",["3","30","0",null],"0","-"]],"Taiwan":[["1945","1951","-","May","1",["0","0","0",null],"60","D"],["1945","1951","-","Oct","1",["0","0","0",null],"0","S"],["1952","only","-","Mar","1",["0","0","0",null],"60","D"],["1952","1954","-","Nov","1",["0","0","0",null],"0","S"],["1953","1959","-","Apr","1",["0","0","0",null],"60","D"],["1955","1961","-","Oct","1",["0","0","0",null],"0","S"],["1960","1961","-","Jun","1",["0","0","0",null],"60","D"],["1974","1975","-","Apr","1",["0","0","0",null],"60","D"],["1974","1975","-","Oct","1",["0","0","0",null],"0","S"],["1979","only","-","Jun","30",["0","0","0",null],"60","D"],["1979","only","-","Sep","30",["0","0","0",null],"0","S"]],"Macau":[["1961","1962","-","Mar","Sun>=16",["3","30","0",null],"60","S"],["1961","1964","-","Nov","Sun>=1",["3","30","0",null],"0","-"],["1963","only","-","Mar","Sun>=16",["0","0","0",null],"60","S"],["1964","only","-","Mar","Sun>=16",["3","30","0",null],"60","S"],["1965","only","-","Mar","Sun>=16",["0","0","0",null],"60","S"],["1965","only","-","Oct","31",["0","0","0",null],"0","-"],["1966","1971","-","Apr","Sun>=16",["3","30","0",null],"60","S"],["1966","1971","-","Oct","Sun>=16",["3","30","0",null],"0","-"],["1972","1974","-","Apr","Sun>=15",["0","0","0",null],"60","S"],["1972","1973","-","Oct","Sun>=15",["0","0","0",null],"0","-"],["1974","1977","-","Oct","Sun>=15",["3","30","0",null],"0","-"],["1975","1977","-","Apr","Sun>=15",["3","30","0",null],"60","S"],["1978","1980","-","Apr","Sun>=15",["0","0","0",null],"60","S"],["1978","1980","-","Oct","Sun>=15",["0","0","0",null],"0","-"]],"Cyprus":[["1975","only","-","Apr","13",["0","0","0",null],"60","S"],["1975","only","-","Oct","12",["0","0","0",null],"0","-"],["1976","only","-","May","15",["0","0","0",null],"60","S"],["1976","only","-","Oct","11",["0","0","0",null],"0","-"],["1977","1980","-","Apr","Sun>=1",["0","0","0",null],"60","S"],["1977","only","-","Sep","25",["0","0","0",null],"0","-"],["1978","only","-","Oct","2",["0","0","0",null],"0","-"],["1979","1997","-","Sep","lastSun",["0","0","0",null],"0","-"],["1981","1998","-","Mar","lastSun",["0","0","0",null],"60","S"]],"Iran":[["1978","1980","-","Mar","21",["0","0","0",null],"60","D"],["1978","only","-","Oct","21",["0","0","0",null],"0","S"],["1979","only","-","Sep","19",["0","0","0",null],"0","S"],["1980","only","-","Sep","23",["0","0","0",null],"0","S"],["1991","only","-","May","3",["0","0","0",null],"60","D"],["1992","1995","-","Mar","22",["0","0","0",null],"60","D"],["1991","1995","-","Sep","22",["0","0","0",null],"0","S"],["1996","only","-","Mar","21",["0","0","0",null],"60","D"],["1996","only","-","Sep","21",["0","0","0",null],"0","S"],["1997","1999","-","Mar","22",["0","0","0",null],"60","D"],["1997","1999","-","Sep","22",["0","0","0",null],"0","S"],["2000","only","-","Mar","21",["0","0","0",null],"60","D"],["2000","only","-","Sep","21",["0","0","0",null],"0","S"],["2001","2003","-","Mar","22",["0","0","0",null],"60","D"],["2001","2003","-","Sep","22",["0","0","0",null],"0","S"],["2004","only","-","Mar","21",["0","0","0",null],"60","D"],["2004","only","-","Sep","21",["0","0","0",null],"0","S"],["2005","only","-","Mar","22",["0","0","0",null],"60","D"],["2005","only","-","Sep","22",["0","0","0",null],"0","S"],["2008","only","-","Mar","21",["0","0","0",null],"60","D"],["2008","only","-","Sep","21",["0","0","0",null],"0","S"],["2009","2011","-","Mar","22",["0","0","0",null],"60","D"],["2009","2011","-","Sep","22",["0","0","0",null],"0","S"],["2012","only","-","Mar","21",["0","0","0",null],"60","D"],["2012","only","-","Sep","21",["0","0","0",null],"0","S"],["2013","2015","-","Mar","22",["0","0","0",null],"60","D"],["2013","2015","-","Sep","22",["0","0","0",null],"0","S"],["2016","only","-","Mar","21",["0","0","0",null],"60","D"],["2016","only","-","Sep","21",["0","0","0",null],"0","S"],["2017","2019","-","Mar","22",["0","0","0",null],"60","D"],["2017","2019","-","Sep","22",["0","0","0",null],"0","S"],["2020","only","-","Mar","21",["0","0","0",null],"60","D"],["2020","only","-","Sep","21",["0","0","0",null],"0","S"],["2021","2023","-","Mar","22",["0","0","0",null],"60","D"],["2021","2023","-","Sep","22",["0","0","0",null],"0","S"],["2024","only","-","Mar","21",["0","0","0",null],"60","D"],["2024","only","-","Sep","21",["0","0","0",null],"0","S"],["2025","2027","-","Mar","22",["0","0","0",null],"60","D"],["2025","2027","-","Sep","22",["0","0","0",null],"0","S"],["2028","2029","-","Mar","21",["0","0","0",null],"60","D"],["2028","2029","-","Sep","21",["0","0","0",null],"0","S"],["2030","2031","-","Mar","22",["0","0","0",null],"60","D"],["2030","2031","-","Sep","22",["0","0","0",null],"0","S"],["2032","2033","-","Mar","21",["0","0","0",null],"60","D"],["2032","2033","-","Sep","21",["0","0","0",null],"0","S"],["2034","2035","-","Mar","22",["0","0","0",null],"60","D"],["2034","2035","-","Sep","22",["0","0","0",null],"0","S"],["2036","2037","-","Mar","21",["0","0","0",null],"60","D"],["2036","2037","-","Sep","21",["0","0","0",null],"0","S"]],"Iraq":[["1982","only","-","May","1",["0","0","0",null],"60","D"],["1982","1984","-","Oct","1",["0","0","0",null],"0","S"],["1983","only","-","Mar","31",["0","0","0",null],"60","D"],["1984","1985","-","Apr","1",["0","0","0",null],"60","D"],["1985","1990","-","Sep","lastSun",["1","0","0","s"],"0","S"],["1986","1990","-","Mar","lastSun",["1","0","0","s"],"60","D"],["1991","2007","-","Apr","1",["3","0","0","s"],"60","D"],["1991","2007","-","Oct","1",["3","0","0","s"],"0","S"]],"Zion":[["1940","only","-","Jun","1",["0","0","0",null],"60","D"],["1942","1944","-","Nov","1",["0","0","0",null],"0","S"],["1943","only","-","Apr","1",["2","0","0",null],"60","D"],["1944","only","-","Apr","1",["0","0","0",null],"60","D"],["1945","only","-","Apr","16",["0","0","0",null],"60","D"],["1945","only","-","Nov","1",["2","0","0",null],"0","S"],["1946","only","-","Apr","16",["2","0","0",null],"60","D"],["1946","only","-","Nov","1",["0","0","0",null],"0","S"],["1948","only","-","May","23",["0","0","0",null],"120","DD"],["1948","only","-","Sep","1",["0","0","0",null],"60","D"],["1948","1949","-","Nov","1",["2","0","0",null],"0","S"],["1949","only","-","May","1",["0","0","0",null],"60","D"],["1950","only","-","Apr","16",["0","0","0",null],"60","D"],["1950","only","-","Sep","15",["3","0","0",null],"0","S"],["1951","only","-","Apr","1",["0","0","0",null],"60","D"],["1951","only","-","Nov","11",["3","0","0",null],"0","S"],["1952","only","-","Apr","20",["2","0","0",null],"60","D"],["1952","only","-","Oct","19",["3","0","0",null],"0","S"],["1953","only","-","Apr","12",["2","0","0",null],"60","D"],["1953","only","-","Sep","13",["3","0","0",null],"0","S"],["1954","only","-","Jun","13",["0","0","0",null],"60","D"],["1954","only","-","Sep","12",["0","0","0",null],"0","S"],["1955","only","-","Jun","11",["2","0","0",null],"60","D"],["1955","only","-","Sep","11",["0","0","0",null],"0","S"],["1956","only","-","Jun","3",["0","0","0",null],"60","D"],["1956","only","-","Sep","30",["3","0","0",null],"0","S"],["1957","only","-","Apr","29",["2","0","0",null],"60","D"],["1957","only","-","Sep","22",["0","0","0",null],"0","S"],["1974","only","-","Jul","7",["0","0","0",null],"60","D"],["1974","only","-","Oct","13",["0","0","0",null],"0","S"],["1975","only","-","Apr","20",["0","0","0",null],"60","D"],["1975","only","-","Aug","31",["0","0","0",null],"0","S"],["1985","only","-","Apr","14",["0","0","0",null],"60","D"],["1985","only","-","Sep","15",["0","0","0",null],"0","S"],["1986","only","-","May","18",["0","0","0",null],"60","D"],["1986","only","-","Sep","7",["0","0","0",null],"0","S"],["1987","only","-","Apr","15",["0","0","0",null],"60","D"],["1987","only","-","Sep","13",["0","0","0",null],"0","S"],["1988","only","-","Apr","10",["0","0","0",null],"60","D"],["1988","only","-","Sep","4",["0","0","0",null],"0","S"],["1989","only","-","Apr","30",["0","0","0",null],"60","D"],["1989","only","-","Sep","3",["0","0","0",null],"0","S"],["1990","only","-","Mar","25",["0","0","0",null],"60","D"],["1990","only","-","Aug","26",["0","0","0",null],"0","S"],["1991","only","-","Mar","24",["0","0","0",null],"60","D"],["1991","only","-","Sep","1",["0","0","0",null],"0","S"],["1992","only","-","Mar","29",["0","0","0",null],"60","D"],["1992","only","-","Sep","6",["0","0","0",null],"0","S"],["1993","only","-","Apr","2",["0","0","0",null],"60","D"],["1993","only","-","Sep","5",["0","0","0",null],"0","S"],["1994","only","-","Apr","1",["0","0","0",null],"60","D"],["1994","only","-","Aug","28",["0","0","0",null],"0","S"],["1995","only","-","Mar","31",["0","0","0",null],"60","D"],["1995","only","-","Sep","3",["0","0","0",null],"0","S"],["1996","only","-","Mar","15",["0","0","0",null],"60","D"],["1996","only","-","Sep","16",["0","0","0",null],"0","S"],["1997","only","-","Mar","21",["0","0","0",null],"60","D"],["1997","only","-","Sep","14",["0","0","0",null],"0","S"],["1998","only","-","Mar","20",["0","0","0",null],"60","D"],["1998","only","-","Sep","6",["0","0","0",null],"0","S"],["1999","only","-","Apr","2",["2","0","0",null],"60","D"],["1999","only","-","Sep","3",["2","0","0",null],"0","S"],["2000","only","-","Apr","14",["2","0","0",null],"60","D"],["2000","only","-","Oct","6",["1","0","0",null],"0","S"],["2001","only","-","Apr","9",["1","0","0",null],"60","D"],["2001","only","-","Sep","24",["1","0","0",null],"0","S"],["2002","only","-","Mar","29",["1","0","0",null],"60","D"],["2002","only","-","Oct","7",["1","0","0",null],"0","S"],["2003","only","-","Mar","28",["1","0","0",null],"60","D"],["2003","only","-","Oct","3",["1","0","0",null],"0","S"],["2004","only","-","Apr","7",["1","0","0",null],"60","D"],["2004","only","-","Sep","22",["1","0","0",null],"0","S"],["2005","only","-","Apr","1",["2","0","0",null],"60","D"],["2005","only","-","Oct","9",["2","0","0",null],"0","S"],["2006","2010","-","Mar","Fri>=26",["2","0","0",null],"60","D"],["2006","only","-","Oct","1",["2","0","0",null],"0","S"],["2007","only","-","Sep","16",["2","0","0",null],"0","S"],["2008","only","-","Oct","5",["2","0","0",null],"0","S"],["2009","only","-","Sep","27",["2","0","0",null],"0","S"],["2010","only","-","Sep","12",["2","0","0",null],"0","S"],["2011","only","-","Apr","1",["2","0","0",null],"60","D"],["2011","only","-","Oct","2",["2","0","0",null],"0","S"],["2012","only","-","Mar","Fri>=26",["2","0","0",null],"60","D"],["2012","only","-","Sep","23",["2","0","0",null],"0","S"],["2013","max","-","Mar","Fri>=23",["2","0","0",null],"60","D"],["2013","max","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Japan":[["1948","only","-","May","Sun>=1",["2","0","0",null],"60","D"],["1948","1951","-","Sep","Sat>=8",["2","0","0",null],"0","S"],["1949","only","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["1950","1951","-","May","Sun>=1",["2","0","0",null],"60","D"]],"Jordan":[["1973","only","-","Jun","6",["0","0","0",null],"60","S"],["1973","1975","-","Oct","1",["0","0","0",null],"0","-"],["1974","1977","-","May","1",["0","0","0",null],"60","S"],["1976","only","-","Nov","1",["0","0","0",null],"0","-"],["1977","only","-","Oct","1",["0","0","0",null],"0","-"],["1978","only","-","Apr","30",["0","0","0",null],"60","S"],["1978","only","-","Sep","30",["0","0","0",null],"0","-"],["1985","only","-","Apr","1",["0","0","0",null],"60","S"],["1985","only","-","Oct","1",["0","0","0",null],"0","-"],["1986","1988","-","Apr","Fri>=1",["0","0","0",null],"60","S"],["1986","1990","-","Oct","Fri>=1",["0","0","0",null],"0","-"],["1989","only","-","May","8",["0","0","0",null],"60","S"],["1990","only","-","Apr","27",["0","0","0",null],"60","S"],["1991","only","-","Apr","17",["0","0","0",null],"60","S"],["1991","only","-","Sep","27",["0","0","0",null],"0","-"],["1992","only","-","Apr","10",["0","0","0",null],"60","S"],["1992","1993","-","Oct","Fri>=1",["0","0","0",null],"0","-"],["1993","1998","-","Apr","Fri>=1",["0","0","0",null],"60","S"],["1994","only","-","Sep","Fri>=15",["0","0","0",null],"0","-"],["1995","1998","-","Sep","Fri>=15",["0","0","0","s"],"0","-"],["1999","only","-","Jul","1",["0","0","0","s"],"60","S"],["1999","2002","-","Sep","lastFri",["0","0","0","s"],"0","-"],["2000","2001","-","Mar","lastThu",["0","0","0","s"],"60","S"],["2002","2012","-","Mar","lastThu",["24","0","0",null],"60","S"],["2003","only","-","Oct","24",["0","0","0","s"],"0","-"],["2004","only","-","Oct","15",["0","0","0","s"],"0","-"],["2005","only","-","Sep","lastFri",["0","0","0","s"],"0","-"],["2006","2011","-","Oct","lastFri",["0","0","0","s"],"0","-"],["2013","only","-","Dec","20",["0","0","0",null],"0","-"],["2014","max","-","Mar","lastThu",["24","0","0",null],"60","S"],["2014","max","-","Oct","lastFri",["0","0","0","s"],"0","-"]],"Kyrgyz":[["1992","1996","-","Apr","Sun>=7",["0","0","0","s"],"60","S"],["1992","1996","-","Sep","lastSun",["0","0","0",null],"0","-"],["1997","2005","-","Mar","lastSun",["2","30","0",null],"60","S"],["1997","2004","-","Oct","lastSun",["2","30","0",null],"0","-"]],"ROK":[["1960","only","-","May","15",["0","0","0",null],"60","D"],["1960","only","-","Sep","13",["0","0","0",null],"0","S"],["1987","1988","-","May","Sun>=8",["0","0","0",null],"60","D"],["1987","1988","-","Oct","Sun>=8",["0","0","0",null],"0","S"]],"Lebanon":[["1920","only","-","Mar","28",["0","0","0",null],"60","S"],["1920","only","-","Oct","25",["0","0","0",null],"0","-"],["1921","only","-","Apr","3",["0","0","0",null],"60","S"],["1921","only","-","Oct","3",["0","0","0",null],"0","-"],["1922","only","-","Mar","26",["0","0","0",null],"60","S"],["1922","only","-","Oct","8",["0","0","0",null],"0","-"],["1923","only","-","Apr","22",["0","0","0",null],"60","S"],["1923","only","-","Sep","16",["0","0","0",null],"0","-"],["1957","1961","-","May","1",["0","0","0",null],"60","S"],["1957","1961","-","Oct","1",["0","0","0",null],"0","-"],["1972","only","-","Jun","22",["0","0","0",null],"60","S"],["1972","1977","-","Oct","1",["0","0","0",null],"0","-"],["1973","1977","-","May","1",["0","0","0",null],"60","S"],["1978","only","-","Apr","30",["0","0","0",null],"60","S"],["1978","only","-","Sep","30",["0","0","0",null],"0","-"],["1984","1987","-","May","1",["0","0","0",null],"60","S"],["1984","1991","-","Oct","16",["0","0","0",null],"0","-"],["1988","only","-","Jun","1",["0","0","0",null],"60","S"],["1989","only","-","May","10",["0","0","0",null],"60","S"],["1990","1992","-","May","1",["0","0","0",null],"60","S"],["1992","only","-","Oct","4",["0","0","0",null],"0","-"],["1993","max","-","Mar","lastSun",["0","0","0",null],"60","S"],["1993","1998","-","Sep","lastSun",["0","0","0",null],"0","-"],["1999","max","-","Oct","lastSun",["0","0","0",null],"0","-"]],"NBorneo":[["1935","1941","-","Sep","14",["0","0","0",null],"20","TS",""],["1935","1941","-","Dec","14",["0","0","0",null],"0","-"]],"Mongol":[["1983","1984","-","Apr","1",["0","0","0",null],"60","S"],["1983","only","-","Oct","1",["0","0","0",null],"0","-"],["1985","1998","-","Mar","lastSun",["0","0","0",null],"60","S"],["1984","1998","-","Sep","lastSun",["0","0","0",null],"0","-"],["2001","only","-","Apr","lastSat",["2","0","0",null],"60","S"],["2001","2006","-","Sep","lastSat",["2","0","0",null],"0","-"],["2002","2006","-","Mar","lastSat",["2","0","0",null],"60","S"]],"Pakistan":[["2002","only","-","Apr","Sun>=2",["0","1","0",null],"60","S"],["2002","only","-","Oct","Sun>=2",["0","1","0",null],"0","-"],["2008","only","-","Jun","1",["0","0","0",null],"60","S"],["2008","only","-","Nov","1",["0","0","0",null],"0","-"],["2009","only","-","Apr","15",["0","0","0",null],"60","S"],["2009","only","-","Nov","1",["0","0","0",null],"0","-"]],"EgyptAsia":[["1957","only","-","May","10",["0","0","0",null],"60","S"],["1957","1958","-","Oct","1",["0","0","0",null],"0","-"],["1958","only","-","May","1",["0","0","0",null],"60","S"],["1959","1967","-","May","1",["1","0","0",null],"60","S"],["1959","1965","-","Sep","30",["3","0","0",null],"0","-"],["1966","only","-","Oct","1",["3","0","0",null],"0","-"]],"Palestine":[["1999","2005","-","Apr","Fri>=15",["0","0","0",null],"60","S"],["1999","2003","-","Oct","Fri>=15",["0","0","0",null],"0","-"],["2004","only","-","Oct","1",["1","0","0",null],"0","-"],["2005","only","-","Oct","4",["2","0","0",null],"0","-"],["2006","2007","-","Apr","1",["0","0","0",null],"60","S"],["2006","only","-","Sep","22",["0","0","0",null],"0","-"],["2007","only","-","Sep","Thu>=8",["2","0","0",null],"0","-"],["2008","2009","-","Mar","lastFri",["0","0","0",null],"60","S"],["2008","only","-","Sep","1",["0","0","0",null],"0","-"],["2009","only","-","Sep","Fri>=1",["1","0","0",null],"0","-"],["2010","only","-","Mar","26",["0","0","0",null],"60","S"],["2010","only","-","Aug","11",["0","0","0",null],"0","-"],["2011","only","-","Apr","1",["0","1","0",null],"60","S"],["2011","only","-","Aug","1",["0","0","0",null],"0","-"],["2011","only","-","Aug","30",["0","0","0",null],"60","S"],["2011","only","-","Sep","30",["0","0","0",null],"0","-"],["2012","max","-","Mar","lastThu",["24","0","0",null],"60","S"],["2012","only","-","Sep","21",["1","0","0",null],"0","-"],["2013","max","-","Sep","Fri>=21",["0","0","0",null],"0","-"]],"Phil":[["1936","only","-","Nov","1",["0","0","0",null],"60","S"],["1937","only","-","Feb","1",["0","0","0",null],"0","-"],["1954","only","-","Apr","12",["0","0","0",null],"60","S"],["1954","only","-","Jul","1",["0","0","0",null],"0","-"],["1978","only","-","Mar","22",["0","0","0",null],"60","S"],["1978","only","-","Sep","21",["0","0","0",null],"0","-"]],"Syria":[["1920","1923","-","Apr","Sun>=15",["2","0","0",null],"60","S"],["1920","1923","-","Oct","Sun>=1",["2","0","0",null],"0","-"],["1962","only","-","Apr","29",["2","0","0",null],"60","S"],["1962","only","-","Oct","1",["2","0","0",null],"0","-"],["1963","1965","-","May","1",["2","0","0",null],"60","S"],["1963","only","-","Sep","30",["2","0","0",null],"0","-"],["1964","only","-","Oct","1",["2","0","0",null],"0","-"],["1965","only","-","Sep","30",["2","0","0",null],"0","-"],["1966","only","-","Apr","24",["2","0","0",null],"60","S"],["1966","1976","-","Oct","1",["2","0","0",null],"0","-"],["1967","1978","-","May","1",["2","0","0",null],"60","S"],["1977","1978","-","Sep","1",["2","0","0",null],"0","-"],["1983","1984","-","Apr","9",["2","0","0",null],"60","S"],["1983","1984","-","Oct","1",["2","0","0",null],"0","-"],["1986","only","-","Feb","16",["2","0","0",null],"60","S"],["1986","only","-","Oct","9",["2","0","0",null],"0","-"],["1987","only","-","Mar","1",["2","0","0",null],"60","S"],["1987","1988","-","Oct","31",["2","0","0",null],"0","-"],["1988","only","-","Mar","15",["2","0","0",null],"60","S"],["1989","only","-","Mar","31",["2","0","0",null],"60","S"],["1989","only","-","Oct","1",["2","0","0",null],"0","-"],["1990","only","-","Apr","1",["2","0","0",null],"60","S"],["1990","only","-","Sep","30",["2","0","0",null],"0","-"],["1991","only","-","Apr","1",["0","0","0",null],"60","S"],["1991","1992","-","Oct","1",["0","0","0",null],"0","-"],["1992","only","-","Apr","8",["0","0","0",null],"60","S"],["1993","only","-","Mar","26",["0","0","0",null],"60","S"],["1993","only","-","Sep","25",["0","0","0",null],"0","-"],["1994","1996","-","Apr","1",["0","0","0",null],"60","S"],["1994","2005","-","Oct","1",["0","0","0",null],"0","-"],["1997","1998","-","Mar","lastMon",["0","0","0",null],"60","S"],["1999","2006","-","Apr","1",["0","0","0",null],"60","S"],["2006","only","-","Sep","22",["0","0","0",null],"0","-"],["2007","only","-","Mar","lastFri",["0","0","0",null],"60","S"],["2007","only","-","Nov","Fri>=1",["0","0","0",null],"0","-"],["2008","only","-","Apr","Fri>=1",["0","0","0",null],"60","S"],["2008","only","-","Nov","1",["0","0","0",null],"0","-"],["2009","only","-","Mar","lastFri",["0","0","0",null],"60","S"],["2010","2011","-","Apr","Fri>=1",["0","0","0",null],"60","S"],["2012","max","-","Mar","lastFri",["0","0","0",null],"60","S"],["2009","max","-","Oct","lastFri",["0","0","0",null],"0","-"]],"Aus":[["1917","only","-","Jan","1",["0","1","0",null],"60","-"],["1917","only","-","Mar","25",["2","0","0",null],"0","-"],["1942","only","-","Jan","1",["2","0","0",null],"60","-"],["1942","only","-","Mar","29",["2","0","0",null],"0","-"],["1942","only","-","Sep","27",["2","0","0",null],"60","-"],["1943","1944","-","Mar","lastSun",["2","0","0",null],"0","-"],["1943","only","-","Oct","3",["2","0","0",null],"60","-"]],"AW":[["1974","only","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1975","only","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1983","only","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1984","only","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1991","only","-","Nov","17",["2","0","0","s"],"60","-"],["1992","only","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["2006","only","-","Dec","3",["2","0","0","s"],"60","-"],["2007","2009","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2007","2008","-","Oct","lastSun",["2","0","0","s"],"60","-"]],"AQ":[["1971","only","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1972","only","-","Feb","lastSun",["2","0","0","s"],"0","-"],["1989","1991","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1990","1992","-","Mar","Sun>=1",["2","0","0","s"],"0","-"]],"Holiday":[["1992","1993","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1993","1994","-","Mar","Sun>=1",["2","0","0","s"],"0","-"]],"AS":[["1971","1985","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1986","only","-","Oct","19",["2","0","0","s"],"60","-"],["1987","2007","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1972","only","-","Feb","27",["2","0","0","s"],"0","-"],["1973","1985","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1986","1990","-","Mar","Sun>=15",["2","0","0","s"],"0","-"],["1991","only","-","Mar","3",["2","0","0","s"],"0","-"],["1992","only","-","Mar","22",["2","0","0","s"],"0","-"],["1993","only","-","Mar","7",["2","0","0","s"],"0","-"],["1994","only","-","Mar","20",["2","0","0","s"],"0","-"],["1995","2005","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2006","only","-","Apr","2",["2","0","0","s"],"0","-"],["2007","only","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2008","max","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["2008","max","-","Oct","Sun>=1",["2","0","0","s"],"60","-"]],"AT":[["1967","only","-","Oct","Sun>=1",["2","0","0","s"],"60","-"],["1968","only","-","Mar","lastSun",["2","0","0","s"],"0","-"],["1968","1985","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1969","1971","-","Mar","Sun>=8",["2","0","0","s"],"0","-"],["1972","only","-","Feb","lastSun",["2","0","0","s"],"0","-"],["1973","1981","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1982","1983","-","Mar","lastSun",["2","0","0","s"],"0","-"],["1984","1986","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1986","only","-","Oct","Sun>=15",["2","0","0","s"],"60","-"],["1987","1990","-","Mar","Sun>=15",["2","0","0","s"],"0","-"],["1987","only","-","Oct","Sun>=22",["2","0","0","s"],"60","-"],["1988","1990","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1991","1999","-","Oct","Sun>=1",["2","0","0","s"],"60","-"],["1991","2005","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2000","only","-","Aug","lastSun",["2","0","0","s"],"60","-"],["2001","max","-","Oct","Sun>=1",["2","0","0","s"],"60","-"],["2006","only","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["2007","only","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2008","max","-","Apr","Sun>=1",["2","0","0","s"],"0","-"]],"AV":[["1971","1985","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1972","only","-","Feb","lastSun",["2","0","0","s"],"0","-"],["1973","1985","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1986","1990","-","Mar","Sun>=15",["2","0","0","s"],"0","-"],["1986","1987","-","Oct","Sun>=15",["2","0","0","s"],"60","-"],["1988","1999","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1991","1994","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1995","2005","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2000","only","-","Aug","lastSun",["2","0","0","s"],"60","-"],["2001","2007","-","Oct","lastSun",["2","0","0","s"],"60","-"],["2006","only","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["2007","only","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2008","max","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["2008","max","-","Oct","Sun>=1",["2","0","0","s"],"60","-"]],"AN":[["1971","1985","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1972","only","-","Feb","27",["2","0","0","s"],"0","-"],["1973","1981","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1982","only","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["1983","1985","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1986","1989","-","Mar","Sun>=15",["2","0","0","s"],"0","-"],["1986","only","-","Oct","19",["2","0","0","s"],"60","-"],["1987","1999","-","Oct","lastSun",["2","0","0","s"],"60","-"],["1990","1995","-","Mar","Sun>=1",["2","0","0","s"],"0","-"],["1996","2005","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2000","only","-","Aug","lastSun",["2","0","0","s"],"60","-"],["2001","2007","-","Oct","lastSun",["2","0","0","s"],"60","-"],["2006","only","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["2007","only","-","Mar","lastSun",["2","0","0","s"],"0","-"],["2008","max","-","Apr","Sun>=1",["2","0","0","s"],"0","-"],["2008","max","-","Oct","Sun>=1",["2","0","0","s"],"60","-"]],"LH":[["1981","1984","-","Oct","lastSun",["2","0","0",null],"60","-"],["1982","1985","-","Mar","Sun>=1",["2","0","0",null],"0","-"],["1985","only","-","Oct","lastSun",["2","0","0",null],"30","-"],["1986","1989","-","Mar","Sun>=15",["2","0","0",null],"0","-"],["1986","only","-","Oct","19",["2","0","0",null],"30","-"],["1987","1999","-","Oct","lastSun",["2","0","0",null],"30","-"],["1990","1995","-","Mar","Sun>=1",["2","0","0",null],"0","-"],["1996","2005","-","Mar","lastSun",["2","0","0",null],"0","-"],["2000","only","-","Aug","lastSun",["2","0","0",null],"30","-"],["2001","2007","-","Oct","lastSun",["2","0","0",null],"30","-"],["2006","only","-","Apr","Sun>=1",["2","0","0",null],"0","-"],["2007","only","-","Mar","lastSun",["2","0","0",null],"0","-"],["2008","max","-","Apr","Sun>=1",["2","0","0",null],"0","-"],["2008","max","-","Oct","Sun>=1",["2","0","0",null],"30","-"]],"Cook":[["1978","only","-","Nov","12",["0","0","0",null],"30","HS"],["1979","1991","-","Mar","Sun>=1",["0","0","0",null],"0","-"],["1979","1990","-","Oct","lastSun",["0","0","0",null],"30","HS"]],"Fiji":[["1998","1999","-","Nov","Sun>=1",["2","0","0",null],"60","S"],["1999","2000","-","Feb","lastSun",["3","0","0",null],"0","-"],["2009","only","-","Nov","29",["2","0","0",null],"60","S"],["2010","only","-","Mar","lastSun",["3","0","0",null],"0","-"],["2010","max","-","Oct","Sun>=21",["2","0","0",null],"60","S"],["2011","only","-","Mar","Sun>=1",["3","0","0",null],"0","-"],["2012","2013","-","Jan","Sun>=18",["3","0","0",null],"0","-"],["2014","max","-","Jan","Sun>=18",["2","0","0",null],"0","-"]],"NC":[["1977","1978","-","Dec","Sun>=1",["0","0","0",null],"60","S"],["1978","1979","-","Feb","27",["0","0","0",null],"0","-"],["1996","only","-","Dec","1",["2","0","0","s"],"60","S"],["1997","only","-","Mar","2",["2","0","0","s"],"0","-"]],"NZ":[["1927","only","-","Nov","6",["2","0","0",null],"60","S"],["1928","only","-","Mar","4",["2","0","0",null],"0","M"],["1928","1933","-","Oct","Sun>=8",["2","0","0",null],"30","S"],["1929","1933","-","Mar","Sun>=15",["2","0","0",null],"0","M"],["1934","1940","-","Apr","lastSun",["2","0","0",null],"0","M"],["1934","1940","-","Sep","lastSun",["2","0","0",null],"30","S"],["1946","only","-","Jan","1",["0","0","0",null],"0","S"],["1974","only","-","Nov","Sun>=1",["2","0","0","s"],"60","D"],["1975","only","-","Feb","lastSun",["2","0","0","s"],"0","S"],["1975","1988","-","Oct","lastSun",["2","0","0","s"],"60","D"],["1976","1989","-","Mar","Sun>=1",["2","0","0","s"],"0","S"],["1989","only","-","Oct","Sun>=8",["2","0","0","s"],"60","D"],["1990","2006","-","Oct","Sun>=1",["2","0","0","s"],"60","D"],["1990","2007","-","Mar","Sun>=15",["2","0","0","s"],"0","S"],["2007","max","-","Sep","lastSun",["2","0","0","s"],"60","D"],["2008","max","-","Apr","Sun>=1",["2","0","0","s"],"0","S"]],"Chatham":[["1974","only","-","Nov","Sun>=1",["2","45","0","s"],"60","D"],["1975","only","-","Feb","lastSun",["2","45","0","s"],"0","S"],["1975","1988","-","Oct","lastSun",["2","45","0","s"],"60","D"],["1976","1989","-","Mar","Sun>=1",["2","45","0","s"],"0","S"],["1989","only","-","Oct","Sun>=8",["2","45","0","s"],"60","D"],["1990","2006","-","Oct","Sun>=1",["2","45","0","s"],"60","D"],["1990","2007","-","Mar","Sun>=15",["2","45","0","s"],"0","S"],["2007","max","-","Sep","lastSun",["2","45","0","s"],"60","D"],["2008","max","-","Apr","Sun>=1",["2","45","0","s"],"0","S"]],"WS":[["2012","max","-","Sep","lastSun",["3","0","0",null],"60","D"],["2012","max","-","Apr","Sun>=1",["4","0","0",null],"0","-"]],"Tonga":[["1999","only","-","Oct","7",["2","0","0","s"],"60","S"],["2000","only","-","Mar","19",["2","0","0","s"],"0","-"],["2000","2001","-","Nov","Sun>=1",["2","0","0",null],"60","S"],["2001","2002","-","Jan","lastSun",["2","0","0",null],"0","-"]],"Vanuatu":[["1983","only","-","Sep","25",["0","0","0",null],"60","S"],["1984","1991","-","Mar","Sun>=23",["0","0","0",null],"0","-"],["1984","only","-","Oct","23",["0","0","0",null],"60","S"],["1985","1991","-","Sep","Sun>=23",["0","0","0",null],"60","S"],["1992","1993","-","Jan","Sun>=23",["0","0","0",null],"0","-"],["1992","only","-","Oct","Sun>=23",["0","0","0",null],"60","S"]],"GB-Eire":[["1916","only","-","May","21",["2","0","0","s"],"60","BST"],["1916","only","-","Oct","1",["2","0","0","s"],"0","GMT"],["1917","only","-","Apr","8",["2","0","0","s"],"60","BST"],["1917","only","-","Sep","17",["2","0","0","s"],"0","GMT"],["1918","only","-","Mar","24",["2","0","0","s"],"60","BST"],["1918","only","-","Sep","30",["2","0","0","s"],"0","GMT"],["1919","only","-","Mar","30",["2","0","0","s"],"60","BST"],["1919","only","-","Sep","29",["2","0","0","s"],"0","GMT"],["1920","only","-","Mar","28",["2","0","0","s"],"60","BST"],["1920","only","-","Oct","25",["2","0","0","s"],"0","GMT"],["1921","only","-","Apr","3",["2","0","0","s"],"60","BST"],["1921","only","-","Oct","3",["2","0","0","s"],"0","GMT"],["1922","only","-","Mar","26",["2","0","0","s"],"60","BST"],["1922","only","-","Oct","8",["2","0","0","s"],"0","GMT"],["1923","only","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1923","1924","-","Sep","Sun>=16",["2","0","0","s"],"0","GMT"],["1924","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1925","1926","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1925","1938","-","Oct","Sun>=2",["2","0","0","s"],"0","GMT"],["1927","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1928","1929","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1930","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1931","1932","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1933","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1934","only","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1935","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1936","1937","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1938","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1939","only","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1939","only","-","Nov","Sun>=16",["2","0","0","s"],"0","GMT"],["1940","only","-","Feb","Sun>=23",["2","0","0","s"],"60","BST"],["1941","only","-","May","Sun>=2",["1","0","0","s"],"120","BDST"],["1941","1943","-","Aug","Sun>=9",["1","0","0","s"],"60","BST"],["1942","1944","-","Apr","Sun>=2",["1","0","0","s"],"120","BDST"],["1944","only","-","Sep","Sun>=16",["1","0","0","s"],"60","BST"],["1945","only","-","Apr","Mon>=2",["1","0","0","s"],"120","BDST"],["1945","only","-","Jul","Sun>=9",["1","0","0","s"],"60","BST"],["1945","1946","-","Oct","Sun>=2",["2","0","0","s"],"0","GMT"],["1946","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1947","only","-","Mar","16",["2","0","0","s"],"60","BST"],["1947","only","-","Apr","13",["1","0","0","s"],"120","BDST"],["1947","only","-","Aug","10",["1","0","0","s"],"60","BST"],["1947","only","-","Nov","2",["2","0","0","s"],"0","GMT"],["1948","only","-","Mar","14",["2","0","0","s"],"60","BST"],["1948","only","-","Oct","31",["2","0","0","s"],"0","GMT"],["1949","only","-","Apr","3",["2","0","0","s"],"60","BST"],["1949","only","-","Oct","30",["2","0","0","s"],"0","GMT"],["1950","1952","-","Apr","Sun>=14",["2","0","0","s"],"60","BST"],["1950","1952","-","Oct","Sun>=21",["2","0","0","s"],"0","GMT"],["1953","only","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1953","1960","-","Oct","Sun>=2",["2","0","0","s"],"0","GMT"],["1954","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1955","1956","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1957","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1958","1959","-","Apr","Sun>=16",["2","0","0","s"],"60","BST"],["1960","only","-","Apr","Sun>=9",["2","0","0","s"],"60","BST"],["1961","1963","-","Mar","lastSun",["2","0","0","s"],"60","BST"],["1961","1968","-","Oct","Sun>=23",["2","0","0","s"],"0","GMT"],["1964","1967","-","Mar","Sun>=19",["2","0","0","s"],"60","BST"],["1968","only","-","Feb","18",["2","0","0","s"],"60","BST"],["1972","1980","-","Mar","Sun>=16",["2","0","0","s"],"60","BST"],["1972","1980","-","Oct","Sun>=23",["2","0","0","s"],"0","GMT"],["1981","1995","-","Mar","lastSun",["1","0","0","u"],"60","BST"],["1981","1989","-","Oct","Sun>=23",["1","0","0","u"],"0","GMT"],["1990","1995","-","Oct","Sun>=22",["1","0","0","u"],"0","GMT"]],"EU":[["1977","1980","-","Apr","Sun>=1",["1","0","0","u"],"60","S"],["1977","only","-","Sep","lastSun",["1","0","0","u"],"0","-"],["1978","only","-","Oct","1",["1","0","0","u"],"0","-"],["1979","1995","-","Sep","lastSun",["1","0","0","u"],"0","-"],["1981","max","-","Mar","lastSun",["1","0","0","u"],"60","S"],["1996","max","-","Oct","lastSun",["1","0","0","u"],"0","-"]],"W-Eur":[["1977","1980","-","Apr","Sun>=1",["1","0","0","s"],"60","S"],["1977","only","-","Sep","lastSun",["1","0","0","s"],"0","-"],["1978","only","-","Oct","1",["1","0","0","s"],"0","-"],["1979","1995","-","Sep","lastSun",["1","0","0","s"],"0","-"],["1981","max","-","Mar","lastSun",["1","0","0","s"],"60","S"],["1996","max","-","Oct","lastSun",["1","0","0","s"],"0","-"]],"C-Eur":[["1916","only","-","Apr","30",["23","0","0",null],"60","S"],["1916","only","-","Oct","1",["1","0","0",null],"0","-"],["1917","1918","-","Apr","Mon>=15",["2","0","0","s"],"60","S"],["1917","1918","-","Sep","Mon>=15",["2","0","0","s"],"0","-"],["1940","only","-","Apr","1",["2","0","0","s"],"60","S"],["1942","only","-","Nov","2",["2","0","0","s"],"0","-"],["1943","only","-","Mar","29",["2","0","0","s"],"60","S"],["1943","only","-","Oct","4",["2","0","0","s"],"0","-"],["1944","1945","-","Apr","Mon>=1",["2","0","0","s"],"60","S"],["1944","only","-","Oct","2",["2","0","0","s"],"0","-"],["1945","only","-","Sep","16",["2","0","0","s"],"0","-"],["1977","1980","-","Apr","Sun>=1",["2","0","0","s"],"60","S"],["1977","only","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1978","only","-","Oct","1",["2","0","0","s"],"0","-"],["1979","1995","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1981","max","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1996","max","-","Oct","lastSun",["2","0","0","s"],"0","-"]],"E-Eur":[["1977","1980","-","Apr","Sun>=1",["0","0","0",null],"60","S"],["1977","only","-","Sep","lastSun",["0","0","0",null],"0","-"],["1978","only","-","Oct","1",["0","0","0",null],"0","-"],["1979","1995","-","Sep","lastSun",["0","0","0",null],"0","-"],["1981","max","-","Mar","lastSun",["0","0","0",null],"60","S"],["1996","max","-","Oct","lastSun",["0","0","0",null],"0","-"]],"Russia":[["1917","only","-","Jul","1",["23","0","0",null],"60","MST",""],["1917","only","-","Dec","28",["0","0","0",null],"0","MMT",""],["1918","only","-","May","31",["22","0","0",null],"120","MDST",""],["1918","only","-","Sep","16",["1","0","0",null],"60","MST"],["1919","only","-","May","31",["23","0","0",null],"120","MDST"],["1919","only","-","Jul","1",["2","0","0",null],"60","S"],["1919","only","-","Aug","16",["0","0","0",null],"0","-"],["1921","only","-","Feb","14",["23","0","0",null],"60","S"],["1921","only","-","Mar","20",["23","0","0",null],"120","M",""],["1921","only","-","Sep","1",["0","0","0",null],"60","S"],["1921","only","-","Oct","1",["0","0","0",null],"0","-"],["1981","1984","-","Apr","1",["0","0","0",null],"60","S"],["1981","1983","-","Oct","1",["0","0","0",null],"0","-"],["1984","1991","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1985","1991","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1992","only","-","Mar","lastSat",["23","0","0",null],"60","S"],["1992","only","-","Sep","lastSat",["23","0","0",null],"0","-"],["1993","2010","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1993","1995","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1996","2010","-","Oct","lastSun",["2","0","0","s"],"0","-"]],"Albania":[["1940","only","-","Jun","16",["0","0","0",null],"60","S"],["1942","only","-","Nov","2",["3","0","0",null],"0","-"],["1943","only","-","Mar","29",["2","0","0",null],"60","S"],["1943","only","-","Apr","10",["3","0","0",null],"0","-"],["1974","only","-","May","4",["0","0","0",null],"60","S"],["1974","only","-","Oct","2",["0","0","0",null],"0","-"],["1975","only","-","May","1",["0","0","0",null],"60","S"],["1975","only","-","Oct","2",["0","0","0",null],"0","-"],["1976","only","-","May","2",["0","0","0",null],"60","S"],["1976","only","-","Oct","3",["0","0","0",null],"0","-"],["1977","only","-","May","8",["0","0","0",null],"60","S"],["1977","only","-","Oct","2",["0","0","0",null],"0","-"],["1978","only","-","May","6",["0","0","0",null],"60","S"],["1978","only","-","Oct","1",["0","0","0",null],"0","-"],["1979","only","-","May","5",["0","0","0",null],"60","S"],["1979","only","-","Sep","30",["0","0","0",null],"0","-"],["1980","only","-","May","3",["0","0","0",null],"60","S"],["1980","only","-","Oct","4",["0","0","0",null],"0","-"],["1981","only","-","Apr","26",["0","0","0",null],"60","S"],["1981","only","-","Sep","27",["0","0","0",null],"0","-"],["1982","only","-","May","2",["0","0","0",null],"60","S"],["1982","only","-","Oct","3",["0","0","0",null],"0","-"],["1983","only","-","Apr","18",["0","0","0",null],"60","S"],["1983","only","-","Oct","1",["0","0","0",null],"0","-"],["1984","only","-","Apr","1",["0","0","0",null],"60","S"]],"Austria":[["1920","only","-","Apr","5",["2","0","0","s"],"60","S"],["1920","only","-","Sep","13",["2","0","0","s"],"0","-"],["1946","only","-","Apr","14",["2","0","0","s"],"60","S"],["1946","1948","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1947","only","-","Apr","6",["2","0","0","s"],"60","S"],["1948","only","-","Apr","18",["2","0","0","s"],"60","S"],["1980","only","-","Apr","6",["0","0","0",null],"60","S"],["1980","only","-","Sep","28",["0","0","0",null],"0","-"]],"Belgium":[["1918","only","-","Mar","9",["0","0","0","s"],"60","S"],["1918","1919","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1919","only","-","Mar","1",["23","0","0","s"],"60","S"],["1920","only","-","Feb","14",["23","0","0","s"],"60","S"],["1920","only","-","Oct","23",["23","0","0","s"],"0","-"],["1921","only","-","Mar","14",["23","0","0","s"],"60","S"],["1921","only","-","Oct","25",["23","0","0","s"],"0","-"],["1922","only","-","Mar","25",["23","0","0","s"],"60","S"],["1922","1927","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1923","only","-","Apr","21",["23","0","0","s"],"60","S"],["1924","only","-","Mar","29",["23","0","0","s"],"60","S"],["1925","only","-","Apr","4",["23","0","0","s"],"60","S"],["1926","only","-","Apr","17",["23","0","0","s"],"60","S"],["1927","only","-","Apr","9",["23","0","0","s"],"60","S"],["1928","only","-","Apr","14",["23","0","0","s"],"60","S"],["1928","1938","-","Oct","Sun>=2",["2","0","0","s"],"0","-"],["1929","only","-","Apr","21",["2","0","0","s"],"60","S"],["1930","only","-","Apr","13",["2","0","0","s"],"60","S"],["1931","only","-","Apr","19",["2","0","0","s"],"60","S"],["1932","only","-","Apr","3",["2","0","0","s"],"60","S"],["1933","only","-","Mar","26",["2","0","0","s"],"60","S"],["1934","only","-","Apr","8",["2","0","0","s"],"60","S"],["1935","only","-","Mar","31",["2","0","0","s"],"60","S"],["1936","only","-","Apr","19",["2","0","0","s"],"60","S"],["1937","only","-","Apr","4",["2","0","0","s"],"60","S"],["1938","only","-","Mar","27",["2","0","0","s"],"60","S"],["1939","only","-","Apr","16",["2","0","0","s"],"60","S"],["1939","only","-","Nov","19",["2","0","0","s"],"0","-"],["1940","only","-","Feb","25",["2","0","0","s"],"60","S"],["1944","only","-","Sep","17",["2","0","0","s"],"0","-"],["1945","only","-","Apr","2",["2","0","0","s"],"60","S"],["1945","only","-","Sep","16",["2","0","0","s"],"0","-"],["1946","only","-","May","19",["2","0","0","s"],"60","S"],["1946","only","-","Oct","7",["2","0","0","s"],"0","-"]],"Bulg":[["1979","only","-","Mar","31",["23","0","0",null],"60","S"],["1979","only","-","Oct","1",["1","0","0",null],"0","-"],["1980","1982","-","Apr","Sat>=1",["23","0","0",null],"60","S"],["1980","only","-","Sep","29",["1","0","0",null],"0","-"],["1981","only","-","Sep","27",["2","0","0",null],"0","-"]],"Czech":[["1945","only","-","Apr","8",["2","0","0","s"],"60","S"],["1945","only","-","Nov","18",["2","0","0","s"],"0","-"],["1946","only","-","May","6",["2","0","0","s"],"60","S"],["1946","1949","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1947","only","-","Apr","20",["2","0","0","s"],"60","S"],["1948","only","-","Apr","18",["2","0","0","s"],"60","S"],["1949","only","-","Apr","9",["2","0","0","s"],"60","S"]],"Denmark":[["1916","only","-","May","14",["23","0","0",null],"60","S"],["1916","only","-","Sep","30",["23","0","0",null],"0","-"],["1940","only","-","May","15",["0","0","0",null],"60","S"],["1945","only","-","Apr","2",["2","0","0","s"],"60","S"],["1945","only","-","Aug","15",["2","0","0","s"],"0","-"],["1946","only","-","May","1",["2","0","0","s"],"60","S"],["1946","only","-","Sep","1",["2","0","0","s"],"0","-"],["1947","only","-","May","4",["2","0","0","s"],"60","S"],["1947","only","-","Aug","10",["2","0","0","s"],"0","-"],["1948","only","-","May","9",["2","0","0","s"],"60","S"],["1948","only","-","Aug","8",["2","0","0","s"],"0","-"]],"Thule":[["1991","1992","-","Mar","lastSun",["2","0","0",null],"60","D"],["1991","1992","-","Sep","lastSun",["2","0","0",null],"0","S"],["1993","2006","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["1993","2006","-","Oct","lastSun",["2","0","0",null],"0","S"],["2007","max","-","Mar","Sun>=8",["2","0","0",null],"60","D"],["2007","max","-","Nov","Sun>=1",["2","0","0",null],"0","S"]],"Finland":[["1942","only","-","Apr","3",["0","0","0",null],"60","S"],["1942","only","-","Oct","3",["0","0","0",null],"0","-"],["1981","1982","-","Mar","lastSun",["2","0","0",null],"60","S"],["1981","1982","-","Sep","lastSun",["3","0","0",null],"0","-"]],"France":[["1916","only","-","Jun","14",["23","0","0","s"],"60","S"],["1916","1919","-","Oct","Sun>=1",["23","0","0","s"],"0","-"],["1917","only","-","Mar","24",["23","0","0","s"],"60","S"],["1918","only","-","Mar","9",["23","0","0","s"],"60","S"],["1919","only","-","Mar","1",["23","0","0","s"],"60","S"],["1920","only","-","Feb","14",["23","0","0","s"],"60","S"],["1920","only","-","Oct","23",["23","0","0","s"],"0","-"],["1921","only","-","Mar","14",["23","0","0","s"],"60","S"],["1921","only","-","Oct","25",["23","0","0","s"],"0","-"],["1922","only","-","Mar","25",["23","0","0","s"],"60","S"],["1922","1938","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1923","only","-","May","26",["23","0","0","s"],"60","S"],["1924","only","-","Mar","29",["23","0","0","s"],"60","S"],["1925","only","-","Apr","4",["23","0","0","s"],"60","S"],["1926","only","-","Apr","17",["23","0","0","s"],"60","S"],["1927","only","-","Apr","9",["23","0","0","s"],"60","S"],["1928","only","-","Apr","14",["23","0","0","s"],"60","S"],["1929","only","-","Apr","20",["23","0","0","s"],"60","S"],["1930","only","-","Apr","12",["23","0","0","s"],"60","S"],["1931","only","-","Apr","18",["23","0","0","s"],"60","S"],["1932","only","-","Apr","2",["23","0","0","s"],"60","S"],["1933","only","-","Mar","25",["23","0","0","s"],"60","S"],["1934","only","-","Apr","7",["23","0","0","s"],"60","S"],["1935","only","-","Mar","30",["23","0","0","s"],"60","S"],["1936","only","-","Apr","18",["23","0","0","s"],"60","S"],["1937","only","-","Apr","3",["23","0","0","s"],"60","S"],["1938","only","-","Mar","26",["23","0","0","s"],"60","S"],["1939","only","-","Apr","15",["23","0","0","s"],"60","S"],["1939","only","-","Nov","18",["23","0","0","s"],"0","-"],["1940","only","-","Feb","25",["2","0","0",null],"60","S"],["1941","only","-","May","5",["0","0","0",null],"120","M",""],["1941","only","-","Oct","6",["0","0","0",null],"60","S"],["1942","only","-","Mar","9",["0","0","0",null],"120","M"],["1942","only","-","Nov","2",["3","0","0",null],"60","S"],["1943","only","-","Mar","29",["2","0","0",null],"120","M"],["1943","only","-","Oct","4",["3","0","0",null],"60","S"],["1944","only","-","Apr","3",["2","0","0",null],"120","M"],["1944","only","-","Oct","8",["1","0","0",null],"60","S"],["1945","only","-","Apr","2",["2","0","0",null],"120","M"],["1945","only","-","Sep","16",["3","0","0",null],"0","-"],["1976","only","-","Mar","28",["1","0","0",null],"60","S"],["1976","only","-","Sep","26",["1","0","0",null],"0","-"]],"Germany":[["1946","only","-","Apr","14",["2","0","0","s"],"60","S"],["1946","only","-","Oct","7",["2","0","0","s"],"0","-"],["1947","1949","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1947","only","-","Apr","6",["3","0","0","s"],"60","S"],["1947","only","-","May","11",["2","0","0","s"],"120","M"],["1947","only","-","Jun","29",["3","0","0",null],"60","S"],["1948","only","-","Apr","18",["2","0","0","s"],"60","S"],["1949","only","-","Apr","10",["2","0","0","s"],"60","S"]],"SovietZone":[["1945","only","-","May","24",["2","0","0",null],"120","M",""],["1945","only","-","Sep","24",["3","0","0",null],"60","S"],["1945","only","-","Nov","18",["2","0","0","s"],"0","-"]],"Greece":[["1932","only","-","Jul","7",["0","0","0",null],"60","S"],["1932","only","-","Sep","1",["0","0","0",null],"0","-"],["1941","only","-","Apr","7",["0","0","0",null],"60","S"],["1942","only","-","Nov","2",["3","0","0",null],"0","-"],["1943","only","-","Mar","30",["0","0","0",null],"60","S"],["1943","only","-","Oct","4",["0","0","0",null],"0","-"],["1952","only","-","Jul","1",["0","0","0",null],"60","S"],["1952","only","-","Nov","2",["0","0","0",null],"0","-"],["1975","only","-","Apr","12",["0","0","0","s"],"60","S"],["1975","only","-","Nov","26",["0","0","0","s"],"0","-"],["1976","only","-","Apr","11",["2","0","0","s"],"60","S"],["1976","only","-","Oct","10",["2","0","0","s"],"0","-"],["1977","1978","-","Apr","Sun>=1",["2","0","0","s"],"60","S"],["1977","only","-","Sep","26",["2","0","0","s"],"0","-"],["1978","only","-","Sep","24",["4","0","0",null],"0","-"],["1979","only","-","Apr","1",["9","0","0",null],"60","S"],["1979","only","-","Sep","29",["2","0","0",null],"0","-"],["1980","only","-","Apr","1",["0","0","0",null],"60","S"],["1980","only","-","Sep","28",["0","0","0",null],"0","-"]],"Hungary":[["1918","only","-","Apr","1",["3","0","0",null],"60","S"],["1918","only","-","Sep","29",["3","0","0",null],"0","-"],["1919","only","-","Apr","15",["3","0","0",null],"60","S"],["1919","only","-","Sep","15",["3","0","0",null],"0","-"],["1920","only","-","Apr","5",["3","0","0",null],"60","S"],["1920","only","-","Sep","30",["3","0","0",null],"0","-"],["1945","only","-","May","1",["23","0","0",null],"60","S"],["1945","only","-","Nov","3",["0","0","0",null],"0","-"],["1946","only","-","Mar","31",["2","0","0","s"],"60","S"],["1946","1949","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1947","1949","-","Apr","Sun>=4",["2","0","0","s"],"60","S"],["1950","only","-","Apr","17",["2","0","0","s"],"60","S"],["1950","only","-","Oct","23",["2","0","0","s"],"0","-"],["1954","1955","-","May","23",["0","0","0",null],"60","S"],["1954","1955","-","Oct","3",["0","0","0",null],"0","-"],["1956","only","-","Jun","Sun>=1",["0","0","0",null],"60","S"],["1956","only","-","Sep","lastSun",["0","0","0",null],"0","-"],["1957","only","-","Jun","Sun>=1",["1","0","0",null],"60","S"],["1957","only","-","Sep","lastSun",["3","0","0",null],"0","-"],["1980","only","-","Apr","6",["1","0","0",null],"60","S"]],"Iceland":[["1917","1918","-","Feb","19",["23","0","0",null],"60","S"],["1917","only","-","Oct","21",["1","0","0",null],"0","-"],["1918","only","-","Nov","16",["1","0","0",null],"0","-"],["1939","only","-","Apr","29",["23","0","0",null],"60","S"],["1939","only","-","Nov","29",["2","0","0",null],"0","-"],["1940","only","-","Feb","25",["2","0","0",null],"60","S"],["1940","only","-","Nov","3",["2","0","0",null],"0","-"],["1941","only","-","Mar","2",["1","0","0","s"],"60","S"],["1941","only","-","Nov","2",["1","0","0","s"],"0","-"],["1942","only","-","Mar","8",["1","0","0","s"],"60","S"],["1942","only","-","Oct","25",["1","0","0","s"],"0","-"],["1943","1946","-","Mar","Sun>=1",["1","0","0","s"],"60","S"],["1943","1948","-","Oct","Sun>=22",["1","0","0","s"],"0","-"],["1947","1967","-","Apr","Sun>=1",["1","0","0","s"],"60","S"],["1949","only","-","Oct","30",["1","0","0","s"],"0","-"],["1950","1966","-","Oct","Sun>=22",["1","0","0","s"],"0","-"],["1967","only","-","Oct","29",["1","0","0","s"],"0","-"]],"Italy":[["1916","only","-","Jun","3",["0","0","0","s"],"60","S"],["1916","only","-","Oct","1",["0","0","0","s"],"0","-"],["1917","only","-","Apr","1",["0","0","0","s"],"60","S"],["1917","only","-","Sep","30",["0","0","0","s"],"0","-"],["1918","only","-","Mar","10",["0","0","0","s"],"60","S"],["1918","1919","-","Oct","Sun>=1",["0","0","0","s"],"0","-"],["1919","only","-","Mar","2",["0","0","0","s"],"60","S"],["1920","only","-","Mar","21",["0","0","0","s"],"60","S"],["1920","only","-","Sep","19",["0","0","0","s"],"0","-"],["1940","only","-","Jun","15",["0","0","0","s"],"60","S"],["1944","only","-","Sep","17",["0","0","0","s"],"0","-"],["1945","only","-","Apr","2",["2","0","0",null],"60","S"],["1945","only","-","Sep","15",["0","0","0","s"],"0","-"],["1946","only","-","Mar","17",["2","0","0","s"],"60","S"],["1946","only","-","Oct","6",["2","0","0","s"],"0","-"],["1947","only","-","Mar","16",["0","0","0","s"],"60","S"],["1947","only","-","Oct","5",["0","0","0","s"],"0","-"],["1948","only","-","Feb","29",["2","0","0","s"],"60","S"],["1948","only","-","Oct","3",["2","0","0","s"],"0","-"],["1966","1968","-","May","Sun>=22",["0","0","0",null],"60","S"],["1966","1969","-","Sep","Sun>=22",["0","0","0",null],"0","-"],["1969","only","-","Jun","1",["0","0","0",null],"60","S"],["1970","only","-","May","31",["0","0","0",null],"60","S"],["1970","only","-","Sep","lastSun",["0","0","0",null],"0","-"],["1971","1972","-","May","Sun>=22",["0","0","0",null],"60","S"],["1971","only","-","Sep","lastSun",["1","0","0",null],"0","-"],["1972","only","-","Oct","1",["0","0","0",null],"0","-"],["1973","only","-","Jun","3",["0","0","0",null],"60","S"],["1973","1974","-","Sep","lastSun",["0","0","0",null],"0","-"],["1974","only","-","May","26",["0","0","0",null],"60","S"],["1975","only","-","Jun","1",["0","0","0","s"],"60","S"],["1975","1977","-","Sep","lastSun",["0","0","0","s"],"0","-"],["1976","only","-","May","30",["0","0","0","s"],"60","S"],["1977","1979","-","May","Sun>=22",["0","0","0","s"],"60","S"],["1978","only","-","Oct","1",["0","0","0","s"],"0","-"],["1979","only","-","Sep","30",["0","0","0","s"],"0","-"]],"Latvia":[["1989","1996","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1989","1996","-","Sep","lastSun",["2","0","0","s"],"0","-"]],"Lux":[["1916","only","-","May","14",["23","0","0",null],"60","S"],["1916","only","-","Oct","1",["1","0","0",null],"0","-"],["1917","only","-","Apr","28",["23","0","0",null],"60","S"],["1917","only","-","Sep","17",["1","0","0",null],"0","-"],["1918","only","-","Apr","Mon>=15",["2","0","0","s"],"60","S"],["1918","only","-","Sep","Mon>=15",["2","0","0","s"],"0","-"],["1919","only","-","Mar","1",["23","0","0",null],"60","S"],["1919","only","-","Oct","5",["3","0","0",null],"0","-"],["1920","only","-","Feb","14",["23","0","0",null],"60","S"],["1920","only","-","Oct","24",["2","0","0",null],"0","-"],["1921","only","-","Mar","14",["23","0","0",null],"60","S"],["1921","only","-","Oct","26",["2","0","0",null],"0","-"],["1922","only","-","Mar","25",["23","0","0",null],"60","S"],["1922","only","-","Oct","Sun>=2",["1","0","0",null],"0","-"],["1923","only","-","Apr","21",["23","0","0",null],"60","S"],["1923","only","-","Oct","Sun>=2",["2","0","0",null],"0","-"],["1924","only","-","Mar","29",["23","0","0",null],"60","S"],["1924","1928","-","Oct","Sun>=2",["1","0","0",null],"0","-"],["1925","only","-","Apr","5",["23","0","0",null],"60","S"],["1926","only","-","Apr","17",["23","0","0",null],"60","S"],["1927","only","-","Apr","9",["23","0","0",null],"60","S"],["1928","only","-","Apr","14",["23","0","0",null],"60","S"],["1929","only","-","Apr","20",["23","0","0",null],"60","S"]],"Malta":[["1973","only","-","Mar","31",["0","0","0","s"],"60","S"],["1973","only","-","Sep","29",["0","0","0","s"],"0","-"],["1974","only","-","Apr","21",["0","0","0","s"],"60","S"],["1974","only","-","Sep","16",["0","0","0","s"],"0","-"],["1975","1979","-","Apr","Sun>=15",["2","0","0",null],"60","S"],["1975","1980","-","Sep","Sun>=15",["2","0","0",null],"0","-"],["1980","only","-","Mar","31",["2","0","0",null],"60","S"]],"Neth":[["1916","only","-","May","1",["0","0","0",null],"60","NST",""],["1916","only","-","Oct","1",["0","0","0",null],"0","AMT",""],["1917","only","-","Apr","16",["2","0","0","s"],"60","NST"],["1917","only","-","Sep","17",["2","0","0","s"],"0","AMT"],["1918","1921","-","Apr","Mon>=1",["2","0","0","s"],"60","NST"],["1918","1921","-","Sep","lastMon",["2","0","0","s"],"0","AMT"],["1922","only","-","Mar","lastSun",["2","0","0","s"],"60","NST"],["1922","1936","-","Oct","Sun>=2",["2","0","0","s"],"0","AMT"],["1923","only","-","Jun","Fri>=1",["2","0","0","s"],"60","NST"],["1924","only","-","Mar","lastSun",["2","0","0","s"],"60","NST"],["1925","only","-","Jun","Fri>=1",["2","0","0","s"],"60","NST"],["1926","1931","-","May","15",["2","0","0","s"],"60","NST"],["1932","only","-","May","22",["2","0","0","s"],"60","NST"],["1933","1936","-","May","15",["2","0","0","s"],"60","NST"],["1937","only","-","May","22",["2","0","0","s"],"60","NST"],["1937","only","-","Jul","1",["0","0","0",null],"60","S"],["1937","1939","-","Oct","Sun>=2",["2","0","0","s"],"0","-"],["1938","1939","-","May","15",["2","0","0","s"],"60","S"],["1945","only","-","Apr","2",["2","0","0","s"],"60","S"],["1945","only","-","Sep","16",["2","0","0","s"],"0","-"]],"Norway":[["1916","only","-","May","22",["1","0","0",null],"60","S"],["1916","only","-","Sep","30",["0","0","0",null],"0","-"],["1945","only","-","Apr","2",["2","0","0","s"],"60","S"],["1945","only","-","Oct","1",["2","0","0","s"],"0","-"],["1959","1964","-","Mar","Sun>=15",["2","0","0","s"],"60","S"],["1959","1965","-","Sep","Sun>=15",["2","0","0","s"],"0","-"],["1965","only","-","Apr","25",["2","0","0","s"],"60","S"]],"Poland":[["1918","1919","-","Sep","16",["2","0","0","s"],"0","-"],["1919","only","-","Apr","15",["2","0","0","s"],"60","S"],["1944","only","-","Apr","3",["2","0","0","s"],"60","S"],["1944","only","-","Oct","4",["2","0","0",null],"0","-"],["1945","only","-","Apr","29",["0","0","0",null],"60","S"],["1945","only","-","Nov","1",["0","0","0",null],"0","-"],["1946","only","-","Apr","14",["0","0","0","s"],"60","S"],["1946","only","-","Oct","7",["2","0","0","s"],"0","-"],["1947","only","-","May","4",["2","0","0","s"],"60","S"],["1947","1949","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1948","only","-","Apr","18",["2","0","0","s"],"60","S"],["1949","only","-","Apr","10",["2","0","0","s"],"60","S"],["1957","only","-","Jun","2",["1","0","0","s"],"60","S"],["1957","1958","-","Sep","lastSun",["1","0","0","s"],"0","-"],["1958","only","-","Mar","30",["1","0","0","s"],"60","S"],["1959","only","-","May","31",["1","0","0","s"],"60","S"],["1959","1961","-","Oct","Sun>=1",["1","0","0","s"],"0","-"],["1960","only","-","Apr","3",["1","0","0","s"],"60","S"],["1961","1964","-","May","lastSun",["1","0","0","s"],"60","S"],["1962","1964","-","Sep","lastSun",["1","0","0","s"],"0","-"]],"Port":[["1916","only","-","Jun","17",["23","0","0",null],"60","S"],["1916","only","-","Nov","1",["1","0","0",null],"0","-"],["1917","only","-","Feb","28",["23","0","0","s"],"60","S"],["1917","1921","-","Oct","14",["23","0","0","s"],"0","-"],["1918","only","-","Mar","1",["23","0","0","s"],"60","S"],["1919","only","-","Feb","28",["23","0","0","s"],"60","S"],["1920","only","-","Feb","29",["23","0","0","s"],"60","S"],["1921","only","-","Feb","28",["23","0","0","s"],"60","S"],["1924","only","-","Apr","16",["23","0","0","s"],"60","S"],["1924","only","-","Oct","14",["23","0","0","s"],"0","-"],["1926","only","-","Apr","17",["23","0","0","s"],"60","S"],["1926","1929","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1927","only","-","Apr","9",["23","0","0","s"],"60","S"],["1928","only","-","Apr","14",["23","0","0","s"],"60","S"],["1929","only","-","Apr","20",["23","0","0","s"],"60","S"],["1931","only","-","Apr","18",["23","0","0","s"],"60","S"],["1931","1932","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1932","only","-","Apr","2",["23","0","0","s"],"60","S"],["1934","only","-","Apr","7",["23","0","0","s"],"60","S"],["1934","1938","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1935","only","-","Mar","30",["23","0","0","s"],"60","S"],["1936","only","-","Apr","18",["23","0","0","s"],"60","S"],["1937","only","-","Apr","3",["23","0","0","s"],"60","S"],["1938","only","-","Mar","26",["23","0","0","s"],"60","S"],["1939","only","-","Apr","15",["23","0","0","s"],"60","S"],["1939","only","-","Nov","18",["23","0","0","s"],"0","-"],["1940","only","-","Feb","24",["23","0","0","s"],"60","S"],["1940","1941","-","Oct","5",["23","0","0","s"],"0","-"],["1941","only","-","Apr","5",["23","0","0","s"],"60","S"],["1942","1945","-","Mar","Sat>=8",["23","0","0","s"],"60","S"],["1942","only","-","Apr","25",["22","0","0","s"],"120","M",""],["1942","only","-","Aug","15",["22","0","0","s"],"60","S"],["1942","1945","-","Oct","Sat>=24",["23","0","0","s"],"0","-"],["1943","only","-","Apr","17",["22","0","0","s"],"120","M"],["1943","1945","-","Aug","Sat>=25",["22","0","0","s"],"60","S"],["1944","1945","-","Apr","Sat>=21",["22","0","0","s"],"120","M"],["1946","only","-","Apr","Sat>=1",["23","0","0","s"],"60","S"],["1946","only","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1947","1949","-","Apr","Sun>=1",["2","0","0","s"],"60","S"],["1947","1949","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1951","1965","-","Apr","Sun>=1",["2","0","0","s"],"60","S"],["1951","1965","-","Oct","Sun>=1",["2","0","0","s"],"0","-"],["1977","only","-","Mar","27",["0","0","0","s"],"60","S"],["1977","only","-","Sep","25",["0","0","0","s"],"0","-"],["1978","1979","-","Apr","Sun>=1",["0","0","0","s"],"60","S"],["1978","only","-","Oct","1",["0","0","0","s"],"0","-"],["1979","1982","-","Sep","lastSun",["1","0","0","s"],"0","-"],["1980","only","-","Mar","lastSun",["0","0","0","s"],"60","S"],["1981","1982","-","Mar","lastSun",["1","0","0","s"],"60","S"],["1983","only","-","Mar","lastSun",["2","0","0","s"],"60","S"]],"Romania":[["1932","only","-","May","21",["0","0","0","s"],"60","S"],["1932","1939","-","Oct","Sun>=1",["0","0","0","s"],"0","-"],["1933","1939","-","Apr","Sun>=2",["0","0","0","s"],"60","S"],["1979","only","-","May","27",["0","0","0",null],"60","S"],["1979","only","-","Sep","lastSun",["0","0","0",null],"0","-"],["1980","only","-","Apr","5",["23","0","0",null],"60","S"],["1980","only","-","Sep","lastSun",["1","0","0",null],"0","-"],["1991","1993","-","Mar","lastSun",["0","0","0","s"],"60","S"],["1991","1993","-","Sep","lastSun",["0","0","0","s"],"0","-"]],"Spain":[["1917","only","-","May","5",["23","0","0","s"],"60","S"],["1917","1919","-","Oct","6",["23","0","0","s"],"0","-"],["1918","only","-","Apr","15",["23","0","0","s"],"60","S"],["1919","only","-","Apr","5",["23","0","0","s"],"60","S"],["1924","only","-","Apr","16",["23","0","0","s"],"60","S"],["1924","only","-","Oct","4",["23","0","0","s"],"0","-"],["1926","only","-","Apr","17",["23","0","0","s"],"60","S"],["1926","1929","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1927","only","-","Apr","9",["23","0","0","s"],"60","S"],["1928","only","-","Apr","14",["23","0","0","s"],"60","S"],["1929","only","-","Apr","20",["23","0","0","s"],"60","S"],["1937","only","-","May","22",["23","0","0","s"],"60","S"],["1937","1939","-","Oct","Sat>=1",["23","0","0","s"],"0","-"],["1938","only","-","Mar","22",["23","0","0","s"],"60","S"],["1939","only","-","Apr","15",["23","0","0","s"],"60","S"],["1940","only","-","Mar","16",["23","0","0","s"],"60","S"],["1942","only","-","May","2",["22","0","0","s"],"120","M",""],["1942","only","-","Sep","1",["22","0","0","s"],"60","S"],["1943","1946","-","Apr","Sat>=13",["22","0","0","s"],"120","M"],["1943","only","-","Oct","3",["22","0","0","s"],"60","S"],["1944","only","-","Oct","10",["22","0","0","s"],"60","S"],["1945","only","-","Sep","30",["1","0","0",null],"60","S"],["1946","only","-","Sep","30",["0","0","0",null],"0","-"],["1949","only","-","Apr","30",["23","0","0",null],"60","S"],["1949","only","-","Sep","30",["1","0","0",null],"0","-"],["1974","1975","-","Apr","Sat>=13",["23","0","0",null],"60","S"],["1974","1975","-","Oct","Sun>=1",["1","0","0",null],"0","-"],["1976","only","-","Mar","27",["23","0","0",null],"60","S"],["1976","1977","-","Sep","lastSun",["1","0","0",null],"0","-"],["1977","1978","-","Apr","2",["23","0","0",null],"60","S"],["1978","only","-","Oct","1",["1","0","0",null],"0","-"]],"SpainAfrica":[["1967","only","-","Jun","3",["12","0","0",null],"60","S"],["1967","only","-","Oct","1",["0","0","0",null],"0","-"],["1974","only","-","Jun","24",["0","0","0",null],"60","S"],["1974","only","-","Sep","1",["0","0","0",null],"0","-"],["1976","1977","-","May","1",["0","0","0",null],"60","S"],["1976","only","-","Aug","1",["0","0","0",null],"0","-"],["1977","only","-","Sep","28",["0","0","0",null],"0","-"],["1978","only","-","Jun","1",["0","0","0",null],"60","S"],["1978","only","-","Aug","4",["0","0","0",null],"0","-"]],"Swiss":[["1941","1942","-","May","Mon>=1",["1","0","0",null],"60","S"],["1941","1942","-","Oct","Mon>=1",["2","0","0",null],"0","-"]],"Turkey":[["1916","only","-","May","1",["0","0","0",null],"60","S"],["1916","only","-","Oct","1",["0","0","0",null],"0","-"],["1920","only","-","Mar","28",["0","0","0",null],"60","S"],["1920","only","-","Oct","25",["0","0","0",null],"0","-"],["1921","only","-","Apr","3",["0","0","0",null],"60","S"],["1921","only","-","Oct","3",["0","0","0",null],"0","-"],["1922","only","-","Mar","26",["0","0","0",null],"60","S"],["1922","only","-","Oct","8",["0","0","0",null],"0","-"],["1924","only","-","May","13",["0","0","0",null],"60","S"],["1924","1925","-","Oct","1",["0","0","0",null],"0","-"],["1925","only","-","May","1",["0","0","0",null],"60","S"],["1940","only","-","Jun","30",["0","0","0",null],"60","S"],["1940","only","-","Oct","5",["0","0","0",null],"0","-"],["1940","only","-","Dec","1",["0","0","0",null],"60","S"],["1941","only","-","Sep","21",["0","0","0",null],"0","-"],["1942","only","-","Apr","1",["0","0","0",null],"60","S"],["1942","only","-","Nov","1",["0","0","0",null],"0","-"],["1945","only","-","Apr","2",["0","0","0",null],"60","S"],["1945","only","-","Oct","8",["0","0","0",null],"0","-"],["1946","only","-","Jun","1",["0","0","0",null],"60","S"],["1946","only","-","Oct","1",["0","0","0",null],"0","-"],["1947","1948","-","Apr","Sun>=16",["0","0","0",null],"60","S"],["1947","1950","-","Oct","Sun>=2",["0","0","0",null],"0","-"],["1949","only","-","Apr","10",["0","0","0",null],"60","S"],["1950","only","-","Apr","19",["0","0","0",null],"60","S"],["1951","only","-","Apr","22",["0","0","0",null],"60","S"],["1951","only","-","Oct","8",["0","0","0",null],"0","-"],["1962","only","-","Jul","15",["0","0","0",null],"60","S"],["1962","only","-","Oct","8",["0","0","0",null],"0","-"],["1964","only","-","May","15",["0","0","0",null],"60","S"],["1964","only","-","Oct","1",["0","0","0",null],"0","-"],["1970","1972","-","May","Sun>=2",["0","0","0",null],"60","S"],["1970","1972","-","Oct","Sun>=2",["0","0","0",null],"0","-"],["1973","only","-","Jun","3",["1","0","0",null],"60","S"],["1973","only","-","Nov","4",["3","0","0",null],"0","-"],["1974","only","-","Mar","31",["2","0","0",null],"60","S"],["1974","only","-","Nov","3",["5","0","0",null],"0","-"],["1975","only","-","Mar","30",["0","0","0",null],"60","S"],["1975","1976","-","Oct","lastSun",["0","0","0",null],"0","-"],["1976","only","-","Jun","1",["0","0","0",null],"60","S"],["1977","1978","-","Apr","Sun>=1",["0","0","0",null],"60","S"],["1977","only","-","Oct","16",["0","0","0",null],"0","-"],["1979","1980","-","Apr","Sun>=1",["3","0","0",null],"60","S"],["1979","1982","-","Oct","Mon>=11",["0","0","0",null],"0","-"],["1981","1982","-","Mar","lastSun",["3","0","0",null],"60","S"],["1983","only","-","Jul","31",["0","0","0",null],"60","S"],["1983","only","-","Oct","2",["0","0","0",null],"0","-"],["1985","only","-","Apr","20",["0","0","0",null],"60","S"],["1985","only","-","Sep","28",["0","0","0",null],"0","-"],["1986","1990","-","Mar","lastSun",["2","0","0","s"],"60","S"],["1986","1990","-","Sep","lastSun",["2","0","0","s"],"0","-"],["1991","2006","-","Mar","lastSun",["1","0","0","s"],"60","S"],["1991","1995","-","Sep","lastSun",["1","0","0","s"],"0","-"],["1996","2006","-","Oct","lastSun",["1","0","0","s"],"0","-"]],"US":[["1918","1919","-","Mar","lastSun",["2","0","0",null],"60","D"],["1918","1919","-","Oct","lastSun",["2","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","30",["2","0","0",null],"0","S"],["1967","2006","-","Oct","lastSun",["2","0","0",null],"0","S"],["1967","1973","-","Apr","lastSun",["2","0","0",null],"60","D"],["1974","only","-","Jan","6",["2","0","0",null],"60","D"],["1975","only","-","Feb","23",["2","0","0",null],"60","D"],["1976","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1987","2006","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["2007","max","-","Mar","Sun>=8",["2","0","0",null],"60","D"],["2007","max","-","Nov","Sun>=1",["2","0","0",null],"0","S"]],"NYC":[["1920","only","-","Mar","lastSun",["2","0","0",null],"60","D"],["1920","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1921","1966","-","Apr","lastSun",["2","0","0",null],"60","D"],["1921","1954","-","Sep","lastSun",["2","0","0",null],"0","S"],["1955","1966","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Chicago":[["1920","only","-","Jun","13",["2","0","0",null],"60","D"],["1920","1921","-","Oct","lastSun",["2","0","0",null],"0","S"],["1921","only","-","Mar","lastSun",["2","0","0",null],"60","D"],["1922","1966","-","Apr","lastSun",["2","0","0",null],"60","D"],["1922","1954","-","Sep","lastSun",["2","0","0",null],"0","S"],["1955","1966","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Denver":[["1920","1921","-","Mar","lastSun",["2","0","0",null],"60","D"],["1920","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1921","only","-","May","22",["2","0","0",null],"0","S"],["1965","1966","-","Apr","lastSun",["2","0","0",null],"60","D"],["1965","1966","-","Oct","lastSun",["2","0","0",null],"0","S"]],"CA":[["1948","only","-","Mar","14",["2","0","0",null],"60","D"],["1949","only","-","Jan","1",["2","0","0",null],"0","S"],["1950","1966","-","Apr","lastSun",["2","0","0",null],"60","D"],["1950","1961","-","Sep","lastSun",["2","0","0",null],"0","S"],["1962","1966","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Indianapolis":[["1941","only","-","Jun","22",["2","0","0",null],"60","D"],["1941","1954","-","Sep","lastSun",["2","0","0",null],"0","S"],["1946","1954","-","Apr","lastSun",["2","0","0",null],"60","D"]],"Marengo":[["1951","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1951","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1954","1960","-","Apr","lastSun",["2","0","0",null],"60","D"],["1954","1960","-","Sep","lastSun",["2","0","0",null],"0","S"]],"Vincennes":[["1946","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1953","1954","-","Apr","lastSun",["2","0","0",null],"60","D"],["1953","1959","-","Sep","lastSun",["2","0","0",null],"0","S"],["1955","only","-","May","1",["0","0","0",null],"60","D"],["1956","1963","-","Apr","lastSun",["2","0","0",null],"60","D"],["1960","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1961","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1962","1963","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Perry":[["1946","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1953","1954","-","Apr","lastSun",["2","0","0",null],"60","D"],["1953","1959","-","Sep","lastSun",["2","0","0",null],"0","S"],["1955","only","-","May","1",["0","0","0",null],"60","D"],["1956","1963","-","Apr","lastSun",["2","0","0",null],"60","D"],["1960","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1961","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1962","1963","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Pike":[["1955","only","-","May","1",["0","0","0",null],"60","D"],["1955","1960","-","Sep","lastSun",["2","0","0",null],"0","S"],["1956","1964","-","Apr","lastSun",["2","0","0",null],"60","D"],["1961","1964","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Starke":[["1947","1961","-","Apr","lastSun",["2","0","0",null],"60","D"],["1947","1954","-","Sep","lastSun",["2","0","0",null],"0","S"],["1955","1956","-","Oct","lastSun",["2","0","0",null],"0","S"],["1957","1958","-","Sep","lastSun",["2","0","0",null],"0","S"],["1959","1961","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Pulaski":[["1946","1960","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","1954","-","Sep","lastSun",["2","0","0",null],"0","S"],["1955","1956","-","Oct","lastSun",["2","0","0",null],"0","S"],["1957","1960","-","Sep","lastSun",["2","0","0",null],"0","S"]],"Louisville":[["1921","only","-","May","1",["2","0","0",null],"60","D"],["1921","only","-","Sep","1",["2","0","0",null],"0","S"],["1941","1961","-","Apr","lastSun",["2","0","0",null],"60","D"],["1941","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1946","only","-","Jun","2",["2","0","0",null],"0","S"],["1950","1955","-","Sep","lastSun",["2","0","0",null],"0","S"],["1956","1960","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Detroit":[["1948","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1948","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1967","only","-","Jun","14",["2","0","0",null],"60","D"],["1967","only","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Menominee":[["1946","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1966","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1966","only","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Canada":[["1918","only","-","Apr","14",["2","0","0",null],"60","D"],["1918","only","-","Oct","27",["2","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","30",["2","0","0",null],"0","S"],["1974","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1974","2006","-","Oct","lastSun",["2","0","0",null],"0","S"],["1987","2006","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["2007","max","-","Mar","Sun>=8",["2","0","0",null],"60","D"],["2007","max","-","Nov","Sun>=1",["2","0","0",null],"0","S"]],"StJohns":[["1917","only","-","Apr","8",["2","0","0",null],"60","D"],["1917","only","-","Sep","17",["2","0","0",null],"0","S"],["1919","only","-","May","5",["23","0","0",null],"60","D"],["1919","only","-","Aug","12",["23","0","0",null],"0","S"],["1920","1935","-","May","Sun>=1",["23","0","0",null],"60","D"],["1920","1935","-","Oct","lastSun",["23","0","0",null],"0","S"],["1936","1941","-","May","Mon>=9",["0","0","0",null],"60","D"],["1936","1941","-","Oct","Mon>=2",["0","0","0",null],"0","S"],["1946","1950","-","May","Sun>=8",["2","0","0",null],"60","D"],["1946","1950","-","Oct","Sun>=2",["2","0","0",null],"0","S"],["1951","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1951","1959","-","Sep","lastSun",["2","0","0",null],"0","S"],["1960","1986","-","Oct","lastSun",["2","0","0",null],"0","S"],["1987","only","-","Apr","Sun>=1",["0","1","0",null],"60","D"],["1987","2006","-","Oct","lastSun",["0","1","0",null],"0","S"],["1988","only","-","Apr","Sun>=1",["0","1","0",null],"120","DD"],["1989","2006","-","Apr","Sun>=1",["0","1","0",null],"60","D"],["2007","2011","-","Mar","Sun>=8",["0","1","0",null],"60","D"],["2007","2010","-","Nov","Sun>=1",["0","1","0",null],"0","S"]],"Halifax":[["1916","only","-","Apr","1",["0","0","0",null],"60","D"],["1916","only","-","Oct","1",["0","0","0",null],"0","S"],["1920","only","-","May","9",["0","0","0",null],"60","D"],["1920","only","-","Aug","29",["0","0","0",null],"0","S"],["1921","only","-","May","6",["0","0","0",null],"60","D"],["1921","1922","-","Sep","5",["0","0","0",null],"0","S"],["1922","only","-","Apr","30",["0","0","0",null],"60","D"],["1923","1925","-","May","Sun>=1",["0","0","0",null],"60","D"],["1923","only","-","Sep","4",["0","0","0",null],"0","S"],["1924","only","-","Sep","15",["0","0","0",null],"0","S"],["1925","only","-","Sep","28",["0","0","0",null],"0","S"],["1926","only","-","May","16",["0","0","0",null],"60","D"],["1926","only","-","Sep","13",["0","0","0",null],"0","S"],["1927","only","-","May","1",["0","0","0",null],"60","D"],["1927","only","-","Sep","26",["0","0","0",null],"0","S"],["1928","1931","-","May","Sun>=8",["0","0","0",null],"60","D"],["1928","only","-","Sep","9",["0","0","0",null],"0","S"],["1929","only","-","Sep","3",["0","0","0",null],"0","S"],["1930","only","-","Sep","15",["0","0","0",null],"0","S"],["1931","1932","-","Sep","Mon>=24",["0","0","0",null],"0","S"],["1932","only","-","May","1",["0","0","0",null],"60","D"],["1933","only","-","Apr","30",["0","0","0",null],"60","D"],["1933","only","-","Oct","2",["0","0","0",null],"0","S"],["1934","only","-","May","20",["0","0","0",null],"60","D"],["1934","only","-","Sep","16",["0","0","0",null],"0","S"],["1935","only","-","Jun","2",["0","0","0",null],"60","D"],["1935","only","-","Sep","30",["0","0","0",null],"0","S"],["1936","only","-","Jun","1",["0","0","0",null],"60","D"],["1936","only","-","Sep","14",["0","0","0",null],"0","S"],["1937","1938","-","May","Sun>=1",["0","0","0",null],"60","D"],["1937","1941","-","Sep","Mon>=24",["0","0","0",null],"0","S"],["1939","only","-","May","28",["0","0","0",null],"60","D"],["1940","1941","-","May","Sun>=1",["0","0","0",null],"60","D"],["1946","1949","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","1949","-","Sep","lastSun",["2","0","0",null],"0","S"],["1951","1954","-","Apr","lastSun",["2","0","0",null],"60","D"],["1951","1954","-","Sep","lastSun",["2","0","0",null],"0","S"],["1956","1959","-","Apr","lastSun",["2","0","0",null],"60","D"],["1956","1959","-","Sep","lastSun",["2","0","0",null],"0","S"],["1962","1973","-","Apr","lastSun",["2","0","0",null],"60","D"],["1962","1973","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Moncton":[["1933","1935","-","Jun","Sun>=8",["1","0","0",null],"60","D"],["1933","1935","-","Sep","Sun>=8",["1","0","0",null],"0","S"],["1936","1938","-","Jun","Sun>=1",["1","0","0",null],"60","D"],["1936","1938","-","Sep","Sun>=1",["1","0","0",null],"0","S"],["1939","only","-","May","27",["1","0","0",null],"60","D"],["1939","1941","-","Sep","Sat>=21",["1","0","0",null],"0","S"],["1940","only","-","May","19",["1","0","0",null],"60","D"],["1941","only","-","May","4",["1","0","0",null],"60","D"],["1946","1972","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","1956","-","Sep","lastSun",["2","0","0",null],"0","S"],["1957","1972","-","Oct","lastSun",["2","0","0",null],"0","S"],["1993","2006","-","Apr","Sun>=1",["0","1","0",null],"60","D"],["1993","2006","-","Oct","lastSun",["0","1","0",null],"0","S"]],"Mont":[["1917","only","-","Mar","25",["2","0","0",null],"60","D"],["1917","only","-","Apr","24",["0","0","0",null],"0","S"],["1919","only","-","Mar","31",["2","30","0",null],"60","D"],["1919","only","-","Oct","25",["2","30","0",null],"0","S"],["1920","only","-","May","2",["2","30","0",null],"60","D"],["1920","1922","-","Oct","Sun>=1",["2","30","0",null],"0","S"],["1921","only","-","May","1",["2","0","0",null],"60","D"],["1922","only","-","Apr","30",["2","0","0",null],"60","D"],["1924","only","-","May","17",["2","0","0",null],"60","D"],["1924","1926","-","Sep","lastSun",["2","30","0",null],"0","S"],["1925","1926","-","May","Sun>=1",["2","0","0",null],"60","D"],["1927","only","-","May","1",["0","0","0",null],"60","D"],["1927","1932","-","Sep","lastSun",["0","0","0",null],"0","S"],["1928","1931","-","Apr","lastSun",["0","0","0",null],"60","D"],["1932","only","-","May","1",["0","0","0",null],"60","D"],["1933","1940","-","Apr","lastSun",["0","0","0",null],"60","D"],["1933","only","-","Oct","1",["0","0","0",null],"0","S"],["1934","1939","-","Sep","lastSun",["0","0","0",null],"0","S"],["1946","1973","-","Apr","lastSun",["2","0","0",null],"60","D"],["1945","1948","-","Sep","lastSun",["2","0","0",null],"0","S"],["1949","1950","-","Oct","lastSun",["2","0","0",null],"0","S"],["1951","1956","-","Sep","lastSun",["2","0","0",null],"0","S"],["1957","1973","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Toronto":[["1919","only","-","Mar","30",["23","30","0",null],"60","D"],["1919","only","-","Oct","26",["0","0","0",null],"0","S"],["1920","only","-","May","2",["2","0","0",null],"60","D"],["1920","only","-","Sep","26",["0","0","0",null],"0","S"],["1921","only","-","May","15",["2","0","0",null],"60","D"],["1921","only","-","Sep","15",["2","0","0",null],"0","S"],["1922","1923","-","May","Sun>=8",["2","0","0",null],"60","D"],["1922","1926","-","Sep","Sun>=15",["2","0","0",null],"0","S"],["1924","1927","-","May","Sun>=1",["2","0","0",null],"60","D"],["1927","1932","-","Sep","lastSun",["2","0","0",null],"0","S"],["1928","1931","-","Apr","lastSun",["2","0","0",null],"60","D"],["1932","only","-","May","1",["2","0","0",null],"60","D"],["1933","1940","-","Apr","lastSun",["2","0","0",null],"60","D"],["1933","only","-","Oct","1",["2","0","0",null],"0","S"],["1934","1939","-","Sep","lastSun",["2","0","0",null],"0","S"],["1945","1946","-","Sep","lastSun",["2","0","0",null],"0","S"],["1946","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1947","1949","-","Apr","lastSun",["0","0","0",null],"60","D"],["1947","1948","-","Sep","lastSun",["0","0","0",null],"0","S"],["1949","only","-","Nov","lastSun",["0","0","0",null],"0","S"],["1950","1973","-","Apr","lastSun",["2","0","0",null],"60","D"],["1950","only","-","Nov","lastSun",["2","0","0",null],"0","S"],["1951","1956","-","Sep","lastSun",["2","0","0",null],"0","S"],["1957","1973","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Winn":[["1916","only","-","Apr","23",["0","0","0",null],"60","D"],["1916","only","-","Sep","17",["0","0","0",null],"0","S"],["1918","only","-","Apr","14",["2","0","0",null],"60","D"],["1918","only","-","Oct","27",["2","0","0",null],"0","S"],["1937","only","-","May","16",["2","0","0",null],"60","D"],["1937","only","-","Sep","26",["2","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1946","only","-","May","12",["2","0","0",null],"60","D"],["1946","only","-","Oct","13",["2","0","0",null],"0","S"],["1947","1949","-","Apr","lastSun",["2","0","0",null],"60","D"],["1947","1949","-","Sep","lastSun",["2","0","0",null],"0","S"],["1950","only","-","May","1",["2","0","0",null],"60","D"],["1950","only","-","Sep","30",["2","0","0",null],"0","S"],["1951","1960","-","Apr","lastSun",["2","0","0",null],"60","D"],["1951","1958","-","Sep","lastSun",["2","0","0",null],"0","S"],["1959","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1960","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1963","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1963","only","-","Sep","22",["2","0","0",null],"0","S"],["1966","1986","-","Apr","lastSun",["2","0","0","s"],"60","D"],["1966","2005","-","Oct","lastSun",["2","0","0","s"],"0","S"],["1987","2005","-","Apr","Sun>=1",["2","0","0","s"],"60","D"]],"Regina":[["1918","only","-","Apr","14",["2","0","0",null],"60","D"],["1918","only","-","Oct","27",["2","0","0",null],"0","S"],["1930","1934","-","May","Sun>=1",["0","0","0",null],"60","D"],["1930","1934","-","Oct","Sun>=1",["0","0","0",null],"0","S"],["1937","1941","-","Apr","Sun>=8",["0","0","0",null],"60","D"],["1937","only","-","Oct","Sun>=8",["0","0","0",null],"0","S"],["1938","only","-","Oct","Sun>=1",["0","0","0",null],"0","S"],["1939","1941","-","Oct","Sun>=8",["0","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1946","only","-","Apr","Sun>=8",["2","0","0",null],"60","D"],["1946","only","-","Oct","Sun>=8",["2","0","0",null],"0","S"],["1947","1957","-","Apr","lastSun",["2","0","0",null],"60","D"],["1947","1957","-","Sep","lastSun",["2","0","0",null],"0","S"],["1959","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1959","only","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Swift":[["1957","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1957","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1959","1961","-","Apr","lastSun",["2","0","0",null],"60","D"],["1959","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1960","1961","-","Sep","lastSun",["2","0","0",null],"0","S"]],"Edm":[["1918","1919","-","Apr","Sun>=8",["2","0","0",null],"60","D"],["1918","only","-","Oct","27",["2","0","0",null],"0","S"],["1919","only","-","May","27",["2","0","0",null],"0","S"],["1920","1923","-","Apr","lastSun",["2","0","0",null],"60","D"],["1920","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1921","1923","-","Sep","lastSun",["2","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1947","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1947","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["1967","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1967","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1969","only","-","Apr","lastSun",["2","0","0",null],"60","D"],["1969","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1972","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1972","2006","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Vanc":[["1918","only","-","Apr","14",["2","0","0",null],"60","D"],["1918","only","-","Oct","27",["2","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","30",["2","0","0",null],"0","S"],["1946","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1946","only","-","Oct","13",["2","0","0",null],"0","S"],["1947","1961","-","Sep","lastSun",["2","0","0",null],"0","S"],["1962","2006","-","Oct","lastSun",["2","0","0",null],"0","S"]],"NT_YK":[["1918","only","-","Apr","14",["2","0","0",null],"60","D"],["1918","only","-","Oct","27",["2","0","0",null],"0","S"],["1919","only","-","May","25",["2","0","0",null],"60","D"],["1919","only","-","Nov","1",["0","0","0",null],"0","S"],["1942","only","-","Feb","9",["2","0","0",null],"60","W",""],["1945","only","-","Aug","14",["23","0","0","u"],"60","P",""],["1945","only","-","Sep","30",["2","0","0",null],"0","S"],["1965","only","-","Apr","lastSun",["0","0","0",null],"120","DD"],["1965","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1980","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1980","2006","-","Oct","lastSun",["2","0","0",null],"0","S"],["1987","2006","-","Apr","Sun>=1",["2","0","0",null],"60","D"]],"Mexico":[["1939","only","-","Feb","5",["0","0","0",null],"60","D"],["1939","only","-","Jun","25",["0","0","0",null],"0","S"],["1940","only","-","Dec","9",["0","0","0",null],"60","D"],["1941","only","-","Apr","1",["0","0","0",null],"0","S"],["1943","only","-","Dec","16",["0","0","0",null],"60","W",""],["1944","only","-","May","1",["0","0","0",null],"0","S"],["1950","only","-","Feb","12",["0","0","0",null],"60","D"],["1950","only","-","Jul","30",["0","0","0",null],"0","S"],["1996","2000","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["1996","2000","-","Oct","lastSun",["2","0","0",null],"0","S"],["2001","only","-","May","Sun>=1",["2","0","0",null],"60","D"],["2001","only","-","Sep","lastSun",["2","0","0",null],"0","S"],["2002","max","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["2002","max","-","Oct","lastSun",["2","0","0",null],"0","S"]],"Bahamas":[["1964","1975","-","Oct","lastSun",["2","0","0",null],"0","S"],["1964","1975","-","Apr","lastSun",["2","0","0",null],"60","D"]],"Barb":[["1977","only","-","Jun","12",["2","0","0",null],"60","D"],["1977","1978","-","Oct","Sun>=1",["2","0","0",null],"0","S"],["1978","1980","-","Apr","Sun>=15",["2","0","0",null],"60","D"],["1979","only","-","Sep","30",["2","0","0",null],"0","S"],["1980","only","-","Sep","25",["2","0","0",null],"0","S"]],"Belize":[["1918","1942","-","Oct","Sun>=2",["0","0","0",null],"30","HD"],["1919","1943","-","Feb","Sun>=9",["0","0","0",null],"0","S"],["1973","only","-","Dec","5",["0","0","0",null],"60","D"],["1974","only","-","Feb","9",["0","0","0",null],"0","S"],["1982","only","-","Dec","18",["0","0","0",null],"60","D"],["1983","only","-","Feb","12",["0","0","0",null],"0","S"]],"CR":[["1979","1980","-","Feb","lastSun",["0","0","0",null],"60","D"],["1979","1980","-","Jun","Sun>=1",["0","0","0",null],"0","S"],["1991","1992","-","Jan","Sat>=15",["0","0","0",null],"60","D"],["1991","only","-","Jul","1",["0","0","0",null],"0","S"],["1992","only","-","Mar","15",["0","0","0",null],"0","S"]],"Cuba":[["1928","only","-","Jun","10",["0","0","0",null],"60","D"],["1928","only","-","Oct","10",["0","0","0",null],"0","S"],["1940","1942","-","Jun","Sun>=1",["0","0","0",null],"60","D"],["1940","1942","-","Sep","Sun>=1",["0","0","0",null],"0","S"],["1945","1946","-","Jun","Sun>=1",["0","0","0",null],"60","D"],["1945","1946","-","Sep","Sun>=1",["0","0","0",null],"0","S"],["1965","only","-","Jun","1",["0","0","0",null],"60","D"],["1965","only","-","Sep","30",["0","0","0",null],"0","S"],["1966","only","-","May","29",["0","0","0",null],"60","D"],["1966","only","-","Oct","2",["0","0","0",null],"0","S"],["1967","only","-","Apr","8",["0","0","0",null],"60","D"],["1967","1968","-","Sep","Sun>=8",["0","0","0",null],"0","S"],["1968","only","-","Apr","14",["0","0","0",null],"60","D"],["1969","1977","-","Apr","lastSun",["0","0","0",null],"60","D"],["1969","1971","-","Oct","lastSun",["0","0","0",null],"0","S"],["1972","1974","-","Oct","8",["0","0","0",null],"0","S"],["1975","1977","-","Oct","lastSun",["0","0","0",null],"0","S"],["1978","only","-","May","7",["0","0","0",null],"60","D"],["1978","1990","-","Oct","Sun>=8",["0","0","0",null],"0","S"],["1979","1980","-","Mar","Sun>=15",["0","0","0",null],"60","D"],["1981","1985","-","May","Sun>=5",["0","0","0",null],"60","D"],["1986","1989","-","Mar","Sun>=14",["0","0","0",null],"60","D"],["1990","1997","-","Apr","Sun>=1",["0","0","0",null],"60","D"],["1991","1995","-","Oct","Sun>=8",["0","0","0","s"],"0","S"],["1996","only","-","Oct","6",["0","0","0","s"],"0","S"],["1997","only","-","Oct","12",["0","0","0","s"],"0","S"],["1998","1999","-","Mar","lastSun",["0","0","0","s"],"60","D"],["1998","2003","-","Oct","lastSun",["0","0","0","s"],"0","S"],["2000","2003","-","Apr","Sun>=1",["0","0","0","s"],"60","D"],["2004","only","-","Mar","lastSun",["0","0","0","s"],"60","D"],["2006","2010","-","Oct","lastSun",["0","0","0","s"],"0","S"],["2007","only","-","Mar","Sun>=8",["0","0","0","s"],"60","D"],["2008","only","-","Mar","Sun>=15",["0","0","0","s"],"60","D"],["2009","2010","-","Mar","Sun>=8",["0","0","0","s"],"60","D"],["2011","only","-","Mar","Sun>=15",["0","0","0","s"],"60","D"],["2011","only","-","Nov","13",["0","0","0","s"],"0","S"],["2012","only","-","Apr","1",["0","0","0","s"],"60","D"],["2012","max","-","Nov","Sun>=1",["0","0","0","s"],"0","S"],["2013","max","-","Mar","Sun>=8",["0","0","0","s"],"60","D"]],"DR":[["1966","only","-","Oct","30",["0","0","0",null],"60","D"],["1967","only","-","Feb","28",["0","0","0",null],"0","S"],["1969","1973","-","Oct","lastSun",["0","0","0",null],"30","HD"],["1970","only","-","Feb","21",["0","0","0",null],"0","S"],["1971","only","-","Jan","20",["0","0","0",null],"0","S"],["1972","1974","-","Jan","21",["0","0","0",null],"0","S"]],"Salv":[["1987","1988","-","May","Sun>=1",["0","0","0",null],"60","D"],["1987","1988","-","Sep","lastSun",["0","0","0",null],"0","S"]],"Guat":[["1973","only","-","Nov","25",["0","0","0",null],"60","D"],["1974","only","-","Feb","24",["0","0","0",null],"0","S"],["1983","only","-","May","21",["0","0","0",null],"60","D"],["1983","only","-","Sep","22",["0","0","0",null],"0","S"],["1991","only","-","Mar","23",["0","0","0",null],"60","D"],["1991","only","-","Sep","7",["0","0","0",null],"0","S"],["2006","only","-","Apr","30",["0","0","0",null],"60","D"],["2006","only","-","Oct","1",["0","0","0",null],"0","S"]],"Haiti":[["1983","only","-","May","8",["0","0","0",null],"60","D"],["1984","1987","-","Apr","lastSun",["0","0","0",null],"60","D"],["1983","1987","-","Oct","lastSun",["0","0","0",null],"0","S"],["1988","1997","-","Apr","Sun>=1",["1","0","0","s"],"60","D"],["1988","1997","-","Oct","lastSun",["1","0","0","s"],"0","S"],["2005","2006","-","Apr","Sun>=1",["0","0","0",null],"60","D"],["2005","2006","-","Oct","lastSun",["0","0","0",null],"0","S"],["2012","max","-","Mar","Sun>=8",["2","0","0",null],"60","D"],["2012","max","-","Nov","Sun>=1",["2","0","0",null],"0","S"]],"Hond":[["1987","1988","-","May","Sun>=1",["0","0","0",null],"60","D"],["1987","1988","-","Sep","lastSun",["0","0","0",null],"0","S"],["2006","only","-","May","Sun>=1",["0","0","0",null],"60","D"],["2006","only","-","Aug","Mon>=1",["0","0","0",null],"0","S"]],"Nic":[["1979","1980","-","Mar","Sun>=16",["0","0","0",null],"60","D"],["1979","1980","-","Jun","Mon>=23",["0","0","0",null],"0","S"],["2005","only","-","Apr","10",["0","0","0",null],"60","D"],["2005","only","-","Oct","Sun>=1",["0","0","0",null],"0","S"],["2006","only","-","Apr","30",["2","0","0",null],"60","D"],["2006","only","-","Oct","Sun>=1",["1","0","0",null],"0","S"]],"TC":[["1979","1986","-","Apr","lastSun",["2","0","0",null],"60","D"],["1979","2006","-","Oct","lastSun",["2","0","0",null],"0","S"],["1987","2006","-","Apr","Sun>=1",["2","0","0",null],"60","D"],["2007","max","-","Mar","Sun>=8",["2","0","0",null],"60","D"],["2007","max","-","Nov","Sun>=1",["2","0","0",null],"0","S"]],"sol87":[["1987","only","-","Jan","1",["12","3","20","s"],"-3.3333333333333335","-"],["1987","only","-","Jan","2",["12","3","50","s"],"-3.8333333333333335","-"],["1987","only","-","Jan","3",["12","4","15","s"],"-4.25","-"],["1987","only","-","Jan","4",["12","4","45","s"],"-4.75","-"],["1987","only","-","Jan","5",["12","5","10","s"],"-5.166666666666667","-"],["1987","only","-","Jan","6",["12","5","40","s"],"-5.666666666666667","-"],["1987","only","-","Jan","7",["12","6","5","s"],"-6.083333333333333","-"],["1987","only","-","Jan","8",["12","6","30","s"],"-6.5","-"],["1987","only","-","Jan","9",["12","6","55","s"],"-6.916666666666667","-"],["1987","only","-","Jan","10",["12","7","20","s"],"-7.333333333333333","-"],["1987","only","-","Jan","11",["12","7","45","s"],"-7.75","-"],["1987","only","-","Jan","12",["12","8","10","s"],"-8.166666666666668","-"],["1987","only","-","Jan","13",["12","8","30","s"],"-8.5","-"],["1987","only","-","Jan","14",["12","8","55","s"],"-8.916666666666666","-"],["1987","only","-","Jan","15",["12","9","15","s"],"-9.25","-"],["1987","only","-","Jan","16",["12","9","35","s"],"-9.583333333333334","-"],["1987","only","-","Jan","17",["12","9","55","s"],"-9.916666666666666","-"],["1987","only","-","Jan","18",["12","10","15","s"],"-10.25","-"],["1987","only","-","Jan","19",["12","10","35","s"],"-10.583333333333334","-"],["1987","only","-","Jan","20",["12","10","55","s"],"-10.916666666666666","-"],["1987","only","-","Jan","21",["12","11","10","s"],"-11.166666666666666","-"],["1987","only","-","Jan","22",["12","11","30","s"],"-11.5","-"],["1987","only","-","Jan","23",["12","11","45","s"],"-11.75","-"],["1987","only","-","Jan","24",["12","12","0","s"],"-12","-"],["1987","only","-","Jan","25",["12","12","15","s"],"-12.25","-"],["1987","only","-","Jan","26",["12","12","30","s"],"-12.5","-"],["1987","only","-","Jan","27",["12","12","40","s"],"-12.666666666666666","-"],["1987","only","-","Jan","28",["12","12","55","s"],"-12.916666666666666","-"],["1987","only","-","Jan","29",["12","13","5","s"],"-13.083333333333334","-"],["1987","only","-","Jan","30",["12","13","15","s"],"-13.25","-"],["1987","only","-","Jan","31",["12","13","25","s"],"-13.416666666666666","-"],["1987","only","-","Feb","1",["12","13","35","s"],"-13.583333333333334","-"],["1987","only","-","Feb","2",["12","13","40","s"],"-13.666666666666666","-"],["1987","only","-","Feb","3",["12","13","50","s"],"-13.833333333333334","-"],["1987","only","-","Feb","4",["12","13","55","s"],"-13.916666666666666","-"],["1987","only","-","Feb","5",["12","14","0","s"],"-14","-"],["1987","only","-","Feb","6",["12","14","5","s"],"-14.083333333333334","-"],["1987","only","-","Feb","7",["12","14","10","s"],"-14.166666666666666","-"],["1987","only","-","Feb","8",["12","14","10","s"],"-14.166666666666666","-"],["1987","only","-","Feb","9",["12","14","15","s"],"-14.25","-"],["1987","only","-","Feb","10",["12","14","15","s"],"-14.25","-"],["1987","only","-","Feb","11",["12","14","15","s"],"-14.25","-"],["1987","only","-","Feb","12",["12","14","15","s"],"-14.25","-"],["1987","only","-","Feb","13",["12","14","15","s"],"-14.25","-"],["1987","only","-","Feb","14",["12","14","15","s"],"-14.25","-"],["1987","only","-","Feb","15",["12","14","10","s"],"-14.166666666666666","-"],["1987","only","-","Feb","16",["12","14","10","s"],"-14.166666666666666","-"],["1987","only","-","Feb","17",["12","14","5","s"],"-14.083333333333334","-"],["1987","only","-","Feb","18",["12","14","0","s"],"-14","-"],["1987","only","-","Feb","19",["12","13","55","s"],"-13.916666666666666","-"],["1987","only","-","Feb","20",["12","13","50","s"],"-13.833333333333334","-"],["1987","only","-","Feb","21",["12","13","45","s"],"-13.75","-"],["1987","only","-","Feb","22",["12","13","35","s"],"-13.583333333333334","-"],["1987","only","-","Feb","23",["12","13","30","s"],"-13.5","-"],["1987","only","-","Feb","24",["12","13","20","s"],"-13.333333333333334","-"],["1987","only","-","Feb","25",["12","13","10","s"],"-13.166666666666666","-"],["1987","only","-","Feb","26",["12","13","0","s"],"-13","-"],["1987","only","-","Feb","27",["12","12","50","s"],"-12.833333333333334","-"],["1987","only","-","Feb","28",["12","12","40","s"],"-12.666666666666666","-"],["1987","only","-","Mar","1",["12","12","30","s"],"-12.5","-"],["1987","only","-","Mar","2",["12","12","20","s"],"-12.333333333333334","-"],["1987","only","-","Mar","3",["12","12","5","s"],"-12.083333333333334","-"],["1987","only","-","Mar","4",["12","11","55","s"],"-11.916666666666666","-"],["1987","only","-","Mar","5",["12","11","40","s"],"-11.666666666666666","-"],["1987","only","-","Mar","6",["12","11","25","s"],"-11.416666666666666","-"],["1987","only","-","Mar","7",["12","11","15","s"],"-11.25","-"],["1987","only","-","Mar","8",["12","11","0","s"],"-11","-"],["1987","only","-","Mar","9",["12","10","45","s"],"-10.75","-"],["1987","only","-","Mar","10",["12","10","30","s"],"-10.5","-"],["1987","only","-","Mar","11",["12","10","15","s"],"-10.25","-"],["1987","only","-","Mar","12",["12","9","55","s"],"-9.916666666666666","-"],["1987","only","-","Mar","13",["12","9","40","s"],"-9.666666666666666","-"],["1987","only","-","Mar","14",["12","9","25","s"],"-9.416666666666666","-"],["1987","only","-","Mar","15",["12","9","10","s"],"-9.166666666666666","-"],["1987","only","-","Mar","16",["12","8","50","s"],"-8.833333333333334","-"],["1987","only","-","Mar","17",["12","8","35","s"],"-8.583333333333334","-"],["1987","only","-","Mar","18",["12","8","15","s"],"-8.25","-"],["1987","only","-","Mar","19",["12","8","0","s"],"-8","-"],["1987","only","-","Mar","20",["12","7","40","s"],"-7.666666666666667","-"],["1987","only","-","Mar","21",["12","7","25","s"],"-7.416666666666667","-"],["1987","only","-","Mar","22",["12","7","5","s"],"-7.083333333333333","-"],["1987","only","-","Mar","23",["12","6","50","s"],"-6.833333333333333","-"],["1987","only","-","Mar","24",["12","6","30","s"],"-6.5","-"],["1987","only","-","Mar","25",["12","6","10","s"],"-6.166666666666667","-"],["1987","only","-","Mar","26",["12","5","55","s"],"-5.916666666666667","-"],["1987","only","-","Mar","27",["12","5","35","s"],"-5.583333333333333","-"],["1987","only","-","Mar","28",["12","5","15","s"],"-5.25","-"],["1987","only","-","Mar","29",["12","5","0","s"],"-5","-"],["1987","only","-","Mar","30",["12","4","40","s"],"-4.666666666666667","-"],["1987","only","-","Mar","31",["12","4","25","s"],"-4.416666666666667","-"],["1987","only","-","Apr","1",["12","4","5","s"],"-4.083333333333334","-"],["1987","only","-","Apr","2",["12","3","45","s"],"-3.75","-"],["1987","only","-","Apr","3",["12","3","30","s"],"-3.5","-"],["1987","only","-","Apr","4",["12","3","10","s"],"-3.1666666666666665","-"],["1987","only","-","Apr","5",["12","2","55","s"],"-2.9166666666666665","-"],["1987","only","-","Apr","6",["12","2","35","s"],"-2.5833333333333335","-"],["1987","only","-","Apr","7",["12","2","20","s"],"-2.3333333333333335","-"],["1987","only","-","Apr","8",["12","2","5","s"],"-2.0833333333333335","-"],["1987","only","-","Apr","9",["12","1","45","s"],"-1.75","-"],["1987","only","-","Apr","10",["12","1","30","s"],"-1.5","-"],["1987","only","-","Apr","11",["12","1","15","s"],"-1.25","-"],["1987","only","-","Apr","12",["12","0","55","s"],"-0.9166666666666666","-"],["1987","only","-","Apr","13",["12","0","40","s"],"-0.6666666666666666","-"],["1987","only","-","Apr","14",["12","0","25","s"],"-0.4166666666666667","-"],["1987","only","-","Apr","15",["12","0","10","s"],"-0.16666666666666666","-"],["1987","only","-","Apr","16",["11","59","55","s"],"0.08333333333333333","-"],["1987","only","-","Apr","17",["11","59","45","s"],"0.25","-"],["1987","only","-","Apr","18",["11","59","30","s"],"0.5","-"],["1987","only","-","Apr","19",["11","59","15","s"],"0.75","-"],["1987","only","-","Apr","20",["11","59","5","s"],"0.9166666666666666","-"],["1987","only","-","Apr","21",["11","58","50","s"],"1.1666666666666667","-"],["1987","only","-","Apr","22",["11","58","40","s"],"1.3333333333333333","-"],["1987","only","-","Apr","23",["11","58","25","s"],"1.5833333333333333","-"],["1987","only","-","Apr","24",["11","58","15","s"],"1.75","-"],["1987","only","-","Apr","25",["11","58","5","s"],"1.9166666666666667","-"],["1987","only","-","Apr","26",["11","57","55","s"],"2.0833333333333335","-"],["1987","only","-","Apr","27",["11","57","45","s"],"2.25","-"],["1987","only","-","Apr","28",["11","57","35","s"],"2.4166666666666665","-"],["1987","only","-","Apr","29",["11","57","25","s"],"2.5833333333333335","-"],["1987","only","-","Apr","30",["11","57","15","s"],"2.75","-"],["1987","only","-","May","1",["11","57","10","s"],"2.8333333333333335","-"],["1987","only","-","May","2",["11","57","0","s"],"3","-"],["1987","only","-","May","3",["11","56","55","s"],"3.0833333333333335","-"],["1987","only","-","May","4",["11","56","50","s"],"3.1666666666666665","-"],["1987","only","-","May","5",["11","56","45","s"],"3.25","-"],["1987","only","-","May","6",["11","56","40","s"],"3.3333333333333335","-"],["1987","only","-","May","7",["11","56","35","s"],"3.4166666666666665","-"],["1987","only","-","May","8",["11","56","30","s"],"3.5","-"],["1987","only","-","May","9",["11","56","25","s"],"3.5833333333333335","-"],["1987","only","-","May","10",["11","56","25","s"],"3.5833333333333335","-"],["1987","only","-","May","11",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","12",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","13",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","14",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","15",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","16",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","17",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","18",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","May","19",["11","56","25","s"],"3.5833333333333335","-"],["1987","only","-","May","20",["11","56","25","s"],"3.5833333333333335","-"],["1987","only","-","May","21",["11","56","30","s"],"3.5","-"],["1987","only","-","May","22",["11","56","35","s"],"3.4166666666666665","-"],["1987","only","-","May","23",["11","56","40","s"],"3.3333333333333335","-"],["1987","only","-","May","24",["11","56","45","s"],"3.25","-"],["1987","only","-","May","25",["11","56","50","s"],"3.1666666666666665","-"],["1987","only","-","May","26",["11","56","55","s"],"3.0833333333333335","-"],["1987","only","-","May","27",["11","57","0","s"],"3","-"],["1987","only","-","May","28",["11","57","10","s"],"2.8333333333333335","-"],["1987","only","-","May","29",["11","57","15","s"],"2.75","-"],["1987","only","-","May","30",["11","57","25","s"],"2.5833333333333335","-"],["1987","only","-","May","31",["11","57","30","s"],"2.5","-"],["1987","only","-","Jun","1",["11","57","40","s"],"2.3333333333333335","-"],["1987","only","-","Jun","2",["11","57","50","s"],"2.1666666666666665","-"],["1987","only","-","Jun","3",["11","58","0","s"],"2","-"],["1987","only","-","Jun","4",["11","58","10","s"],"1.8333333333333333","-"],["1987","only","-","Jun","5",["11","58","20","s"],"1.6666666666666667","-"],["1987","only","-","Jun","6",["11","58","30","s"],"1.5","-"],["1987","only","-","Jun","7",["11","58","40","s"],"1.3333333333333333","-"],["1987","only","-","Jun","8",["11","58","50","s"],"1.1666666666666667","-"],["1987","only","-","Jun","9",["11","59","5","s"],"0.9166666666666666","-"],["1987","only","-","Jun","10",["11","59","15","s"],"0.75","-"],["1987","only","-","Jun","11",["11","59","30","s"],"0.5","-"],["1987","only","-","Jun","12",["11","59","40","s"],"0.3333333333333333","-"],["1987","only","-","Jun","13",["11","59","50","s"],"0.16666666666666666","-"],["1987","only","-","Jun","14",["12","0","5","s"],"-0.08333333333333333","-"],["1987","only","-","Jun","15",["12","0","15","s"],"-0.25","-"],["1987","only","-","Jun","16",["12","0","30","s"],"-0.5","-"],["1987","only","-","Jun","17",["12","0","45","s"],"-0.75","-"],["1987","only","-","Jun","18",["12","0","55","s"],"-0.9166666666666666","-"],["1987","only","-","Jun","19",["12","1","10","s"],"-1.1666666666666667","-"],["1987","only","-","Jun","20",["12","1","20","s"],"-1.3333333333333333","-"],["1987","only","-","Jun","21",["12","1","35","s"],"-1.5833333333333333","-"],["1987","only","-","Jun","22",["12","1","50","s"],"-1.8333333333333333","-"],["1987","only","-","Jun","23",["12","2","0","s"],"-2","-"],["1987","only","-","Jun","24",["12","2","15","s"],"-2.25","-"],["1987","only","-","Jun","25",["12","2","25","s"],"-2.4166666666666665","-"],["1987","only","-","Jun","26",["12","2","40","s"],"-2.6666666666666665","-"],["1987","only","-","Jun","27",["12","2","50","s"],"-2.8333333333333335","-"],["1987","only","-","Jun","28",["12","3","5","s"],"-3.0833333333333335","-"],["1987","only","-","Jun","29",["12","3","15","s"],"-3.25","-"],["1987","only","-","Jun","30",["12","3","30","s"],"-3.5","-"],["1987","only","-","Jul","1",["12","3","40","s"],"-3.6666666666666665","-"],["1987","only","-","Jul","2",["12","3","50","s"],"-3.8333333333333335","-"],["1987","only","-","Jul","3",["12","4","5","s"],"-4.083333333333334","-"],["1987","only","-","Jul","4",["12","4","15","s"],"-4.25","-"],["1987","only","-","Jul","5",["12","4","25","s"],"-4.416666666666667","-"],["1987","only","-","Jul","6",["12","4","35","s"],"-4.583333333333333","-"],["1987","only","-","Jul","7",["12","4","45","s"],"-4.75","-"],["1987","only","-","Jul","8",["12","4","55","s"],"-4.916666666666667","-"],["1987","only","-","Jul","9",["12","5","5","s"],"-5.083333333333333","-"],["1987","only","-","Jul","10",["12","5","15","s"],"-5.25","-"],["1987","only","-","Jul","11",["12","5","20","s"],"-5.333333333333333","-"],["1987","only","-","Jul","12",["12","5","30","s"],"-5.5","-"],["1987","only","-","Jul","13",["12","5","40","s"],"-5.666666666666667","-"],["1987","only","-","Jul","14",["12","5","45","s"],"-5.75","-"],["1987","only","-","Jul","15",["12","5","50","s"],"-5.833333333333333","-"],["1987","only","-","Jul","16",["12","6","0","s"],"-6","-"],["1987","only","-","Jul","17",["12","6","5","s"],"-6.083333333333333","-"],["1987","only","-","Jul","18",["12","6","10","s"],"-6.166666666666667","-"],["1987","only","-","Jul","19",["12","6","15","s"],"-6.25","-"],["1987","only","-","Jul","20",["12","6","15","s"],"-6.25","-"],["1987","only","-","Jul","21",["12","6","20","s"],"-6.333333333333333","-"],["1987","only","-","Jul","22",["12","6","25","s"],"-6.416666666666667","-"],["1987","only","-","Jul","23",["12","6","25","s"],"-6.416666666666667","-"],["1987","only","-","Jul","24",["12","6","25","s"],"-6.416666666666667","-"],["1987","only","-","Jul","25",["12","6","30","s"],"-6.5","-"],["1987","only","-","Jul","26",["12","6","30","s"],"-6.5","-"],["1987","only","-","Jul","27",["12","6","30","s"],"-6.5","-"],["1987","only","-","Jul","28",["12","6","30","s"],"-6.5","-"],["1987","only","-","Jul","29",["12","6","25","s"],"-6.416666666666667","-"],["1987","only","-","Jul","30",["12","6","25","s"],"-6.416666666666667","-"],["1987","only","-","Jul","31",["12","6","25","s"],"-6.416666666666667","-"],["1987","only","-","Aug","1",["12","6","20","s"],"-6.333333333333333","-"],["1987","only","-","Aug","2",["12","6","15","s"],"-6.25","-"],["1987","only","-","Aug","3",["12","6","10","s"],"-6.166666666666667","-"],["1987","only","-","Aug","4",["12","6","5","s"],"-6.083333333333333","-"],["1987","only","-","Aug","5",["12","6","0","s"],"-6","-"],["1987","only","-","Aug","6",["12","5","55","s"],"-5.916666666666667","-"],["1987","only","-","Aug","7",["12","5","50","s"],"-5.833333333333333","-"],["1987","only","-","Aug","8",["12","5","40","s"],"-5.666666666666667","-"],["1987","only","-","Aug","9",["12","5","35","s"],"-5.583333333333333","-"],["1987","only","-","Aug","10",["12","5","25","s"],"-5.416666666666667","-"],["1987","only","-","Aug","11",["12","5","15","s"],"-5.25","-"],["1987","only","-","Aug","12",["12","5","5","s"],"-5.083333333333333","-"],["1987","only","-","Aug","13",["12","4","55","s"],"-4.916666666666667","-"],["1987","only","-","Aug","14",["12","4","45","s"],"-4.75","-"],["1987","only","-","Aug","15",["12","4","35","s"],"-4.583333333333333","-"],["1987","only","-","Aug","16",["12","4","25","s"],"-4.416666666666667","-"],["1987","only","-","Aug","17",["12","4","10","s"],"-4.166666666666667","-"],["1987","only","-","Aug","18",["12","4","0","s"],"-4","-"],["1987","only","-","Aug","19",["12","3","45","s"],"-3.75","-"],["1987","only","-","Aug","20",["12","3","30","s"],"-3.5","-"],["1987","only","-","Aug","21",["12","3","15","s"],"-3.25","-"],["1987","only","-","Aug","22",["12","3","0","s"],"-3","-"],["1987","only","-","Aug","23",["12","2","45","s"],"-2.75","-"],["1987","only","-","Aug","24",["12","2","30","s"],"-2.5","-"],["1987","only","-","Aug","25",["12","2","15","s"],"-2.25","-"],["1987","only","-","Aug","26",["12","2","0","s"],"-2","-"],["1987","only","-","Aug","27",["12","1","40","s"],"-1.6666666666666667","-"],["1987","only","-","Aug","28",["12","1","25","s"],"-1.4166666666666667","-"],["1987","only","-","Aug","29",["12","1","5","s"],"-1.0833333333333333","-"],["1987","only","-","Aug","30",["12","0","50","s"],"-0.8333333333333334","-"],["1987","only","-","Aug","31",["12","0","30","s"],"-0.5","-"],["1987","only","-","Sep","1",["12","0","10","s"],"-0.16666666666666666","-"],["1987","only","-","Sep","2",["11","59","50","s"],"0.16666666666666666","-"],["1987","only","-","Sep","3",["11","59","35","s"],"0.4166666666666667","-"],["1987","only","-","Sep","4",["11","59","15","s"],"0.75","-"],["1987","only","-","Sep","5",["11","58","55","s"],"1.0833333333333333","-"],["1987","only","-","Sep","6",["11","58","35","s"],"1.4166666666666667","-"],["1987","only","-","Sep","7",["11","58","15","s"],"1.75","-"],["1987","only","-","Sep","8",["11","57","55","s"],"2.0833333333333335","-"],["1987","only","-","Sep","9",["11","57","30","s"],"2.5","-"],["1987","only","-","Sep","10",["11","57","10","s"],"2.8333333333333335","-"],["1987","only","-","Sep","11",["11","56","50","s"],"3.1666666666666665","-"],["1987","only","-","Sep","12",["11","56","30","s"],"3.5","-"],["1987","only","-","Sep","13",["11","56","10","s"],"3.8333333333333335","-"],["1987","only","-","Sep","14",["11","55","45","s"],"4.25","-"],["1987","only","-","Sep","15",["11","55","25","s"],"4.583333333333333","-"],["1987","only","-","Sep","16",["11","55","5","s"],"4.916666666666667","-"],["1987","only","-","Sep","17",["11","54","45","s"],"5.25","-"],["1987","only","-","Sep","18",["11","54","20","s"],"5.666666666666667","-"],["1987","only","-","Sep","19",["11","54","0","s"],"6","-"],["1987","only","-","Sep","20",["11","53","40","s"],"6.333333333333333","-"],["1987","only","-","Sep","21",["11","53","15","s"],"6.75","-"],["1987","only","-","Sep","22",["11","52","55","s"],"7.083333333333333","-"],["1987","only","-","Sep","23",["11","52","35","s"],"7.416666666666667","-"],["1987","only","-","Sep","24",["11","52","15","s"],"7.75","-"],["1987","only","-","Sep","25",["11","51","55","s"],"8.083333333333332","-"],["1987","only","-","Sep","26",["11","51","35","s"],"8.416666666666666","-"],["1987","only","-","Sep","27",["11","51","10","s"],"8.833333333333334","-"],["1987","only","-","Sep","28",["11","50","50","s"],"9.166666666666666","-"],["1987","only","-","Sep","29",["11","50","30","s"],"9.5","-"],["1987","only","-","Sep","30",["11","50","10","s"],"9.833333333333334","-"],["1987","only","-","Oct","1",["11","49","50","s"],"10.166666666666666","-"],["1987","only","-","Oct","2",["11","49","35","s"],"10.416666666666666","-"],["1987","only","-","Oct","3",["11","49","15","s"],"10.75","-"],["1987","only","-","Oct","4",["11","48","55","s"],"11.083333333333334","-"],["1987","only","-","Oct","5",["11","48","35","s"],"11.416666666666666","-"],["1987","only","-","Oct","6",["11","48","20","s"],"11.666666666666666","-"],["1987","only","-","Oct","7",["11","48","0","s"],"12","-"],["1987","only","-","Oct","8",["11","47","45","s"],"12.25","-"],["1987","only","-","Oct","9",["11","47","25","s"],"12.583333333333334","-"],["1987","only","-","Oct","10",["11","47","10","s"],"12.833333333333334","-"],["1987","only","-","Oct","11",["11","46","55","s"],"13.083333333333334","-"],["1987","only","-","Oct","12",["11","46","40","s"],"13.333333333333334","-"],["1987","only","-","Oct","13",["11","46","25","s"],"13.583333333333334","-"],["1987","only","-","Oct","14",["11","46","10","s"],"13.833333333333334","-"],["1987","only","-","Oct","15",["11","45","55","s"],"14.083333333333334","-"],["1987","only","-","Oct","16",["11","45","45","s"],"14.25","-"],["1987","only","-","Oct","17",["11","45","30","s"],"14.5","-"],["1987","only","-","Oct","18",["11","45","20","s"],"14.666666666666666","-"],["1987","only","-","Oct","19",["11","45","5","s"],"14.916666666666666","-"],["1987","only","-","Oct","20",["11","44","55","s"],"15.083333333333334","-"],["1987","only","-","Oct","21",["11","44","45","s"],"15.25","-"],["1987","only","-","Oct","22",["11","44","35","s"],"15.416666666666666","-"],["1987","only","-","Oct","23",["11","44","25","s"],"15.583333333333334","-"],["1987","only","-","Oct","24",["11","44","20","s"],"15.666666666666666","-"],["1987","only","-","Oct","25",["11","44","10","s"],"15.833333333333334","-"],["1987","only","-","Oct","26",["11","44","5","s"],"15.916666666666666","-"],["1987","only","-","Oct","27",["11","43","55","s"],"16.083333333333336","-"],["1987","only","-","Oct","28",["11","43","50","s"],"16.166666666666664","-"],["1987","only","-","Oct","29",["11","43","45","s"],"16.25","-"],["1987","only","-","Oct","30",["11","43","45","s"],"16.25","-"],["1987","only","-","Oct","31",["11","43","40","s"],"16.333333333333336","-"],["1987","only","-","Nov","1",["11","43","40","s"],"16.333333333333336","-"],["1987","only","-","Nov","2",["11","43","35","s"],"16.416666666666668","-"],["1987","only","-","Nov","3",["11","43","35","s"],"16.416666666666668","-"],["1987","only","-","Nov","4",["11","43","35","s"],"16.416666666666668","-"],["1987","only","-","Nov","5",["11","43","35","s"],"16.416666666666668","-"],["1987","only","-","Nov","6",["11","43","40","s"],"16.333333333333336","-"],["1987","only","-","Nov","7",["11","43","40","s"],"16.333333333333336","-"],["1987","only","-","Nov","8",["11","43","45","s"],"16.25","-"],["1987","only","-","Nov","9",["11","43","50","s"],"16.166666666666664","-"],["1987","only","-","Nov","10",["11","43","55","s"],"16.083333333333336","-"],["1987","only","-","Nov","11",["11","44","0","s"],"16","-"],["1987","only","-","Nov","12",["11","44","5","s"],"15.916666666666666","-"],["1987","only","-","Nov","13",["11","44","15","s"],"15.75","-"],["1987","only","-","Nov","14",["11","44","20","s"],"15.666666666666666","-"],["1987","only","-","Nov","15",["11","44","30","s"],"15.5","-"],["1987","only","-","Nov","16",["11","44","40","s"],"15.333333333333334","-"],["1987","only","-","Nov","17",["11","44","50","s"],"15.166666666666666","-"],["1987","only","-","Nov","18",["11","45","5","s"],"14.916666666666666","-"],["1987","only","-","Nov","19",["11","45","15","s"],"14.75","-"],["1987","only","-","Nov","20",["11","45","30","s"],"14.5","-"],["1987","only","-","Nov","21",["11","45","45","s"],"14.25","-"],["1987","only","-","Nov","22",["11","46","0","s"],"14","-"],["1987","only","-","Nov","23",["11","46","15","s"],"13.75","-"],["1987","only","-","Nov","24",["11","46","30","s"],"13.5","-"],["1987","only","-","Nov","25",["11","46","50","s"],"13.166666666666666","-"],["1987","only","-","Nov","26",["11","47","10","s"],"12.833333333333334","-"],["1987","only","-","Nov","27",["11","47","25","s"],"12.583333333333334","-"],["1987","only","-","Nov","28",["11","47","45","s"],"12.25","-"],["1987","only","-","Nov","29",["11","48","5","s"],"11.916666666666666","-"],["1987","only","-","Nov","30",["11","48","30","s"],"11.5","-"],["1987","only","-","Dec","1",["11","48","50","s"],"11.166666666666666","-"],["1987","only","-","Dec","2",["11","49","10","s"],"10.833333333333334","-"],["1987","only","-","Dec","3",["11","49","35","s"],"10.416666666666666","-"],["1987","only","-","Dec","4",["11","50","0","s"],"10","-"],["1987","only","-","Dec","5",["11","50","25","s"],"9.583333333333334","-"],["1987","only","-","Dec","6",["11","50","50","s"],"9.166666666666666","-"],["1987","only","-","Dec","7",["11","51","15","s"],"8.75","-"],["1987","only","-","Dec","8",["11","51","40","s"],"8.333333333333334","-"],["1987","only","-","Dec","9",["11","52","5","s"],"7.916666666666667","-"],["1987","only","-","Dec","10",["11","52","30","s"],"7.5","-"],["1987","only","-","Dec","11",["11","53","0","s"],"7","-"],["1987","only","-","Dec","12",["11","53","25","s"],"6.583333333333333","-"],["1987","only","-","Dec","13",["11","53","55","s"],"6.083333333333333","-"],["1987","only","-","Dec","14",["11","54","25","s"],"5.583333333333333","-"],["1987","only","-","Dec","15",["11","54","50","s"],"5.166666666666667","-"],["1987","only","-","Dec","16",["11","55","20","s"],"4.666666666666667","-"],["1987","only","-","Dec","17",["11","55","50","s"],"4.166666666666667","-"],["1987","only","-","Dec","18",["11","56","20","s"],"3.6666666666666665","-"],["1987","only","-","Dec","19",["11","56","50","s"],"3.1666666666666665","-"],["1987","only","-","Dec","20",["11","57","20","s"],"2.6666666666666665","-"],["1987","only","-","Dec","21",["11","57","50","s"],"2.1666666666666665","-"],["1987","only","-","Dec","22",["11","58","20","s"],"1.6666666666666667","-"],["1987","only","-","Dec","23",["11","58","50","s"],"1.1666666666666667","-"],["1987","only","-","Dec","24",["11","59","20","s"],"0.6666666666666666","-"],["1987","only","-","Dec","25",["11","59","50","s"],"0.16666666666666666","-"],["1987","only","-","Dec","26",["12","0","20","s"],"-0.3333333333333333","-"],["1987","only","-","Dec","27",["12","0","45","s"],"-0.75","-"],["1987","only","-","Dec","28",["12","1","15","s"],"-1.25","-"],["1987","only","-","Dec","29",["12","1","45","s"],"-1.75","-"],["1987","only","-","Dec","30",["12","2","15","s"],"-2.25","-"],["1987","only","-","Dec","31",["12","2","45","s"],"-2.75","-"]],"sol88":[["1988","only","-","Jan","1",["12","3","15","s"],"-3.25","-"],["1988","only","-","Jan","2",["12","3","40","s"],"-3.6666666666666665","-"],["1988","only","-","Jan","3",["12","4","10","s"],"-4.166666666666667","-"],["1988","only","-","Jan","4",["12","4","40","s"],"-4.666666666666667","-"],["1988","only","-","Jan","5",["12","5","5","s"],"-5.083333333333333","-"],["1988","only","-","Jan","6",["12","5","30","s"],"-5.5","-"],["1988","only","-","Jan","7",["12","6","0","s"],"-6","-"],["1988","only","-","Jan","8",["12","6","25","s"],"-6.416666666666667","-"],["1988","only","-","Jan","9",["12","6","50","s"],"-6.833333333333333","-"],["1988","only","-","Jan","10",["12","7","15","s"],"-7.25","-"],["1988","only","-","Jan","11",["12","7","40","s"],"-7.666666666666667","-"],["1988","only","-","Jan","12",["12","8","5","s"],"-8.083333333333332","-"],["1988","only","-","Jan","13",["12","8","25","s"],"-8.416666666666666","-"],["1988","only","-","Jan","14",["12","8","50","s"],"-8.833333333333334","-"],["1988","only","-","Jan","15",["12","9","10","s"],"-9.166666666666666","-"],["1988","only","-","Jan","16",["12","9","30","s"],"-9.5","-"],["1988","only","-","Jan","17",["12","9","50","s"],"-9.833333333333334","-"],["1988","only","-","Jan","18",["12","10","10","s"],"-10.166666666666666","-"],["1988","only","-","Jan","19",["12","10","30","s"],"-10.5","-"],["1988","only","-","Jan","20",["12","10","50","s"],"-10.833333333333334","-"],["1988","only","-","Jan","21",["12","11","5","s"],"-11.083333333333334","-"],["1988","only","-","Jan","22",["12","11","25","s"],"-11.416666666666666","-"],["1988","only","-","Jan","23",["12","11","40","s"],"-11.666666666666666","-"],["1988","only","-","Jan","24",["12","11","55","s"],"-11.916666666666666","-"],["1988","only","-","Jan","25",["12","12","10","s"],"-12.166666666666666","-"],["1988","only","-","Jan","26",["12","12","25","s"],"-12.416666666666666","-"],["1988","only","-","Jan","27",["12","12","40","s"],"-12.666666666666666","-"],["1988","only","-","Jan","28",["12","12","50","s"],"-12.833333333333334","-"],["1988","only","-","Jan","29",["12","13","0","s"],"-13","-"],["1988","only","-","Jan","30",["12","13","10","s"],"-13.166666666666666","-"],["1988","only","-","Jan","31",["12","13","20","s"],"-13.333333333333334","-"],["1988","only","-","Feb","1",["12","13","30","s"],"-13.5","-"],["1988","only","-","Feb","2",["12","13","40","s"],"-13.666666666666666","-"],["1988","only","-","Feb","3",["12","13","45","s"],"-13.75","-"],["1988","only","-","Feb","4",["12","13","55","s"],"-13.916666666666666","-"],["1988","only","-","Feb","5",["12","14","0","s"],"-14","-"],["1988","only","-","Feb","6",["12","14","5","s"],"-14.083333333333334","-"],["1988","only","-","Feb","7",["12","14","10","s"],"-14.166666666666666","-"],["1988","only","-","Feb","8",["12","14","10","s"],"-14.166666666666666","-"],["1988","only","-","Feb","9",["12","14","15","s"],"-14.25","-"],["1988","only","-","Feb","10",["12","14","15","s"],"-14.25","-"],["1988","only","-","Feb","11",["12","14","15","s"],"-14.25","-"],["1988","only","-","Feb","12",["12","14","15","s"],"-14.25","-"],["1988","only","-","Feb","13",["12","14","15","s"],"-14.25","-"],["1988","only","-","Feb","14",["12","14","15","s"],"-14.25","-"],["1988","only","-","Feb","15",["12","14","10","s"],"-14.166666666666666","-"],["1988","only","-","Feb","16",["12","14","10","s"],"-14.166666666666666","-"],["1988","only","-","Feb","17",["12","14","5","s"],"-14.083333333333334","-"],["1988","only","-","Feb","18",["12","14","0","s"],"-14","-"],["1988","only","-","Feb","19",["12","13","55","s"],"-13.916666666666666","-"],["1988","only","-","Feb","20",["12","13","50","s"],"-13.833333333333334","-"],["1988","only","-","Feb","21",["12","13","45","s"],"-13.75","-"],["1988","only","-","Feb","22",["12","13","40","s"],"-13.666666666666666","-"],["1988","only","-","Feb","23",["12","13","30","s"],"-13.5","-"],["1988","only","-","Feb","24",["12","13","20","s"],"-13.333333333333334","-"],["1988","only","-","Feb","25",["12","13","15","s"],"-13.25","-"],["1988","only","-","Feb","26",["12","13","5","s"],"-13.083333333333334","-"],["1988","only","-","Feb","27",["12","12","55","s"],"-12.916666666666666","-"],["1988","only","-","Feb","28",["12","12","45","s"],"-12.75","-"],["1988","only","-","Feb","29",["12","12","30","s"],"-12.5","-"],["1988","only","-","Mar","1",["12","12","20","s"],"-12.333333333333334","-"],["1988","only","-","Mar","2",["12","12","10","s"],"-12.166666666666666","-"],["1988","only","-","Mar","3",["12","11","55","s"],"-11.916666666666666","-"],["1988","only","-","Mar","4",["12","11","45","s"],"-11.75","-"],["1988","only","-","Mar","5",["12","11","30","s"],"-11.5","-"],["1988","only","-","Mar","6",["12","11","15","s"],"-11.25","-"],["1988","only","-","Mar","7",["12","11","0","s"],"-11","-"],["1988","only","-","Mar","8",["12","10","45","s"],"-10.75","-"],["1988","only","-","Mar","9",["12","10","30","s"],"-10.5","-"],["1988","only","-","Mar","10",["12","10","15","s"],"-10.25","-"],["1988","only","-","Mar","11",["12","10","0","s"],"-10","-"],["1988","only","-","Mar","12",["12","9","45","s"],"-9.75","-"],["1988","only","-","Mar","13",["12","9","30","s"],"-9.5","-"],["1988","only","-","Mar","14",["12","9","10","s"],"-9.166666666666666","-"],["1988","only","-","Mar","15",["12","8","55","s"],"-8.916666666666666","-"],["1988","only","-","Mar","16",["12","8","40","s"],"-8.666666666666666","-"],["1988","only","-","Mar","17",["12","8","20","s"],"-8.333333333333334","-"],["1988","only","-","Mar","18",["12","8","5","s"],"-8.083333333333332","-"],["1988","only","-","Mar","19",["12","7","45","s"],"-7.75","-"],["1988","only","-","Mar","20",["12","7","30","s"],"-7.5","-"],["1988","only","-","Mar","21",["12","7","10","s"],"-7.166666666666667","-"],["1988","only","-","Mar","22",["12","6","50","s"],"-6.833333333333333","-"],["1988","only","-","Mar","23",["12","6","35","s"],"-6.583333333333333","-"],["1988","only","-","Mar","24",["12","6","15","s"],"-6.25","-"],["1988","only","-","Mar","25",["12","6","0","s"],"-6","-"],["1988","only","-","Mar","26",["12","5","40","s"],"-5.666666666666667","-"],["1988","only","-","Mar","27",["12","5","20","s"],"-5.333333333333333","-"],["1988","only","-","Mar","28",["12","5","5","s"],"-5.083333333333333","-"],["1988","only","-","Mar","29",["12","4","45","s"],"-4.75","-"],["1988","only","-","Mar","30",["12","4","25","s"],"-4.416666666666667","-"],["1988","only","-","Mar","31",["12","4","10","s"],"-4.166666666666667","-"],["1988","only","-","Apr","1",["12","3","50","s"],"-3.8333333333333335","-"],["1988","only","-","Apr","2",["12","3","35","s"],"-3.5833333333333335","-"],["1988","only","-","Apr","3",["12","3","15","s"],"-3.25","-"],["1988","only","-","Apr","4",["12","3","0","s"],"-3","-"],["1988","only","-","Apr","5",["12","2","40","s"],"-2.6666666666666665","-"],["1988","only","-","Apr","6",["12","2","25","s"],"-2.4166666666666665","-"],["1988","only","-","Apr","7",["12","2","5","s"],"-2.0833333333333335","-"],["1988","only","-","Apr","8",["12","1","50","s"],"-1.8333333333333333","-"],["1988","only","-","Apr","9",["12","1","35","s"],"-1.5833333333333333","-"],["1988","only","-","Apr","10",["12","1","15","s"],"-1.25","-"],["1988","only","-","Apr","11",["12","1","0","s"],"-1","-"],["1988","only","-","Apr","12",["12","0","45","s"],"-0.75","-"],["1988","only","-","Apr","13",["12","0","30","s"],"-0.5","-"],["1988","only","-","Apr","14",["12","0","15","s"],"-0.25","-"],["1988","only","-","Apr","15",["12","0","0","s"],"0","-"],["1988","only","-","Apr","16",["11","59","45","s"],"0.25","-"],["1988","only","-","Apr","17",["11","59","30","s"],"0.5","-"],["1988","only","-","Apr","18",["11","59","20","s"],"0.6666666666666666","-"],["1988","only","-","Apr","19",["11","59","5","s"],"0.9166666666666666","-"],["1988","only","-","Apr","20",["11","58","55","s"],"1.0833333333333333","-"],["1988","only","-","Apr","21",["11","58","40","s"],"1.3333333333333333","-"],["1988","only","-","Apr","22",["11","58","30","s"],"1.5","-"],["1988","only","-","Apr","23",["11","58","15","s"],"1.75","-"],["1988","only","-","Apr","24",["11","58","5","s"],"1.9166666666666667","-"],["1988","only","-","Apr","25",["11","57","55","s"],"2.0833333333333335","-"],["1988","only","-","Apr","26",["11","57","45","s"],"2.25","-"],["1988","only","-","Apr","27",["11","57","35","s"],"2.4166666666666665","-"],["1988","only","-","Apr","28",["11","57","30","s"],"2.5","-"],["1988","only","-","Apr","29",["11","57","20","s"],"2.6666666666666665","-"],["1988","only","-","Apr","30",["11","57","10","s"],"2.8333333333333335","-"],["1988","only","-","May","1",["11","57","5","s"],"2.9166666666666665","-"],["1988","only","-","May","2",["11","56","55","s"],"3.0833333333333335","-"],["1988","only","-","May","3",["11","56","50","s"],"3.1666666666666665","-"],["1988","only","-","May","4",["11","56","45","s"],"3.25","-"],["1988","only","-","May","5",["11","56","40","s"],"3.3333333333333335","-"],["1988","only","-","May","6",["11","56","35","s"],"3.4166666666666665","-"],["1988","only","-","May","7",["11","56","30","s"],"3.5","-"],["1988","only","-","May","8",["11","56","25","s"],"3.5833333333333335","-"],["1988","only","-","May","9",["11","56","25","s"],"3.5833333333333335","-"],["1988","only","-","May","10",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","11",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","12",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","13",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","14",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","15",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","16",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","17",["11","56","20","s"],"3.6666666666666665","-"],["1988","only","-","May","18",["11","56","25","s"],"3.5833333333333335","-"],["1988","only","-","May","19",["11","56","25","s"],"3.5833333333333335","-"],["1988","only","-","May","20",["11","56","30","s"],"3.5","-"],["1988","only","-","May","21",["11","56","35","s"],"3.4166666666666665","-"],["1988","only","-","May","22",["11","56","40","s"],"3.3333333333333335","-"],["1988","only","-","May","23",["11","56","45","s"],"3.25","-"],["1988","only","-","May","24",["11","56","50","s"],"3.1666666666666665","-"],["1988","only","-","May","25",["11","56","55","s"],"3.0833333333333335","-"],["1988","only","-","May","26",["11","57","0","s"],"3","-"],["1988","only","-","May","27",["11","57","5","s"],"2.9166666666666665","-"],["1988","only","-","May","28",["11","57","15","s"],"2.75","-"],["1988","only","-","May","29",["11","57","20","s"],"2.6666666666666665","-"],["1988","only","-","May","30",["11","57","30","s"],"2.5","-"],["1988","only","-","May","31",["11","57","40","s"],"2.3333333333333335","-"],["1988","only","-","Jun","1",["11","57","50","s"],"2.1666666666666665","-"],["1988","only","-","Jun","2",["11","57","55","s"],"2.0833333333333335","-"],["1988","only","-","Jun","3",["11","58","5","s"],"1.9166666666666667","-"],["1988","only","-","Jun","4",["11","58","15","s"],"1.75","-"],["1988","only","-","Jun","5",["11","58","30","s"],"1.5","-"],["1988","only","-","Jun","6",["11","58","40","s"],"1.3333333333333333","-"],["1988","only","-","Jun","7",["11","58","50","s"],"1.1666666666666667","-"],["1988","only","-","Jun","8",["11","59","0","s"],"1","-"],["1988","only","-","Jun","9",["11","59","15","s"],"0.75","-"],["1988","only","-","Jun","10",["11","59","25","s"],"0.5833333333333334","-"],["1988","only","-","Jun","11",["11","59","35","s"],"0.4166666666666667","-"],["1988","only","-","Jun","12",["11","59","50","s"],"0.16666666666666666","-"],["1988","only","-","Jun","13",["12","0","0","s"],"0","-"],["1988","only","-","Jun","14",["12","0","15","s"],"-0.25","-"],["1988","only","-","Jun","15",["12","0","25","s"],"-0.4166666666666667","-"],["1988","only","-","Jun","16",["12","0","40","s"],"-0.6666666666666666","-"],["1988","only","-","Jun","17",["12","0","55","s"],"-0.9166666666666666","-"],["1988","only","-","Jun","18",["12","1","5","s"],"-1.0833333333333333","-"],["1988","only","-","Jun","19",["12","1","20","s"],"-1.3333333333333333","-"],["1988","only","-","Jun","20",["12","1","30","s"],"-1.5","-"],["1988","only","-","Jun","21",["12","1","45","s"],"-1.75","-"],["1988","only","-","Jun","22",["12","2","0","s"],"-2","-"],["1988","only","-","Jun","23",["12","2","10","s"],"-2.1666666666666665","-"],["1988","only","-","Jun","24",["12","2","25","s"],"-2.4166666666666665","-"],["1988","only","-","Jun","25",["12","2","35","s"],"-2.5833333333333335","-"],["1988","only","-","Jun","26",["12","2","50","s"],"-2.8333333333333335","-"],["1988","only","-","Jun","27",["12","3","0","s"],"-3","-"],["1988","only","-","Jun","28",["12","3","15","s"],"-3.25","-"],["1988","only","-","Jun","29",["12","3","25","s"],"-3.4166666666666665","-"],["1988","only","-","Jun","30",["12","3","40","s"],"-3.6666666666666665","-"],["1988","only","-","Jul","1",["12","3","50","s"],"-3.8333333333333335","-"],["1988","only","-","Jul","2",["12","4","0","s"],"-4","-"],["1988","only","-","Jul","3",["12","4","10","s"],"-4.166666666666667","-"],["1988","only","-","Jul","4",["12","4","25","s"],"-4.416666666666667","-"],["1988","only","-","Jul","5",["12","4","35","s"],"-4.583333333333333","-"],["1988","only","-","Jul","6",["12","4","45","s"],"-4.75","-"],["1988","only","-","Jul","7",["12","4","55","s"],"-4.916666666666667","-"],["1988","only","-","Jul","8",["12","5","5","s"],"-5.083333333333333","-"],["1988","only","-","Jul","9",["12","5","10","s"],"-5.166666666666667","-"],["1988","only","-","Jul","10",["12","5","20","s"],"-5.333333333333333","-"],["1988","only","-","Jul","11",["12","5","30","s"],"-5.5","-"],["1988","only","-","Jul","12",["12","5","35","s"],"-5.583333333333333","-"],["1988","only","-","Jul","13",["12","5","45","s"],"-5.75","-"],["1988","only","-","Jul","14",["12","5","50","s"],"-5.833333333333333","-"],["1988","only","-","Jul","15",["12","5","55","s"],"-5.916666666666667","-"],["1988","only","-","Jul","16",["12","6","0","s"],"-6","-"],["1988","only","-","Jul","17",["12","6","5","s"],"-6.083333333333333","-"],["1988","only","-","Jul","18",["12","6","10","s"],"-6.166666666666667","-"],["1988","only","-","Jul","19",["12","6","15","s"],"-6.25","-"],["1988","only","-","Jul","20",["12","6","20","s"],"-6.333333333333333","-"],["1988","only","-","Jul","21",["12","6","25","s"],"-6.416666666666667","-"],["1988","only","-","Jul","22",["12","6","25","s"],"-6.416666666666667","-"],["1988","only","-","Jul","23",["12","6","25","s"],"-6.416666666666667","-"],["1988","only","-","Jul","24",["12","6","30","s"],"-6.5","-"],["1988","only","-","Jul","25",["12","6","30","s"],"-6.5","-"],["1988","only","-","Jul","26",["12","6","30","s"],"-6.5","-"],["1988","only","-","Jul","27",["12","6","30","s"],"-6.5","-"],["1988","only","-","Jul","28",["12","6","30","s"],"-6.5","-"],["1988","only","-","Jul","29",["12","6","25","s"],"-6.416666666666667","-"],["1988","only","-","Jul","30",["12","6","25","s"],"-6.416666666666667","-"],["1988","only","-","Jul","31",["12","6","20","s"],"-6.333333333333333","-"],["1988","only","-","Aug","1",["12","6","15","s"],"-6.25","-"],["1988","only","-","Aug","2",["12","6","15","s"],"-6.25","-"],["1988","only","-","Aug","3",["12","6","10","s"],"-6.166666666666667","-"],["1988","only","-","Aug","4",["12","6","5","s"],"-6.083333333333333","-"],["1988","only","-","Aug","5",["12","5","55","s"],"-5.916666666666667","-"],["1988","only","-","Aug","6",["12","5","50","s"],"-5.833333333333333","-"],["1988","only","-","Aug","7",["12","5","45","s"],"-5.75","-"],["1988","only","-","Aug","8",["12","5","35","s"],"-5.583333333333333","-"],["1988","only","-","Aug","9",["12","5","25","s"],"-5.416666666666667","-"],["1988","only","-","Aug","10",["12","5","20","s"],"-5.333333333333333","-"],["1988","only","-","Aug","11",["12","5","10","s"],"-5.166666666666667","-"],["1988","only","-","Aug","12",["12","5","0","s"],"-5","-"],["1988","only","-","Aug","13",["12","4","50","s"],"-4.833333333333333","-"],["1988","only","-","Aug","14",["12","4","35","s"],"-4.583333333333333","-"],["1988","only","-","Aug","15",["12","4","25","s"],"-4.416666666666667","-"],["1988","only","-","Aug","16",["12","4","15","s"],"-4.25","-"],["1988","only","-","Aug","17",["12","4","0","s"],"-4","-"],["1988","only","-","Aug","18",["12","3","50","s"],"-3.8333333333333335","-"],["1988","only","-","Aug","19",["12","3","35","s"],"-3.5833333333333335","-"],["1988","only","-","Aug","20",["12","3","20","s"],"-3.3333333333333335","-"],["1988","only","-","Aug","21",["12","3","5","s"],"-3.0833333333333335","-"],["1988","only","-","Aug","22",["12","2","50","s"],"-2.8333333333333335","-"],["1988","only","-","Aug","23",["12","2","35","s"],"-2.5833333333333335","-"],["1988","only","-","Aug","24",["12","2","20","s"],"-2.3333333333333335","-"],["1988","only","-","Aug","25",["12","2","0","s"],"-2","-"],["1988","only","-","Aug","26",["12","1","45","s"],"-1.75","-"],["1988","only","-","Aug","27",["12","1","30","s"],"-1.5","-"],["1988","only","-","Aug","28",["12","1","10","s"],"-1.1666666666666667","-"],["1988","only","-","Aug","29",["12","0","50","s"],"-0.8333333333333334","-"],["1988","only","-","Aug","30",["12","0","35","s"],"-0.5833333333333334","-"],["1988","only","-","Aug","31",["12","0","15","s"],"-0.25","-"],["1988","only","-","Sep","1",["11","59","55","s"],"0.08333333333333333","-"],["1988","only","-","Sep","2",["11","59","35","s"],"0.4166666666666667","-"],["1988","only","-","Sep","3",["11","59","20","s"],"0.6666666666666666","-"],["1988","only","-","Sep","4",["11","59","0","s"],"1","-"],["1988","only","-","Sep","5",["11","58","40","s"],"1.3333333333333333","-"],["1988","only","-","Sep","6",["11","58","20","s"],"1.6666666666666667","-"],["1988","only","-","Sep","7",["11","58","0","s"],"2","-"],["1988","only","-","Sep","8",["11","57","35","s"],"2.4166666666666665","-"],["1988","only","-","Sep","9",["11","57","15","s"],"2.75","-"],["1988","only","-","Sep","10",["11","56","55","s"],"3.0833333333333335","-"],["1988","only","-","Sep","11",["11","56","35","s"],"3.4166666666666665","-"],["1988","only","-","Sep","12",["11","56","15","s"],"3.75","-"],["1988","only","-","Sep","13",["11","55","50","s"],"4.166666666666667","-"],["1988","only","-","Sep","14",["11","55","30","s"],"4.5","-"],["1988","only","-","Sep","15",["11","55","10","s"],"4.833333333333333","-"],["1988","only","-","Sep","16",["11","54","50","s"],"5.166666666666667","-"],["1988","only","-","Sep","17",["11","54","25","s"],"5.583333333333333","-"],["1988","only","-","Sep","18",["11","54","5","s"],"5.916666666666667","-"],["1988","only","-","Sep","19",["11","53","45","s"],"6.25","-"],["1988","only","-","Sep","20",["11","53","25","s"],"6.583333333333333","-"],["1988","only","-","Sep","21",["11","53","0","s"],"7","-"],["1988","only","-","Sep","22",["11","52","40","s"],"7.333333333333333","-"],["1988","only","-","Sep","23",["11","52","20","s"],"7.666666666666667","-"],["1988","only","-","Sep","24",["11","52","0","s"],"8","-"],["1988","only","-","Sep","25",["11","51","40","s"],"8.333333333333334","-"],["1988","only","-","Sep","26",["11","51","15","s"],"8.75","-"],["1988","only","-","Sep","27",["11","50","55","s"],"9.083333333333334","-"],["1988","only","-","Sep","28",["11","50","35","s"],"9.416666666666666","-"],["1988","only","-","Sep","29",["11","50","15","s"],"9.75","-"],["1988","only","-","Sep","30",["11","49","55","s"],"10.083333333333334","-"],["1988","only","-","Oct","1",["11","49","35","s"],"10.416666666666666","-"],["1988","only","-","Oct","2",["11","49","20","s"],"10.666666666666666","-"],["1988","only","-","Oct","3",["11","49","0","s"],"11","-"],["1988","only","-","Oct","4",["11","48","40","s"],"11.333333333333334","-"],["1988","only","-","Oct","5",["11","48","25","s"],"11.583333333333334","-"],["1988","only","-","Oct","6",["11","48","5","s"],"11.916666666666666","-"],["1988","only","-","Oct","7",["11","47","50","s"],"12.166666666666666","-"],["1988","only","-","Oct","8",["11","47","30","s"],"12.5","-"],["1988","only","-","Oct","9",["11","47","15","s"],"12.75","-"],["1988","only","-","Oct","10",["11","47","0","s"],"13","-"],["1988","only","-","Oct","11",["11","46","45","s"],"13.25","-"],["1988","only","-","Oct","12",["11","46","30","s"],"13.5","-"],["1988","only","-","Oct","13",["11","46","15","s"],"13.75","-"],["1988","only","-","Oct","14",["11","46","0","s"],"14","-"],["1988","only","-","Oct","15",["11","45","45","s"],"14.25","-"],["1988","only","-","Oct","16",["11","45","35","s"],"14.416666666666666","-"],["1988","only","-","Oct","17",["11","45","20","s"],"14.666666666666666","-"],["1988","only","-","Oct","18",["11","45","10","s"],"14.833333333333334","-"],["1988","only","-","Oct","19",["11","45","0","s"],"15","-"],["1988","only","-","Oct","20",["11","44","45","s"],"15.25","-"],["1988","only","-","Oct","21",["11","44","40","s"],"15.333333333333334","-"],["1988","only","-","Oct","22",["11","44","30","s"],"15.5","-"],["1988","only","-","Oct","23",["11","44","20","s"],"15.666666666666666","-"],["1988","only","-","Oct","24",["11","44","10","s"],"15.833333333333334","-"],["1988","only","-","Oct","25",["11","44","5","s"],"15.916666666666666","-"],["1988","only","-","Oct","26",["11","44","0","s"],"16","-"],["1988","only","-","Oct","27",["11","43","55","s"],"16.083333333333336","-"],["1988","only","-","Oct","28",["11","43","50","s"],"16.166666666666664","-"],["1988","only","-","Oct","29",["11","43","45","s"],"16.25","-"],["1988","only","-","Oct","30",["11","43","40","s"],"16.333333333333336","-"],["1988","only","-","Oct","31",["11","43","40","s"],"16.333333333333336","-"],["1988","only","-","Nov","1",["11","43","35","s"],"16.416666666666668","-"],["1988","only","-","Nov","2",["11","43","35","s"],"16.416666666666668","-"],["1988","only","-","Nov","3",["11","43","35","s"],"16.416666666666668","-"],["1988","only","-","Nov","4",["11","43","35","s"],"16.416666666666668","-"],["1988","only","-","Nov","5",["11","43","40","s"],"16.333333333333336","-"],["1988","only","-","Nov","6",["11","43","40","s"],"16.333333333333336","-"],["1988","only","-","Nov","7",["11","43","45","s"],"16.25","-"],["1988","only","-","Nov","8",["11","43","45","s"],"16.25","-"],["1988","only","-","Nov","9",["11","43","50","s"],"16.166666666666664","-"],["1988","only","-","Nov","10",["11","44","0","s"],"16","-"],["1988","only","-","Nov","11",["11","44","5","s"],"15.916666666666666","-"],["1988","only","-","Nov","12",["11","44","10","s"],"15.833333333333334","-"],["1988","only","-","Nov","13",["11","44","20","s"],"15.666666666666666","-"],["1988","only","-","Nov","14",["11","44","30","s"],"15.5","-"],["1988","only","-","Nov","15",["11","44","40","s"],"15.333333333333334","-"],["1988","only","-","Nov","16",["11","44","50","s"],"15.166666666666666","-"],["1988","only","-","Nov","17",["11","45","0","s"],"15","-"],["1988","only","-","Nov","18",["11","45","15","s"],"14.75","-"],["1988","only","-","Nov","19",["11","45","25","s"],"14.583333333333334","-"],["1988","only","-","Nov","20",["11","45","40","s"],"14.333333333333334","-"],["1988","only","-","Nov","21",["11","45","55","s"],"14.083333333333334","-"],["1988","only","-","Nov","22",["11","46","10","s"],"13.833333333333334","-"],["1988","only","-","Nov","23",["11","46","30","s"],"13.5","-"],["1988","only","-","Nov","24",["11","46","45","s"],"13.25","-"],["1988","only","-","Nov","25",["11","47","5","s"],"12.916666666666666","-"],["1988","only","-","Nov","26",["11","47","20","s"],"12.666666666666666","-"],["1988","only","-","Nov","27",["11","47","40","s"],"12.333333333333334","-"],["1988","only","-","Nov","28",["11","48","0","s"],"12","-"],["1988","only","-","Nov","29",["11","48","25","s"],"11.583333333333334","-"],["1988","only","-","Nov","30",["11","48","45","s"],"11.25","-"],["1988","only","-","Dec","1",["11","49","5","s"],"10.916666666666666","-"],["1988","only","-","Dec","2",["11","49","30","s"],"10.5","-"],["1988","only","-","Dec","3",["11","49","55","s"],"10.083333333333334","-"],["1988","only","-","Dec","4",["11","50","15","s"],"9.75","-"],["1988","only","-","Dec","5",["11","50","40","s"],"9.333333333333334","-"],["1988","only","-","Dec","6",["11","51","5","s"],"8.916666666666666","-"],["1988","only","-","Dec","7",["11","51","35","s"],"8.416666666666666","-"],["1988","only","-","Dec","8",["11","52","0","s"],"8","-"],["1988","only","-","Dec","9",["11","52","25","s"],"7.583333333333333","-"],["1988","only","-","Dec","10",["11","52","55","s"],"7.083333333333333","-"],["1988","only","-","Dec","11",["11","53","20","s"],"6.666666666666667","-"],["1988","only","-","Dec","12",["11","53","50","s"],"6.166666666666667","-"],["1988","only","-","Dec","13",["11","54","15","s"],"5.75","-"],["1988","only","-","Dec","14",["11","54","45","s"],"5.25","-"],["1988","only","-","Dec","15",["11","55","15","s"],"4.75","-"],["1988","only","-","Dec","16",["11","55","45","s"],"4.25","-"],["1988","only","-","Dec","17",["11","56","15","s"],"3.75","-"],["1988","only","-","Dec","18",["11","56","40","s"],"3.3333333333333335","-"],["1988","only","-","Dec","19",["11","57","10","s"],"2.8333333333333335","-"],["1988","only","-","Dec","20",["11","57","40","s"],"2.3333333333333335","-"],["1988","only","-","Dec","21",["11","58","10","s"],"1.8333333333333333","-"],["1988","only","-","Dec","22",["11","58","40","s"],"1.3333333333333333","-"],["1988","only","-","Dec","23",["11","59","10","s"],"0.8333333333333334","-"],["1988","only","-","Dec","24",["11","59","40","s"],"0.3333333333333333","-"],["1988","only","-","Dec","25",["12","0","10","s"],"-0.16666666666666666","-"],["1988","only","-","Dec","26",["12","0","40","s"],"-0.6666666666666666","-"],["1988","only","-","Dec","27",["12","1","10","s"],"-1.1666666666666667","-"],["1988","only","-","Dec","28",["12","1","40","s"],"-1.6666666666666667","-"],["1988","only","-","Dec","29",["12","2","10","s"],"-2.1666666666666665","-"],["1988","only","-","Dec","30",["12","2","35","s"],"-2.5833333333333335","-"],["1988","only","-","Dec","31",["12","3","5","s"],"-3.0833333333333335","-"]],"sol89":[["1989","only","-","Jan","1",["12","3","35","s"],"-3.5833333333333335","-"],["1989","only","-","Jan","2",["12","4","5","s"],"-4.083333333333334","-"],["1989","only","-","Jan","3",["12","4","30","s"],"-4.5","-"],["1989","only","-","Jan","4",["12","5","0","s"],"-5","-"],["1989","only","-","Jan","5",["12","5","25","s"],"-5.416666666666667","-"],["1989","only","-","Jan","6",["12","5","50","s"],"-5.833333333333333","-"],["1989","only","-","Jan","7",["12","6","15","s"],"-6.25","-"],["1989","only","-","Jan","8",["12","6","45","s"],"-6.75","-"],["1989","only","-","Jan","9",["12","7","10","s"],"-7.166666666666667","-"],["1989","only","-","Jan","10",["12","7","35","s"],"-7.583333333333333","-"],["1989","only","-","Jan","11",["12","7","55","s"],"-7.916666666666667","-"],["1989","only","-","Jan","12",["12","8","20","s"],"-8.333333333333334","-"],["1989","only","-","Jan","13",["12","8","45","s"],"-8.75","-"],["1989","only","-","Jan","14",["12","9","5","s"],"-9.083333333333334","-"],["1989","only","-","Jan","15",["12","9","25","s"],"-9.416666666666666","-"],["1989","only","-","Jan","16",["12","9","45","s"],"-9.75","-"],["1989","only","-","Jan","17",["12","10","5","s"],"-10.083333333333334","-"],["1989","only","-","Jan","18",["12","10","25","s"],"-10.416666666666666","-"],["1989","only","-","Jan","19",["12","10","45","s"],"-10.75","-"],["1989","only","-","Jan","20",["12","11","5","s"],"-11.083333333333334","-"],["1989","only","-","Jan","21",["12","11","20","s"],"-11.333333333333334","-"],["1989","only","-","Jan","22",["12","11","35","s"],"-11.583333333333334","-"],["1989","only","-","Jan","23",["12","11","55","s"],"-11.916666666666666","-"],["1989","only","-","Jan","24",["12","12","10","s"],"-12.166666666666666","-"],["1989","only","-","Jan","25",["12","12","20","s"],"-12.333333333333334","-"],["1989","only","-","Jan","26",["12","12","35","s"],"-12.583333333333334","-"],["1989","only","-","Jan","27",["12","12","50","s"],"-12.833333333333334","-"],["1989","only","-","Jan","28",["12","13","0","s"],"-13","-"],["1989","only","-","Jan","29",["12","13","10","s"],"-13.166666666666666","-"],["1989","only","-","Jan","30",["12","13","20","s"],"-13.333333333333334","-"],["1989","only","-","Jan","31",["12","13","30","s"],"-13.5","-"],["1989","only","-","Feb","1",["12","13","40","s"],"-13.666666666666666","-"],["1989","only","-","Feb","2",["12","13","45","s"],"-13.75","-"],["1989","only","-","Feb","3",["12","13","55","s"],"-13.916666666666666","-"],["1989","only","-","Feb","4",["12","14","0","s"],"-14","-"],["1989","only","-","Feb","5",["12","14","5","s"],"-14.083333333333334","-"],["1989","only","-","Feb","6",["12","14","10","s"],"-14.166666666666666","-"],["1989","only","-","Feb","7",["12","14","10","s"],"-14.166666666666666","-"],["1989","only","-","Feb","8",["12","14","15","s"],"-14.25","-"],["1989","only","-","Feb","9",["12","14","15","s"],"-14.25","-"],["1989","only","-","Feb","10",["12","14","20","s"],"-14.333333333333334","-"],["1989","only","-","Feb","11",["12","14","20","s"],"-14.333333333333334","-"],["1989","only","-","Feb","12",["12","14","20","s"],"-14.333333333333334","-"],["1989","only","-","Feb","13",["12","14","15","s"],"-14.25","-"],["1989","only","-","Feb","14",["12","14","15","s"],"-14.25","-"],["1989","only","-","Feb","15",["12","14","10","s"],"-14.166666666666666","-"],["1989","only","-","Feb","16",["12","14","10","s"],"-14.166666666666666","-"],["1989","only","-","Feb","17",["12","14","5","s"],"-14.083333333333334","-"],["1989","only","-","Feb","18",["12","14","0","s"],"-14","-"],["1989","only","-","Feb","19",["12","13","55","s"],"-13.916666666666666","-"],["1989","only","-","Feb","20",["12","13","50","s"],"-13.833333333333334","-"],["1989","only","-","Feb","21",["12","13","40","s"],"-13.666666666666666","-"],["1989","only","-","Feb","22",["12","13","35","s"],"-13.583333333333334","-"],["1989","only","-","Feb","23",["12","13","25","s"],"-13.416666666666666","-"],["1989","only","-","Feb","24",["12","13","15","s"],"-13.25","-"],["1989","only","-","Feb","25",["12","13","5","s"],"-13.083333333333334","-"],["1989","only","-","Feb","26",["12","12","55","s"],"-12.916666666666666","-"],["1989","only","-","Feb","27",["12","12","45","s"],"-12.75","-"],["1989","only","-","Feb","28",["12","12","35","s"],"-12.583333333333334","-"],["1989","only","-","Mar","1",["12","12","25","s"],"-12.416666666666666","-"],["1989","only","-","Mar","2",["12","12","10","s"],"-12.166666666666666","-"],["1989","only","-","Mar","3",["12","12","0","s"],"-12","-"],["1989","only","-","Mar","4",["12","11","45","s"],"-11.75","-"],["1989","only","-","Mar","5",["12","11","35","s"],"-11.583333333333334","-"],["1989","only","-","Mar","6",["12","11","20","s"],"-11.333333333333334","-"],["1989","only","-","Mar","7",["12","11","5","s"],"-11.083333333333334","-"],["1989","only","-","Mar","8",["12","10","50","s"],"-10.833333333333334","-"],["1989","only","-","Mar","9",["12","10","35","s"],"-10.583333333333334","-"],["1989","only","-","Mar","10",["12","10","20","s"],"-10.333333333333334","-"],["1989","only","-","Mar","11",["12","10","5","s"],"-10.083333333333334","-"],["1989","only","-","Mar","12",["12","9","50","s"],"-9.833333333333334","-"],["1989","only","-","Mar","13",["12","9","30","s"],"-9.5","-"],["1989","only","-","Mar","14",["12","9","15","s"],"-9.25","-"],["1989","only","-","Mar","15",["12","9","0","s"],"-9","-"],["1989","only","-","Mar","16",["12","8","40","s"],"-8.666666666666666","-"],["1989","only","-","Mar","17",["12","8","25","s"],"-8.416666666666666","-"],["1989","only","-","Mar","18",["12","8","5","s"],"-8.083333333333332","-"],["1989","only","-","Mar","19",["12","7","50","s"],"-7.833333333333333","-"],["1989","only","-","Mar","20",["12","7","30","s"],"-7.5","-"],["1989","only","-","Mar","21",["12","7","15","s"],"-7.25","-"],["1989","only","-","Mar","22",["12","6","55","s"],"-6.916666666666667","-"],["1989","only","-","Mar","23",["12","6","35","s"],"-6.583333333333333","-"],["1989","only","-","Mar","24",["12","6","20","s"],"-6.333333333333333","-"],["1989","only","-","Mar","25",["12","6","0","s"],"-6","-"],["1989","only","-","Mar","26",["12","5","40","s"],"-5.666666666666667","-"],["1989","only","-","Mar","27",["12","5","25","s"],"-5.416666666666667","-"],["1989","only","-","Mar","28",["12","5","5","s"],"-5.083333333333333","-"],["1989","only","-","Mar","29",["12","4","50","s"],"-4.833333333333333","-"],["1989","only","-","Mar","30",["12","4","30","s"],"-4.5","-"],["1989","only","-","Mar","31",["12","4","10","s"],"-4.166666666666667","-"],["1989","only","-","Apr","1",["12","3","55","s"],"-3.9166666666666665","-"],["1989","only","-","Apr","2",["12","3","35","s"],"-3.5833333333333335","-"],["1989","only","-","Apr","3",["12","3","20","s"],"-3.3333333333333335","-"],["1989","only","-","Apr","4",["12","3","0","s"],"-3","-"],["1989","only","-","Apr","5",["12","2","45","s"],"-2.75","-"],["1989","only","-","Apr","6",["12","2","25","s"],"-2.4166666666666665","-"],["1989","only","-","Apr","7",["12","2","10","s"],"-2.1666666666666665","-"],["1989","only","-","Apr","8",["12","1","50","s"],"-1.8333333333333333","-"],["1989","only","-","Apr","9",["12","1","35","s"],"-1.5833333333333333","-"],["1989","only","-","Apr","10",["12","1","20","s"],"-1.3333333333333333","-"],["1989","only","-","Apr","11",["12","1","5","s"],"-1.0833333333333333","-"],["1989","only","-","Apr","12",["12","0","50","s"],"-0.8333333333333334","-"],["1989","only","-","Apr","13",["12","0","35","s"],"-0.5833333333333334","-"],["1989","only","-","Apr","14",["12","0","20","s"],"-0.3333333333333333","-"],["1989","only","-","Apr","15",["12","0","5","s"],"-0.08333333333333333","-"],["1989","only","-","Apr","16",["11","59","50","s"],"0.16666666666666666","-"],["1989","only","-","Apr","17",["11","59","35","s"],"0.4166666666666667","-"],["1989","only","-","Apr","18",["11","59","20","s"],"0.6666666666666666","-"],["1989","only","-","Apr","19",["11","59","10","s"],"0.8333333333333334","-"],["1989","only","-","Apr","20",["11","58","55","s"],"1.0833333333333333","-"],["1989","only","-","Apr","21",["11","58","45","s"],"1.25","-"],["1989","only","-","Apr","22",["11","58","30","s"],"1.5","-"],["1989","only","-","Apr","23",["11","58","20","s"],"1.6666666666666667","-"],["1989","only","-","Apr","24",["11","58","10","s"],"1.8333333333333333","-"],["1989","only","-","Apr","25",["11","58","0","s"],"2","-"],["1989","only","-","Apr","26",["11","57","50","s"],"2.1666666666666665","-"],["1989","only","-","Apr","27",["11","57","40","s"],"2.3333333333333335","-"],["1989","only","-","Apr","28",["11","57","30","s"],"2.5","-"],["1989","only","-","Apr","29",["11","57","20","s"],"2.6666666666666665","-"],["1989","only","-","Apr","30",["11","57","15","s"],"2.75","-"],["1989","only","-","May","1",["11","57","5","s"],"2.9166666666666665","-"],["1989","only","-","May","2",["11","57","0","s"],"3","-"],["1989","only","-","May","3",["11","56","50","s"],"3.1666666666666665","-"],["1989","only","-","May","4",["11","56","45","s"],"3.25","-"],["1989","only","-","May","5",["11","56","40","s"],"3.3333333333333335","-"],["1989","only","-","May","6",["11","56","35","s"],"3.4166666666666665","-"],["1989","only","-","May","7",["11","56","30","s"],"3.5","-"],["1989","only","-","May","8",["11","56","30","s"],"3.5","-"],["1989","only","-","May","9",["11","56","25","s"],"3.5833333333333335","-"],["1989","only","-","May","10",["11","56","25","s"],"3.5833333333333335","-"],["1989","only","-","May","11",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","12",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","13",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","14",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","15",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","16",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","17",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","May","18",["11","56","25","s"],"3.5833333333333335","-"],["1989","only","-","May","19",["11","56","25","s"],"3.5833333333333335","-"],["1989","only","-","May","20",["11","56","30","s"],"3.5","-"],["1989","only","-","May","21",["11","56","35","s"],"3.4166666666666665","-"],["1989","only","-","May","22",["11","56","35","s"],"3.4166666666666665","-"],["1989","only","-","May","23",["11","56","40","s"],"3.3333333333333335","-"],["1989","only","-","May","24",["11","56","45","s"],"3.25","-"],["1989","only","-","May","25",["11","56","55","s"],"3.0833333333333335","-"],["1989","only","-","May","26",["11","57","0","s"],"3","-"],["1989","only","-","May","27",["11","57","5","s"],"2.9166666666666665","-"],["1989","only","-","May","28",["11","57","15","s"],"2.75","-"],["1989","only","-","May","29",["11","57","20","s"],"2.6666666666666665","-"],["1989","only","-","May","30",["11","57","30","s"],"2.5","-"],["1989","only","-","May","31",["11","57","35","s"],"2.4166666666666665","-"],["1989","only","-","Jun","1",["11","57","45","s"],"2.25","-"],["1989","only","-","Jun","2",["11","57","55","s"],"2.0833333333333335","-"],["1989","only","-","Jun","3",["11","58","5","s"],"1.9166666666666667","-"],["1989","only","-","Jun","4",["11","58","15","s"],"1.75","-"],["1989","only","-","Jun","5",["11","58","25","s"],"1.5833333333333333","-"],["1989","only","-","Jun","6",["11","58","35","s"],"1.4166666666666667","-"],["1989","only","-","Jun","7",["11","58","45","s"],"1.25","-"],["1989","only","-","Jun","8",["11","59","0","s"],"1","-"],["1989","only","-","Jun","9",["11","59","10","s"],"0.8333333333333334","-"],["1989","only","-","Jun","10",["11","59","20","s"],"0.6666666666666666","-"],["1989","only","-","Jun","11",["11","59","35","s"],"0.4166666666666667","-"],["1989","only","-","Jun","12",["11","59","45","s"],"0.25","-"],["1989","only","-","Jun","13",["12","0","0","s"],"0","-"],["1989","only","-","Jun","14",["12","0","10","s"],"-0.16666666666666666","-"],["1989","only","-","Jun","15",["12","0","25","s"],"-0.4166666666666667","-"],["1989","only","-","Jun","16",["12","0","35","s"],"-0.5833333333333334","-"],["1989","only","-","Jun","17",["12","0","50","s"],"-0.8333333333333334","-"],["1989","only","-","Jun","18",["12","1","5","s"],"-1.0833333333333333","-"],["1989","only","-","Jun","19",["12","1","15","s"],"-1.25","-"],["1989","only","-","Jun","20",["12","1","30","s"],"-1.5","-"],["1989","only","-","Jun","21",["12","1","40","s"],"-1.6666666666666667","-"],["1989","only","-","Jun","22",["12","1","55","s"],"-1.9166666666666667","-"],["1989","only","-","Jun","23",["12","2","10","s"],"-2.1666666666666665","-"],["1989","only","-","Jun","24",["12","2","20","s"],"-2.3333333333333335","-"],["1989","only","-","Jun","25",["12","2","35","s"],"-2.5833333333333335","-"],["1989","only","-","Jun","26",["12","2","45","s"],"-2.75","-"],["1989","only","-","Jun","27",["12","3","0","s"],"-3","-"],["1989","only","-","Jun","28",["12","3","10","s"],"-3.1666666666666665","-"],["1989","only","-","Jun","29",["12","3","25","s"],"-3.4166666666666665","-"],["1989","only","-","Jun","30",["12","3","35","s"],"-3.5833333333333335","-"],["1989","only","-","Jul","1",["12","3","45","s"],"-3.75","-"],["1989","only","-","Jul","2",["12","4","0","s"],"-4","-"],["1989","only","-","Jul","3",["12","4","10","s"],"-4.166666666666667","-"],["1989","only","-","Jul","4",["12","4","20","s"],"-4.333333333333333","-"],["1989","only","-","Jul","5",["12","4","30","s"],"-4.5","-"],["1989","only","-","Jul","6",["12","4","40","s"],"-4.666666666666667","-"],["1989","only","-","Jul","7",["12","4","50","s"],"-4.833333333333333","-"],["1989","only","-","Jul","8",["12","5","0","s"],"-5","-"],["1989","only","-","Jul","9",["12","5","10","s"],"-5.166666666666667","-"],["1989","only","-","Jul","10",["12","5","20","s"],"-5.333333333333333","-"],["1989","only","-","Jul","11",["12","5","25","s"],"-5.416666666666667","-"],["1989","only","-","Jul","12",["12","5","35","s"],"-5.583333333333333","-"],["1989","only","-","Jul","13",["12","5","40","s"],"-5.666666666666667","-"],["1989","only","-","Jul","14",["12","5","50","s"],"-5.833333333333333","-"],["1989","only","-","Jul","15",["12","5","55","s"],"-5.916666666666667","-"],["1989","only","-","Jul","16",["12","6","0","s"],"-6","-"],["1989","only","-","Jul","17",["12","6","5","s"],"-6.083333333333333","-"],["1989","only","-","Jul","18",["12","6","10","s"],"-6.166666666666667","-"],["1989","only","-","Jul","19",["12","6","15","s"],"-6.25","-"],["1989","only","-","Jul","20",["12","6","20","s"],"-6.333333333333333","-"],["1989","only","-","Jul","21",["12","6","20","s"],"-6.333333333333333","-"],["1989","only","-","Jul","22",["12","6","25","s"],"-6.416666666666667","-"],["1989","only","-","Jul","23",["12","6","25","s"],"-6.416666666666667","-"],["1989","only","-","Jul","24",["12","6","30","s"],"-6.5","-"],["1989","only","-","Jul","25",["12","6","30","s"],"-6.5","-"],["1989","only","-","Jul","26",["12","6","30","s"],"-6.5","-"],["1989","only","-","Jul","27",["12","6","30","s"],"-6.5","-"],["1989","only","-","Jul","28",["12","6","30","s"],"-6.5","-"],["1989","only","-","Jul","29",["12","6","25","s"],"-6.416666666666667","-"],["1989","only","-","Jul","30",["12","6","25","s"],"-6.416666666666667","-"],["1989","only","-","Jul","31",["12","6","20","s"],"-6.333333333333333","-"],["1989","only","-","Aug","1",["12","6","20","s"],"-6.333333333333333","-"],["1989","only","-","Aug","2",["12","6","15","s"],"-6.25","-"],["1989","only","-","Aug","3",["12","6","10","s"],"-6.166666666666667","-"],["1989","only","-","Aug","4",["12","6","5","s"],"-6.083333333333333","-"],["1989","only","-","Aug","5",["12","6","0","s"],"-6","-"],["1989","only","-","Aug","6",["12","5","50","s"],"-5.833333333333333","-"],["1989","only","-","Aug","7",["12","5","45","s"],"-5.75","-"],["1989","only","-","Aug","8",["12","5","35","s"],"-5.583333333333333","-"],["1989","only","-","Aug","9",["12","5","30","s"],"-5.5","-"],["1989","only","-","Aug","10",["12","5","20","s"],"-5.333333333333333","-"],["1989","only","-","Aug","11",["12","5","10","s"],"-5.166666666666667","-"],["1989","only","-","Aug","12",["12","5","0","s"],"-5","-"],["1989","only","-","Aug","13",["12","4","50","s"],"-4.833333333333333","-"],["1989","only","-","Aug","14",["12","4","40","s"],"-4.666666666666667","-"],["1989","only","-","Aug","15",["12","4","30","s"],"-4.5","-"],["1989","only","-","Aug","16",["12","4","15","s"],"-4.25","-"],["1989","only","-","Aug","17",["12","4","5","s"],"-4.083333333333334","-"],["1989","only","-","Aug","18",["12","3","50","s"],"-3.8333333333333335","-"],["1989","only","-","Aug","19",["12","3","35","s"],"-3.5833333333333335","-"],["1989","only","-","Aug","20",["12","3","25","s"],"-3.4166666666666665","-"],["1989","only","-","Aug","21",["12","3","10","s"],"-3.1666666666666665","-"],["1989","only","-","Aug","22",["12","2","55","s"],"-2.9166666666666665","-"],["1989","only","-","Aug","23",["12","2","40","s"],"-2.6666666666666665","-"],["1989","only","-","Aug","24",["12","2","20","s"],"-2.3333333333333335","-"],["1989","only","-","Aug","25",["12","2","5","s"],"-2.0833333333333335","-"],["1989","only","-","Aug","26",["12","1","50","s"],"-1.8333333333333333","-"],["1989","only","-","Aug","27",["12","1","30","s"],"-1.5","-"],["1989","only","-","Aug","28",["12","1","15","s"],"-1.25","-"],["1989","only","-","Aug","29",["12","0","55","s"],"-0.9166666666666666","-"],["1989","only","-","Aug","30",["12","0","40","s"],"-0.6666666666666666","-"],["1989","only","-","Aug","31",["12","0","20","s"],"-0.3333333333333333","-"],["1989","only","-","Sep","1",["12","0","0","s"],"0","-"],["1989","only","-","Sep","2",["11","59","45","s"],"0.25","-"],["1989","only","-","Sep","3",["11","59","25","s"],"0.5833333333333334","-"],["1989","only","-","Sep","4",["11","59","5","s"],"0.9166666666666666","-"],["1989","only","-","Sep","5",["11","58","45","s"],"1.25","-"],["1989","only","-","Sep","6",["11","58","25","s"],"1.5833333333333333","-"],["1989","only","-","Sep","7",["11","58","5","s"],"1.9166666666666667","-"],["1989","only","-","Sep","8",["11","57","45","s"],"2.25","-"],["1989","only","-","Sep","9",["11","57","20","s"],"2.6666666666666665","-"],["1989","only","-","Sep","10",["11","57","0","s"],"3","-"],["1989","only","-","Sep","11",["11","56","40","s"],"3.3333333333333335","-"],["1989","only","-","Sep","12",["11","56","20","s"],"3.6666666666666665","-"],["1989","only","-","Sep","13",["11","56","0","s"],"4","-"],["1989","only","-","Sep","14",["11","55","35","s"],"4.416666666666667","-"],["1989","only","-","Sep","15",["11","55","15","s"],"4.75","-"],["1989","only","-","Sep","16",["11","54","55","s"],"5.083333333333333","-"],["1989","only","-","Sep","17",["11","54","35","s"],"5.416666666666667","-"],["1989","only","-","Sep","18",["11","54","10","s"],"5.833333333333333","-"],["1989","only","-","Sep","19",["11","53","50","s"],"6.166666666666667","-"],["1989","only","-","Sep","20",["11","53","30","s"],"6.5","-"],["1989","only","-","Sep","21",["11","53","10","s"],"6.833333333333333","-"],["1989","only","-","Sep","22",["11","52","45","s"],"7.25","-"],["1989","only","-","Sep","23",["11","52","25","s"],"7.583333333333333","-"],["1989","only","-","Sep","24",["11","52","5","s"],"7.916666666666667","-"],["1989","only","-","Sep","25",["11","51","45","s"],"8.25","-"],["1989","only","-","Sep","26",["11","51","25","s"],"8.583333333333334","-"],["1989","only","-","Sep","27",["11","51","5","s"],"8.916666666666666","-"],["1989","only","-","Sep","28",["11","50","40","s"],"9.333333333333334","-"],["1989","only","-","Sep","29",["11","50","20","s"],"9.666666666666666","-"],["1989","only","-","Sep","30",["11","50","0","s"],"10","-"],["1989","only","-","Oct","1",["11","49","45","s"],"10.25","-"],["1989","only","-","Oct","2",["11","49","25","s"],"10.583333333333334","-"],["1989","only","-","Oct","3",["11","49","5","s"],"10.916666666666666","-"],["1989","only","-","Oct","4",["11","48","45","s"],"11.25","-"],["1989","only","-","Oct","5",["11","48","30","s"],"11.5","-"],["1989","only","-","Oct","6",["11","48","10","s"],"11.833333333333334","-"],["1989","only","-","Oct","7",["11","47","50","s"],"12.166666666666666","-"],["1989","only","-","Oct","8",["11","47","35","s"],"12.416666666666666","-"],["1989","only","-","Oct","9",["11","47","20","s"],"12.666666666666666","-"],["1989","only","-","Oct","10",["11","47","0","s"],"13","-"],["1989","only","-","Oct","11",["11","46","45","s"],"13.25","-"],["1989","only","-","Oct","12",["11","46","30","s"],"13.5","-"],["1989","only","-","Oct","13",["11","46","15","s"],"13.75","-"],["1989","only","-","Oct","14",["11","46","0","s"],"14","-"],["1989","only","-","Oct","15",["11","45","50","s"],"14.166666666666666","-"],["1989","only","-","Oct","16",["11","45","35","s"],"14.416666666666666","-"],["1989","only","-","Oct","17",["11","45","20","s"],"14.666666666666666","-"],["1989","only","-","Oct","18",["11","45","10","s"],"14.833333333333334","-"],["1989","only","-","Oct","19",["11","45","0","s"],"15","-"],["1989","only","-","Oct","20",["11","44","50","s"],"15.166666666666666","-"],["1989","only","-","Oct","21",["11","44","40","s"],"15.333333333333334","-"],["1989","only","-","Oct","22",["11","44","30","s"],"15.5","-"],["1989","only","-","Oct","23",["11","44","20","s"],"15.666666666666666","-"],["1989","only","-","Oct","24",["11","44","10","s"],"15.833333333333334","-"],["1989","only","-","Oct","25",["11","44","5","s"],"15.916666666666666","-"],["1989","only","-","Oct","26",["11","44","0","s"],"16","-"],["1989","only","-","Oct","27",["11","43","50","s"],"16.166666666666664","-"],["1989","only","-","Oct","28",["11","43","45","s"],"16.25","-"],["1989","only","-","Oct","29",["11","43","40","s"],"16.333333333333336","-"],["1989","only","-","Oct","30",["11","43","40","s"],"16.333333333333336","-"],["1989","only","-","Oct","31",["11","43","35","s"],"16.416666666666668","-"],["1989","only","-","Nov","1",["11","43","35","s"],"16.416666666666668","-"],["1989","only","-","Nov","2",["11","43","35","s"],"16.416666666666668","-"],["1989","only","-","Nov","3",["11","43","30","s"],"16.5","-"],["1989","only","-","Nov","4",["11","43","35","s"],"16.416666666666668","-"],["1989","only","-","Nov","5",["11","43","35","s"],"16.416666666666668","-"],["1989","only","-","Nov","6",["11","43","35","s"],"16.416666666666668","-"],["1989","only","-","Nov","7",["11","43","40","s"],"16.333333333333336","-"],["1989","only","-","Nov","8",["11","43","45","s"],"16.25","-"],["1989","only","-","Nov","9",["11","43","50","s"],"16.166666666666664","-"],["1989","only","-","Nov","10",["11","43","55","s"],"16.083333333333336","-"],["1989","only","-","Nov","11",["11","44","0","s"],"16","-"],["1989","only","-","Nov","12",["11","44","5","s"],"15.916666666666666","-"],["1989","only","-","Nov","13",["11","44","15","s"],"15.75","-"],["1989","only","-","Nov","14",["11","44","25","s"],"15.583333333333334","-"],["1989","only","-","Nov","15",["11","44","35","s"],"15.416666666666666","-"],["1989","only","-","Nov","16",["11","44","45","s"],"15.25","-"],["1989","only","-","Nov","17",["11","44","55","s"],"15.083333333333334","-"],["1989","only","-","Nov","18",["11","45","10","s"],"14.833333333333334","-"],["1989","only","-","Nov","19",["11","45","20","s"],"14.666666666666666","-"],["1989","only","-","Nov","20",["11","45","35","s"],"14.416666666666666","-"],["1989","only","-","Nov","21",["11","45","50","s"],"14.166666666666666","-"],["1989","only","-","Nov","22",["11","46","5","s"],"13.916666666666666","-"],["1989","only","-","Nov","23",["11","46","25","s"],"13.583333333333334","-"],["1989","only","-","Nov","24",["11","46","40","s"],"13.333333333333334","-"],["1989","only","-","Nov","25",["11","47","0","s"],"13","-"],["1989","only","-","Nov","26",["11","47","20","s"],"12.666666666666666","-"],["1989","only","-","Nov","27",["11","47","35","s"],"12.416666666666666","-"],["1989","only","-","Nov","28",["11","47","55","s"],"12.083333333333334","-"],["1989","only","-","Nov","29",["11","48","20","s"],"11.666666666666666","-"],["1989","only","-","Nov","30",["11","48","40","s"],"11.333333333333334","-"],["1989","only","-","Dec","1",["11","49","0","s"],"11","-"],["1989","only","-","Dec","2",["11","49","25","s"],"10.583333333333334","-"],["1989","only","-","Dec","3",["11","49","50","s"],"10.166666666666666","-"],["1989","only","-","Dec","4",["11","50","15","s"],"9.75","-"],["1989","only","-","Dec","5",["11","50","35","s"],"9.416666666666666","-"],["1989","only","-","Dec","6",["11","51","0","s"],"9","-"],["1989","only","-","Dec","7",["11","51","30","s"],"8.5","-"],["1989","only","-","Dec","8",["11","51","55","s"],"8.083333333333332","-"],["1989","only","-","Dec","9",["11","52","20","s"],"7.666666666666667","-"],["1989","only","-","Dec","10",["11","52","50","s"],"7.166666666666667","-"],["1989","only","-","Dec","11",["11","53","15","s"],"6.75","-"],["1989","only","-","Dec","12",["11","53","45","s"],"6.25","-"],["1989","only","-","Dec","13",["11","54","10","s"],"5.833333333333333","-"],["1989","only","-","Dec","14",["11","54","40","s"],"5.333333333333333","-"],["1989","only","-","Dec","15",["11","55","10","s"],"4.833333333333333","-"],["1989","only","-","Dec","16",["11","55","40","s"],"4.333333333333333","-"],["1989","only","-","Dec","17",["11","56","5","s"],"3.9166666666666665","-"],["1989","only","-","Dec","18",["11","56","35","s"],"3.4166666666666665","-"],["1989","only","-","Dec","19",["11","57","5","s"],"2.9166666666666665","-"],["1989","only","-","Dec","20",["11","57","35","s"],"2.4166666666666665","-"],["1989","only","-","Dec","21",["11","58","5","s"],"1.9166666666666667","-"],["1989","only","-","Dec","22",["11","58","35","s"],"1.4166666666666667","-"],["1989","only","-","Dec","23",["11","59","5","s"],"0.9166666666666666","-"],["1989","only","-","Dec","24",["11","59","35","s"],"0.4166666666666667","-"],["1989","only","-","Dec","25",["12","0","5","s"],"-0.08333333333333333","-"],["1989","only","-","Dec","26",["12","0","35","s"],"-0.5833333333333334","-"],["1989","only","-","Dec","27",["12","1","5","s"],"-1.0833333333333333","-"],["1989","only","-","Dec","28",["12","1","35","s"],"-1.5833333333333333","-"],["1989","only","-","Dec","29",["12","2","0","s"],"-2","-"],["1989","only","-","Dec","30",["12","2","30","s"],"-2.5","-"],["1989","only","-","Dec","31",["12","3","0","s"],"-3","-"]],"Arg":[["1930","only","-","Dec","1",["0","0","0",null],"60","S"],["1931","only","-","Apr","1",["0","0","0",null],"0","-"],["1931","only","-","Oct","15",["0","0","0",null],"60","S"],["1932","1940","-","Mar","1",["0","0","0",null],"0","-"],["1932","1939","-","Nov","1",["0","0","0",null],"60","S"],["1940","only","-","Jul","1",["0","0","0",null],"60","S"],["1941","only","-","Jun","15",["0","0","0",null],"0","-"],["1941","only","-","Oct","15",["0","0","0",null],"60","S"],["1943","only","-","Aug","1",["0","0","0",null],"0","-"],["1943","only","-","Oct","15",["0","0","0",null],"60","S"],["1946","only","-","Mar","1",["0","0","0",null],"0","-"],["1946","only","-","Oct","1",["0","0","0",null],"60","S"],["1963","only","-","Oct","1",["0","0","0",null],"0","-"],["1963","only","-","Dec","15",["0","0","0",null],"60","S"],["1964","1966","-","Mar","1",["0","0","0",null],"0","-"],["1964","1966","-","Oct","15",["0","0","0",null],"60","S"],["1967","only","-","Apr","2",["0","0","0",null],"0","-"],["1967","1968","-","Oct","Sun>=1",["0","0","0",null],"60","S"],["1968","1969","-","Apr","Sun>=1",["0","0","0",null],"0","-"],["1974","only","-","Jan","23",["0","0","0",null],"60","S"],["1974","only","-","May","1",["0","0","0",null],"0","-"],["1988","only","-","Dec","1",["0","0","0",null],"60","S"],["1989","1993","-","Mar","Sun>=1",["0","0","0",null],"0","-"],["1989","1992","-","Oct","Sun>=15",["0","0","0",null],"60","S"],["1999","only","-","Oct","Sun>=1",["0","0","0",null],"60","S"],["2000","only","-","Mar","3",["0","0","0",null],"0","-"],["2007","only","-","Dec","30",["0","0","0",null],"60","S"],["2008","2009","-","Mar","Sun>=15",["0","0","0",null],"0","-"],["2008","only","-","Oct","Sun>=15",["0","0","0",null],"60","S"]],"SanLuis":[["2008","2009","-","Mar","Sun>=8",["0","0","0",null],"0","-"],["2007","2008","-","Oct","Sun>=8",["0","0","0",null],"60","S"]],"Brazil":[["1931","only","-","Oct","3",["11","0","0",null],"60","S"],["1932","1933","-","Apr","1",["0","0","0",null],"0","-"],["1932","only","-","Oct","3",["0","0","0",null],"60","S"],["1949","1952","-","Dec","1",["0","0","0",null],"60","S"],["1950","only","-","Apr","16",["1","0","0",null],"0","-"],["1951","1952","-","Apr","1",["0","0","0",null],"0","-"],["1953","only","-","Mar","1",["0","0","0",null],"0","-"],["1963","only","-","Dec","9",["0","0","0",null],"60","S"],["1964","only","-","Mar","1",["0","0","0",null],"0","-"],["1965","only","-","Jan","31",["0","0","0",null],"60","S"],["1965","only","-","Mar","31",["0","0","0",null],"0","-"],["1965","only","-","Dec","1",["0","0","0",null],"60","S"],["1966","1968","-","Mar","1",["0","0","0",null],"0","-"],["1966","1967","-","Nov","1",["0","0","0",null],"60","S"],["1985","only","-","Nov","2",["0","0","0",null],"60","S"],["1986","only","-","Mar","15",["0","0","0",null],"0","-"],["1986","only","-","Oct","25",["0","0","0",null],"60","S"],["1987","only","-","Feb","14",["0","0","0",null],"0","-"],["1987","only","-","Oct","25",["0","0","0",null],"60","S"],["1988","only","-","Feb","7",["0","0","0",null],"0","-"],["1988","only","-","Oct","16",["0","0","0",null],"60","S"],["1989","only","-","Jan","29",["0","0","0",null],"0","-"],["1989","only","-","Oct","15",["0","0","0",null],"60","S"],["1990","only","-","Feb","11",["0","0","0",null],"0","-"],["1990","only","-","Oct","21",["0","0","0",null],"60","S"],["1991","only","-","Feb","17",["0","0","0",null],"0","-"],["1991","only","-","Oct","20",["0","0","0",null],"60","S"],["1992","only","-","Feb","9",["0","0","0",null],"0","-"],["1992","only","-","Oct","25",["0","0","0",null],"60","S"],["1993","only","-","Jan","31",["0","0","0",null],"0","-"],["1993","1995","-","Oct","Sun>=11",["0","0","0",null],"60","S"],["1994","1995","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["1996","only","-","Feb","11",["0","0","0",null],"0","-"],["1996","only","-","Oct","6",["0","0","0",null],"60","S"],["1997","only","-","Feb","16",["0","0","0",null],"0","-"],["1997","only","-","Oct","6",["0","0","0",null],"60","S"],["1998","only","-","Mar","1",["0","0","0",null],"0","-"],["1998","only","-","Oct","11",["0","0","0",null],"60","S"],["1999","only","-","Feb","21",["0","0","0",null],"0","-"],["1999","only","-","Oct","3",["0","0","0",null],"60","S"],["2000","only","-","Feb","27",["0","0","0",null],"0","-"],["2000","2001","-","Oct","Sun>=8",["0","0","0",null],"60","S"],["2001","2006","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2002","only","-","Nov","3",["0","0","0",null],"60","S"],["2003","only","-","Oct","19",["0","0","0",null],"60","S"],["2004","only","-","Nov","2",["0","0","0",null],"60","S"],["2005","only","-","Oct","16",["0","0","0",null],"60","S"],["2006","only","-","Nov","5",["0","0","0",null],"60","S"],["2007","only","-","Feb","25",["0","0","0",null],"0","-"],["2007","only","-","Oct","Sun>=8",["0","0","0",null],"60","S"],["2008","max","-","Oct","Sun>=15",["0","0","0",null],"60","S"],["2008","2011","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2012","only","-","Feb","Sun>=22",["0","0","0",null],"0","-"],["2013","2014","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2015","only","-","Feb","Sun>=22",["0","0","0",null],"0","-"],["2016","2022","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2023","only","-","Feb","Sun>=22",["0","0","0",null],"0","-"],["2024","2025","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2026","only","-","Feb","Sun>=22",["0","0","0",null],"0","-"],["2027","2033","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2034","only","-","Feb","Sun>=22",["0","0","0",null],"0","-"],["2035","2036","-","Feb","Sun>=15",["0","0","0",null],"0","-"],["2037","only","-","Feb","Sun>=22",["0","0","0",null],"0","-"],["2038","max","-","Feb","Sun>=15",["0","0","0",null],"0","-"]],"Chile":[["1927","1932","-","Sep","1",["0","0","0",null],"60","S"],["1928","1932","-","Apr","1",["0","0","0",null],"0","-"],["1942","only","-","Jun","1",["4","0","0","u"],"0","-"],["1942","only","-","Aug","1",["5","0","0","u"],"60","S"],["1946","only","-","Jul","15",["4","0","0","u"],"60","S"],["1946","only","-","Sep","1",["3","0","0","u"],"0","-"],["1947","only","-","Apr","1",["4","0","0","u"],"0","-"],["1968","only","-","Nov","3",["4","0","0","u"],"60","S"],["1969","only","-","Mar","30",["3","0","0","u"],"0","-"],["1969","only","-","Nov","23",["4","0","0","u"],"60","S"],["1970","only","-","Mar","29",["3","0","0","u"],"0","-"],["1971","only","-","Mar","14",["3","0","0","u"],"0","-"],["1970","1972","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1972","1986","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1973","only","-","Sep","30",["4","0","0","u"],"60","S"],["1974","1987","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1987","only","-","Apr","12",["3","0","0","u"],"0","-"],["1988","1989","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1988","only","-","Oct","Sun>=1",["4","0","0","u"],"60","S"],["1989","only","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1990","only","-","Mar","18",["3","0","0","u"],"0","-"],["1990","only","-","Sep","16",["4","0","0","u"],"60","S"],["1991","1996","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1991","1997","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["1997","only","-","Mar","30",["3","0","0","u"],"0","-"],["1998","only","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["1998","only","-","Sep","27",["4","0","0","u"],"60","S"],["1999","only","-","Apr","4",["3","0","0","u"],"0","-"],["1999","2010","-","Oct","Sun>=9",["4","0","0","u"],"60","S"],["2000","2007","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["2008","only","-","Mar","30",["3","0","0","u"],"0","-"],["2009","only","-","Mar","Sun>=9",["3","0","0","u"],"0","-"],["2010","only","-","Apr","Sun>=1",["3","0","0","u"],"0","-"],["2011","only","-","May","Sun>=2",["3","0","0","u"],"0","-"],["2011","only","-","Aug","Sun>=16",["4","0","0","u"],"60","S"],["2012","max","-","Apr","Sun>=23",["3","0","0","u"],"0","-"],["2012","max","-","Sep","Sun>=2",["4","0","0","u"],"60","S"]],"CO":[["1992","only","-","May","3",["0","0","0",null],"60","S"],["1993","only","-","Apr","4",["0","0","0",null],"0","-"]],"Falk":[["1937","1938","-","Sep","lastSun",["0","0","0",null],"60","S"],["1938","1942","-","Mar","Sun>=19",["0","0","0",null],"0","-"],["1939","only","-","Oct","1",["0","0","0",null],"60","S"],["1940","1942","-","Sep","lastSun",["0","0","0",null],"60","S"],["1943","only","-","Jan","1",["0","0","0",null],"0","-"],["1983","only","-","Sep","lastSun",["0","0","0",null],"60","S"],["1984","1985","-","Apr","lastSun",["0","0","0",null],"0","-"],["1984","only","-","Sep","16",["0","0","0",null],"60","S"],["1985","2000","-","Sep","Sun>=9",["0","0","0",null],"60","S"],["1986","2000","-","Apr","Sun>=16",["0","0","0",null],"0","-"],["2001","2010","-","Apr","Sun>=15",["2","0","0",null],"0","-"],["2001","2010","-","Sep","Sun>=1",["2","0","0",null],"60","S"]],"Para":[["1975","1988","-","Oct","1",["0","0","0",null],"60","S"],["1975","1978","-","Mar","1",["0","0","0",null],"0","-"],["1979","1991","-","Apr","1",["0","0","0",null],"0","-"],["1989","only","-","Oct","22",["0","0","0",null],"60","S"],["1990","only","-","Oct","1",["0","0","0",null],"60","S"],["1991","only","-","Oct","6",["0","0","0",null],"60","S"],["1992","only","-","Mar","1",["0","0","0",null],"0","-"],["1992","only","-","Oct","5",["0","0","0",null],"60","S"],["1993","only","-","Mar","31",["0","0","0",null],"0","-"],["1993","1995","-","Oct","1",["0","0","0",null],"60","S"],["1994","1995","-","Feb","lastSun",["0","0","0",null],"0","-"],["1996","only","-","Mar","1",["0","0","0",null],"0","-"],["1996","2001","-","Oct","Sun>=1",["0","0","0",null],"60","S"],["1997","only","-","Feb","lastSun",["0","0","0",null],"0","-"],["1998","2001","-","Mar","Sun>=1",["0","0","0",null],"0","-"],["2002","2004","-","Apr","Sun>=1",["0","0","0",null],"0","-"],["2002","2003","-","Sep","Sun>=1",["0","0","0",null],"60","S"],["2004","2009","-","Oct","Sun>=15",["0","0","0",null],"60","S"],["2005","2009","-","Mar","Sun>=8",["0","0","0",null],"0","-"],["2010","max","-","Oct","Sun>=1",["0","0","0",null],"60","S"],["2010","2012","-","Apr","Sun>=8",["0","0","0",null],"0","-"],["2013","max","-","Mar","Sun>=22",["0","0","0",null],"0","-"]],"Peru":[["1938","only","-","Jan","1",["0","0","0",null],"60","S"],["1938","only","-","Apr","1",["0","0","0",null],"0","-"],["1938","1939","-","Sep","lastSun",["0","0","0",null],"60","S"],["1939","1940","-","Mar","Sun>=24",["0","0","0",null],"0","-"],["1986","1987","-","Jan","1",["0","0","0",null],"60","S"],["1986","1987","-","Apr","1",["0","0","0",null],"0","-"],["1990","only","-","Jan","1",["0","0","0",null],"60","S"],["1990","only","-","Apr","1",["0","0","0",null],"0","-"],["1994","only","-","Jan","1",["0","0","0",null],"60","S"],["1994","only","-","Apr","1",["0","0","0",null],"0","-"]],"Uruguay":[["1923","only","-","Oct","2",["0","0","0",null],"30","HS"],["1924","1926","-","Apr","1",["0","0","0",null],"0","-"],["1924","1925","-","Oct","1",["0","0","0",null],"30","HS"],["1933","1935","-","Oct","lastSun",["0","0","0",null],"30","HS"],["1934","1936","-","Mar","Sat>=25",["23","30","0","s"],"0","-"],["1936","only","-","Nov","1",["0","0","0",null],"30","HS"],["1937","1941","-","Mar","lastSun",["0","0","0",null],"0","-"],["1937","1940","-","Oct","lastSun",["0","0","0",null],"30","HS"],["1941","only","-","Aug","1",["0","0","0",null],"30","HS"],["1942","only","-","Jan","1",["0","0","0",null],"0","-"],["1942","only","-","Dec","14",["0","0","0",null],"60","S"],["1943","only","-","Mar","14",["0","0","0",null],"0","-"],["1959","only","-","May","24",["0","0","0",null],"60","S"],["1959","only","-","Nov","15",["0","0","0",null],"0","-"],["1960","only","-","Jan","17",["0","0","0",null],"60","S"],["1960","only","-","Mar","6",["0","0","0",null],"0","-"],["1965","1967","-","Apr","Sun>=1",["0","0","0",null],"60","S"],["1965","only","-","Sep","26",["0","0","0",null],"0","-"],["1966","1967","-","Oct","31",["0","0","0",null],"0","-"],["1968","1970","-","May","27",["0","0","0",null],"30","HS"],["1968","1970","-","Dec","2",["0","0","0",null],"0","-"],["1972","only","-","Apr","24",["0","0","0",null],"60","S"],["1972","only","-","Aug","15",["0","0","0",null],"0","-"],["1974","only","-","Mar","10",["0","0","0",null],"30","HS"],["1974","only","-","Dec","22",["0","0","0",null],"60","S"],["1976","only","-","Oct","1",["0","0","0",null],"0","-"],["1977","only","-","Dec","4",["0","0","0",null],"60","S"],["1978","only","-","Apr","1",["0","0","0",null],"0","-"],["1979","only","-","Oct","1",["0","0","0",null],"60","S"],["1980","only","-","May","1",["0","0","0",null],"0","-"],["1987","only","-","Dec","14",["0","0","0",null],"60","S"],["1988","only","-","Mar","14",["0","0","0",null],"0","-"],["1988","only","-","Dec","11",["0","0","0",null],"60","S"],["1989","only","-","Mar","12",["0","0","0",null],"0","-"],["1989","only","-","Oct","29",["0","0","0",null],"60","S"],["1990","1992","-","Mar","Sun>=1",["0","0","0",null],"0","-"],["1990","1991","-","Oct","Sun>=21",["0","0","0",null],"60","S"],["1992","only","-","Oct","18",["0","0","0",null],"60","S"],["1993","only","-","Feb","28",["0","0","0",null],"0","-"],["2004","only","-","Sep","19",["0","0","0",null],"60","S"],["2005","only","-","Mar","27",["2","0","0",null],"0","-"],["2005","only","-","Oct","9",["2","0","0",null],"60","S"],["2006","only","-","Mar","12",["2","0","0",null],"0","-"],["2006","max","-","Oct","Sun>=1",["2","0","0",null],"60","S"],["2007","max","-","Mar","Sun>=8",["2","0","0",null],"0","-"]],"SystemV":[["NaN","1973","-","Apr","lastSun",["2","0","0",null],"60","D"],["NaN","1973","-","Oct","lastSun",["2","0","0",null],"0","S"],["1974","only","-","Jan","6",["2","0","0",null],"60","D"],["1974","only","-","Nov","lastSun",["2","0","0",null],"0","S"],["1975","only","-","Feb","23",["2","0","0",null],"60","D"],["1975","only","-","Oct","lastSun",["2","0","0",null],"0","S"],["1976","max","-","Apr","lastSun",["2","0","0",null],"60","D"],["1976","max","-","Oct","lastSun",["2","0","0",null],"0","S"]]}}';
    tz.transport = function() {
      return json;
    };
    tz.loadZoneJSONData(null, true);
  }
  // On the server we load timezone data at the TIME\_ZONE\_DATA environment variable
  // or 'lib/vendor/tz.' We use a synchronous file load to avoid race conditions.
  else {
    tz.loadingScheme = tz.loadingSchemes.PRELOAD_ALL;
    tz.zoneFileBasePath = process.env.TIME_ZONE_DATA ||
      __dirname + '/../../lib/vendor/tz';
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

    // `nextDay` looks for the next instance of `day`, where day is something like
    // 'Monday.' You can set the start `date` for the search; otherwise it will use the
    // current time. `timezone` is required to ensure our determination of the day is
    // correct in the user's timezone.
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
      date = new timezonejs.Date(
        date.getFullYear(), date.getMonth(), date.getDate(), hour, timezone
      );
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

// # thehelp-core
// This file pulls in color, general, string and time for the client side.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)


define('thehelp-core',[
  'src/both/color',
  'src/both/general',
  'src/both/string',
  'src/both/time'
],
  function(
    color,
    general,
    string,
    time
  ) {

  

  return {
    color: color,
    general: general,
    string: string,
    time: time
  };

});

