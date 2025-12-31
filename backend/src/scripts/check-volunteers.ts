import { db } from '../db';
import { volunteers } from '../db/schema';

async function checkVolunteers() {
  try {
    console.log('Checking volunteers data...\n');
    
    const allVolunteers = await db.select().from(volunteers);
    
    console.log(`Total volunteers: ${allVolunteers.length}\n`);
    
    allVolunteers.forEach((volunteer, index) => {
      console.log(`${index + 1}. ${volunteer.name}`);
      console.log(`   ID: ${volunteer.id}`);
      console.log(`   Email: ${volunteer.email}`);
      console.log(`   Photo: ${volunteer.photo || 'No photo'}`);
      console.log(`   Status: ${volunteer.status}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkVolunteers();
