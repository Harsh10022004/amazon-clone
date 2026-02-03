require('dotenv').config({ path: 'c:\\Users\\ASUS\\Desktop\\Working-Clone1\\amazon-backend\\.env' });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function checkData() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        const [products] = await connection.query(`
      SELECT 
        p.*,
        c.name as category_name,
        (SELECT image_url FROM ProductImages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE p.title LIKE '%iphone%'
    `);

        console.log('Product Data:', JSON.stringify(products, null, 2));
        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkData();
