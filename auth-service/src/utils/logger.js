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
//         timestamp: new Date().toISOString(),
//         service_name,
//         environment: "dev",
//         log_level,
//         event_type,
//         trace_id,
//         user_id,
//         message,
//     };
//
//     console.log(JSON.stringify(log));
//     return trace_id;
// }
//
// module.exports = { logEvent };
/**
 * SOC-Oriented Logger (Trace-ID-Free)
 */
function logEvent({
                      event_type,
                      log_level = "INFO",
                      message = "",
                      user_id = null,
                      source_ip = null,
                      http_status = null
                  }) {
    const log = {
        timestamp: new Date().toISOString(),
        service_name: "auth-service",
        environment: "prod",

        log_level,
        event_type,
        message,

        user_id,
        source_ip,
        http_status
    };

    console.log(JSON.stringify(log));
}

module.exports = { logEvent };
