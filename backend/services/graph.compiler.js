const { map, filter, scan } = require('rxjs/operators');

class GraphCompiler {
    constructor(telemetryHub, alertService, webhookService) {
        this.telemetryHub = telemetryHub;
        this.alertService = alertService;
        this.webhookService = webhookService;
        this.activeSubscriptions = new Map();
    }

    deploy(graph) {
        const graphId = graph._id
            ? graph._id.toString()
            : graph.id;

        this.undeploy(graphId);

        const nodes = new Map(
            (graph.nodes || []).map((n) => [n.id, n])
        );

        const edges = graph.edges || [];
        const subscriptions = [];

        const sources = (graph.nodes || []).filter(
            (n) => n.type === 'deviceSource'
        );

        if (sources.length === 0) {
            throw new Error(
                'Graph must contain at least one deviceSource node'
            );
        }

        const visit = (nodeId, input$, sourceNode) => {
            const node = nodes.get(nodeId);

            if (!node) {
                return;
            }

            let output$ = input$;

            switch (node.type) {
                case 'movingAverage':
                    output$ = this._applyMovingAverage(
                        input$,
                        node.data || {}
                    );
                    break;

                case 'condition':
                    output$ = this._applyCondition(
                        input$,
                        node.data || {}
                    );
                    break;

                case 'alert': {
                    const subscription = output$.subscribe({
                        next: (item) => {
                            this.alertService.sendAlert({
                                graphId,
                                graphName: graph.name || 'Untitled graph',
                                nodeId: node.id,
                                nodeName:
                                    node.data?.name || node.id,
                                deviceId:
                                    sourceNode.data.deviceId,
                                metric:
                                    sourceNode.data.field ||
                                    'temperature',
                                value: item.value,
                                message:
                                    node.data?.message ||
                                    'Alert triggered',
                                timestamp: new Date()
                            });
                        },

                        error: (err) => {
                            console.error(
                                `Graph ${graphId} alert stream error:`,
                                err.message
                            );
                        }
                    });

                    subscriptions.push(subscription);
                    return;
                }

                case 'webhookNode': {
                    const subscription = output$.subscribe({
                        next: (item) => {
                            if (!this.webhookService) return;
                            
                            const payload = {
                                graphId,
                                graphName: graph.name || 'Untitled graph',
                                nodeId: node.id,
                                deviceId: sourceNode.data?.deviceId,
                                metric: sourceNode.data?.field || 'temperature',
                                value: item.value,
                                timestamp: new Date()
                            };

                            const targetUrl = node.data?.targetUrl;
                            const method = node.data?.method || 'POST';
                            
                            if (targetUrl) {
                                this.webhookService.execute(targetUrl, method, payload);
                            }
                        },

                        error: (err) => {
                            console.error(
                                `Graph ${graphId} webhook stream error:`,
                                err.message
                            );
                        }
                    });

                    subscriptions.push(subscription);
                    return;
                }

                default:
                    break;
            }

            const children = edges.filter(
                (e) => e.source === nodeId
            );

            for (const child of children) {
                visit(
                    child.target,
                    output$,
                    sourceNode
                );
            }
        };

        for (const source of sources) {
            const deviceId = source.data?.deviceId;
            const field =
                source.data?.field || 'temperature';

            if (!deviceId) {
                continue;
            }

            const source$ =
                this.telemetryHub
                    .forDevice(deviceId)
                    .pipe(
                        map((point) => ({
                            ...point,
                            value: Number(point[field])
                        }))
                    );

            const children = edges.filter(
                (e) => e.source === source.id
            );

            for (const child of children) {
                visit(
                    child.target,
                    source$,
                    source
                );
            }
        }

        const subscription = {
            unsubscribe: () => {
                for (const sub of subscriptions) {
                    sub.unsubscribe();
                }
            }
        };

        this.activeSubscriptions.set(
            graphId,
            subscription
        );

        return {
            ok: true,
            graphId,
            activeSources: sources.length
        };
    }

    undeploy(graphId) {
        const existing =
            this.activeSubscriptions.get(graphId);

        if (existing) {
            existing.unsubscribe();
            this.activeSubscriptions.delete(graphId);
        }
    }

    _applyMovingAverage(input$, data) {
        const windowSize = data.window || 5;

        return input$.pipe(
            scan(
                (acc, item) => {
                    const values = acc.values
                        .concat(item.value)
                        .slice(-windowSize);

                    const avg =
                        values.reduce(
                            (a, b) => a + b,
                            0
                        ) / values.length;

                    return {
                        values,
                        avg,
                        last: item
                    };
                },
                { values: [] }
            ),

            filter(
                (acc) =>
                    acc.values.length === windowSize
            ),

            map((acc) => ({
                ...acc.last,
                value: acc.avg
            }))
        );
    }

    _applyCondition(input$, data) {
        const operator = data.operator || '>';
        const threshold = Number(data.threshold);

        return input$.pipe(
            filter((item) =>
                this._evaluate(
                    item.value,
                    operator,
                    threshold
                )
            )
        );
    }

    _evaluate(value, operator, threshold) {
        switch (operator) {
            case '>':
                return value > threshold;

            case '>=':
                return value >= threshold;

            case '<':
                return value < threshold;

            case '<=':
                return value <= threshold;

            case '==':
                return value === threshold;

            case '!=':
                return value !== threshold;

            default:
                return false;
        }
    }
}

module.exports = GraphCompiler;