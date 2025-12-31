import { db } from '../db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Running migration: add-volunteer-photo');
    
    // Check if column already exists
    const [result] = await db.execute(sql`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'volunteers' 
        AND COLUMN_NAME = 'photo'
    `) as any;
    
    if (result && result.length > 0) {
      console.log('✅ Column "photo" already exists. Skipping migration.');
      return;
    }
    
    // Run migration
    await db.execute(sql`
      ALTER TABLE volunteers 
      ADD COLUMN photo VARCHAR(255) AFTER availability
    `);
    
    console.log('✅ Migration completed successfully!');
    console.log('   Added column: volunteers.photo VARCHAR(255)');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

runMigration();
