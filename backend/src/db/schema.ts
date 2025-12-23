import { mysqlTable, varchar, text, timestamp, int, decimal, mysqlEnum } from 'drizzle-orm/mysql-core';

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
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  image: varchar('image', { length: 255 }),
  targetAmount: decimal('target_amount', { precision: 15, scale: 2 }),
  currentAmount: decimal('current_amount', { precision: 15, scale: 2 }).default('0'),
  location: varchar('location', { length: 255 }),
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
  createdAt: timestamp('created_at').defaultNow(),
});

// Team members table
export const teamMembers = mysqlTable('team_members', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  image: varchar('image', { length: 255 }),
  bio: text('bio'),
  order: int('order').default(0),
  isActive: int('is_active').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});
