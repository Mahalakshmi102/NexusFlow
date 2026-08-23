require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const { setupTelemetrySocket } =
  require("./websocket/telemetrySocket");

const { registerGraph } =
  require("./services/graphRegistry");

const { CompiledGraph } =
  require("./compiler/compiledGraph");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

const server = http.createServer(app);


/*
========================================
REGISTER COMPILED GRAPH
========================================
*/

const turbineGraph =
  new CompiledGraph("turbine-01");

registerGraph(
  "turbine-01",
  turbineGraph
);


/*
========================================
WEBSOCKET
========================================
*/

setupTelemetrySocket(server);


/*
========================================
START SERVER
========================================
*/

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

  console.log(
    `🔌 WebSocket endpoint: ws://localhost:${PORT}/telemetry`
  );

});
