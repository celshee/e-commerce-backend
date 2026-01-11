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
        timestamp: new Date().toISOString(),
        service_name,
        environment: "dev",
        log_level,
        event_type,
        trace_id,
        user_id,
        message,
    };

    console.log(JSON.stringify(log));
    return trace_id;
}

module.exports = { logEvent };
