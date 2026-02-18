export type Severity = 'low' | 'medium' | 'high' | 'critical';
export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  severity: Severity;
}
export interface ScanResult {
  ruleId: string;
  severity: Severity;
  message: string;
  file: string;
  line?: number;
}
export const SECURITY_RULES: SecurityRule[] = [
  {
    id: 'SEC-001',
    name: 'Hardcoded Secrets',
    description: 'Potential API key or secret token detected.',
    pattern: /(?:key|secret|token|password|auth|api_key|moltbook_sk_)\s*[:=]\s*["'][a-zA-Z0-9_\-]{16,}["']/gi,
    severity: 'critical',
  },
  {
    id: 'SEC-002',
    name: 'Unsafe Eval',
    description: 'Use of eval() can lead to arbitrary code execution.',
    pattern: /\beval\s*\(/g,
    severity: 'high',
  }
];
