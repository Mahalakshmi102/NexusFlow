const { Router } = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const db = getDb();

        const graphs = await db
            .collection('graphs')
            .find()
            .toArray();

        res.json(
            graphs.map((g) => ({
                ...g,
                _id: g._id.toString()
            }))
        );
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const db = getDb();

        const graph = {
            ...req.body,
            deployed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection('graphs')
            .insertOne(graph);

        res.status(201).json({
            _id: result.insertedId.toString(),
            ...graph
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/compile', async (req, res) => {
    try {
        const db = getDb();
        const { graphCompiler } = req.app.locals;
        const graphData = req.body;

        // Basic validation schema
        if (!Array.isArray(graphData.nodes) || !Array.isArray(graphData.edges)) {
            return res.status(400).json({ error: 'Invalid graph data: nodes and edges must be arrays' });
        }

        // Save graph to DB (optional, but good for persistence)
        const graph = {
            ...graphData,
            deployed: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('graphs').insertOne(graph);
        graph._id = result.insertedId;

        // Finalize the parser and pipe into RxJS compiler service
        const compileResult = graphCompiler.deploy(graph);

        res.status(200).json({
            message: 'Graph compiled successfully',
            ...compileResult
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/:id/deploy', async (req, res) => {
    try {
        const db = getDb();
        const { graphCompiler } = req.app.locals;

        const graph = await db
            .collection('graphs')
            .findOne({
                _id: new ObjectId(req.params.id)
            });

        if (!graph) {
            return res.status(404).json({
                error: 'Graph not found'
            });
        }

        const result = graphCompiler.deploy(graph);

        await db.collection('graphs').updateOne(
            { _id: graph._id },
            {
                $set: {
                    deployed: true,
                    updatedAt: new Date()
                }
            }
        );

        res.json(result);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.post('/:id/undeploy', async (req, res) => {
    try {
        const db = getDb();
        const { graphCompiler } = req.app.locals;

        graphCompiler.undeploy(req.params.id);

        await db.collection('graphs').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    deployed: false,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            ok: true
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;