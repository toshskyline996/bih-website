#!/usr/bin/env node
// QBO OAuth2 Token Exchange Helper
// Usage: node scripts/qbo-get-tokens.mjs
// Starts a local callback server, opens the QBO consent URL, then prints tokens.

import http from 'http';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// ── Load .dev.vars (key=value format) ────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const devVarsPath = path.resolve(__dirname, '../.dev.vars');
const rootEnvPath = path.resolve(__dirname, '../../.env');

function parseEnvFile(filePath) {
  try {
    return Object.fromEntries(
      readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(l => l && !l.startsWith('#') && l.includes('='))
        .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()])
    );
  } catch { return {}; }
}

const devVars  = parseEnvFile(devVarsPath);
const rootEnv  = parseEnvFile(rootEnvPath);
const env      = { ...rootEnv, ...devVars };

const CLIENT_ID     = env.QUICKBOOKS_CLIENT_ID;
const CLIENT_SECRET = env.QUICKBOOKS_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:3030/callback';
const SCOPES        = 'com.intuit.quickbooks.accounting';
const PORT          = 3030;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌  QUICKBOOKS_CLIENT_ID or QUICKBOOKS_CLIENT_SECRET not found in .dev.vars or root .env');
  process.exit(1);
}

// ── Step 1: Start local callback server ──────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/callback') {
    res.writeHead(404); res.end(); return;
  }

  const code    = url.searchParams.get('code');
  const realmId = url.searchParams.get('realmId');

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing code parameter');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2>✅ Authorization received — check your terminal for the tokens.</h2>');

  server.close();

  // ── Step 2: Exchange code for tokens ───────────────────────────────────────
  console.log(`\n📬 Auth code received. RealmId: ${realmId}`);
  console.log('🔄 Exchanging code for tokens...\n');

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error('❌ Token exchange failed:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log('✅ Tokens received!\n');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`QUICKBOOKS_REALM_ID=${realmId}`);
  console.log(`QUICKBOOKS_REFRESH_TOKEN=${data.refresh_token}`);
  console.log('─────────────────────────────────────────────────────────');
  console.log('\n📋 Add QUICKBOOKS_REFRESH_TOKEN to .dev.vars and Cloudflare secrets.');
  console.log(`   Refresh token expires in: ~${Math.round(data.x_refresh_token_expires_in / 86400)} days`);
  console.log(`   Access token (short-lived, don't store): ${data.access_token.slice(0, 40)}…\n`);
});

server.listen(PORT, () => {
  // ── Step 3: Open QBO consent URL ─────────────────────────────────────────
  const state = Math.random().toString(36).slice(2);
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&state=${state}`;

  console.log('\n🚀 QBO OAuth Token Helper');
  console.log('─────────────────────────────────────────────────────────');
  console.log('Opening browser for QuickBooks authorization...');
  console.log('\nIf browser does not open, visit this URL manually:');
  console.log(`\n${authUrl}\n`);
  console.log('─────────────────────────────────────────────────────────');
  console.log('⏳ Waiting for callback on http://localhost:3030/callback ...\n');

  // Try to open browser (Linux/macOS/WSL)
  const opener = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start'
    : 'xdg-open';
  exec(`${opener} "${authUrl}"`, (err) => {
    if (err) console.log('(Could not auto-open browser — use the URL above)');
  });
});
