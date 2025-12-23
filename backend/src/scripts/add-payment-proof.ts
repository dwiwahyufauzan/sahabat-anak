import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sahabat_anak',
});

console.log('🔄 Adding payment_proof column to donations table...');

try {
  await connection.query(
    `ALTER TABLE donations ADD COLUMN payment_proof VARCHAR(255) AFTER payment_status`
  );
  console.log('✅ payment_proof column added successfully!');
} catch (error: any) {
  if (error.code === 'ER_DUP_FIELDNAME') {
    console.log('ℹ️ payment_proof column already exists');
  } else {
    console.error('❌ Error adding column:', error);
  }
}

await connection.end();
process.exit(0);
