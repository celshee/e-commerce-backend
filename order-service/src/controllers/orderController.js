const { logEvent } = require("../utils/logger");

const orders = [];

exports.createOrder = (req, res) => {
    const { user_id, amount } = req.body;

    const trace_id = logEvent({
        service_name: "order-service",
        event_type: "order_attempt",
        user_id,
        message: `Order attempt for amount ${amount}`,
    });

    // Simulate failure (10%)
    // if (Math.random() < 0.1) {
    //     logEvent({
    //         service_name: "order-service",
    //         event_type: "order_failed",
    //         log_level: "WARN",
    //         user_id,
    //         trace_id,
    //         message: "Order creation failed",
    //     });
    //
    //     return res.status(500).json({ error: "Order failed" });
    // }

    const order = {
        id: orders.length + 1,
        user_id,
        amount,
        status: "CREATED",
    };

    orders.push(order);

    logEvent({
        service_name: "order-service",
        event_type: "order_created",
        user_id,
        trace_id,
        message: `Order ${order.id} created`,
    });

    res.status(201).json(order);
};

exports.getOrders = (req, res) => {
    res.json(orders);
};
