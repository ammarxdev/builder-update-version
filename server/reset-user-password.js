// Reset a specific user's password
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './src/config/db.js';
import { User } from './src/models/User.js';

dotenv.config();

async function resetUserPassword() {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    const email = 'aaaaaa@gmail.com';
    const newPassword = 'password123';
    
    console.log(`🔄 Resetting password for ${email}...\n`);

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    console.log('\n🔒 This is a simple password for testing.\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetUserPassword();
