import { db } from '../db';
import { sql } from 'drizzle-orm';

async function addTeamPhotoAndType() {
  console.log('Adding photo and team_type columns to team_members table...');

  try {
    // Add photo column (VARCHAR 255)
    await db.execute(sql`
      ALTER TABLE team_members 
      ADD COLUMN photo VARCHAR(255) NULL AFTER bio
    `);
    console.log('✓ Added column: photo');

    // Add team_type column (ENUM with leadership/coordinators)
    await db.execute(sql`
      ALTER TABLE team_members 
      ADD COLUMN team_type ENUM('leadership', 'coordinators') DEFAULT 'coordinators' AFTER photo
    `);
    console.log('✓ Added column: team_type');

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }

  process.exit(0);
}

addTeamPhotoAndType();
