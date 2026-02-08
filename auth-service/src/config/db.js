// const { Pool } = require("pg");
//
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     port: 5432,
//     ssl: { rejectUnauthorized: false }
// });
//
// module.exports = pool;





const { Pool } = require("pg");

const pool = new Pool({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    family: 4
});

module.exports = pool;
