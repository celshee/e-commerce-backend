const db = require("../config/db");

exports.createPayment = async (payment) => {
    const { id, order_id, user_id, amount, status, failure_reason } = payment;

    const query = `
        INSERT INTO payments (id, order_id, user_id, amount, status, failure_reason)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(query, [id, order_id, user_id, amount, status, failure_reason]);
};

exports.updatePaymentStatus = async (paymentId, status, failure_reason = null) => {
    const query = `
        UPDATE payments
        SET status=$1, failure_reason=$2
        WHERE id=$3
    `;
    await db.query(query, [status, failure_reason, paymentId]);
};
