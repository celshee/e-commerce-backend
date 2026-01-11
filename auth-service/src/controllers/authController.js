const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logEvent } = require("../utils/logger");

const users = [];

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const source_ip = req.ip;

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email, password: hashed };
    users.push(user);

    logEvent({
        event_type: "user_registered",
        user_id: user.id,
        source_ip,
        message: "User registered",
        http_status: 201
    });

    res.status(201).json({ message: "User registered" });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const source_ip = req.ip;

    const user = users.find(u => u.email === email);

    logEvent({
        event_type: "login_attempt",
        user_id: user?.id || null,
        source_ip,
        message: "Login attempt"
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        logEvent({
            event_type: "login_failure",
            log_level: "WARN",
            user_id: user?.id || null,
            source_ip,
            message: "Invalid credentials",
            http_status: 401
        });

        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, "secret", { expiresIn: "1h" });

    logEvent({
        event_type: "login_success",
        user_id: user.id,
        source_ip,
        message: "Login successful",
        http_status: 200
    });

    res.json({ token });
};
