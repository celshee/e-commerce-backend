const app = require("./app");

const PORT = 3002;
app.listen(PORT, () => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        service_name: "order-service",
        log_level: "INFO",
        event_type: "service_started",
        message: `Order service running on port ${PORT}`
    }));
});
