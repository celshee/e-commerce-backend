
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});
