require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const { connectToDb } = require('./config/db');
const { initIO } = require('./sockets');

const TelemetryHub = require('./services/telemetry.hub');
const TelemetryService = require('./services/telemetry.service');
const AlertService = require('./services/alert.service');
const GraphCompiler = require('./services/graph.compiler');

const telemetryRoutes = require('./routes/telemetry.routes');
const graphRoutes = require('./routes/graph.routes');

const PORT = process.env.PORT || 5000;

async function main() {
  const db = await connectToDb();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  initIO(io);

  const telemetryHub = new TelemetryHub();
  const telemetryService = new TelemetryService(db);
  const alertService = new AlertService();
  const graphCompiler = new GraphCompiler(telemetryHub, alertService);

  app.locals.db = db;
  app.locals.telemetryHub = telemetryHub;
  app.locals.telemetryService = telemetryService;
  app.locals.alertService = alertService;
  app.locals.graphCompiler = graphCompiler;

  app.use(cors());
  app.use(express.json({ limit: '20mb' }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  app.use('/api/telemetry', telemetryRoutes);
  app.use('/api/graphs', graphRoutes);

  server.listen(PORT, () => {
    console.log(`NexusFlow backend listening on ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start backend:', err.message);
  process.exit(1);
});