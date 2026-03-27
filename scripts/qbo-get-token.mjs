/**
 * 一次性 QuickBooks OAuth2 授权脚本
 *
 * 用途：获取 QUICKBOOKS_REFRESH_TOKEN 和 QUICKBOOKS_REALM_ID
 *       获取后存入 Netlify 环境变量，此脚本只需运行一次
 *
 * 前置步骤：
 *   1. 登录 https://developer.intuit.com → 你的 App → Keys & OAuth
 *   2. 在 "Redirect URIs" 添加: http://localhost:3000/callback
 *   3. 确保 .env 文件里有 QUICKBOOKS_CLIENT_ID 和 QUICKBOOKS_CLIENT_SECRET
 *
 * 运行方法：
 *   node scripts/qbo-get-token.mjs
 */

import http from 'node:http';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

// 读取 .env（简单解析，不依赖 dotenv）
function loadEnv() {
  try {
    const raw = readFileSync('../.env', 'utf-8');
    const env = {};
    for (const line of raw.split('\n')) {
      const [key, ...vals] = line.split('=');
      if (key && vals.length) env[key.trim()] = vals.join('=').trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const CLIENT_ID     = process.env.QUICKBOOKS_CLIENT_ID     || env.QUICKBOOKS_CLIENT_ID;
const CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET || env.QUICKBOOKS_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing QUICKBOOKS_CLIENT_ID or QUICKBOOKS_CLIENT_SECRET in ../.env');
  process.exit(1);
}

const REDIRECT_URI = 'http://localhost:3399/callback';
const SCOPE        = 'com.intuit.quickbooks.accounting';
const AUTH_URL     = 'https://appcenter.intuit.com/connect/oauth2';
const TOKEN_URL    = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

// 构建授权 URL
const authUrl = new URL(AUTH_URL);
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPE);
authUrl.searchParams.set('state', 'bih-qbo-auth');

console.log('\n🔑 QuickBooks OAuth2 授权流程\n');
console.log('请在浏览器中打开以下链接授权：\n');
console.log(authUrl.toString());
console.log('\n等待授权回调...\n');

// 启动本地服务器接收回调
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:3399`);
  if (url.pathname !== '/callback') {
    res.end('Not found');
    return;
  }

  const code    = url.searchParams.get('code');
  const realmId = url.searchParams.get('realmId');

  if (!code || !realmId) {
    res.end('❌ 授权失败：缺少 code 或 realmId');
    console.error('授权回调缺少参数:', url.searchParams.toString());
    server.close();
    return;
  }

  console.log('✅ 收到授权码，正在换取 Token...');

  try {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });

    const tokens = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(JSON.stringify(tokens));
    }

    console.log('\n✅ 授权成功！请将以下值存入 Netlify 环境变量：\n');
    console.log('━'.repeat(60));
    console.log(`QUICKBOOKS_REALM_ID     = ${realmId}`);
    console.log(`QUICKBOOKS_REFRESH_TOKEN = ${tokens.refresh_token}`);
    console.log('━'.repeat(60));
    console.log('\n提示：Access Token 每小时过期，Refresh Token 有效期 100 天（系统会自动刷新）\n');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html><body style="font-family:monospace;padding:2rem;background:#003366;color:#FFC500">
        <h2>✅ QuickBooks 授权成功</h2>
        <p>请回到终端查看环境变量，并存入 Netlify。</p>
        <p><b>Realm ID:</b> ${realmId}</p>
        <p><b>Refresh Token:</b> ${tokens.refresh_token?.slice(0, 20)}...</p>
      </body></html>
    `);
  } catch (err) {
    console.error('❌ Token 换取失败:', err.message || err);
    res.end(`❌ Token 换取失败: ${err.message || err}`);
  }

  server.close();
  process.exit(0);
});

server.listen(3399, () => {
  console.log('本地回调服务器监听 http://localhost:3399/callback');
});
