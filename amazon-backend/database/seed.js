require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
  ssl: {
    rejectUnauthorized: false
  }
};

const connectWithRetry = async () => {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await mysql.createConnection(dbConfig);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`⏳ DB connection failed, retrying (${i + 1}/${maxRetries})...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

/* ---------- HELPERS ---------- */
function cleanProductTitle(rawTitle) {
  let title = rawTitle.replace(/_/g, ' ');
  title = title.replace(/\b\d+GB\b|\b\d+TB\b|\bRAM\b|\bROM\b/gi, '');
  title = title.replace(/\(.*?\)/g, '');
  title = title.replace(/5G|4G|Mobile Phone|Smartphone/gi, '');
  return title.replace(/\s+/g, ' ').trim();
}

function determineCategory(title) {
  const t = title.toLowerCase();
  if (
    t.includes('iphone') || t.includes('samsung') || t.includes('oneplus') ||
    t.includes('laptop') || t.includes('macbook') || t.includes('headphone') ||
    t.includes('speaker')
  ) return 1;

  if (t.includes('shirt') || t.includes('shoe') || t.includes('jeans')) return 3;
  return 6;
}

/* ---------- SEED ---------- */
async function seedDatabase() {
  let connection;

  try {
    console.log('🌱 Starting Aiven database seeding...');

    const imagesDir = path.join(__dirname, '../public/gems');
    if (!fs.existsSync(imagesDir)) {
      throw new Error('public/gems directory not found');
    }

    const gemFiles = fs.readdirSync(imagesDir)
      .filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

    if (!gemFiles.length) {
      throw new Error('No images found in public/gems');
    }

    connection = await connectWithRetry();

    /* 1️⃣ CREATE SCHEMA FIRST */
    console.log('📊 Creating schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schema);

    /* 2️⃣ CLEAN TABLES */
    console.log('🧹 Cleaning existing data...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query(`
      TRUNCATE TABLE OrderItems;
      TRUNCATE TABLE Orders;
      TRUNCATE TABLE WishlistItems;
      TRUNCATE TABLE CartItems;
      TRUNCATE TABLE ProductImages;
      TRUNCATE TABLE Products;
      TRUNCATE TABLE Categories;
      TRUNCATE TABLE Users;
    `);
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    /* 3️⃣ USERS */
    console.log('👤 Inserting users...');
    await connection.query(`
      INSERT INTO Users (name, email, default_shipping_address) VALUES
      ('Harsh', 'harsh@example.com', 'New Delhi, India'),
      ('Vinay', 'vinay@example.com', 'Mumbai, India')
    `);

    /* 4️⃣ CATEGORIES */
    console.log('📂 Inserting categories...');
    const categories = [
      'Electronics', 'Books', 'Fashion', 'Gaming', 'Kitchen',
      'Home', 'Beauty', 'Toys', 'Sports', 'Automotive'
    ];
    for (const name of categories) {
      await connection.query(`INSERT INTO Categories (name) VALUES (?)`, [name]);
    }

    /* 5️⃣ PRODUCTS */
    console.log('📦 Inserting products...');
    const BASE_URL =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    for (const file of gemFiles) {
      const name = path.parse(file).name;
      const parts = name.split('_');
      const asin = parts.pop();
      const title = cleanProductTitle(parts.join(' '));
      const categoryId = determineCategory(title);

      const [productRes] = await connection.query(
        `INSERT INTO Products
         (title, asin, description, price, stock_quantity, category_id, rating, review_count, specifications)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, '{}')`,
        [
          title,
          asin,
          `Premium quality ${title}`,
          (Math.random() * 50000 + 500).toFixed(2),
          50,
          categoryId,
          (Math.random() * 1.5 + 3.5).toFixed(1),
          Math.floor(Math.random() * 2000)
        ]
      );

      await connection.query(
        `INSERT INTO ProductImages (product_id, image_url, is_primary, display_order)
         VALUES (?, ?, true, 0)`,
        [productRes.insertId, `${BASE_URL}/gems/${file}`]
      );
    }

    console.log('✅ AIVEN SEED COMPLETE');

  } catch (err) {
    console.error('❌ SEED FAILED:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

seedDatabase();
