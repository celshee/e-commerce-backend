const db = require("../config/db");

exports.createOrder = async (order) => {
    const { id, user_id, total_amount, status } = order;
    const query = `
        INSERT INTO orders (id, user_id, total_amount, status)
        VALUES ($1, $2, $3, $4)
    `;
    await db.query(query, [id, user_id, total_amount, status]);
};

exports.addOrderItem = async (item) => {
    const { id, order_id, product_name, price, quantity } = item;
    const query = `
        INSERT INTO order_items (id, order_id, product_name, price, quantity)
        VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [id, order_id, product_name, price, quantity]);
};

exports.getOrdersByUser = async (user_id) => {
    const res = await db.query(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
        [user_id]
    );
    return res.rows;
};
exports.updateOrderStatus = async (orderId, status) => {
    const query = `
        UPDATE orders
        SET status=$1
        WHERE id=$2
    `;
    await db.query(query, [status, orderId]);
};

exports.getOrderById = async (orderId) => {
    const orderRes = await db.query("SELECT * FROM orders WHERE id=$1", [orderId]);
    const itemsRes = await db.query("SELECT * FROM order_items WHERE order_id=$1", [orderId]);

    if (!orderRes.rows.length) return null;

    return {
        ...orderRes.rows[0],
        items: itemsRes.rows
    };
};
