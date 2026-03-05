const express = require("express");
const authRoutes = require("./routes/authRoutes");
const requestContext = require("./middlewares/requestContext");

const app = express();

app.use(requestContext);
app.use(express.json());
app.use("/auth", authRoutes);

module.exports = app;
