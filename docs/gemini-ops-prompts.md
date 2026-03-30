# BIH Operations — Gemini AI Prompt 工具包

> 使用方法：在 Gmail 点击 Gemini 图标 → 粘贴以下 Prompt → 根据 [方括号] 内容填入实际信息

---

## 🏭 1. 工厂询价邮件（中文）

```
帮我写一封专业的中文商务询价邮件，发给中国挖掘机配件工厂。

背景：我是加拿大 Boreal Iron Heavy 公司的采购负责人，专注进口挖掘机配件，长期客户。

询价产品：[产品名称，例如：20-30吨挖掘机标准斗]
数量：[X] 件（首批），后续有持续采购需求
要求：
- 材质：Q355B 或以上，焊接符合 AWS D1.1 标准
- 耐磨件：Hardox 450
- 质检：出货前提供质检报告 + 焊缝检验记录
- 贸易条款：FOB [青岛/天津/上海]
- 包装：出口木箱，适合海运
- 原产地证明：Form A（CPTPP 优惠关税用）
- 交货期：签合同后 [25-30] 天内

请提供：含税价（增值税退税后净价）、EXW 价和 FOB 价供参考。

语气要体现专业性和长期合作诚意，不要太过强硬。
```

---

## 💰 2. 工厂砍价 / 二次谈判（中文）

```
帮我写一封中文商务邮件，目的是在工厂报价基础上进一步压价，但保持友好合作关系。

情况：工厂报价 [X] 元/件，我的目标价是 [Y] 元/件。
理由可以包括：
- 我们是长期客户，后续订单稳定
- 同类产品市场竞品价格更低（不用具体说）
- 这批量较大 [X件]，希望享受批量优惠

要求：语气不卑不亢，给对方台阶下，不要用"ultimatum"（最后通牒）式措辞。
结尾：表示如果价格合适，本周内可以签合同打定金。
```

---

## 📄 3. 合同条款审查（英文 Prompt，发给 Claude/Gemini）

```
Please review this purchase contract from a Chinese manufacturer. 
Flag any risk points in the following categories and rate each as LOW / MEDIUM / HIGH risk:

1. Payment terms — flag if >30% deposit or 100% prepayment required before production
2. Quality inspection — verify buyer has right to third-party inspection before shipment
3. Dispute resolution — flag if jurisdiction is Chinese courts only (should be international arbitration, e.g., CIETAC or ICC)
4. Force majeure — check if definition is too broad (covers normal business delays)
5. Delivery penalty — verify liquidated damages clause exists for late delivery
6. IP/design ownership — confirm buyer retains ownership of any custom designs
7. Governing law — flag if not neutral jurisdiction

After flagging issues, provide 3 suggested amendments I should request from the supplier.

[Paste contract text below]
```

---

## 🚢 4. 订舱位 / 货代沟通（英文）

```
Write a professional email to a freight forwarder to book ocean freight for my shipment.

Shipper: [Factory name], [City, China]
Consignee: Boreal Iron Heavy, Oshawa, Ontario, Canada L1H 4L3
Cargo: Excavator attachments (steel, heavy equipment parts)
HS Code: [8431.49.90 or specific code]
Quantity: [X] pieces
Gross Weight: approx. [X] kg
Dimensions: approx. [L x W x H] cm per piece
Packaging: Export wooden crates
Incoterms: FOB [Port name]
Target ETD: [Date range]
Destination port: Port of Vancouver or Port of Toronto (via Montreal)
Required: Copy of B/L, packing list, commercial invoice for customs clearance

Please ask for: FCL vs LCL recommendation, transit time estimate, and all-in rate to door (DDP) or CIF port.
```

---

## 🇨🇦 5. 清关准备 — HS Code 确认（英文）

```
I'm importing the following product from China to Canada commercially.
Help me:

1. Identify the most accurate HS Code under Canada's customs tariff schedule
2. Confirm the Most Favoured Nation (MFN) duty rate
3. Check if CPTPP preferential rate applies (China is NOT in CPTPP — flag this)
4. List any anti-dumping or countervailing duties from China for this product category
5. List all documents required for CBSA commercial release
6. Confirm if Form A (GSP certificate of origin) or any other certificate is needed

Product description: [Describe product in detail — material, function, end use]
Approximate unit value: CAD [X]
Country of origin: China (People's Republic)
```

---

## 🛃 6. 清关 — 商业发票自查（英文）

```
Review my commercial invoice for Canadian customs clearance (CBSA). 
Flag any missing or incorrect fields that could cause delays or penalties.

Required fields checklist:
- Seller name, address, country ✓/✗
- Buyer name, address, Canada ✓/✗
- Invoice date and number ✓/✗
- HS Code ✓/✗
- Country of origin ✓/✗
- Description of goods (sufficient detail) ✓/✗
- Quantity and unit of measure ✓/✗
- Unit price and total value in currency ✓/✗
- Currency clearly stated ✓/✗
- Incoterms ✓/✗
- Gross and net weight ✓/✗

[Paste your draft commercial invoice below]
```

---

## 📧 7. 客户询价回复（英文）

```
A potential B2B customer has sent me an inquiry about excavator attachments. 
Write a professional response email for Boreal Iron Heavy (BIH).

Customer inquiry summary: [Paste or summarize what they asked]

My response should:
1. Thank them and acknowledge their specific equipment/project needs
2. Confirm we stock [product type] for [tonnage class] machines
3. Ask 2-3 clarifying questions: machine make/model, pin diameter, required width, delivery timeline
4. Mention: factory-direct pricing, Q355 steel + Hardox 450 wear parts, 2-4 week lead time
5. Offer to send formal quote PDF within 24 hours once specs confirmed
6. Professional and direct — Canadian B2B tone, not salesy

Keep under 180 words. Sign off as: Anton | Boreal Iron Heavy | info@borealironheavy.ca
```

---

## 🔄 8. 报价跟进邮件（英文）

```
Write a professional follow-up email for a B2B quote I sent [X] days ago with no response.

Context: I sent a quote for [product] to [company type, e.g., an excavation contractor in Ontario].
Quote value: approx. CAD [X].

The email should:
- Be brief (under 100 words)
- Not be pushy — just checking if they have questions
- Offer a 5-minute call to go over specs if helpful
- Remind them lead time is [X] weeks so ordering sooner avoids delays
- Leave the door open without pressure

Tone: helpful, confident, not desperate.
```

---

## 📊 9. QuickBooks — 新增产品/服务（操作指引）

在 QBO 中设置产品目录，方便快速开 Estimate：

1. QBO 左侧菜单 → **Sales** → **Products and Services** → **New**
2. 类型选 **Non-inventory** (无实物库存追踪) 或 **Inventory**
3. 填写：
   - Name: `HD Excavator Bucket 12-25T`
   - SKU: `BIH-BKT-HD-01`
   - Sales price: `3800` (CAD)
   - Income account: `Sales Revenue`
4. 为每个产品重复以上步骤

设置好后，开 Estimate 时直接从下拉选产品，秒填价格。

---

## 🧾 10. QuickBooks Estimate → 报价 PDF 完整流程

```
客户询价 → 你收到邮件
         ↓
QBO → + New → Estimate
         ↓
填写: Customer (新建或选现有) + Expiry Date (14天) + 选产品 + 数量
         ↓
Customize → 上传 BIH Logo → 添加备注 ("FOB Oshawa, lead time 3-4 weeks")
         ↓
Save & Send → QBO 自动生成 PDF 发给客户
         ↓
客户接受 → Convert to Invoice → 一键完成
         ↓
付款到账 → Mark as Paid → 自动进入财务报表
```

---

## 💡 Gemini in Gmail 快捷使用技巧

- 打开任何邮件 → 右侧出现 **✨ Summarize this email** → 快速理解长邮件
- 写邮件时点击 **Help me write** → 粘贴以上 Prompt → 修改细节 → 发送
- 转发中文邮件给自己 → 让 Gemini **翻译并总结要点**
- 收到合同 PDF → 上传到 Google Drive → 在 Gemini 里 "Review this document"
