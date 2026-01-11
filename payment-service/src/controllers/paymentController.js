// const { logEvent } = require("../utils/logger");
//
// exports.processPayment = (req, res) => {
//     const { user_id, order_id, amount } = req.body;
//
//     const trace_id = logEvent({
//         service_name: "payment-service",
//         event_type: "payment_attempt",
//         user_id,
//         message: `Payment attempt for order ${order_id}`,
//     });
//
//     // Simulate failure (25%)
//     if (Math.random() < 0.10) {
//         logEvent({
//             service_name: "payment-service",
//             event_type: "payment_failure",
//             log_level: "ERROR",
//             user_id,
//             trace_id,
//             message: "Payment failed",
//         });
//
//         return res.status(402).json({ error: "Payment failed" });
//     }
//
//     logEvent({
//         service_name: "payment-service",
//         event_type: "payment_success",
//         user_id,
//         trace_id,
//         message: "Payment successful",
//     });
//
//     res.json({ status: "PAID" });
// };

const { logEvent } = require("../utils/logger");

exports.processPayment = (req, res) => {
    const { user_id, order_id, amount } = req.body;
    const source_ip = req.ip;

    const trace_id = logEvent({
        event_type: "payment_attempt",
        user_id,
        order_id,
        amount,
        source_ip,
        message: "Payment attempt initiated"
    });

    if (Math.random() < 0.25) {
        logEvent({
            event_type: "payment_failure",
            log_level: "ERROR",
            user_id,
            order_id,
            amount,
            source_ip,
            trace_id,
            http_status: 402,
            message: "Payment failed"
        });

        return res.status(402).json({ error: "Payment failed" });
    }

    logEvent({
        event_type: "payment_success",
        user_id,
        order_id,
        amount,
        source_ip,
        trace_id,
        http_status: 200,
        message: "Payment successful"
    });

    res.json({ status: "PAID" });
};
