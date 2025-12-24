import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('🔄 Starting migration: Add reply fields to contact_messages...');

  try {
    // Check if columns already exist
    const columns = await db.execute(sql`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'sahabat_anak' 
        AND TABLE_NAME = 'contact_messages' 
        AND COLUMN_NAME IN ('reply', 'replied_at', 'replied_by')
    `);

    if (columns.length >= 3) {
      console.log('✅ Columns already exist. Migration skipped.');
      process.exit(0);
    }

    // Add reply column if not exists
    if (!columns.some((c: any) => c.COLUMN_NAME === 'reply')) {
      console.log('  Adding column: reply...');
      await db.execute(sql`ALTER TABLE contact_messages ADD COLUMN reply TEXT`);
    }

    // Add replied_at column if not exists
    if (!columns.some((c: any) => c.COLUMN_NAME === 'replied_at')) {
      console.log('  Adding column: replied_at...');
      await db.execute(sql`ALTER TABLE contact_messages ADD COLUMN replied_at TIMESTAMP NULL`);
    }

    // Add replied_by column if not exists
    if (!columns.some((c: any) => c.COLUMN_NAME === 'replied_by')) {
      console.log('  Adding column: replied_by...');
      await db.execute(sql`ALTER TABLE contact_messages ADD COLUMN replied_by INT NULL`);
    }

    // Add foreign key constraint
    try {
      console.log('  Adding foreign key constraint...');
      await db.execute(sql`
        ALTER TABLE contact_messages 
        ADD CONSTRAINT fk_contact_replied_by 
        FOREIGN KEY (replied_by) REFERENCES admins(id) 
        ON DELETE SET NULL
      `);
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
        console.log('  Foreign key already exists. Skipped.');
      } else {
        console.warn('  Warning: Could not add foreign key:', err.message);
      }
    }

    // Add indexes
    try {
      console.log('  Adding indexes...');
      await db.execute(sql`CREATE INDEX idx_contact_status ON contact_messages(status)`);
    } catch (err: any) {
      if (err.message?.includes('already exists') || err.message?.includes('Duplicate key')) {
        console.log('  Index idx_contact_status already exists. Skipped.');
      } else {
        console.warn('  Warning: Could not add index idx_contact_status:', err.message);
      }
    }

    try {
      await db.execute(sql`CREATE INDEX idx_contact_replied_by ON contact_messages(replied_by)`);
    } catch (err: any) {
      if (err.message?.includes('already exists') || err.message?.includes('Duplicate key')) {
        console.log('  Index idx_contact_replied_by already exists. Skipped.');
      } else {
        console.warn('  Warning: Could not add index idx_contact_replied_by:', err.message);
      }
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
