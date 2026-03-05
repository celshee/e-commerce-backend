const express = require("express");
const orderRoutes = require("./routes/orderRoutes");
const requestContext = require("./middlewares/requestContext");

const app = express();

app.use(requestContext);
app.use(express.json());

app.use("/orders", orderRoutes);

module.exports = app;