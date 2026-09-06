const { Router } = require('express');
const Webhook = require('../models/Webhook');
const WebhookLog = require('../models/WebhookLog');

const router = Router();

// GET all webhooks
router.get('/', async (req, res) => {
    try {
        const webhooks = await Webhook.find().sort({ createdAt: -1 });
        res.json(webhooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new webhook
router.post('/', async (req, res) => {
    try {
        const webhookData = { ...req.body };
        if (!webhookData.author) {
            // Fallback: assign to a default user if none provided
            const User = require('../models/User');
            const defaultUser = await User.findOne();
            webhookData.author = defaultUser ? defaultUser._id : null;
        }

        const newWebhook = new Webhook(webhookData);
        const savedWebhook = await newWebhook.save();
        res.status(201).json(savedWebhook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT (update) an existing webhook
router.put('/:id', async (req, res) => {
    try {
        const updatedWebhook = await Webhook.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedWebhook) return res.status(404).json({ error: 'Webhook not found' });
        res.json(updatedWebhook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a webhook
router.delete('/:id', async (req, res) => {
    try {
        const deletedWebhook = await Webhook.findByIdAndDelete(req.params.id);
        if (!deletedWebhook) return res.status(404).json({ error: 'Webhook not found' });
        
        // Also delete logs for this webhook
        await WebhookLog.deleteMany({ webhook: req.params.id });
        
        res.json({ message: 'Webhook deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET execution logs for a specific webhook
router.get('/:id/logs', async (req, res) => {
    try {
        const logs = await WebhookLog.find({ webhook: req.params.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
