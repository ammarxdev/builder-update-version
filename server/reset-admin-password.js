// Reset admin password to a simple one
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './src/config/db.js';
import { Admin } from './src/models/Admin.js';

dotenv.config();

async function resetAdminPassword() {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    console.log('🔄 Resetting admin password...\n');

    // Delete existing admin
    await Admin.deleteMany({ username: 'admin' });
    console.log('✅ Removed old admin user');

    // Create new admin with simple password
    const newPassword = 'admin123';  // Simple password for testing
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await Admin.create({
      username: 'admin',
      passwordHash,
      role: 'super_admin'
    });

    console.log('\n✅ Admin user recreated successfully!');
    console.log('\n📋 NEW Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🔒 This is a SIMPLE password for testing.');
    console.log('   Change it to something secure later!\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAdminPassword();
