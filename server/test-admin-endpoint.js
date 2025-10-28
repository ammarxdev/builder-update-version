// Quick test to verify admin login endpoint
import fetch from 'node-fetch';

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login Endpoint...\n');
    
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'Admin@123'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.token) {
      console.log('\n✅ Admin login working!');
      console.log('Token:', data.token.substring(0, 20) + '...');
    } else {
      console.log('\n❌ Login failed:', data.message);
    }
    
  } catch (error) {
    console.log('\n❌ Error:', error.message);
    console.log('\n💡 Make sure backend is running on port 5000');
  }
}

testAdminLogin();
