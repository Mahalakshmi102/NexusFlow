const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry');

// POST /api/telemetry - Ingest single or bulk telemetry data
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    
    // Support for both single object and array of objects (bulk ingest)
    const records = Array.isArray(data) ? data : [data];
    
    // Map records to match schema, filling in current time if missing
    const docs = records.map(record => ({
      timestamp: record.timestamp ? new Date(record.timestamp) : new Date(),
      metadata: {
        deviceId: record.deviceId,
        sensorType: record.sensorType
      },
      value: record.value
    }));

    await Telemetry.insertMany(docs);
    res.status(201).json({ message: 'Telemetry data ingested successfully', count: docs.length });
  } catch (error) {
    console.error('Error ingesting telemetry:', error);
    res.status(500).json({ error: 'Failed to ingest telemetry data' });
  }
});

// GET /api/telemetry - Fetch recent telemetry (mostly for testing, usually done via websocket/pipeline in real app)
router.get('/', async (req, res) => {
  try {
    const { deviceId, limit = 100 } = req.query;
    const query = {};
    
    if (deviceId) {
      query['metadata.deviceId'] = deviceId;
    }

    const data = await Telemetry.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(data);
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    res.status(500).json({ error: 'Failed to fetch telemetry data' });
  }
});

module.exports = router;
