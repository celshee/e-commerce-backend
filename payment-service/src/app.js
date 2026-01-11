const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");
const authenticate = require("./middlewares/middleware");
const app = express();
app.use(express.json());
app.use(authenticate);
app.use("/", paymentRoutes);
module.exports = app;
