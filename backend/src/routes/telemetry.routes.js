const { Router } = require('express');

const router = Router();

function normalizePoints(rawPoints) {
    return rawPoints
        .map((p) => {
            const {
                timestamp,
                deviceId,
                sensorType,
                ...measurements
            } = p;

            if (!deviceId) {
                return null;
            }

            const point = {
                timestamp: new Date(
                    timestamp || Date.now()
                ),
                metadata: {
                    deviceId,
                    sensorType: sensorType || 'generic'
                }
            };

            for (const [key, value] of Object.entries(measurements)) {
                if (typeof value === 'number') {
                    point[key] = value;
                } else if (
                    typeof value === 'string' &&
                    !isNaN(Number(value))
                ) {
                    point[key] = Number(value);
                } else if (
                    typeof value === 'string' ||
                    typeof value === 'boolean'
                ) {
                    point[key] = value;
                }
            }

            return point;
        })
        .filter(Boolean);
}

router.post('/', (req, res) => {
    try {
        const {
            telemetryService,
            telemetryHub
        } = req.app.locals;

        const body = req.body;

        const rawPoints = Array.isArray(body)
            ? body
            : body.points || [body];

        if (!rawPoints.length) {
            return res.status(400).json({
                error: 'No telemetry points provided'
            });
        }

        const docs = normalizePoints(rawPoints);

        if (!docs.length) {
            return res.status(400).json({
                error: 'At least one point must include deviceId'
            });
        }

        telemetryService.accept(docs);

        for (const doc of docs) {
            telemetryHub.push(
                doc.metadata.deviceId,
                doc
            );
        }

        res.status(202).json({
            accepted: docs.length,
            queued: telemetryService.pending.length
        });

    } catch (err) {
        console.error(
            'Telemetry ingestion error:',
            err.message
        );

        res.status(500).json({
            error: 'Ingestion failed'
        });
    }
});

module.exports = router;