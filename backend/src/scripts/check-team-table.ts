import { db } from '../db/index.ts';

async function checkTable() {
  const result = await db.execute('DESCRIBE team_members');
  console.log('Table structure:');
  console.log(result);
  process.exit(0);
}

checkTable();
