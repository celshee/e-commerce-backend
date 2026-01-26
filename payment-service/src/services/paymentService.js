const { v4: uuidv4 } = require("uuid");
const paymentRepo = require("../repositories/paymentRepository");
const eventBus = require("../utils/eventBus"); // for publishing payment events

exports.processPayment = async (order) => {
    const paymentId = uuidv4();
    const { orderId, userId, totalAmount } = order;

    // Simulate payment (90% success rate)
    const success = Math.random() > 0.1;
    const status = success ? "SUCCESS" : "FAILED";
    const failureReason = success ? null : "Card declined";

    // Save to DB
    await paymentRepo.createPayment({
        id: paymentId,
        order_id: orderId,
        user_id: userId,
        amount: totalAmount,
        status,
        failure_reason: failureReason
    });

    // Publish event to SNS
    await eventBus.publishPaymentEvent({
        paymentId,
        orderId,
        userId,
        amount: totalAmount,
        status,
        failureReason,
        createdAt: new Date().toISOString()
    });

    return { paymentId, status };
};
