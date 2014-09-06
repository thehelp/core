if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'lodash', 'thehelp-test', 'util', 'winston', 'thehelp-core'
], function(
  _, test, util, winston, core
) {

  'use strict';

  var expect = test.expect;

  describe('time', function() {
    var time = core.time;
    var old;

    beforeEach(function() {
      old = time.now;
    });

    afterEach(function() {
      time.now = old;
    });

    // Duration

    describe('#Duration', function() {
      it('can be constructed', function() {
        expect(function() {
          /*jshint nonew: false */
          new time.Duration();
        }).not.to['throw']();
      });

      it('construction sets start', function() {
        var duration = new time.Duration();

        expect(duration).to.have.property('start').that.exist;
        var now = time.now();
        var delta = now.getTime() - duration.start.getTime();
        expect(delta).to.be.lessThan(time.SECOND_IN_MIL);
      });

      it('renders on end', function() {
        var duration = new time.Duration();
        var result = duration.end();
        expect(result).to.exist;
      });

      it('can be ended with render = false', function() {
        var duration = new time.Duration();
        var result = duration.end(false);
        expect(result).to.be.a.number;
      });
    });

    // Date Formatting

    describe('#easyLong', function() {
      it('formats time in PST', function() {
        var now = new Date('2012-12-08T06:02:51.612Z');
        time.now = function() { return now; };

        expect(time.easyLong('US/Pacific')).to.equal('Friday Dec 7 at 10:02pm');
      });

      it('formats time in EST', function() {
        var now = new Date('2012-12-08T06:02:51.612Z');
        time.now = function() { return now; };

        expect(time.easyLong('US/Eastern')).to.equal('Saturday Dec 8 at 1:02am');
      });

      it('does not include the year if the current year is different', function() {
        var now = new Date('2013-12-08T06:02:51.612Z');
        time.now = function() { return now; };

        var date = new Date('2012-12-08T07:02:51.612Z');

        expect(time.easyLong('US/Eastern', date))
          .to.equal('Saturday Dec 8 2012 at 2:02am');
      });
    });

    describe('#shortDate', function() {
      it('formats date in PST', function() {
        var now = new Date('2012-01-31T08:01:19.621Z');
        time.now = function() { return now; };

        expect(time.shortDate('US/Pacific')).to.equal('Jan 31');
      });

      it('formats date in US/Hawaii', function() {
        var now = new Date('2012-01-31T08:01:19.621Z');
        time.now = function() { return now; };

        expect(time.shortDate('US/Hawaii')).to.equal('Jan 30');
      });

      it('does not include year if the current year is different', function() {
        var now = new Date('2013-01-31T08:01:19.621Z');
        time.now = function() { return now; };
        var date = new Date('2012-01-31T08:02:19.621Z');

        expect(time.shortDate('US/Hawaii', date)).to.equal('Jan 30 2012');
      });
    });

    describe('#dayOfWeek', function() {
      it('returns Monday in PST', function() {
        var now = new Date('2013-01-22T06:25:43.250Z');
        time.now = function() { return now; };

        expect(time.dayOfWeek('US/Pacific')).to.equal('Monday');
      });

      it('returns Sunday in GMT', function() {
        var now = new Date('2013-01-22T06:25:43.250Z');
        time.now = function() { return now; };

        expect(time.dayOfWeek('Europe/London')).to.equal('Tuesday');
      });
    });

    describe('#parse', function() {
      it('handles today', function() {
        time.now = function() { return 'blah'; };
        expect(time.parse('TodAy')).to.equal('blah');
      });

      it('handles tomorrow', function() {
        var date = new Date();
        time.now = function() { return date; };
        var tomorrow = new Date(date.getTime() + time.DAY_IN_MIL);
        expect(time.parse('tOmorRow').getTime()).to.equal(tomorrow.getTime());
      });

      it('handles yesterday', function() {
        var date = new Date();
        time.now = function() { return date; };
        var yesterday = new Date(date.getTime() - time.DAY_IN_MIL);
        expect(time.parse('YesTerday').getTime()).to.equal(yesterday.getTime());
      });

      it('returns null for invalid strings', function() {
        expect(time.parse('random')).to.be.null;
      });

      it('returns a native javascript object for a real parse', function() {
        expect(time.parse('2013-01-21')).to.have.property('getDay').that.exist;
      });

      it('handles today in a different time zone (doesn\'t modify time)', function() {
        var now = new Date('2013-01-31T08:01:00.000Z');
        var actual = time.parse('Today', 'Europe/London', now);
        expect(actual.getTime()).to.equal(now.getTime());
      });

      it('handles a date in a different time zone', function() {
        var expected = new Date('2013-01-31T00:00:00.000Z');
        var text = '2013-01-31T00:00:00';

        var actual = time.parse(text, 'Europe/London');
        expect(actual.getTime()).to.equal(expected.getTime());
      });
    });

    describe('#englishTimespan', function() {
      var now;

      beforeEach(function() {
        now = new Date();
        time.now = function() { return now; };
      });

      it('handles the future', function() {
        var mil = 1000;
        expect(time.englishTimespan(mil)).to.equal('1 second');
        mil = 1000 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 seconds');
        mil = 1000 * 6;
        expect(time.englishTimespan(mil)).to.equal('6 seconds');
        mil = 1000 * 30;
        expect(time.englishTimespan(mil)).to.equal('30 seconds');
        mil = 1000 * 59;
        expect(time.englishTimespan(mil)).to.equal('59 seconds');
      });

      it('handles now', function() {
        expect(time.englishTimespan(0)).to.equal('now');
        var mil = 900;
        expect(time.englishTimespan(mil)).to.equal('now');
      });

      it('handles up to 59 seconds', function() {
        var mil = 1000;
        expect(time.englishTimespan(mil)).to.equal('1 second');
        mil = 1000 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 seconds');
        mil = 1000 * 6;
        expect(time.englishTimespan(mil)).to.equal('6 seconds');
        mil = 1000 * 30;
        expect(time.englishTimespan(mil)).to.equal('30 seconds');
        mil = 1000 * 59;
        expect(time.englishTimespan(mil)).to.equal('59 seconds');
      });

      it('handles up to 60 minutes', function() {
        var mil = 1000 * 60;
        expect(time.englishTimespan(mil)).to.equal('1 minute');
        mil = 1000 * 60 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 minutes');
        mil = 1000 * 60 * 30;
        expect(time.englishTimespan(mil)).to.equal('30 minutes');
        mil = 1000 * 60 * 59;
        expect(time.englishTimespan(mil)).to.equal('59 minutes');
      });

      it('handles up to 23 hours', function() {
        var mil = 1000 * 60 * 60;
        expect(time.englishTimespan(mil)).to.equal('1 hour');
        mil = 1000 * 60 * 60 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 hours');
        mil = 1000 * 60 * 60 * 12;
        expect(time.englishTimespan(mil)).to.equal('12 hours');
        mil = 1000 * 60 * 60 * 23;
        expect(time.englishTimespan(mil)).to.equal('23 hours');
      });

      it('handles up to 6 days', function() {
        var mil = 1000 * 60 * 60 * 24;
        expect(time.englishTimespan(mil)).to.equal('1 day');
        mil = 1000 * 60 * 60 * 24 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 days');
        mil = 1000 * 60 * 60 * 24 * 6;
        expect(time.englishTimespan(mil)).to.equal('6 days');
      });

      it('handles up to 4 weeks', function() {
        var mil = 1000 * 60 * 60 * 24 * 7 * 1;
        expect(time.englishTimespan(mil)).to.equal('1 week');
        mil = 1000 * 60 * 60 * 24 * 7 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 weeks');
        mil = 1000 * 60 * 60 * 24 * 7 * 4;
        expect(time.englishTimespan(mil)).to.equal('4 weeks');
      });

      it('handles up to 11 months', function() {
        var mil = 1000 * 60 * 60 * 24 * 30;
        expect(time.englishTimespan(mil)).to.equal('1 month');
        mil = 1000 * 60 * 60 * 24 * 30 * 2;
        expect(time.englishTimespan(mil)).to.equal('2 months');
        mil = 1000 * 60 * 60 * 24 * 30 * 11;
        expect(time.englishTimespan(mil)).to.equal('11 months');
      });
    });


    describe('#renderTimespan', function() {
      it('handles one hour', function() {
        expect(time.renderTimespan(time.HOUR_IN_MIL)).to.equal('1:00:00');
      });

      it('handles other times above a minute', function() {
        expect(time.renderTimespan(90 * time.SECOND_IN_MIL)).to.equal('1:30');
        expect(time.renderTimespan(43 * time.SECOND_IN_MIL + 40 * time.MINUTE_IN_MIL))
          .to.equal('40:43');
      });

      it('handles one minute', function() {
        expect(time.renderTimespan(time.MINUTE_IN_MIL)).to.equal('1:00');
      });

      it('handles other times below a minute', function() {
        expect(time.renderTimespan(50 * time.SECOND_IN_MIL)).to.equal(':50');
      });

      it('handles one second', function() {
        expect(time.renderTimespan(time.SECOND_IN_MIL)).to.equal(':01');
      });

      it('shows milliseconds if requested', function() {
        expect(time.renderTimespan(1345, true)).to.equal(':01.345');
        expect(time.renderTimespan(59345, true)).to.equal(':59.345');
      });

      it('doesn\'t show milliseconds if minutes is above zero', function() {
        expect(time.renderTimespan(time.MINUTE_IN_MIL + 1034, true)).to.equal('1:01');
      });

      it('doesn\'t show milliseconds if hours is above zero', function() {
        expect(time.renderTimespan(time.HOUR_IN_MIL + 1, true)).to.equal('1:00:00');
      });
    });

    // Timezone Manipulation

    describe('#toTimezone (test passes in PST only)', function() {
      it('PST is a pass-through', function() {
        var date = new Date('2013-01-29T03:14:06.529Z');
        var actual = time.toTimezone(date, 'US/Pacific');
        expect(actual.getTime()).to.equal(date.getTime());
      });

      it('goes from PST to EST', function() {
        var date = new Date('2013-01-29T03:14:06.529Z');
        var expected = new Date('2013-01-29T06:14:06.529Z');
        var actual = time.toTimezone(date, 'US/Eastern');
        expect(actual.getTime()).to.equal(expected.getTime());
      });
    });

    describe('#fromTimezone (test passes in PST only)', function() {
      it('PST is a pass-through', function() {
        var date = new Date('2013-01-29T03:14:06.529Z');
        var actual = time.toTimezone(date, 'US/Pacific');
        expect(actual.getTime()).to.equal(date.getTime());
      });

      it('goes from EST to PST', function() {
        var date = new Date('2013-01-29T03:14:06.529Z');
        var expected = new Date('2013-01-29T00:14:06.529Z');
        var actual = time.fromTimezone(date, 'US/Eastern');
        expect(actual.getTime()).to.equal(expected.getTime());
      });
    });

    describe('#timezoneAwareDate', function() {
      it(
        'returns a date that has the right value for getDay() (only works in PST)',
        function() {
          var date = new Date('2013-01-31T08:01:19.621Z');

          expect(date.getDay()).to.equal(4);
          var tzDate = time.timezoneAwareDate(date, 'US/Hawaii');
          expect(tzDate.getDay()).to.equal(3);
        }
      );
    });

    describe('#getTimezone', function() {
      it('returns current time zone (ONLY PASSES IN PACIFIC TIME)', function() {
        expect(time.getTimezone()).to.equal('US/Pacific');
      });
    });

    describe('#getTimezones', function() {
      it('returns all available timezones, with name and pretty name', function() {
        var timezones = time.getTimezones();

        var names = _.pluck(timezones, 'name');
        expect(names).to.contain('US/Pacific');

        var pretty = _.pluck(timezones, 'pretty');
        expect(pretty).to.contain('0 UTC');
      });
    });

    // Date Manipulation

    describe('#now', function() {
      it('returns a new Date()', function() {
        var expected = new Date();
        var milliseconds = expected.getTime();
        var actual = time.now();
        expect(actual.getTime()).to.be.within(milliseconds - 10, milliseconds + 10);
      });
    });

    describe('#offset', function() {
      it('returns result of now() if offset is zero, no date provided', function() {
        var expected = new Date();
        time.now = function() { return expected; };

        var actual = time.offset(0);
        expect(actual.getTime()).to.equal(expected.getTime());
      });

      it('returns date offset by supplied milliseconds', function() {
        var expected = new Date();
        var milliseconds = expected.getTime();
        var actual = time.offset(20, expected);
        expect(actual.getTime()).to.equal(milliseconds + 20);
      });
    });

    describe('#nextDay', function() {
      it('returns null if day not recognized', function() {
        expect((!time.nextDay('random'))).to.equal(true, 'was not null');
      });

      it('returns provided date given the target day', function() {
        var date = new Date(2013, 0, 21, 1);
        time.now = function() { return date; };
        var expected = new Date(2013, 0, 21, 1);
        var actual = time.nextDay('Monday');
        expect(expected.getTime()).to.equal(actual.getTime());
      });

      it('goes forward a whole week given a sunday, target monday', function() {
        var date = new Date(2013, 0, 21, 1);
        time.now = function() { return date; };
        var expected = new Date(2013, 0, 27, 1);
        var actual = time.nextDay('Sunday');
        expect(expected.getTime()).to.equal(actual.getTime());
      });

      it('does not go back a day if in London', function() {
        var date = new Date('2013-01-30T02:00:00.000Z');

        var actual = time.lastDay('Wednesday', 'Europe/London', date);
        expect(actual.getTime()).to.equal(date.getTime());
      });

      it('goes back one day in London', function() {
        var date = new Date('2013-01-30T02:00:00.000Z');
        var expected = new Date('2013-01-29T02:00:00.000Z');

        var actual = time.lastDay('Tuesday', 'Europe/London', date);
        expect(actual.getTime()).to.equal(expected.getTime());
      });
    });

    describe('#lastDay', function() {
      it('returns null if day not recognized', function() {
        expect((!time.lastDay('random'))).to.equal(true, 'was not null');
      });

      it('returns provided date given the target day', function() {
        var date = new Date(2012, 10, 27, 1);
        time.now = function() { return date; };
        var expected = new Date(2012, 10, 26, 1);
        var actual = time.lastDay('Monday');
        expect(expected.getTime()).to.equal(actual.getTime());
      });

      it('goes back a whole week given a sunday, target monday', function() {
        var date = new Date(2012, 11, 2, 1);
        time.now = function() { return date; };
        var expected = new Date(2012, 10, 26, 1);
        var actual = time.lastDay('Monday');
        expect(expected.getTime()).to.equal(actual.getTime());
      });

      it('goes back to Wednesday in London', function() {
        var date = new Date('2013-01-30T02:00:00.000Z');

        var actual = time.lastDay('Wednesday', 'Europe/London', date);
        expect(actual.getTime()).to.equal(date.getTime());
      });

      it('goes back to monday in Hawaii', function() {
        var date = new Date('2013-01-31T08:01:19.621Z');
        var expected = new Date('2013-01-29T08:01:19.621Z');

        var actual = time.lastDay('Monday', 'US/Hawaii', date);
        expect(actual.getTime()).to.equal(expected.getTime());
      });
    });

    describe('#toMidnight', function() {
      it('returns midnight PST (crossing midnight)', function() {
        var now = new Date('2013-01-30T05:36:03.748Z');
        time.now = function() { return now; };
        var expected = new Date('2013-01-29T08:00:00.000Z');

        var actual = time.toMidnight('US/Pacific');
        expect(actual.toISOString()).to.equal(expected.toISOString());
      });

      it('returns midnight EST (not crossing midnight)', function() {
        var now = new Date('2013-01-30T05:36:03.748Z');
        time.now = function() { return now; };
        var expected = new Date('2013-01-30T05:00:00.0000Z');

        var actual = time.toMidnight('US/Eastern');
        expect(actual.toISOString()).to.equal(expected.toISOString());
      });
    });

    describe('#toHour', function() {
      it('returns 8am PST (crossing midnight)', function() {
        var now = new Date('2013-01-30T05:36:03.748Z');
        time.now = function() { return now; };
        var expected = new Date('2013-01-29T13:00:00.000Z');

        var actual = time.toHour(5, 'US/Pacific');
        expect(actual.toISOString()).to.equal(expected.toISOString());
      });

      it('returns 8am EST (not crossing midnight)', function() {
        var now = new Date('2013-01-30T05:36:03.748Z');
        time.now = function() { return now; };
        var expected = new Date('2013-01-30T10:00:00.000Z');

        var actual = time.toHour(5, 'US/Eastern');
        expect(actual.toISOString()).to.equal(expected.toISOString());
      });
    });

    describe('#toFirstOfMonth', function() {
      it('gets back to July 1st in PDT (just short of next month)', function() {
        var now = new Date('2013-08-01T05:30:00.000Z');
        time.now = function() { return now; };

        // 7:00 due to daylight savings
        var expected = new Date('2013-07-01T07:00:00.000Z');

        var actual = time.toFirstOfMonth('US/Pacific');
        expect(actual.toISOString()).to.equal(expected.toISOString());
      });

      it('gets back to August 1st in EDT (right at beginning of month)', function() {
        var now = new Date('2013-08-01T05:30:00.000Z');
        time.now = function() { return now; };

        // 4:00 due to daylight savings
        var expected = new Date('2013-08-01T04:00:00.000Z');

        var actual = time.toFirstOfMonth('US/Eastern');
        expect(actual.toISOString()).to.equal(expected.toISOString());
      });
    });

    describe('#isLastDayOfMonth', function() {
      it('returns true for July 31st in PDT', function() {
        var now = new Date('2013-08-01T05:30:00.000Z');
        time.now = function() { return now; };

        expect(time.isLastDayOfMonth('US/Pacific')).to.equal(true);
      });

      it('returns false for August 1st in EDT', function() {
        var now = new Date('2013-08-01T05:30:00.000Z');
        time.now = function() { return now; };

        expect(time.isLastDayOfMonth('US/Eastern')).to.equal(false);
      });
    });

    // Other

    describe('#addPadding', function() {
      it('adds nothing to a single digit', function() {
        expect(time.addPadding(9, 1)).to.equal('9');
      });

      it('adds nothing to digits longer than specified', function() {
        expect(time.addPadding(56, 2)).to.equal('56');
      });

      it('adds one zero to a single digit', function() {
        expect(time.addPadding(9, 2)).to.equal('09');
      });

      it('adds six zeros to a five digits', function() {
        expect(time.addPadding(10000, 11)).to.equal('00000010000');
      });
    });

  });
});
