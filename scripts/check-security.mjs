#!/usr/bin/env node
/**
 * Data-security check over every file tracked by git (plus staged files).
 * Reports path, line and finding TYPE only, never the matched value.
 * Errors (exit 1): credentials, private keys, .env files, secret-looking file names.
 * Warnings: email addresses and phone-number-like strings, for a human to review.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const files = execSync('git ls-files -z --cached --others --exclude-standard', { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .filter((f) => !f.startsWith('node_modules/') && f !== 'package-lock.json');

const SECRET_PATTERNS = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['GitHub token', /\b(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['AWS access key', /\b(AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ['OpenAI/Anthropic-style key', /\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}\b/],
  ['Stripe key', /\b[rs]k_(live|test)_[A-Za-z0-9]{16,}\b/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  ['generic secret assignment', /\b(api[_-]?key|api[_-]?token|secret|password|passwd|access[_-]?token)\b\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];
const BAD_NAMES = [
  ['.env file', /(^|\/)\.env(\.|$)/],
  ['key/certificate file', /\.(pem|key|p12|pfx)$/i],
  ['secret-looking file name', /(api[ _-]?token|api[ _-]?key|secret|credential|password)/i],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const PHONE = /(?<![\w.])(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?![\w.])/g;
const TEXT = /\.(astro|ts|mjs|js|json|md|html|css|yml|yaml|txt|svg|xml|toml)$|(^|\/)(CNAME|\.gitignore)$/i;

const errors = [];
const warnings = [];
for (const f of files) {
  for (const [type, re] of BAD_NAMES) if (re.test(f)) errors.push(`${f}: ${type}`);
  if (!TEXT.test(f) || !fs.existsSync(f)) continue;
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [type, re] of SECRET_PATTERNS) if (re.test(line)) errors.push(`${f}:${i + 1}: possible ${type}`);
    if (f === 'scripts/check-security.mjs') return;
    if (line.match(EMAIL)?.some((e) => !/@(example\.com|users\.noreply\.github\.com)$/i.test(e)))
      warnings.push(`${f}:${i + 1}: email address`);
    if (PHONE.test(line)) warnings.push(`${f}:${i + 1}: phone-number-like string`);
    PHONE.lastIndex = 0;
  });
}
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`check-security: ${files.length} files scanned, ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
