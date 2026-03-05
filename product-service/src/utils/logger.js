function logEvent({
    service = "product-service",
    event_type,
    event_category = "product",
    severity = "low",

    request_id,
    method,
    endpoint,
    status_code,
    response_time_ms,

    user_id = null,
    user_role = "user",
    source_ip = null,

    product_id = null,
    cart_product_id = null,
    cart_quantity = null,

    message
}) {
    const log = {
        "@timestamp": new Date().toISOString(),
        service,
        service_instance: null,
        environment: process.env.NODE_ENV || "prod",

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
            product_id,
            cart_product_id,
            cart_quantity
        },

        message
    };

    process.stdout.write(JSON.stringify(log) + "\n");
}

module.exports = { logEvent };