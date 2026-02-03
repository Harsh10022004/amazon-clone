const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool (Aiven / Render compatible)
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Aiven requires SSL
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully (Aiven)');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
