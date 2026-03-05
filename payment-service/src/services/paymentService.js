const { v4: uuidv4 } = require("uuid");
const paymentRepo = require("../repositories/paymentRepository");
const eventBus = require("../utils/eventBus");

exports.processPayment = async ({ orderId, userId, amount }) => {
  const paymentId = uuidv4();

  const success = Math.random() > 0.1; // 90% success
  const status = success ? "SUCCESS" : "FAILED";
  const failureReason = success ? null : "Card declined";

  await paymentRepo.createPayment({
    id: paymentId,
    order_id: orderId,
    user_id: userId,
    amount,
    status,
    failure_reason: failureReason
  });

  await eventBus.publishPaymentEvent({
    paymentId,
    orderId,
    userId,
    amount,
    status,
    failureReason,
    createdAt: new Date().toISOString()
  });

  return { paymentId, status, failureReason };
};