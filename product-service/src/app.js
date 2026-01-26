require("dotenv").config();
const express = require("express");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use("/products", productRoutes);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
