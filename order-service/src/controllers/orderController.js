const orderService = require("../services/orderService");
const { logEvent } = require("../utils/logger");

exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.userId;

        const order = await orderService.createOrder(userId, items);

        logEvent({
            service: "order-service",
            event_type: "order_created",
            user_id: userId,
            source_ip: req.ip,
            message: "Order created"
        });

        res.status(201).json(order);
    } catch (err) {
        console.error("createOrder error:", err);
        res.status(500).json({ error: "Internal server error" });
    }

};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await orderService.getOrders(userId);
        res.json(orders);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.getOrderDetails(orderId);

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json(order);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
};
