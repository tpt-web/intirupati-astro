#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const accountId = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '';
const namespaceId = process.env.CF_KV_SESSION_NAMESPACE_ID || process.env.CLOUDFLARE_KV_SESSION_ID || '';
const projectName = process.env.WRANGLER_PROJECT_NAME || 'intirupati-astro-wrk';
const compatibilityDate = process.env.WRANGLER_COMPATIBILITY_DATE || new Date().toISOString().slice(0,10);

const lines = [];
lines.push(`name = "${projectName}"`);
lines.push(`main = "functions/auth.js"`);
lines.push(`compatibility_date = "${compatibilityDate}"`);
if (accountId) lines.push(`account_id = "${accountId}"`);
lines.push(`workers_dev = false`);
lines.push(`[build]`);
lines.push(`upload_format = "service-worker"`);
lines.push(``);
lines.push(`[[kv_namespaces]]`);
lines.push(`binding = "SESSION"`);
if (namespaceId) {
  lines.push(`id = "${namespaceId}"`);
} else {
  lines.push(`title = "intirupati-astro-session"`);
}

const out = lines.join('\n') + '\n';
const outPath = path.resolve(process.cwd(), 'wrangler.toml');

try {
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Generated wrangler.toml at', outPath);
  if (!accountId) console.warn('Warning: CF account id not provided (CF_ACCOUNT_ID or CLOUDFLARE_ACCOUNT_ID).');
  if (!namespaceId) console.warn('Warning: KV namespace id not provided (CF_KV_SESSION_NAMESPACE_ID). Wrangler may attempt to create the namespace.');
} catch (err) {
  console.error('Failed to write wrangler.toml:', err);
  process.exit(1);
}
