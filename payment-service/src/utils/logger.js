const { v4: uuidv4 } = require("uuid");

/**
 * SOC-Oriented Structured Logger
 * Emits JSON logs to stdout for Fluent Bit → Elasticsearch
 */
function logEvent({
                      event_type,
                      log_level = "INFO",
                      message = "",
                      user_id = null,
                      order_id = null,
                      amount = null,
                      trace_id = null,
                      source_ip = null,
                      http_status = null
                  }) {
    const log = {
        // ---- Mandatory SOC fields ----
        timestamp: new Date().toISOString(),        // UTC ISO-8601
        service_name: "payment-service",
        environment: "dev",

        log_level,                                  // INFO | WARN | ERROR
        event_type,                                // payment_attempt | payment_success | payment_failure
        trace_id: trace_id || uuidv4(),             // Correlation across services
        message,

        // ---- Security & fraud context ----
        user_id,                                   // Nullable
        order_id,                                  // Nullable
        amount,                                    // Nullable
        source_ip,                                 // For fraud & geo anomalies

        // ---- Operational context ----
        http_status                                // Useful during incident review
    };

    // MUST be stdout, MUST be JSON
    console.log(JSON.stringify(log));

    // Return trace_id so callers can propagate it
    return log.trace_id;
}

module.exports = { logEvent };
