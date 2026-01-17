//
// const os = require("os");
// const { v4: uuidv4 } = require("uuid");
//
// function logEvent({
//                       service_name,
//                       event_type,
//                       log_level = "INFO",
//                       user_id = null,
//                       message = "",
//                       trace_id = uuidv4(),
//                   }) {
//     const log = {
//         "@timestamp": new Date().toISOString(),   // ELK-native timestamp
//         service: service_name,                   // cleaner field name
//         environment: "dev",
//
//         level: log_level,
//         event_type,
//         trace_id,
//         user_id,
//         message,
//
//         host: {
//             hostname: os.hostname(),
//             pid: process.pid
//         }
//     };
//
//     // Fluent Bit prefers stdout JSON, one line per event
//     process.stdout.write(JSON.stringify(log) + "\n");
//
//     return trace_id;
// }
//
// module.exports = { logEvent };

const os = require("os");
const { v4: uuidv4 } = require("uuid");

function logEvent({
                      event_type,
                      event_category = "order",
                      severity = "low",

                      request_id = uuidv4(),
                      method = null,
                      endpoint = null,
                      status_code = null,
                      response_time_ms = null,

                      user_id = null,
                      user_role = "user",
                      source_ip = null,

                      order_id = null,
                      order_amount = null,

                      message = ""
                  }) {
    const log = {
        "@timestamp": new Date().toISOString(),
        service: "order-service",
        environment: "dev",

        event: {
            type: event_type,              // order_created, order_failed
            category: event_category,      // order
            severity                      // low / medium / high
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
            order_amount
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
