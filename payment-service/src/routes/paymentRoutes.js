const express = require("express");
const { processPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/pay", processPayment);


const paymentService = require("../services/paymentService");

// For manual payment testing
router.post("/pay", async (req, res) => {
    try {
        const payment = await paymentService.processPayment(req.body);
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: "Payment failed" });
    }
});

module.exports = router;
