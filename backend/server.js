require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { initIO, initSubscriptions } = require('./sockets');
const models = require('./models');

const TelemetryHub = require('./services/telemetry.hub');
const TelemetryService = require('./services/telemetry.service');
const AlertService = require('./services/alert.service');
const GraphCompiler = require('./services/graph.compiler');

const telemetryRoutes = require('./routes/telemetry.routes');
const graphRoutes = require('./routes/graph.routes');
const webhookRoutes = require('./routes/webhook.routes');
const webhookService = require('./services/webhook.service');

const PORT = process.env.PORT || 5000;

async function main() {
  const db = await connectDB();

  const app = express();
  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: { origin: '*' }
  });
  initIO(io);

  const telemetryHub = new TelemetryHub();
  const telemetryService = new TelemetryService(db);
  const alertService = new AlertService();
  const graphCompiler = new GraphCompiler(telemetryHub, alertService, webhookService);

  initSubscriptions(telemetryHub);

  app.locals.db = db;
  app.locals.telemetryHub = telemetryHub;
  app.locals.telemetryService = telemetryService;
  app.locals.alertService = alertService;
  app.locals.graphCompiler = graphCompiler;
  app.locals.webhookService = webhookService;

  app.use(cors());
  app.use(express.json({ limit: '20mb' }));

  // Basic health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Example API routes
  app.get('/api/devices', async (req, res) => {
    try {
      const Device = models.Device;
      const devices = await Device.find().limit(50).lean();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users', async (req, res) => {
    try {
      const User = models.User;
      const users = await User.find().limit(50).select('-passwordHash').lean();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/telemetry', telemetryRoutes);
  app.use('/api/graphs', graphRoutes);
  app.use('/api/webhooks', webhookRoutes);

  // Serve static frontend in production
  if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, 'dist');
    app.use(express.static(staticPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`NexusFlow backend listening on port ${PORT}`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Failed to start backend:', err.message);
    process.exit(1);
  });
}

module.exports = { main };
