import { SecurityRule, ScanResult } from './rules.js';
import * as fs from 'fs';
import * as path from 'path';

export class Scanner {
  private rules: SecurityRule[];
  constructor(rules: SecurityRule[]) {
    this.rules = rules;
  }
  public async scanFile(filePath: string): Promise<ScanResult[]> {
    const content = fs.readFileSync(filePath, 'utf8');
    const results: ScanResult[] = [];
    for (const rule of this.rules) {
      if (rule.pattern.test(content)) {
        results.push({
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.description,
          file: filePath,
        });
      }
    }
    return results;
  }
  public async scanDirectory(dirPath: string): Promise<ScanResult[]> {
    let results: ScanResult[] = [];
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(await this.scanDirectory(fullPath));
      } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
        results = results.concat(await this.scanFile(fullPath));
      }
    }
    return results;
  }
}
