const WebSocket = require("ws");
const { routeTelemetry } = require("../services/telemetryRouter");

function setupTelemetrySocket(server) {
  const wss = new WebSocket.Server({
    server,
    path: "/telemetry"
  });

  console.log("🔌 WebSocket telemetry server initialized");

  wss.on("connection", (ws) => {
    console.log("🟢 Sensor connected");

    ws.send(
      JSON.stringify({
        type: "connection",
        message: "Connected to NexusFlow telemetry server"
      })
    );

    ws.on("message", (message) => {
      try {
        const telemetry = JSON.parse(message.toString());

        console.log("📡 Incoming telemetry:");
        console.log(telemetry);

        /*
          Send telemetry to the graph router
        */
        routeTelemetry(telemetry);

        ws.send(
          JSON.stringify({
            type: "success",
            message: "Telemetry received",
            data: telemetry
          })
        );

      } catch (error) {
        console.error("❌ Invalid telemetry:", error.message);

        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid JSON data"
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("🔴 Sensor disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error.message);
    });
  });

  return wss;
}

module.exports = {
  setupTelemetrySocket
};
