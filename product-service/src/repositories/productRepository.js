const db = require("../config/db");

exports.createProduct = async ({ id, name, description, price, stock }) => {
    const query = `
        INSERT INTO products (id, name, description, price, stock)
        VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [id, name, description, price, stock]);
};

exports.getProductById = async (id) => {
    const res = await db.query("SELECT * FROM products WHERE id=$1", [id]);
    return res.rows[0];
};

exports.getAllProducts = async () => {
    const res = await db.query("SELECT * FROM products ORDER BY created_at DESC");
    return res.rows;
};

exports.updateProduct = async (id, updates) => {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in updates) {
        fields.push(`${key}=$${idx}`);
        values.push(updates[key]);
        idx++;
    }
    values.push(id);

    const query = `UPDATE products SET ${fields.join(", ")}, updated_at=CURRENT_TIMESTAMP WHERE id=$${idx}`;
    await db.query(query, values);
};

exports.deleteProduct = async (id) => {
    await db.query("DELETE FROM products WHERE id=$1", [id]);
};

exports.reduceStock = async (id, quantity) => {
    const query = `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2 AND stock >= $1
        RETURNING stock
    `;
    const res = await db.query(query, [quantity, id]);
    if (!res.rows.length) throw new Error("INSUFFICIENT_STOCK");
    return res.rows[0].stock;
};
