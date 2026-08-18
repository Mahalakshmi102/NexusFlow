const express = require('express');
const router = express.Router();
const Pipeline = require('../models/Pipeline');

// POST /api/pipelines - Save a new pipeline
router.post('/', async (req, res) => {
  try {
    const { name, description, graphData, author } = req.body;

    const pipeline = new Pipeline({
      name,
      description,
      graphData,
      author // We would usually get this from auth middleware
    });

    await pipeline.save();
    res.status(201).json(pipeline);
  } catch (error) {
    console.error('Error saving pipeline:', error);
    res.status(500).json({ error: 'Failed to save pipeline' });
  }
});

// GET /api/pipelines - List all pipelines
router.get('/', async (req, res) => {
  try {
    const pipelines = await Pipeline.find().sort({ createdAt: -1 });
    res.json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ error: 'Failed to fetch pipelines' });
  }
});

// GET /api/pipelines/:id - Get a specific pipeline
router.get('/:id', async (req, res) => {
  try {
    const pipeline = await Pipeline.findById(req.params.id);
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    res.json(pipeline);
  } catch (error) {
    console.error('Error fetching pipeline:', error);
    res.status(500).json({ error: 'Failed to fetch pipeline' });
  }
});

// PUT /api/pipelines/:id - Update a pipeline
router.put('/:id', async (req, res) => {
  try {
    const { name, description, graphData, isActive } = req.body;
    
    const pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { name, description, graphData, isActive },
      { new: true } // Return updated document
    );

    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    res.json(pipeline);
  } catch (error) {
    console.error('Error updating pipeline:', error);
    res.status(500).json({ error: 'Failed to update pipeline' });
  }
});

module.exports = router;
