import mysql from 'mysql2/promise';
import { env } from '../config/env';

const createEventsTableSQL = `
CREATE TABLE IF NOT EXISTS \`events\` (
	\`id\` int AUTO_INCREMENT NOT NULL,
	\`slug\` varchar(255) NOT NULL,
	\`name\` varchar(255) NOT NULL,
	\`description\` text NOT NULL,
	\`venue\` varchar(255) NOT NULL,
	\`event_type\` enum('offline','online') NOT NULL,
	\`objectives\` text,
	\`target_audience\` varchar(255),
	\`start_date\` datetime NOT NULL,
	\`end_date\` datetime NOT NULL,
	\`start_time\` varchar(10) NOT NULL,
	\`end_time\` varchar(10) NOT NULL,
	\`image\` varchar(255),
	\`status\` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
	\`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT \`events_id\` PRIMARY KEY(\`id\`),
	CONSTRAINT \`events_slug_unique\` UNIQUE(\`slug\`)
);
`;

async function createEventsTable() {
  console.log('🔄 Creating events table...');
  
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  try {
    await connection.execute(createEventsTableSQL);
    console.log('✅ Events table created successfully!');
  } catch (error: any) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  Events table already exists');
    } else {
      console.error('❌ Failed to create events table:', error);
      process.exit(1);
    }
  }

  await connection.end();
  process.exit(0);
}

createEventsTable();
