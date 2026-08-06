const express = require("express");
const app = express();

const telemetryRoutes = require("./routes/telemetryRoutes");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("NexusFlow Backend Running");
});

app.use("/api/telemetry", telemetryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});