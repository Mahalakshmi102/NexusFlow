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