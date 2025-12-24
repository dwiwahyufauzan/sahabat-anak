import { db } from '../db';

async function runMigration() {
  try {
    console.log('Running migration: remove unused team fields...');
    
    // Remove unused columns
    await db.execute(`ALTER TABLE team_members DROP COLUMN IF EXISTS position`);
    console.log('✓ Dropped column: position');
    
    await db.execute(`ALTER TABLE team_members DROP COLUMN IF EXISTS image`);
    console.log('✓ Dropped column: image');
    
    await db.execute(`ALTER TABLE team_members DROP COLUMN IF EXISTS alt`);
    console.log('✓ Dropped column: alt');
    
    await db.execute(`ALTER TABLE team_members DROP COLUMN IF EXISTS linkedin`);
    console.log('✓ Dropped column: linkedin');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
