require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function verifyData() {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.query(`
      SELECT p.id, p.title, pi.image_url 
      FROM Products p 
      LEFT JOIN ProductImages pi ON p.id = pi.product_id 
      WHERE pi.is_primary = 1
      LIMIT 20
    `);

        console.log('--- DB Content Verification ---');
        rows.forEach(row => {
            console.log(`[${row.id}] ${row.title.substring(0, 20)}... -> ${row.image_url}`);
        });

        await conn.end();
    } catch (err) {
        console.error(err);
    }
}

verifyData();
