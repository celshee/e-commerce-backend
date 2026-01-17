// const os = require("os");
// const { v4: uuidv4 } = require("uuid");
//
// /**
//  * SOC-Oriented Structured Logger
//  * Emits JSON logs to stdout for Fluent Bit → Elasticsearch
//  */
// function logEvent({
//                       event_type,
//                       log_level = "INFO",
//                       message = "",
//                       user_id = null,
//                       order_id = null,
//                       amount = null,
//                       trace_id = null,
//                       source_ip = null,
//                       http_status = null
//                   }) {
//     const finalTraceId = trace_id || uuidv4();
//
//     const log = {
//         // ---- ELK / ECS compatible ----
//         "@timestamp": new Date().toISOString(),     // REQUIRED by ELK
//         service: "payment-service",
//         environment: "dev",
//         level: log_level,
//
//         // ---- Event context ----
//         event_type,
//         message,
//         trace_id: finalTraceId,
//
//         // ---- Security & fraud context ----
//         user_id,
//         order_id,
//         amount,
//         source_ip,
//
//         // ---- Operational context ----
//         http_status,
//
//         // ---- Host metadata (SOC-grade) ----
//         host: {
//             hostname: os.hostname(),
//             pid: process.pid
//         }
//     };
//
//     // Fluent Bit best practice: raw JSON → stdout
//     process.stdout.write(JSON.stringify(log) + "\n");
//
//     return finalTraceId;
// }
//
// module.exports = { logEvent };

const os = require("os");
const { v4: uuidv4 } = require("uuid");

function logEvent({
                      event_type,
                      event_category = "payment",
                      severity = "medium",

                      request_id = uuidv4(),
                      method = null,
                      endpoint = null,
                      status_code = null,
                      response_time_ms = null,

                      user_id = null,
                      user_role = "user",
                      source_ip = null,

                      order_id = null,
                      amount = null,
                      payment_method = null,

                      message = ""
                  }) {
    const log = {
        "@timestamp": new Date().toISOString(),
        service: "payment-service",
        environment: "dev",

        event: {
            type: event_type,              // payment_failed, payment_success
            category: event_category,      // payment
            severity                      // medium / high
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
            amount,
            payment_method
        },

        message,

        host: {
            hostname: os.hostname(),
            pid: process.pid
        }
    };

    process.stdout.write(JSON.stringify(log) + "\n");
    return request_id;
}

module.exports = { logEvent };
