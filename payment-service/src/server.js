const app = require("./app");

const PORT = 3003;
app.listen(PORT, () => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        service_name: "payment-service",
        log_level: "INFO",
        event_type: "service_started",
        message: `Payment service running on port ${PORT}`
    }));
});
