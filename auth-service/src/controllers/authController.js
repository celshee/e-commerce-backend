const authService = require("../services/authService");
const { logEvent } = require("../utils/logger");

exports.register = async (req, res) => {
    const requestId = req.headers["x-request-id"] || "";
    const endpoint = req.originalUrl;
    const method = req.method;
    const userEmail = req.body.email;

    try {
        await authService.register(userEmail, req.body.password);


        logEvent({
            service: "auth-service",
            event_type: "user_registration",
            event_category: "authentication",
            severity: "low",
            request_id: requestId,
            method,
            endpoint,
            status_code: 201,
            response_time_ms: 0,
            user_id: userEmail,
            user_role: "user",
            source_ip: req.ip,
            message: `User registered successfully: ${userEmail}`
        });

        res.status(201).json({ message: "User registered" });
    } catch (err) {

        logEvent({
            service: "auth-service",
            event_type: "user_registration_failed",
            event_category: "authentication",
            severity: "high",
            request_id: requestId,
            method,
            endpoint,
            status_code: 500,
            response_time_ms: 0,
            user_id: userEmail,
            user_role: "user",
            source_ip: req.ip,
            message: `Registration failed for ${userEmail}: ${err.message}`
        });

        console.error("REGISTER ERROR:", err);
        res.status(500).json({
            error: "Internal server error",
            details: err.message
        });
    }
};

exports.login = async (req, res) => {
    const requestId = req.headers["x-request-id"] || "";
    const endpoint = req.originalUrl;
    const method = req.method;
    const userEmail = req.body.email;

    try {
        const token = await authService.login(userEmail, req.body.password);


        logEvent({
            service: "auth-service",
            event_type: "user_login",
            event_category: "authentication",
            severity: "low",
            request_id: requestId,
            method,
            endpoint,
            status_code: 200,
            response_time_ms: 0,
            user_id: userEmail,
            user_role: "user",
            source_ip: req.ip,
            message: `User logged in successfully: ${userEmail}`
        });

        res.json({ token });
    } catch (err) {

        logEvent({
            service: "auth-service",
            event_type: "user_login_failed",
            event_category: "authentication",
            severity: "medium",
            request_id: requestId,
            method,
            endpoint,
            status_code: 401,
            response_time_ms: 0,
            user_id: userEmail,
            user_role: "user",
            source_ip: req.ip,
            message: `Login failed for ${userEmail}: Invalid credentials`
        });

        res.status(401).json({ error: "Invalid credentials" });
    }
};
