import { Scanner } from './scanner.js';
import { SECURITY_RULES } from './rules.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const scanner = new Scanner(SECURITY_RULES);
  const targetDir = path.resolve(__dirname); 
  console.log(`Testing Security Auditor on: ${targetDir}`);
  const results = await scanner.scanDirectory(targetDir);
  if (results.length === 0) {
    console.log('✅ No security issues found.');
  } else {
    console.log(`⚠️ Found ${results.length} security issues:\n`);
    results.forEach((res, idx) => {
      console.log(`[${idx + 1}] [${res.severity.toUpperCase()}] ${res.ruleId}: ${res.message}`);
      console.log(`    File: ${res.file}`);
      console.log('---');
    });
  }
}
main().catch(console.error);
