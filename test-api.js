// Test script to verify API connections
// Run with: node test-api.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function testApiEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    console.log(`   Response:`, result);
    return { success: true, status: response.status, data: result };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: Error`);
    console.log(`   Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Seat Predictor API Endpoints\n');

  // Test Dashboard Endpoints
  console.log('📊 Dashboard Analytics:');
  await testApiEndpoint('/admin/dashboard/stats/');
  await testApiEndpoint('/admin/dashboard/comprehensive/');
  await testApiEndpoint('/admin/dashboard/rank-bands/');
  await testApiEndpoint('/admin/dashboard/states/');
  await testApiEndpoint('/admin/dashboard/specializations/');
  await testApiEndpoint('/admin/dashboard/categories/');
  await testApiEndpoint('/admin/dashboard/courses/');

  console.log('\n📤 Data Upload:');
  await testApiEndpoint('/admin/upload/history/');

  console.log('\n👥 User Searches:');
  await testApiEndpoint('/admin/user-searches/enhanced/');
  await testApiEndpoint('/admin/user-searches/analytics/');

  console.log('\n⚙️ System Settings:');
  await testApiEndpoint('/admin/settings/');
  await testApiEndpoint('/admin/settings/data-health/');
  await testApiEndpoint('/admin/settings/system-status/');

  console.log('\n🔐 Authentication:');
  await testApiEndpoint('/admin/login/', 'POST', {
    username: 'test',
    password: 'test'
  });

  console.log('\n✨ API Test Complete!');
  console.log('\nNote: Authentication errors are expected without valid tokens.');
  console.log('The important thing is that the endpoints are accessible and returning proper responses.');
}

// Run the tests
runTests().catch(console.error);
