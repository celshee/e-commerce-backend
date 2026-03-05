function logEvent({
  service = "payment-service",
  event_type,
  event_category = "payment",
  severity = "medium",

  request_id = null,
  method = null,
  endpoint = null,
  status_code = null,
  response_time_ms = null,

  user_id = null,
  user_role = "user",
  source_ip = null,

  order_id = null,
  amount = null,
  payment_id = null,
  failure_reason = null,

  message = ""
}) {
  const log = {
    "@timestamp": new Date().toISOString(),

    service,
    service_instance: process.env.HOSTNAME || null,
    environment: process.env.ENVIRONMENT || "prod",

    event: {
      type: event_type,
      category: event_category,
      severity
    },

    http: {
      request_id,
      method,
      endpoint,
      status_code,
      response_time_ms
    },

    user: {
      id: user_id,
      role: user_role
    },

    source: {
      ip: source_ip
    },

    business: {
      order_id,
      payment_id,
      amount,
      failure_reason
    },

    message
  };

  process.stdout.write(JSON.stringify(log) + "\n");
}

module.exports = { logEvent };