const db = require("../config/db");

exports.createOrder = async ({ id, user_id, total_amount, status }) => {
  const q = `
    INSERT INTO orders (id, user_id, total_amount, status)
    VALUES ($1, $2, $3, $4)
  `;
  await db.query(q, [id, user_id, total_amount, status]);
};

exports.addOrderItem = async ({ id, order_id, product_name, price, quantity, product_id = null }) => {
  // product_id is optional (only if you added it in DB). If your table doesn't have it, ignore it.
  // We'll insert only known columns:
  const q = `
    INSERT INTO order_items (id, order_id, product_name, price, quantity)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await db.query(q, [id, order_id, product_name, price, quantity]);
};

exports.getOrdersByUser = async (user_id) => {
  const r = await db.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [user_id]
  );
  return r.rows;
};

exports.getOrderById = async (orderId) => {
  const orderRes = await db.query("SELECT * FROM orders WHERE id = $1", [orderId]);
  if (!orderRes.rows.length) return null;

  const itemsRes = await db.query("SELECT * FROM order_items WHERE order_id = $1", [orderId]);

  return {
    ...orderRes.rows[0],
    items: itemsRes.rows
  };
};

exports.updateOrderStatus = async (orderId, status) => {
  const q = `UPDATE orders SET status = $1 WHERE id = $2`;
  await db.query(q, [status, orderId]);
};