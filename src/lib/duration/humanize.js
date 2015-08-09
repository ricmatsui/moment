import { createDuration } from './create';

var round = Math.round;
var thresholds = {
    s: 45,  // seconds to minute
    m: 45,  // minutes to hour
    h: 22,  // hours to day
    d: 26,  // days to month
    M: 11   // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = (seconds < thresholds.s || minutes === 0) && ['s', seconds]  ||
            minutes === 1                             && ['m']           ||
            (minutes < thresholds.m || hours   === 0) && ['mm', minutes] ||
            hours   === 1                             && ['h']           ||
            (hours   < thresholds.h || days    === 0) && ['hh', hours]   ||
            days    === 1                             && ['d']           ||
            (days    < thresholds.d || months  === 0) && ['dd', days]    ||
            months  === 1                             && ['M']           ||
            (months  < thresholds.M || years   === 0) && ['MM', months]  ||
            years   === 1                             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;

    if (round(0.8) === 0) {
        console.log('------------------');
        console.log({
            's': duration.as('s'),
            'm': duration.as('m'),
            'h': duration.as('h'),
            'd': duration.as('d'),
            'M': duration.as('M'),
            'y': duration.as('y')
        });
        console.log(JSON.stringify({
            's': seconds,
            'm': minutes,
            'h': hours,
            'd': days,
            'M': months,
            'y': years
        }));
        console.log(Math.floor === round);
        console.log(a.slice(0, 4));
    }
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set a threshold for relative time strings
export function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    return true;
}

// This function allows you to set a rounding function for relative time strings
export function getSetRelativeTimeRounding (newRound) {
    if (newRound === undefined) {
        return round;
    }
    round = newRound;
}

export function humanize (withSuffix) {
    var locale = this.localeData();
    var output = relativeTime(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}
