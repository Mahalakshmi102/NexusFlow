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
