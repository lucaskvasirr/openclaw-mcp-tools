const fs = require('fs');
const path = require('path');

// Simple test cases for regex matching
const testCases = [
  {
    name: "Hardcoded API Key (SEC-001)",
    content: 'const api_key = "12345678901234567890";',
    pattern: /(?:api_key|secret|token|password|key)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/gi,
    shouldMatch: true
  },
  {
    name: "Insecure Eval (SEC-002)",
    content: 'eval("console.log(123)");',
    pattern: /\beval\s*\(/g,
    shouldMatch: true
  },
  {
    name: "Weak Crypto (SEC-003)",
    content: 'const hash = "md5";',
    pattern: /\b(md5|sha1)\b/gi,
    shouldMatch: true
  }
];

let failed = 0;

console.log("Running Security Auditor Tests...");

testCases.forEach(test => {
  const match = test.pattern.test(test.content);
  if (match === test.shouldMatch) {
    console.log(`PASS: ${test.name}`);
  } else {
    console.log(`FAIL: ${test.name} (Expected: ${test.shouldMatch}, Got: ${match})`);
    failed++;
  }
});

if (failed > 0) {
  console.log(`\nTests failed: ${failed}`);
  process.exit(1);
} else {
  console.log("\nAll tests passed!");
  process.exit(0);
}
