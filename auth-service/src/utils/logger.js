const os = require("os");

function logEvent({
                      event_type,
                      log_level = "INFO",
                      message = "",
                      user_id = null,
                      source_ip = null,
                      http_status = null,
                      request_id = null
                  }) {
    const log = {
        "@timestamp": new Date().toISOString(),
        service: "auth-service",
        environment: "prod",

        level: log_level,
        event_type,
        message,

        user_id,
        source_ip,
        http_status,
        request_id,

        host: {
            hostname: os.hostname(),
            pid: process.pid
        }
    };

    process.stdout.write(JSON.stringify(log) + "\n");
}

module.exports = { logEvent };
