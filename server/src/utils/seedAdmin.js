import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';

dotenv.config();

async function seedAdmin() {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const existing = await Admin.findOne({ username: 'admin' });
    
    if (existing) {
      console.log('⚠️  Admin user already exists');
      console.log('   Username: admin');
      console.log('   Use existing password or delete and re-seed');
      process.exit(0);
    }

    // Create default admin
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      username: 'admin',
      passwordHash,
      role: 'super_admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password:', password);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
