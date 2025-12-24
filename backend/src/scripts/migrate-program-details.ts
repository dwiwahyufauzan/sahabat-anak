import { db } from '../db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migrate() {
  try {
    console.log('Starting migration: add-program-detail-fields...');
    
    const sql = readFileSync(
      join(process.cwd(), 'migrations', 'add-program-detail-fields.sql'),
      'utf-8'
    );
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 100) + '...');
      await db.execute(statement);
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
