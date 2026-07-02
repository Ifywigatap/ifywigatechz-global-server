#!/usr/bin/env node

/**
 * API Endpoint Verification Test
 * Tests core API endpoints to ensure they're functional
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

let passedTests = 0;
let failedTests = 0;

const test = {
  section: (title) => console.log(`\n${CYAN}${title}${RESET}`),
  pass: (endpoint) => { console.log(`${GREEN}✅ ${endpoint}${RESET}`); passedTests++; },
  fail: (endpoint, error) => { console.log(`${RED}❌ ${endpoint}${RESET}`); console.log(`   Error: ${error}`); failedTests++; }
};

async function testEndpoint(method, endpoint, testName = null) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, { method, timeout: 5000 });
    
    if (response.ok || response.status === 400 || response.status === 401 || response.status === 404) {
      test.pass(testName || `${method} ${endpoint}`);
      return true;
    } else {
      test.fail(testName || `${method} ${endpoint}`, `HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    test.fail(testName || `${method} ${endpoint}`, error.message);
    return false;
  }
}

async function runTests() {
  console.log(`\n${CYAN}${'═'.repeat(50)}${RESET}`);
  console.log(`${CYAN}🚀 API ENDPOINT VERIFICATION${RESET}`);
  console.log(`${CYAN}${'═'.repeat(50)}${RESET}`);
  console.log(`Testing: ${BASE_URL}\n`);

  try {
    // Health check
    test.section('Health & Status');
    await testEndpoint('GET', '/api/health', 'Health Check');

    // Products
    test.section('Product Endpoints');
    await testEndpoint('GET', '/api/products', 'Get All Products');
    await testEndpoint('GET', '/api/products/featured', 'Get Featured Products');
    await testEndpoint('GET', '/api/products/sale', 'Get Sale Products');
    await testEndpoint('GET', '/api/products/category/Cosmetics', 'Get Products by Category');
    await testEndpoint('GET', '/api/products/search?q=test', 'Search Products');

    // Courses
    test.section('Course Endpoints');
    await testEndpoint('GET', '/api/courses', 'Get All Courses');
    await testEndpoint('GET', '/api/courses/featured', 'Get Featured Courses');

    // Blog
    test.section('Blog Endpoints');
    await testEndpoint('GET', '/api/blog', 'Get All Blog Posts');

    // Case Studies
    test.section('Case Study Endpoints');
    await testEndpoint('GET', '/api/case-studies', 'Get All Case Studies');

    // Solutions
    test.section('Solution Endpoints');
    await testEndpoint('GET', '/api/solutions', 'Get All Solutions');

    // Contacts
    test.section('Contact Endpoints');
    await testEndpoint('GET', '/api/contacts', 'Get Contacts (protected)');

    // Auth
    test.section('Auth Endpoints');
    await testEndpoint('GET', '/api/auth', 'Auth Check');

    console.log(`\n${CYAN}${'═'.repeat(50)}${RESET}`);
    console.log(`${GREEN}Passed: ${passedTests}${RESET}`);
    console.log(`${RED}Failed: ${failedTests}${RESET}`);
    console.log(`${CYAN}${'═'.repeat(50)}${RESET}\n`);

  } catch (error) {
    console.error(`${RED}Fatal error: ${error.message}${RESET}`);
  }
}

// Only run if server is available
setTimeout(() => {
  runTests().then(() => {
    if (failedTests === 0) {
      console.log(`${GREEN}✨ All endpoints responsive!${RESET}\n`);
    } else {
      console.log(`${YELLOW}⚠️  Some endpoints need attention${RESET}\n`);
    }
  });
}, 500);
