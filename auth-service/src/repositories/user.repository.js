const db = require("../config/db");

exports.createUser = async (id, email, passwordHash) => {
    const query = `
        INSERT INTO users (id, email, password_hash)
        VALUES ($1, $2, $3)
    `;
    await db.query(query, [id, email, passwordHash]);
};

exports.findByEmail = async (email) => {
    const result = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
};
