import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { env } from '../config/env';

async function runMigration() {
  console.log('🔄 Starting migration...');
  
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  const db = drizzle(connection);

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  await connection.end();
  process.exit(0);
}

runMigration();
