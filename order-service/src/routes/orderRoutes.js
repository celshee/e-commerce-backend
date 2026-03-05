const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/middleware");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getOrders);
router.get("/:id", authMiddleware, orderController.getOrderDetails);
router.post("/from-cart", authMiddleware, orderController.createOrderFromCart);
module.exports = router;
