import { db } from '../db';
import { events } from '../db/schema';
import { sql } from 'drizzle-orm';

async function fixEventImagePaths() {
  console.log('Fixing event image paths...');
  
  try {
    // Update all event images that don't start with /uploads/
    await db.execute(sql`
      UPDATE events 
      SET image = CONCAT('/uploads/', image)
      WHERE image IS NOT NULL 
      AND image != '' 
      AND image NOT LIKE '/uploads/%'
    `);
    
    console.log('✅ Event image paths updated successfully!');
    
    // Show updated events
    const allEvents = await db.select().from(events);
    console.log('\nUpdated events:');
    allEvents.forEach(event => {
      console.log(`- ${event.name}: ${event.image || 'No image'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  }
  
  process.exit(0);
}

fixEventImagePaths();
