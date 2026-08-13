class TelemetryService {
    constructor(db, options = {}) {
        this.db = db;
        this.pending = [];
        this.batchSize = options.batchSize || 1000;
        this.flushIntervalMs = options.flushIntervalMs || 200;
        this.flushing = false;

        this.timer = setInterval(
            () => this.flush(),
            this.flushIntervalMs
        );
    }

    accept(points) {
        const list = Array.isArray(points) ? points : [points];

        this.pending.push(...list);

        if (this.pending.length >= this.batchSize) {
            setImmediate(() => this.flush());
        }

        return this.pending.length;
    }

    async flush() {
        if (this.flushing || this.pending.length === 0) {
            return;
        }

        this.flushing = true;

        try {
            while (this.pending.length > 0) {
                const batch = this.pending.splice(0, this.batchSize);

                await this.db.collection('telemetry').insertMany(
                    batch,
                    {
                        ordered: false
                    }
                );
            }
        } catch (err) {
            console.error(
                'Telemetry insertMany failed:',
                err.message
            );
        } finally {
            this.flushing = false;
        }
    }

    close() {
        clearInterval(this.timer);
        this.flush();
    }
}

module.exports = TelemetryService;