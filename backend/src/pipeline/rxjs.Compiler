const { Subject } = require("rxjs");
const { map, filter, scan } = require("rxjs/operators");

function createTelemetryPipeline() {
  const telemetry$ = new Subject();

  return telemetry$;
}

function createMovingAveragePipeline(
  telemetry$,
  field,
  windowSize = 5
) {
  return telemetry$.pipe(
    scan((acc, telemetry) => {
      const value = Number(telemetry[field]);

      acc.values.push(value);

      if (acc.values.length > windowSize) {
        acc.values.shift();
      }

      const average =
        acc.values.reduce((sum, value) => sum + value, 0) /
        acc.values.length;

      return {
        values: acc.values,
        telemetry: {
          ...telemetry,
          [`average_${field}`]: average
        }
      };
    }, {
      values: []
    }),

    map(result => result.telemetry)
  );
}

module.exports = {
  createTelemetryPipeline,
  createMovingAveragePipeline
};
