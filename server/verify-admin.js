// Simple script to verify admin user exists and login works
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { Admin } from './src/models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function verifyAdmin() {
  try {
    console.log('🔍 Verifying Admin Setup...\n');
    
    await connectDB(process.env.MONGODB_URI);
    
    // Check if admin exists
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user NOT found!');
      console.log('💡 Run: npm run seed:admin\n');
      process.exit(1);
    }
    
    console.log('✅ Admin user found');
    console.log('   Username:', admin.username);
    console.log('   Role:', admin.role);
    console.log('   Created:', admin.createdAt);
    
    // Test password
    const passwordMatch = await bcrypt.compare('Admin@123', admin.passwordHash);
    
    if (passwordMatch) {
      console.log('✅ Default password verified\n');
      console.log('📋 Login Credentials:');
      console.log('   Username: admin');
      console.log('   Password: Admin@123\n');
      console.log('🌐 Access at: http://localhost:5175/admin.html');
    } else {
      console.log('⚠️  Password has been changed from default');
      console.log('💡 Use your custom password\n');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAdmin();
