
const app = require("./app");

const PORT = 3001;
app.listen(PORT, () => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        service_name: "auth-service",
        log_level: "INFO",
        event_type: "service_started",
        message: `Order service running on port ${PORT}`
    }));
});
