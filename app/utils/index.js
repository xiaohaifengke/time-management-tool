/**
 * Created by Liu on 2019/9/19.
 */
export function timeFilter (ts) {
  const timeStamp = ts > 0 ? ts : 0;
  let timeDiff;
  const d = Math.floor(timeStamp / (24 * 60 * 60 * 1000));
  timeDiff = timeStamp % (24 * 60 * 60 * 1000);
  const h = Math.floor(timeDiff / (60 * 60 * 1000));
  timeDiff %= (60 * 60 * 1000);
  const m = Math.floor(timeDiff / (60 * 1000));
  timeDiff %= (60 * 1000);
  const s = Math.floor(timeDiff / 1000);

  return {
    days: formatNumber(d),
    hours: formatNumber(h),
    minutes: formatNumber(m),
    seconds: formatNumber(s)
  };

  function formatNumber (value) {
    return value > 9 ? value : `0${value}`;
  }
};

export function debounce (func, wait, scope) {
  let timeout;
  return function(...args) {
    const context = scope || this;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * in case of a "storm of events", this executes once every $threshold
 * @param fn
 * @param threshhold
 * @param scope
 * @returns {Function}
 */
export function throttle (fn, threshhold = 250, scope) {
  let last;
  let deferTimer;
  return function(...args) {
    const context = scope || this;

    const now = +new Date;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
