import { mysqlTable, varchar, text, timestamp, datetime, int, decimal, mysqlEnum, json } from 'drizzle-orm/mysql-core';

// Admin table
export const admins = mysqlTable('admins', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // hashed password
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['super_admin', 'admin', 'editor']).default('admin'),
  isActive: int('is_active').default(1),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Program table
export const programs = mysqlTable('programs', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(), // Short description
  fullDescription: text('full_description'), // Long description for detail page
  category: varchar('category', { length: 100 }).notNull(),
  categoryColor: varchar('category_color', { length: 50 }).default('blue'), // blue, orange, green, purple
  icon: varchar('icon', { length: 100 }).default('menu_book'), // Material icon name
  image: varchar('image', { length: 255 }), // Thumbnail image
  heroImage: varchar('hero_image', { length: 255 }), // Hero banner for detail page
  targetAmount: decimal('target_amount', { precision: 15, scale: 2 }),
  currentAmount: decimal('current_amount', { precision: 15, scale: 2 }).default('0'),
  location: varchar('location', { length: 255 }),
  locations: text('locations'), // JSON array of locations
  targetAudience: text('target_audience'), // Target audience description
  scheduleFrequency: varchar('schedule_frequency', { length: 255 }), // e.g., "3x seminggu"
  scheduleDuration: varchar('schedule_duration', { length: 255 }), // e.g., "2 jam per sesi"
  objectives: text('objectives'), // JSON array of objectives
  activities: text('activities'), // JSON array of activities
  testimonials: text('testimonials'), // JSON array of testimonials
  impact: text('impact'), // JSON array of impact stats
  status: mysqlEnum('status', ['active', 'completed', 'archived']).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// News/Berita table
export const news = mysqlTable('news', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  image: varchar('image', { length: 255 }),
  category: varchar('category', { length: 100 }),
  author: varchar('author', { length: 100 }),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Donations table
export const donations = mysqlTable('donations', {
  id: int('id').primaryKey().autoincrement(),
  programId: int('program_id').references(() => programs.id),
  donorName: varchar('donor_name', { length: 255 }).notNull(),
  donorEmail: varchar('donor_email', { length: 255 }).notNull(),
  donorPhone: varchar('donor_phone', { length: 50 }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  isAnonymous: int('is_anonymous').default(0),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'completed', 'failed']).default('pending'),
  paymentProof: varchar('payment_proof', { length: 255 }),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Volunteers table
export const volunteers = mysqlTable('volunteers', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  skills: text('skills'),
  motivation: text('motivation'),
  availability: varchar('availability', { length: 100 }),
  photo: varchar('photo', { length: 255 }),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact messages table
export const contactMessages = mysqlTable('contact_messages', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: mysqlEnum('status', ['unread', 'read', 'replied']).default('unread'),
  reply: text('reply'),
  repliedAt: timestamp('replied_at'),
  repliedBy: int('replied_by').references(() => admins.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Team members table
export const teamMembers = mysqlTable('team_members', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  bio: text('bio'),
  photo: varchar('photo', { length: 255 }),
  teamType: mysqlEnum('team_type', ['leadership', 'coordinators']).default('coordinators'),
  order: int('order').default(0),
  isActive: int('is_active').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Events table
export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  venue: varchar('venue', { length: 255 }).notNull(), // Tempat
  eventType: mysqlEnum('event_type', ['offline', 'online']).notNull(), // Offline/Online
  objectives: text('objectives'), // Tujuan
  targetAudience: varchar('target_audience', { length: 255 }), // Target audiens
  startDate: datetime('start_date').notNull(), // Tanggal mulai
  endDate: datetime('end_date').notNull(), // Tanggal berakhir
  startTime: varchar('start_time', { length: 10 }).notNull(), // Jam mulai (HH:MM)
  endTime: varchar('end_time', { length: 10 }).notNull(), // Jam berakhir (HH:MM)
  image: varchar('image', { length: 255 }), // Foto event
  status: mysqlEnum('status', ['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
