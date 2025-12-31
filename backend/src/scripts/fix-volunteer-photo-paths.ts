import { db } from '../db';
import { volunteers } from '../db/schema';
import { sql } from 'drizzle-orm';

async function fixPhotoPaths() {
  try {
    console.log('Fixing volunteer photo paths...\n');
    
    // Update all volunteer photos to remove /uploads/ prefix
    const result = await db.execute(sql`
      UPDATE volunteers 
      SET photo = REPLACE(photo, '/uploads/', '')
      WHERE photo LIKE '/uploads/%'
    `);
    
    console.log('Photo paths fixed!');
    console.log('Affected rows:', result);
    
    // Show updated data
    const allVolunteers = await db.select().from(volunteers);
    console.log('\nUpdated volunteers:');
    allVolunteers.forEach((v) => {
      if (v.photo) {
        console.log(`- ${v.name}: ${v.photo}`);
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPhotoPaths();
