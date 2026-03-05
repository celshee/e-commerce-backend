const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");
const requestContext = require("./middlewares/requestContext");
const middleware = require("./middlewares/middleware");

const app = express();

app.use(requestContext);
app.use(express.json());

app.use("/payment",paymentRoutes);

module.exports = app;