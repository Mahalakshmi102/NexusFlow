function throttle(
  callback,
  interval
) {

  let lastExecution = 0;

  let timeout = null;

  let latestArgs = null;

  return function (...args) {

    const now = Date.now();

    latestArgs = args;

    const remaining =
      interval -
      (now - lastExecution);

    if (remaining <= 0) {

      if (timeout) {

        clearTimeout(timeout);

        timeout = null;

      }

      lastExecution = now;

      callback(...latestArgs);

      latestArgs = null;

    } else if (!timeout) {

      timeout = setTimeout(() => {

        lastExecution =
          Date.now();

        timeout = null;

        if (latestArgs) {

          callback(
            ...latestArgs
          );

          latestArgs = null;

        }

      }, remaining);

    }

  };

}

module.exports = throttle;