/**
 * Created by Liu on 2019/9/19.
 */
export function timeFilter (timeStamp) {
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
