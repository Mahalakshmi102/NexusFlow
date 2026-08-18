const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// POST /api/devices - Register a new device
router.post('/', async (req, res) => {
  try {
    const { deviceName, deviceType, location } = req.body;

    const device = new Device({
      deviceName,
      deviceType,
      location
    });

    await device.save();
    res.status(201).json(device);
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ error: 'Failed to register device' });
  }
});

// GET /api/devices - List all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

module.exports = router;
