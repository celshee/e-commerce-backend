require("dotenv").config();
const app = require("./app");
const { consumePaymentEvents } = require("./utils/paymentEventConsumer");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        service_name: "order-service",
        log_level: "INFO",
        event_type: "service_started",
        message: `Order service running on port ${PORT}`
    }));
    consumePaymentEvents();
});

