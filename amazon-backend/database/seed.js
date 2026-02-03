require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
};

const connectWithRetry = async () => {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await mysql.createConnection(dbConfig);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`Connection failed, retrying (${i + 1}/${maxRetries})...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

// "AI" Title Cleaner - Heuristic Based
function cleanProductTitle(rawTitle) {
  let title = rawTitle.replace(/_/g, ' '); // Replace underscores

  // Remove technical specs often found in filenames
  title = title.replace(/\b\d+GB\b/gi, '');
  title = title.replace(/\b\d+TB\b/gi, '');
  title = title.replace(/\bRAM\b/gi, '');
  title = title.replace(/\bROM\b/gi, '');
  title = title.replace(/\(.*\)/g, ''); // Remove content in parentheses e.g. (Black)
  title = title.replace(/5G/gi, '');
  title = title.replace(/4G/gi, '');
  title = title.replace(/Mobile Phone/gi, '');
  title = title.replace(/Smartphone/gi, '');
  title = title.replace(/\s+/g, ' ').trim(); // Collapse spaces

  return title.trim();
}

function determineCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('iphone') || t.includes('sams') || t.includes('redmi') || t.includes('oneplus') || t.includes('realme') || t.includes('iQOO') || t.includes('poco') || t.includes('moto')) return 1; // Electronics (Mobiles)
  if (t.includes('macbook') || t.includes('laptop') || t.includes('dell') || t.includes('hp') || t.includes('acer') || t.includes('asus') || t.includes('lenovo')) return 1; // Electronics (Laptops)
  if (t.includes('watch') || t.includes('band')) return 1; // Electronics (Wearables)
  if (t.includes('bud') || t.includes('phone') || t.includes('speaker') || t.includes('sound') || t.includes('boat') || t.includes('sony') || t.includes('jbl') || t.includes('noise')) return 1; // Electronics (Audio)
  if (t.includes('mouse') || t.includes('keyboard') || t.includes('monitor') || t.includes('cam') || t.includes('power bank') || t.includes('charger')) return 1; // Electronics (Accessories)

  if (t.includes('bag') || t.includes('pack')) return 3; // Fashion (Bags)
  if (t.includes('shirt') || t.includes('pant') || t.includes('jeans') || t.includes('shoe') || t.includes('puma') || t.includes('nike') || t.includes('adidas')) return 3; // Fashion

  return 6; // Home/Other default
}

async function seedDatabase() {
  let connection;
  try {
    console.log('🌱 Starting GEMS-BASED database seeding...');

    // 1. Scan Gems Images
    const imagesDir = path.join(__dirname, '../public/gems');
    let gemFiles = [];
    if (fs.existsSync(imagesDir)) {
      gemFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    } else {
      console.error('❌ Gems directory not found!');
      return;
    }
    console.log(`💎 Found ${gemFiles.length} GEM images.`);

    if (gemFiles.length === 0) {
      console.error('❌ No images found in public/gems');
      return;
    }

    connection = await connectWithRetry();

    // 2. FORCE CLEANUP
    console.log('🧹 Cleaning old database...');
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // 3. Schema
    console.log('📊 Creating schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schema);

    // 4. Users
    console.log('👤 Creating users...');
    await connection.query(`
      INSERT INTO Users (name, email, default_shipping_address) VALUES
      ('Harsh', 'harsh@example.com', '123 Main St, New Delhi, India'),
      ('Vinay', 'vinay@example.com', '456 Board Rd, Mumbai, India')
    `);

    // 5. Categories
    console.log('📂 Creating categories...');
    const categories = [
      'Electronics', 'Books', 'Fashion', 'Gaming', 'Kitchen',
      'Home', 'Beauty', 'Toys', 'Sports', 'Automotive'
    ];
    for (const cat of categories) {
      await connection.query(`INSERT INTO Categories (name) VALUES (?)`, [cat]);
    }

    // 6. Process Gems & Prepare Data
    console.log('🏭 Processing Gems and generating data...');
    const productsToInsert = [];
    const PORT = process.env.PORT || 5000;
    const baseUrl = `http://localhost:${PORT}/gems/`;

    for (const file of gemFiles) {
      // Parse Filename: Name_ASIN.jpg
      // Handling cases where name might have underscores
      // Strategy: Split by '_' and take the last part as ASIN (if it looks like ASIN), verify extension

      const nameWithoutExt = path.parse(file).name; // "iPhone 17_B0X..."
      const parts = nameWithoutExt.split('_');

      let asin = '';
      let rawTitle = '';

      if (parts.length >= 2) {
        // Assume last part is ASIN
        asin = parts[parts.length - 1];
        // Join the rest as title
        rawTitle = parts.slice(0, parts.length - 1).join(' ');
      } else {
        // Fallback if no underscore or ASIN pattern
        asin = 'UNKNOWN_' + Math.random().toString(36).substr(2, 9);
        rawTitle = nameWithoutExt;
      }

      // "AI" Cleaning
      const cleanTitle = cleanProductTitle(rawTitle);
      const categoryId = determineCategory(cleanTitle);

      const imageUrl = `${baseUrl}${file}`;

      productsToInsert.push({
        title: cleanTitle,
        asin: asin,
        description: `Experience the ${cleanTitle}. Featuring cutting-edge technology and premium design. Perfect for your daily needs. Rated highly by users.`,
        price: (Math.random() * 50000 + 500).toFixed(2), // Random price for now
        stock: 50,
        category_id: categoryId,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 2000),
        image: imageUrl
      });
    }

    // 7. Batch Insertion
    console.log(`📦 Inserting ${productsToInsert.length} products...`);
    const BATCH_SIZE = 200; // Smaller batch roughly for safety
    for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
      const batch = productsToInsert.slice(i, i + BATCH_SIZE);
      // Added 'asin' to placeholders
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
      const values = [];
      batch.forEach(p => {
        values.push(p.title, p.asin, p.description, p.price, p.stock, p.category_id, p.rating, p.reviews, '{}'); // {} for empty specs
      });

      const [res] = await connection.query(
        `INSERT INTO Products (title, asin, description, price, stock_quantity, category_id, rating, review_count, specifications) VALUES ${placeholders}`,
        values
      );

      const imageValues = [];
      const firstId = res.insertId;
      batch.forEach((p, idx) => {
        imageValues.push(firstId + idx, p.image, true, 0);
      });

      const imgPlaceholders = batch.map(() => '(?, ?, ?, ?)').join(',');
      await connection.query(
        `INSERT INTO ProductImages (product_id, image_url, is_primary, display_order) VALUES ${imgPlaceholders}`,
        imageValues
      );
      process.stdout.write('.');
    }

    console.log('\n✅ GEMS SEED COMPLETE.');

  } catch (err) {
    console.error('❌ SEED ERROR:', err);
  } finally {
    if (connection) await connection.end();
  }
}

seedDatabase();
