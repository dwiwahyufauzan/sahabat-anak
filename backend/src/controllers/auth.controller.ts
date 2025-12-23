import { db } from '../db';
import { admins } from '../db/schema';
import { eq } from 'drizzle-orm';

export class AuthController {
  static async register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: 'super_admin' | 'admin' | 'editor';
  }) {
    // Check if username already exists
    const [existingUsername] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, data.username))
      .limit(1);

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const [existingEmail] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, data.email))
      .limit(1);

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await Bun.password.hash(data.password);

    // Create new admin
    const result = await db.insert(admins).values({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: data.role || 'admin',
    });

    const adminId = result[0].insertId;

    return {
      id: adminId,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role || 'admin',
    };
  }

  static async login(username: string, password: string) {
    // Find admin by username
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await Bun.password.verify(password, admin.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new Error('Account is disabled');
    }

    // Update last login
    await db
      .update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.id, admin.id));

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    };
  }

  static async getProfile(adminId: number) {
    const [admin] = await db
      .select({
        id: admins.id,
        username: admins.username,
        email: admins.email,
        fullName: admins.fullName,
        role: admins.role,
        isActive: admins.isActive,
        lastLogin: admins.lastLogin,
      })
      .from(admins)
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!admin || !admin.isActive) {
      throw new Error('Admin not found');
    }

    return admin;
  }
}
