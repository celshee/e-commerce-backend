const os = require("os");
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
    const finalTraceId = trace_id || uuidv4();

    const log = {
        // ---- ELK / ECS compatible ----
        "@timestamp": new Date().toISOString(),     // REQUIRED by ELK
        service: "payment-service",
        environment: "dev",
        level: log_level,

        // ---- Event context ----
        event_type,
        message,
        trace_id: finalTraceId,

        // ---- Security & fraud context ----
        user_id,
        order_id,
        amount,
        source_ip,

        // ---- Operational context ----
        http_status,

        // ---- Host metadata (SOC-grade) ----
        host: {
            hostname: os.hostname(),
            pid: process.pid
        }
    };

    // Fluent Bit best practice: raw JSON → stdout
    process.stdout.write(JSON.stringify(log) + "\n");

    return finalTraceId;
}

module.exports = { logEvent };
