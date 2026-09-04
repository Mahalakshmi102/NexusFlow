class WebhookService {
    constructor() {}

    async execute(url, method = 'POST', payload = {}, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout for security and performance

        try {
            console.log(`[WebhookService] Dispatching ${method} request to ${url}`);
            
            const options = {
                method: method.toUpperCase(),
                headers,
                signal: controller.signal
            };

            if (options.method !== 'GET' && options.method !== 'HEAD') {
                options.body = JSON.stringify(payload);
            }

            const response = await fetch(url, options);

            clearTimeout(timeout);

            if (!response.ok) {
                console.error(`[WebhookService] Request failed with status ${response.status}`);
                return { success: false, status: response.status };
            }

            console.log(`[WebhookService] Successfully executed webhook to ${url}`);
            return { success: true, status: response.status };

        } catch (error) {
            clearTimeout(timeout);
            console.error(`[WebhookService] Error executing webhook: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

module.exports = WebhookService;
