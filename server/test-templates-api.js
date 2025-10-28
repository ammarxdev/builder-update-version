// Quick test script to verify templates API
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/templates';

async function testTemplatesAPI() {
  try {
    console.log('🔍 Testing Templates API...\n');
    console.log(`Fetching from: ${API_URL}\n`);
    
    const response = await fetch(API_URL);
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(result, null, 2));
    
    if (result.data && Array.isArray(result.data)) {
      console.log(`\n✅ Found ${result.data.length} templates:\n`);
      result.data.forEach((template, index) => {
        console.log(`${index + 1}. ${template.title}`);
        console.log(`   - Category: ${template.category}`);
        console.log(`   - Colors: ${template.colors?.join(', ')}`);
        console.log(`   - HTML Length: ${template.html?.length || 0} characters`);
        console.log(`   - ID: ${template._id}\n`);
      });
    } else {
      console.log('❌ No templates found or unexpected format');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testTemplatesAPI();
