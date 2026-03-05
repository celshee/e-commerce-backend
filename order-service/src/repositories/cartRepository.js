const db = require("../config/db");


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