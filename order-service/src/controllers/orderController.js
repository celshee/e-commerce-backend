const orderService = require("../services/orderService");
const { logEvent } = require("../utils/logger");

exports.createOrder = async (req, res) => {
  const requestId = req.requestId || req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;
  const userId = req.user.userId;

  try {
    const { items } = req.body;

    const order = await orderService.createOrder(userId, items);

    logEvent({
      event_type: "order_created",
      event_category: "order",
      severity: "low",
      request_id: requestId,
      method,
      endpoint,
      status_code: 201,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      order_id: order.orderId,
      order_amount: order.totalAmount,
      message: "Order created"
    });

    res.status(201).json(order);
  } catch (err) {
    const status = err.statusCode || 500;

    logEvent({
      event_type: "order_create_failed",
      event_category: "order",
      severity: status >= 500 ? "high" : "medium",
      request_id: requestId,
      method,
      endpoint,
      status_code: status,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      message: `Create order failed: ${err.message}`
    });

    res.status(status).json({ error: err.message || "Internal server error" });
  }
};

exports.getOrders = async (req, res) => {
  const requestId = req.requestId || req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;
  const userId = req.user.userId;

  try {
    const orders = await orderService.getOrders(userId);

    logEvent({
      event_type: "orders_listed",
      event_category: "order",
      severity: "low",
      request_id: requestId,
      method,
      endpoint,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      message: "Orders fetched"
    });

    res.json(orders);
  } catch (err) {
    logEvent({
      event_type: "orders_list_failed",
      event_category: "order",
      severity: "high",
      request_id: requestId,
      method,
      endpoint,
      status_code: 500,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      message: `Get orders failed: ${err.message}`
    });

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderDetails = async (req, res) => {
  const requestId = req.requestId || req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;
  const userId = req.user.userId;
  const orderId = req.params.id;

  try {
    const order = await orderService.getOrderDetails(orderId);

    if (!order) {
      logEvent({
        event_type: "order_not_found",
        event_category: "order",
        severity: "medium",
        request_id: requestId,
        method,
        endpoint,
        status_code: 404,
        response_time_ms: req.responseTimeMs || 0,
        user_id: userId,
        source_ip: req.ip,
        order_id: orderId,
        message: "Order not found"
      });

      return res.status(404).json({ error: "Order not found" });
    }

    logEvent({
      event_type: "order_details_viewed",
      event_category: "order",
      severity: "low",
      request_id: requestId,
      method,
      endpoint,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      order_id: orderId,
      order_amount: order.total_amount || null,
      message: "Order details fetched"
    });

    res.json(order);
  } catch (err) {
    logEvent({
      event_type: "order_details_failed",
      event_category: "order",
      severity: "high",
      request_id: requestId,
      method,
      endpoint,
      status_code: 500,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      order_id: orderId,
      message: `Get order details failed: ${err.message}`
    });

    res.status(500).json({ error: "Internal server error" });
  }
};
exports.createOrderFromCart = async (req, res) => {
  const requestId = req.requestId || req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;
  const userId = req.user.userId;

  try {
    const { cartItemIds } = req.body;

    const order = await orderService.createOrderFromCartItems(userId, cartItemIds);

    logEvent({
      event_type: "order_created",
      event_category: "order",
      severity: "low",
      request_id: requestId,
      method,
      endpoint,
      status_code: 201,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      order_id: order.orderId,
      order_amount: order.totalAmount,
      message: "Order created from cart items"
    });

    res.status(201).json(order);
  } catch (err) {
    const status = err.statusCode || 500;

    logEvent({
      event_type: "order_create_failed",
      event_category: "order",
      severity: status >= 500 ? "high" : "medium",
      request_id: requestId,
      method,
      endpoint,
      status_code: status,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: req.ip,
      message: `Create order from cart failed: ${err.message}`
    });

    res.status(status).json({ error: err.message });
  }
};