require('dotenv').config({ path: 'c:\\Users\\ASUS\\Desktop\\Working-Clone1\\amazon-backend\\.env' });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function verifyImages() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.query(`
      SELECT p.id, p.title, pi.image_url 
      FROM Products p 
      JOIN ProductImages pi ON p.id = pi.product_id 
      WHERE p.title LIKE '%iPhone%' AND pi.is_primary = 1
    `);

        console.log('iPhone Images in DB:');
        rows.forEach(r => console.log(`${r.id}: ${r.title.substring(0, 20)}... -> ${r.image_url}`));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

verifyImages();
