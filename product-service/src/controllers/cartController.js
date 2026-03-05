const cartService = require("../services/cartService");
const { logEvent } = require("../utils/logger");

exports.addToCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { productId, quantity } = req.body;

    const item = await cartService.add(userId, productId, quantity);

    logEvent({
      event_type: "cart_item_added",
      event_category: "cart",
      severity: "low",

      request_id: req.requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,

      user_id: userId,
      source_ip: req.ip,

      cart_product_id: productId,
      cart_quantity: quantity,

      message: "Product added to cart"
    });

    res.status(200).json({ message: "ADDED_TO_CART", cartItem: item });
  } catch (err) {
    const status = err.statusCode || 400;

    logEvent({
      event_type: "cart_add_failed",
      event_category: "cart",
      severity: status >= 500 ? "high" : "medium",

      request_id: req.requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status_code: status,
      response_time_ms: req.responseTimeMs || 0,

      user_id: userId,
      source_ip: req.ip,

      cart_product_id: req.body?.productId || null,
      cart_quantity: req.body?.quantity ?? null,

      message: `Add to cart failed: ${err.message}`
    });

    res.status(status).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { productId, quantity } = req.body;

    const result = await cartService.remove(userId, productId, quantity ?? null);

    logEvent({
      event_type: "cart_item_removed",
      event_category: "cart",
      severity: "low",

      request_id: req.requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,

      user_id: userId,
      source_ip: req.ip,

      cart_product_id: productId,
      cart_quantity: quantity ?? null,

      message: "Cart updated (remove)"
    });

    res.status(200).json({ message: "CART_UPDATED", result });
  } catch (err) {
    const status = err.statusCode || 400;

    logEvent({
      event_type: "cart_remove_failed",
      event_category: "cart",
      severity: status >= 500 ? "high" : "medium",

      request_id: req.requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status_code: status,
      response_time_ms: req.responseTimeMs || 0,

      user_id: userId,
      source_ip: req.ip,

      cart_product_id: req.body?.productId || null,
      cart_quantity: req.body?.quantity ?? null,

      message: `Remove from cart failed: ${err.message}`
    });

    res.status(status).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await cartService.get(userId);

    logEvent({
      event_type: "cart_viewed",
      event_category: "cart",
      severity: "low",

      request_id: req.requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,

      user_id: userId,
      source_ip: req.ip,

      message: "Cart fetched"
    });

    res.status(200).json(cart);
  } catch (err) {
    const status = err.statusCode || 500;

    logEvent({
      event_type: "cart_view_failed",
      event_category: "cart",
      severity: "high",

      request_id: req.requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status_code: status,
      response_time_ms: req.responseTimeMs || 0,

      user_id: userId,
      source_ip: req.ip,

      message: `Get cart failed: ${err.message}`
    });

    res.status(status).json({ error: err.message });
  }
};