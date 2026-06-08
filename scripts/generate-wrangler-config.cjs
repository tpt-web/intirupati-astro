#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const accountId = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '';
const projectName = process.env.WRANGLER_PROJECT_NAME || 'intirupati-astro';
const compatibilityDate = process.env.WRANGLER_COMPATIBILITY_DATE || new Date().toISOString().slice(0,10);
const route = process.env.CF_WORKER_ROUTE || '/auth';

const lines = [];
lines.push(`name = "${projectName}"`);
lines.push(`main = "functions/auth.js"`);
lines.push(`compatibility_date = "${compatibilityDate}"`);
if (accountId) lines.push(`account_id = "${accountId}"`);
lines.push(`workers_dev = true`);
lines.push(`type = "javascript"`);
lines.push(`route = "${route}"`);

const out = lines.join('\n') + '\n';
const outPath = path.resolve(process.cwd(), 'wrangler.toml');

try {
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Generated wrangler.toml at', outPath);
  if (!accountId) console.warn('Warning: CF account id not provided (CF_ACCOUNT_ID or CLOUDFLARE_ACCOUNT_ID).');
} catch (err) {
  console.error('Failed to write wrangler.toml:', err);
  process.exit(1);
}
