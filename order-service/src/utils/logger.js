
const os = require("os");
const { v4: uuidv4 } = require("uuid");

function logEvent({
                      service_name,
                      event_type,
                      log_level = "INFO",
                      user_id = null,
                      message = "",
                      trace_id = uuidv4(),
                  }) {
    const log = {
        "@timestamp": new Date().toISOString(),   // ELK-native timestamp
        service: service_name,                   // cleaner field name
        environment: "dev",

        level: log_level,
        event_type,
        trace_id,
        user_id,
        message,

        host: {
            hostname: os.hostname(),
            pid: process.pid
        }
    };

    // Fluent Bit prefers stdout JSON, one line per event
    process.stdout.write(JSON.stringify(log) + "\n");

    return trace_id;
}

module.exports = { logEvent };
