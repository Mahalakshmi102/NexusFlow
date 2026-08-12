const express = require('express');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const models = require('./models');

const app = express();
app.use(express.json());

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

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'dist');
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

if (require.main === module) start();

module.exports = app;
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
