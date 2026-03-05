require("dotenv").config();
const express = require("express");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const requestContext = require("./middlewares/requestContext");

const app = express();

app.use(requestContext);
app.use(express.json());

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;