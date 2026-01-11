const express = require("express");
const orderRoutes = require("./routes/orderRoutes");
const authenticate = require("./middlewares/middleware");
const app = express();
app.use(express.json());
app.use(authenticate);
app.use("/", orderRoutes);


module.exports = app;
