const { getGraph } = require("./graphRegistry");

function routeTelemetry(telemetry) {
  const { deviceId } = telemetry;

  if (!deviceId) {
    console.log("❌ Telemetry does not contain deviceId");

    return;
  }

  const graph = getGraph(deviceId);

  if (!graph) {
    console.log(
      `⚠️ No compiled graph found for device: ${deviceId}`
    );

    return;
  }

  console.log(
    `➡️ Routing telemetry to graph: ${deviceId}`
  );

  /*
    Push data into RxJS stream
  */
  graph.input$.next(telemetry);
}

module.exports = {
  routeTelemetry
};