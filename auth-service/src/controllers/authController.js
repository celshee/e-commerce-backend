const authService = require("../services/authService");
const { logEvent } = require("../utils/logger");

exports.register = async (req, res) => {
  const requestId = req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;
  const userEmail = req.body.email;

  try {
    const { userId } = await authService.register(userEmail, req.body.password);

    logEvent({
      service: "auth-service",
      event_type: "user_registration",
      event_category: "authentication",
      severity: "low",
      request_id: req.requestId,
      method,
      endpoint,
      status_code: 201,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId, // uuid ✅
      user_role: "user",
      source_ip: req.ip,
      message: `User registered successfully: ${userEmail}`
    });

    res.status(201).json({ message: "User registered", userId });
  } catch (err) {
    if (err.message === "USER_ALREADY_EXISTS") {
      logEvent({
        service: "auth-service",
        event_type: "user_registration_failed",
        event_category: "authentication",
        severity: "medium",
        request_id: req.requestId,
        method,
        endpoint,
        status_code: 409,
        response_time_ms: req.responseTimeMs || 0,
        user_id: null,
        user_role: "user",
        source_ip: req.ip,
        message: `Registration failed for ${userEmail}: USER_ALREADY_EXISTS`
      });
      return res.status(409).json({ error: "USER_ALREADY_EXISTS" });
    }

    logEvent({
      service: "auth-service",
      event_type: "user_registration_failed",
      event_category: "authentication",
      severity: "high",
      request_id: req.requestId,
      method,
      endpoint,
      status_code: 500,
      response_time_ms: req.responseTimeMs || 0,
      user_id: null,
      user_role: "user",
      source_ip: req.ip,
      message: `Registration failed for ${userEmail}: ${err.message}`
    });

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const requestId = req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;
  const userEmail = req.body.email;

  try {
    const { token, userId } = await authService.login(userEmail, req.body.password);

    logEvent({
      service: "auth-service",
      event_type: "user_login",
      event_category: "authentication",
      severity: "low",
      request_id: req.requestId,
      method,
      endpoint,
      status_code: 200,
      response_time_ms: req.responseTimeMs || 0,
      user_id: userId, // uuid ✅
      user_role: "user",
      source_ip: req.ip,
      message: `User logged in successfully: ${userEmail}`
    });

    res.json({ token, userId });
  } catch (err) {
    logEvent({
      service: "auth-service",
      event_type: "user_login_failed",
      event_category: "authentication",
      severity: "medium",
      request_id: req.requestId,
      method,
      endpoint,
      status_code: 401,
      response_time_ms: req.responseTimeMs || 0,
      user_id: null,
      user_role: "user",
      source_ip: req.ip,
      message: `Login failed for ${userEmail}: Invalid credentials`
    });

    res.status(401).json({ error: "Invalid credentials" });
  }
};

exports.logout = async (req, res) => {
  const requestId = req.headers["x-request-id"] || "";
  const endpoint = req.originalUrl;
  const method = req.method;

  logEvent({
    service: "auth-service",
    event_type: "user_logout",
    event_category: "authentication",
    severity: "low",
    request_id: req.requestId,
    method,
    endpoint,
    status_code: 200,
    response_time_ms: req.responseTimeMs || 0,
    user_id: req.user?.userId || null,
    user_role: "user",
    source_ip: req.ip,
    message: "User logged out"
  });

  res.json({ message: "Logged out successfully" });
};