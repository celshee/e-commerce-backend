const db = require("../config/db");

exports.addToCart = async ({ userId, productId, quantity }) => {
  // Upsert quantity
  const q = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
    RETURNING user_id, product_id, quantity, updated_at
  `;
  const r = await db.query(q, [userId, productId, quantity]);
  return r.rows[0];
};

exports.removeFromCart = async ({ userId, productId, quantity }) => {
  // If quantity is null -> remove item entirely
  if (quantity == null) {
    const r = await db.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING product_id`,
      [userId, productId]
    );
    return { removed: r.rows.length > 0, mode: "delete" };
  }

  // Decrement quantity; delete if goes to <=0
  const r = await db.query(
    `
    UPDATE cart_items
    SET quantity = quantity - $3,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1 AND product_id = $2
    RETURNING quantity
    `,
    [userId, productId, quantity]
  );

  if (!r.rows.length) return { removed: false, mode: "not_found" };

  const newQty = r.rows[0].quantity;

  if (newQty <= 0) {
    await db.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );
    return { removed: true, mode: "delete_after_decrement" };
  }

  return { removed: true, mode: "decrement", quantity: newQty };
};

exports.getCart = async (userId) => {
  
  const q = `
    SELECT
      ci.id as cart_item_id,
      ci.product_id,
      ci.quantity,
      p.name,
      p.price,
      p.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = $1
    ORDER BY ci.updated_at DESC
  `;
  const r = await db.query(q, [userId]);
  return r.rows;
};

exports.clearCart = async (userId) => {
  await db.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
};
exports.getCartItemsByIdsForUser = async (userId, cartItemIds) => {
  const q = `
    SELECT
      ci.id               AS cart_item_id,
      ci.product_id,
      ci.quantity,
      p.name              AS product_name,
      p.price
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = $1
      AND ci.id = ANY($2::uuid[])
  `;
  const r = await db.query(q, [userId, cartItemIds]);
  return r.rows;
};


exports.deleteCartItemsByIdsForUser = async (userId, cartItemIds) => {
  const q = `
    DELETE FROM cart_items
    WHERE user_id = $1
      AND id = ANY($2::uuid[])
  `;
  await db.query(q, [userId, cartItemIds]);
};