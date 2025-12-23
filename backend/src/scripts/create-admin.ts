import { db } from '../db';
import { admins } from '../db/schema';

// Script untuk membuat admin pertama
const createFirstAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@sahabatanak.org';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const fullName = process.env.ADMIN_FULLNAME || 'Super Admin';

  try {
    // Cek apakah sudah ada admin
    const [existingAdmin] = await db.select().from(admins).limit(1);

    if (existingAdmin) {
      console.log('❌ Admin sudah ada di database!');
      console.log(`   Username: ${existingAdmin.username}`);
      return;
    }

    // Hash password
    const hashedPassword = await Bun.password.hash(password);

    // Buat admin baru
    await db.insert(admins).values({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: 'super_admin',
    });

    console.log('✅ Admin berhasil dibuat!');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('   Role: super_admin');
    console.log('\n⚠️  Segera ganti password setelah login!');
  } catch (error) {
    console.error('❌ Error membuat admin:', error);
  }

  process.exit(0);
};

createFirstAdmin();
