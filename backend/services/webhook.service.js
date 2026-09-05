const axios = require('axios');
const Webhook = require('../models/Webhook');
const WebhookLog = require('../models/WebhookLog');

class WebhookService {
    constructor() {
        this.maxRetries = 3;
    }

    /**
     * Replaces placeholders in the mapping template with actual data values
     */
    _mapPayload(template, data) {
        if (!template || Object.keys(template).length === 0) {
            return data; // default to raw data if no mapping
        }

        const mapped = {};
        for (const [key, value] of Object.entries(template)) {
            if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
                const dataPath = value.replace('{{', '').replace('}}', '').trim();
                // simple dot-notation access
                mapped[key] = dataPath.split('.').reduce((acc, part) => acc && acc[part], data);
            } else {
                mapped[key] = value;
            }
        }
        return mapped;
    }

    /**
     * Executes webhook with exponential backoff retry logic
     */
    async executeWebhook(webhookId, payloadData, attempt = 1) {
        try {
            const webhook = await Webhook.findById(webhookId);
            if (!webhook || !webhook.isActive) return;

            const mappedPayload = this._mapPayload(webhook.payloadMapping, payloadData);
            
            const headers = {};
            if (webhook.headers && Array.isArray(webhook.headers)) {
                webhook.headers.forEach(h => {
                    if (h.key && h.value) headers[h.key] = h.value;
                });
            }
            
            const startTime = Date.now();
            try {
                const response = await axios({
                    method: webhook.method || 'POST',
                    url: webhook.url,
                    data: mappedPayload,
                    headers,
                    timeout: 5000 // 5 seconds timeout
                });

                const executionTimeMs = Date.now() - startTime;

                // Log success
                await WebhookLog.create({
                    webhook: webhook._id,
                    status: 'SUCCESS',
                    requestPayload: mappedPayload,
                    responseStatus: response.status,
                    responseBody: response.data,
                    executionTimeMs
                });

                webhook.lastTriggeredAt = new Date();
                webhook.successCount += 1;
                await webhook.save();

            } catch (error) {
                const executionTimeMs = Date.now() - startTime;
                const isTimeout = error.code === 'ECONNABORTED';
                const status = error.response ? error.response.status : null;
                const errorMsg = error.message || 'Unknown error';

                if (attempt < this.maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s...
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    console.log(`Webhook ${webhook.name} failed (${errorMsg}). Retrying in ${delay}ms... (Attempt ${attempt}/${this.maxRetries})`);
                    
                    setTimeout(() => {
                        this.executeWebhook(webhookId, payloadData, attempt + 1);
                    }, delay);
                } else {
                    // Log failure after max retries
                    await WebhookLog.create({
                        webhook: webhook._id,
                        status: 'FAILED',
                        requestPayload: mappedPayload,
                        responseStatus: status,
                        error: isTimeout ? 'Timeout exceeded' : errorMsg,
                        executionTimeMs
                    });

                    webhook.lastTriggeredAt = new Date();
                    webhook.errorCount += 1;
                    await webhook.save();
                    console.error(`Webhook ${webhook.name} failed completely after ${this.maxRetries} retries.`);
                }
            }
        } catch (dbError) {
            console.error('Error fetching webhook or logging:', dbError);
        }
    }
}

module.exports = new WebhookService();
