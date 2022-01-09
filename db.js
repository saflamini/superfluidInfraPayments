const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: process.env.PSQL_PASSWORD,
    host: "localhost",
    port: 5432,
    database: "streamingauth"
});

module.exports = pool;
