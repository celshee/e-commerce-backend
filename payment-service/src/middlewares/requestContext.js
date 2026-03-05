const { v4: uuidv4 } = require("uuid");

module.exports = function requestContext(req, res, next) {
  req.requestId = req.headers["x-request-id"] || uuidv4();

  const start = Date.now();
  res.on("finish", () => {
    req.responseTimeMs = Date.now() - start;
  });

  next();
};  