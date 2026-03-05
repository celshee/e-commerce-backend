const express = require("express");
const router = express.Router();

const auth = require("../middlewares/middleware");
const paymentController = require("../controllers/paymentController");

router.post("/pay", auth, paymentController.pay);

module.exports = router;