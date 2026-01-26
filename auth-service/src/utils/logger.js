function logEvent({
                      service,
                      event_type,
                      event_category,
                      severity = "low",

                      request_id,
                      method,
                      endpoint,
                      status_code,
                      response_time_ms,

                      user_id,
                      user_role,
                      source_ip,

                      message
                  }) {
    const log = {
        "@timestamp": new Date().toISOString(),
        service,
        environment: "prod",

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

        message
    };

    process.stdout.write(JSON.stringify(log) + "\n");
}

module.exports = { logEvent };