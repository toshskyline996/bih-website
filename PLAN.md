# BIH Intel API — 综合项目审查与优化规划



## Context（背景与目标）



bih-intel-api 是 freightracing.ca 的供应链情报后端，基于 Cloudflare Workers + TypeScript + D1 SQLite 构建。项目有 3 次提交，处于早期但功能完整的阶段。数据通过 n8n 自动化平台推入，前端 Dashboard 通过 GET 端点消费。



本次审查发现 **15 个具体问题**，涵盖逻辑 Bug、安全漏洞、性能瓶颈、架构设计和可维护性。所有优化均围绕"最小改动、最大收益"原则，**不添加新功能**。



---



## 一、逻辑 Bug（P1 — 必须修复）



### Bug 1: WoW（周环比）计算不准确

**文件**: `src/handlers/freight.ts:23-35`



**问题**: 使用"最近一条更早记录"，而非"约7天前的数据"。若数据稀疏（例如跳过某周），WoW 可能跨月比较，产生严重误导。



```typescript

// 当前错误做法

SELECT scfi_na_east FROM freight_rates WHERE date < ? ORDER BY date DESC LIMIT 1



// 应该改为：查找 6-8 天前的数据（SCFI 按周发布）

SELECT scfi_na_east FROM freight_rates

WHERE date BETWEEN date(?, '-8 days') AND date(?, '-6 days')

ORDER BY date DESC LIMIT 1

```



**理由**: 海运运价 SCFI 按周（周五）发布，WoW 必须对比上一个完整周。



---



### Bug 2: MA4W 不验证数据时效性

**文件**: `src/handlers/freight.ts:39-51`



**问题**: 取"最近 3 条 `scfi_na_east IS NOT NULL` 记录"，但不检查这些记录是否真实相邻。若有连续几周缺失，则 MA4W 计算会跨越过大时间跨度，失去"移动"平均的意义。



**修复**: 同时对 3 条历史数据做 `WHERE date >= date(?, '-28 days')` 约束，只取近 28 天内的数据参与平均：



```typescript

const rows = await env.DB.prepare(`

  SELECT scfi_na_east FROM freight_rates

  WHERE scfi_na_east IS NOT NULL

    AND date >= date(?, '-28 days')

    AND date < ?

  ORDER BY date DESC LIMIT 3

`).bind(d.date, d.date).all();

```



**理由**: "4周移动平均"语义上要求数据来自近4周，无约束的 LIMIT 3 会破坏这个语义。



---



### Bug 3: `week_52_high` / `week_52_low` 永远为 NULL

**文件**: `schema.sql:65-66`, `src/handlers/freight.ts:53-71`



**问题**: Schema 定义了 `week_52_high` 和 `week_52_low` 字段，但 freight handler 的 `INSERT OR REPLACE` 完全没有填充它们，导致这两列一直是 NULL，占用 schema 空间但无任何价值。



**两种修复方案**（选其一）:



**方案 A（推荐）**: 在 INSERT 之前查询 52 周最高/最低：

```typescript

const stats52 = await env.DB.prepare(`

  SELECT MAX(scfi_na_east) as high, MIN(scfi_na_east) as low

  FROM freight_rates

  WHERE date >= date(?, '-364 days') AND scfi_na_east IS NOT NULL

`).bind(d.date).first<{ high: number | null; low: number | null }>();



const week_52_high = stats52?.high != null

  ? Math.max(stats52.high, d.scfi_na_east ?? 0)

  : d.scfi_na_east ?? null;

const week_52_low = stats52?.low != null

  ? Math.min(stats52.low, d.scfi_na_east ?? Infinity)

  : d.scfi_na_east ?? null;

```



**方案 B**: 如果暂不需要这两个字段，从 INSERT 中注释说明并在 Schema 上保留（不改 Schema），等业务真正需要时再实现。



**理由**: 死字段会造成使用者困惑，误以为数据在那里。



---



### Bug 4: 批量 RBA 处理创建无意义的 Response 对象

**文件**: `src/handlers/rba.ts:62-68`



**问题**: `handleRbaBatch` 对每条记录调用 `handleRba()`，后者返回 `Response`，然后批处理器再 `.json()` 反序列化。这个 serialize→deserialize 循环毫无必要，增加延迟和内存开销。



**修复**: 提取 `ingestOneRba()` 内部函数，返回数据而非 Response：



```typescript

// 内部函数（不创建 Response）

async function ingestOneRba(env: Env, body: unknown): Promise<

  { ok: boolean; inserted: boolean; error?: string; classification?: Classification }

> {

  const v = validateRba(body);

  if (!v.ok) return { ok: false, inserted: false, error: v.error };

  const d = v.data;

  const cls = await classifyRbaTitle(env, d.title);

  const needs_review = cls.ai_confidence < 0.7 ? 1 : 0;

  try {

    const result = await env.DB.prepare(`INSERT OR IGNORE INTO rba_listings ...`).bind(...).run();

    return { ok: true, inserted: result.meta.changes > 0, classification: cls };

  } catch (e) {

    return { ok: false, inserted: false, error: 'DB write failed' };

  }

}



// handleRba 和 handleRbaBatch 都调用 ingestOneRba

export async function handleRba(env: Env, body: unknown): Promise<Response> {

  const r = await ingestOneRba(env, body);

  return json(r.ok ? r : { error: r.error }, r.ok ? 200 : 400);

}

```



**理由**: 消除冗余序列化，简化错误传播链，为后续并发批处理打好基础。



---



### Bug 5: LIKE 查询未转义特殊字符

**文件**: `src/handlers/query.ts:20`



**问题**: `region LIKE ?` 使用 `%${region}%`，但 SQLite LIKE 中 `%` 和 `_` 是通配符。若用户传入 `region=10%`，查询结果会混乱。



**修复**:

```typescript

// 转义 LIKE 特殊字符

const escapedRegion = region.replace(/[%_\\]/g, '\\$&');

binds.push(`%${escapedRegion}%`);

// SQL 改为：region LIKE ? ESCAPE '\'

where.push("region LIKE ? ESCAPE '\\'");

```



**理由**: 防止意外的 LIKE 通配符扩展，确保查询精确性。



---



## 二、安全问题（P1 — 必须修复）



### Security 1: `/health` 被 Bearer auth 挡在后面

**文件**: `src/index.ts:28-40`



**问题**: 认证逻辑在健康检查路由之前，导致外部监控工具（UptimeRobot、Cloudflare Health Checks）必须携带 API Secret 才能访问 `/health`，这不合理。



**修复**: 将 `/health` 移到认证检查之前：

```typescript

// 在认证之前

if (path === '/health') {

  return json({ ok: true, ts: new Date().toISOString() });

}



// 然后再做认证

const auth = request.headers.get('Authorization') ?? '';

if (!env.API_SECRET || auth !== `Bearer ${env.API_SECRET}`) {

  return json({ error: 'Unauthorized' }, 401);

}

```



**理由**: 健康检查天然是公开路由，应可无认证访问。监控服务不应持有业务 Secret。



---



### Security 2: 500 响应暴露内部错误详情

**文件**: `src/handlers/rba.ts:41`, `src/handlers/freight.ts:75`



**问题**:

```typescript

return json({ error: 'DB write failed', detail: String(e) }, 500);

```

`detail: String(e)` 将数据库内部错误字符串（可能含表名、字段名、SQL 片段）直接暴露给 API 调用方，违反信息最小化原则。



**修复**:

```typescript

// 内部记录完整错误

console.error('[rba] DB write failed:', String(e));

// 外部只返回通用信息

return json({ error: 'DB write failed' }, 500);

```



**理由**: API 调用方（n8n）只需知道"失败了"，不需要知道数据库内部细节。同时减少信息泄露风险。



---



### Security 3: CORS 使用通配符 `*`

**文件**: `src/types.ts:9`



**问题**: `Access-Control-Allow-Origin: *` 允许任意网站的浏览器脚本访问 API。虽然有 Bearer token 保护，但 CORS 策略应与业务域保持一致。



**修复**: 限制为 freightracing.ca：

```typescript

export const corsHeaders = {

  'Access-Control-Allow-Origin': 'https://freightracing.ca',

  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',

  'Access-Control-Allow-Headers': 'Authorization, Content-Type',

};

```



**注意**: 如果 n8n 是服务端调用（非浏览器），CORS 对其无影响。如果有多个允许来源（如本地开发），改为动态反射 origin 白名单。



**理由**: 最小权限原则。即使有 token 保护，不必要的 CORS 开放增加了攻击面。



---



## 三、性能问题（P2 — 重要改进）



### Perf 1: 批量 RBA AI 调用是纯顺序的

**文件**: `src/handlers/rba.ts:62-78`



**问题**: 100条批量处理 = 100次顺序 AI 调用，每次 ~300-800ms，总计可达 30-80 秒，**超出 Workers CPU 30秒上限**，会导致任务被强制中止。



**修复**: 使用有界并发（concurrency=5），既提速又不过载 Workers AI：

```typescript

async function processBatchWithConcurrency(

  env: Env,

  rows: unknown[],

  concurrency = 5

): Promise<BatchSummary> {

  const results: OneResult[] = [];

  for (let i = 0; i < rows.length; i += concurrency) {

    const chunk = rows.slice(i, i + concurrency);

    const chunkResults = await Promise.all(chunk.map(row => ingestOneRba(env, row)));

    results.push(...chunkResults);

  }

  return summarize(results);

}

```



**理由**: 5并发 × ~500ms = 每批 ~500ms，100条 = 10批 = ~5秒，远在 Worker CPU 预算内。



---



### Perf 2: Summary 端点缺少船舶数据

**文件**: `src/handlers/query.ts:82-113`



**问题**: `/query/summary` 聚合了 4 个数据域（tender/rba/freight/compat），但遗漏了 vessel。Dashboard 需要显示"当前追踪船舶数量"时没有数据。



**修复**: 添加第 5 个并行查询：

```typescript

env.DB.prepare(

  `SELECT COUNT(*) as vessel_count,

          MAX(updated_at) as last_update

   FROM vessel_positions

   WHERE updated_at > datetime('now', '-15 minutes')`

).first<{ vessel_count: number; last_update: string | null }>()

```



在响应中加入 `vessels: { active: n, last_update: '...' }`。



**理由**: Dashboard 的"综合摘要"本应包含所有5个数据域。



---



## 四、CI/CD 与可维护性（P2）



### CI 1: 部署流程缺少类型检查

**文件**: `.github/workflows/deploy.yml`



**问题**: GitHub Actions 只运行 `npm ci` + `wrangler deploy`，没有 `tsc --noEmit`。TypeScript 类型错误可能直接进入生产。



**修复**: 在 deploy 步骤之前加类型检查：

```yaml

- name: Type check

  run: npx tsc --noEmit



- name: Deploy to Cloudflare Workers

  run: npx wrangler deploy

```



**理由**: TypeScript 的核心价值是编译时错误捕获，不在 CI 中运行 tsc 等于放弃了这个安全网。



---



### CI 2: 缺少 `.dev.vars.example`

**文件**: 项目根目录（缺失）



**问题**: `.gitignore` 屏蔽了 `.dev.vars`（本地开发环境变量文件），但没有提供任何模板，新开发者不知道需要哪些变量。



**修复**: 创建 `.dev.vars.example`：

```

# Copy to .dev.vars and fill in real values

API_SECRET=your-api-secret-here

AISSTREAM_API_KEY=your-aisstream-key-here

```



**理由**: 基本的开发者体验要求，避免"如何在本地运行"的困惑。



---



## 五、数据质量（P3 — 长期优化）



### Data 1: `compat_events` 允许完全重复

**文件**: `src/handlers/compat.ts`



**问题**: 使用纯 `INSERT`（无 `IGNORE`），同一事件如果 n8n 重试，会产生重复记录，影响统计准确性。



**修复**: 改为 `INSERT OR IGNORE`，基于 `(ts, event, brand, model)` 的 UNIQUE 约束去重。或者在 Schema 上添加 `GENERATED` 哈希列作为唯一键。



**理由**: 事件追踪表需要幂等性，特别是在 n8n 有重试机制的情况下。



---



### Data 2: AIS WebSocket 无早期失败重试

**文件**: `src/handlers/vessel.ts:115`



**问题**: WebSocket error 事件触发后直接 `finish()`，不尝试重连。若 AISStream 在连接时返回错误（如临时过载），整个 cron 运行收集零船舶，但不会报错。



**修复**: 至少记录错误，并可考虑简单的一次重试：

```typescript

ws.addEventListener('error', (e) => {

  console.error('[vessel] WebSocket error:', String(e));

  clearTimeout(timeout);

  finish();

});

```



**理由**: 无任何错误日志使得 AIS 收集静默失败，难以诊断。



---



## 六、测试（P2 — 重要）



### Test 1: 验证器单元测试

**目标文件**: `src/validators.ts`（207行，零测试）



验证器是整个系统的数据质量守门人，应覆盖：

- 必填字段缺失的各种情况

- 边界值（`price_cad = 0`, `price_cad = -1`）

- 字符串截断（超长输入）

- 日期格式验证



### Test 2: Freight 计算单元测试

**目标文件**: `src/handlers/freight.ts`



freight 公式 `est_ff_quote = scfi_na_east × 1.13 + 1100` 是核心商业逻辑，WoW 和 MA4W 的计算涉及历史数据查询，都应有测试覆盖。



**推荐测试框架**: Vitest（与 Cloudflare Workers 兼容，支持 `miniflare` 模拟）



---



## 关键文件清单



| 文件 | 修改原因 | 优先级 |

|------|---------|--------|

| `src/index.ts` | 将 `/health` 移到 auth 前 | P1 |

| `src/types.ts` | 修复 CORS 通配符 | P1 |

| `src/handlers/rba.ts` | 提取 `ingestOneRba()`；并发批处理 | P1/P2 |

| `src/handlers/freight.ts` | 修复 WoW/MA4W；填充 52w 高低；移除 detail | P1/P2 |

| `src/handlers/query.ts` | 转义 LIKE；添加 vessel 至 summary | P2 |

| `src/handlers/vessel.ts` | 添加错误日志 | P3 |

| `.github/workflows/deploy.yml` | 添加 `tsc --noEmit` 步骤 | P2 |

| `.dev.vars.example` | 新建：开发者指引 | P3 |



---



## 优化执行顺序



```

Phase 1（P1 安全&Bug）：

  [1] index.ts → /health 前置

  [2] types.ts → CORS 域名限制

  [3] rba.ts + freight.ts → 移除 detail: String(e)

  [4] freight.ts → 修复 WoW 时间窗口

  [5] freight.ts → 修复 MA4W 时效性约束

  [6] freight.ts → 填充 week_52_high/low



Phase 2（P2 性能&架构）：

  [7] rba.ts → 提取 ingestOneRba() + 有界并发批处理

  [8] query.ts → LIKE 转义 + vessel summary

  [9] deploy.yml → 添加 tsc --noEmit



Phase 3（P3 可维护性）：

  [10] vessel.ts → 添加错误日志

  [11] .dev.vars.example → 新建

  [12] 添加 Vitest 测试：validators + freight 计算

```



---



## 验证方法



1. **本地验证**: `npm run dev` → `curl -H "Authorization: Bearer test" http://localhost:8787/health`（确认无需认证）

2. **类型检查**: `npx tsc --noEmit`（应该 0 错误）

3. **WoW 准确性**: 插入两条相差恰好 7 天的 freight_rates，验证 WoW 计算结果

4. **并发批处理**: 发送 20 条 RBA 批量请求，计时应在 3 秒内完成

5. **CORS 验证**: 浏览器控制台检查 `Access-Control-Allow-Origin` 响应头

6. **Summary 完整性**: `GET /query/summary` 响应中确认包含 `vessels` 字段

