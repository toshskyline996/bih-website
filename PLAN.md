# BIH 网站建设工程看板

## 状态：全面投产 ✅
- 目标：Boreal Iron Heavy 品牌化重构 + 竞争情报平台
- 核心：Q355 锰钢与工程黄视觉系统 + Cloudflare 全栈部署

## 进度总览

| 阶段 | 任务 | 状态 | 说明 |
| :--- | :--- | :--- | :--- |
| 1 | 视觉识别系统 (VI) | ✅ 已完成 | 工业黄/深海蓝配色，定制喷码 Logo |
| 2 | 技术叙事 (Q355) | ✅ 已完成 | SteelSpecPage 可视化对比条 + 微合金章节 + 焊接工艺流程；HomePage Material Excellence 区块 |
| 3 | 产品与兼容工具 | ✅ 已完成 | ProductDetailPage 材料徽章 + OEM 兼容入口；CompatibilityPage 品牌快选栏 |
| 4 | 烟台叙事页 | ✅ 已完成 | /factory 页：山东工厂 + 烟台港 + 出口路线 + 时间轴 |
| 5 | B2B 交易集成 | ✅ 已完成 | Stripe + QBO + Cloudflare Workers，生产已部署 |
| 6 | BIH 竞争情报平台 v5 | ✅ 已完成 | Cloudflare D1 + Workers AI + 7 条 n8n 工作流 + Intel Dashboard |

## 阶段 6 架构总览

| 组件 | 地址 | 说明 |
| :--- | :--- | :--- |
| API Gateway | `intel-api.freightracing.ca` | Cloudflare Worker，Bearer 鉴权，D1 写入 + AI 分类 |
| D1 数据库 | `bih_intel_v5` | 4 表：rba_listings / tender_alerts / freight_rates / compat_events |
| Intel Dashboard | `freightracing.ca/intel` | React SPA，GET 查询 D1，API_SECRET 登录 |
| WF3 | Compat 双写 | Webhook → Google Sheets + D1 /ingest/compat |
| WF4 | RBA 历史导入 | Google Sheet → /ingest/rba/batch（一次性，手动触发）|
| WF5 | GTA 标讯 | Canada Buys + Ontario Tenders RSS → /ingest/tender → Telegram |
| WF6 | RBA 拍卖情报 | Gmail (RBA + IronPlanet) → HTML 解析 → /ingest/rba → Telegram |
| WF7 | 运费记录 | 周五提醒 → n8n 表单 → /ingest/freight → Telegram |

## 最近更新
- 2026-03-29: 阶段 1 完成，视觉基调已定。
- 2026-03-30: 阶段 5 完成，Stripe 付款通道 + QBO 同步全链路调试完毕，部署生产。
- 2026-03-31: 阶段 2/3/4 全部完成并部署生产。新增页面：/factory；SteelSpecPage 等全面升级。
- 2026-04-02: 阶段 6 完成。迁移至 Cloudflare（删除 Netlify）。bih-intel-api Worker 部署，D1 初始化，Intel Dashboard 上线，n8n WF3–WF7 全部激活。
