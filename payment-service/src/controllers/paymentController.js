const paymentService = require("../services/paymentService");
const { logEvent } = require("../utils/logger");

exports.pay = async (req, res) => {
  const requestId = req.requestId || req.headers["x-request-id"] || "";
  const method = req.method;
  const endpoint = req.originalUrl;
  const sourceIp = req.ip;
  const userId = req.user.userId;

  try {
    const { orderId, amount } = req.body || {};
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ error: "INVALID_ORDER_ID" });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "INVALID_AMOUNT" });
    }

    // attempt log
    logEvent({
      event_type: "payment_attempt",
      event_category: "payment",
      severity: "low",
      request_id: requestId,
      method,
      endpoint,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: sourceIp,
      order_id: orderId,
      amount,
      message: "Payment attempt initiated"
    });

    const result = await paymentService.processPayment({
      orderId,
      userId,
      amount
    });

    if (result.status === "FAILED") {
      logEvent({
        event_type: "payment_failure",
        event_category: "payment",
        severity: "medium",
        request_id: requestId,
        method,
        endpoint,
        status_code: 402,
        response_time_ms: req.responseTimeMs || 0,
        user_id: userId,
        source_ip: sourceIp,
        order_id: orderId,
        payment_id: result.paymentId,
        amount,
        failure_reason: result.failureReason || "Payment failed",
        message: "Payment failed"
      });

      return res.status(402).json({
        status: "FAILED",
        paymentId: result.paymentId,
        failureReason: result.failureReason || "Payment failed"
      });
    }

    logEvent({
      event_type: "payment_success",
      event_category: "payment",
      severity: "low",
      request_id: requestId,
      method,
      endpoint,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: sourceIp,
      order_id: orderId,
      payment_id: result.paymentId,
      amount,
      message: "Payment successful"
    });

    return res.status(200).json({
      status: "SUCCESS",
      paymentId: result.paymentId
    });
  } catch (err) {
    logEvent({
      event_type: "payment_error",
      event_category: "payment",
      severity: "high",
      request_id: requestId,
      method,
      endpoint,
      status_code: 500,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId,
      source_ip: sourceIp,
      message: `Payment error: ${err.message}`
    });

    return res.status(500).json({ error: "Internal server error" });
  }
};