const { v4: uuidv4 } = require("uuid");

module.exports = function requestContext(req, res, next) {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.requestId = requestId;

  const start = Date.now();

  res.on("finish", () => {
    req.responseTimeMs = Date.now() - start;
  });

  next();
};