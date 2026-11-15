# ⚡ 梯子云 (TiziCloud.blog)

> **2026 年度科学上网、网络工程选型与跨境网络加速权威评测矩阵**  
> *Data-Driven & Physical Telemetry Benchmarking for Next-Gen Network Architecture.*

---

<p align="center">
  <img src="https://img.shields.io/badge/VitePress-1.6+-4f46e5?style=for-the-badge&logo=vitepress&logoColor=white" alt="VitePress" />
  <img src="https://img.shields.io/badge/Vue.js-3.5+-41b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/SEO%20Audit-100%25%20PASS-success?style=for-the-badge&logo=google" alt="SEO Grade" />
  <img src="https://img.shields.io/badge/Pages-81%20SSG%20Static-blue?style=for-the-badge" alt="Static Pages" />
  <img src="https://img.shields.io/badge/Telemetry-DNO%20Active-orange?style=for-the-badge" alt="DNO Observatory" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge" alt="License" />
</p>

---

## 📖 项目简介

**梯子云 (TiziCloud.blog)** 是一套基于 **VitePress 现代静态站点生成器 (SSG)** 架构打造的高性能、工程级跨境网络评测与网络知识库大盘。

本项目彻底摒弃传统营销号“拼凑文”与“主观推销”的陈旧套路，全面引入 **暗黑网络天文台 (Dark Network Observatory, DNO)** 物理探测标准，依托中国电信/联通/移动三网真实物理探针、晚高峰严苛压测数据与底层拓扑抓包，为科研学者、外贸跨境从业者、出海开发者及跨国数字游民提供透明、客观、具备可复现依据的专著级选型指南。

---

## 🌟 核心特性与架构

### 1. 深度内容四大核心专题柱 (4 Pillar Hubs)
全站建立起 4 大高权重技术专题柱，每大专题均包含 8 篇经过严苛技术校验的专著级长文：

```
src/
├── recommend/          # Pillar ① 机场推荐大系 (选型精选 / 2026大盘 / 性价比 / 专线 / 低价 / 免费实测 / 全局)
├── vpn/                # Pillar ② VPN 与加速器大系 (VPN推荐 / 免费VPN / 手机端 / 翻墙软件 / 协议原理)
├── clash/              # Pillar ③ Clash 客户端生态 (Verge Rev / Meta 内核 / 规则分流 / 故障排障手册)
├── resources/          # Pillar ④ 资源与情报雷达 (免费节点核验 / 跑路预警雷达 / 机场风险防范 / 测速方法)
├── reviews/            # 42 家主流品牌专著级深度评测库 + 全局品牌索引大盘
└── (trust pages)/      # E-E-A-T 权威凭证页 (/about/, /methodology/, /disclaimer/, /privacy/, /terms/)
```

### 2. 42 家机场品牌库专著级横向评测
全量收录包含 **光速云、暮光加速、飞猫云、微风网络、大佬云、星岛梦** 等在内的 42 家主流服务商，单篇评测严格遵守万字级内容标准，深度覆盖：
- **物理拓扑分析**：IEPL / IPLC 专线冗余、企业级 BGP 入口与中转隧道解析。
- **晚高峰实测数据**：20:00 - 23:30 黄金拥堵时段真实时延、丢包率 (Packet Loss) 与峰值带宽。
- **协议兼容矩阵**：VLESS (Reality)、Trojan、Shadowsocks-2022、Hysteria 2、TUIC v5 深度解析。
- **流媒体与 AI 解锁能力**：ChatGPT/Claude 封锁检测、Netflix/Disney+ 4K 原生 IP 纯净度。

### 3. 暗黑网络天文台 (DNO) 实时遥测
全站内置 **Dark Network Observatory (DNO)** 监测面板与 ASCII 拓扑决策流：
- 实时接入华东 (电信)、华南 (联通)、华北 (移动) 多地探针。
- 提供可视化丢包曲线与延迟散点图。
- 动态发布服务商风险告警与“跑路预警雷达”。

### 4. 军工级防连坐 SEO & GEO 算法友好架构
经自动化爬虫与安全合规脚本 100% 严苛校验：
- **规范化 (Canonical) 矩阵**：全站 81 个页面通过 VitePress 钩子全自动注入带有绝对域名的标准 Canonical 标签。
- **外链防连坐隔离**：全站所有商业引流与转介入口严格配置 `rel="nofollow sponsored noopener"`，阻断 PageRank 违规传递风险。
- **E-E-A-T 语义凭证网络**：完备的学术评测方法论、利益披露说明、法律合规准则及关于我们团队背书。
- **JSON-LD 增强结构化数据**：自动生成 `WebSite`、`Organization`、`BreadcrumbList`、`TechArticle`、`FAQPage` 微数据，大幅提升生成式 AI 引擎 (GEO / SGE / Perplexity) 的精准语义索引效率。

---

## 🛠️ 技术栈

| 领域 | 技术方案 | 说明 |
| :--- | :--- | :--- |
| **SSG 框架** | [VitePress 1.6+](https://vitepress.dev/) | 极速静态网站生成器，基于 Vite & Vue 3 |
| **样式与主题** | Default Theme + Custom CSS | 高性能响应式布局、移动端横向滑动表格自适应 |
| **运行与构建** | Node.js >= 18 + Rollup | 生产环境极速预渲染，15 秒完成全站编译与 Link Check |
| **生产服务器** | Apache 2.4 / Nginx / Cloudflare | 支持 `.htaccess` 伪静态规则与 HTTP/2 / HTTP/3 |
| **质检流水线** | 自研 Node.js SEO & Link Checker | 零死链、单 H1 约束、SEO 评分自动化验证 |

---

## 🚀 本地开发与构建

### 1. 环境准备
确保本机已安装 Node.js (推荐 v18 或更高版本)：
```bash
node -v
npm -v
```

### 2. 克隆项目与安装依赖
```bash
git clone https://github.com/zlzlzl98698-dev/tizicloud.blog.git
cd tizicloud.blog
npm install
```

### 3. 启动本地开发服务器
```bash
npm run docs:dev
```
本地服务默认将在 `http://localhost:5173` 启动，支持极致的热重载 (HMR)。

### 4. 生产构建与静态导出
```bash
npm run docs:build
```
构建产物将输出至 `src/.vitepress/dist` 目录。

### 5. 本地预览生产构建产物
```bash
npm run docs:preview
```
预览服务将在 `http://localhost:4173` 运行，供检查静态资源与路由映射。

---

## 🧪 自动化质检工具集

本项目内置完善的质量校验脚本，在执行部署或代码合并前可一键运行：

```bash
# 全自动化验证：Canonical 注入、外链 nofollow、死链排查、单 H1、五大信任页完整度
node scripts/seo/verify-all-checklist.cjs
```

**质检标准：**
- [x] **0 Dead Links**：81 个静态 HTML 页面之间互相引用的内链无一死链或 404。
- [x] **100% Canonical Coverage**：全站页面全部规范化至 `https://tizicloud.blog/...`。
- [x] **100% Outbound Affiliate Isolation**：商业外链全量附带 `rel="nofollow sponsored noopener"`。
- [x] **Strict Single H1**：每个页面有且仅有一个 H1 语义标签。
- [x] **E-E-A-T Architecture**：具备独立的评测方法论与法律合规页。

---

## 📁 项目目录结构

```plaintext
tizicloud.blog/
├── .github/                 # GitHub Actions 自动化工作流与 CI
├── .vitepress/              # 站点级兼容配置
├── scripts/                 # 自动化工程脚本
│   └── seo/                 # SEO/GEO 深度质检、外链扫描与死链排查工具
├── src/                     # 站点源代码根目录
│   ├── .vitepress/          # VitePress 核心配置文件
│   │   ├── config.mts       # 站点配置、导航栏、侧边栏、SEO TransformHead 钩子
│   │   ├── theme/           # 主题扩展、自定义样式表 (custom.css)
│   │   └── dist/            # (构建生成) 生产静态输出
│   ├── about/               # 关于我们
│   ├── clash/               # Pillar ③ Clash 客户端专题大系 (8篇)
│   ├── disclaimer/          # 免责声明与合规说明
│   ├── methodology/         # 评测方法论与 DNO 测速规范
│   ├── privacy/             # 隐私政策
│   ├── recommend/           # Pillar ① 机场推荐专题大系 (8篇)
│   ├── resources/           # Pillar ④ 资源与情报防跑路雷达 (8篇)
│   ├── reviews/             # 42 家机场品牌库深度评测 + 索引大盘
│   ├── terms/               # 服务条款
│   ├── vpn/                 # Pillar ② VPN 与加速器专题大系 (8篇)
│   ├── index.md             # 站点首页
│   ├── robots.txt           # 爬虫规范指令
│   └── public/              # 静态公共资源与图标
├── package.json             # 项目依赖与运行脚本
├── README.md                # 项目全景说明文档
└── .gitignore               # Git 忽略规则
```

---

## 🚢 部署指引

### Apache 生产环境部署
1. 将 `src/.vitepress/dist` 下生成的所有文件上传至虚拟主机的网站根目录（如 `public_html` 或 `wwwroot`）。
2. 在网站根目录确保配置了 `.htaccess` 文件，以支持 HTML 友好路由与 HTTPS 强制重定向：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>
```

### Cloudflare Pages / Vercel
- **Build command**: `npm run docs:build`
- **Output directory**: `src/.vitepress/dist`
- **Node.js Version**: `18.x` 或以上

---

## ⚖️ 免责声明 (Disclaimer)

1. 本项目所收录、展示与分析的网络技术资料仅供网络工程学术研究、跨国网络延迟优化测试、出海企业合规跨境互联及科学研究人员查阅。
2. 请严格遵守您所在国家和地区的法律法规，切勿将本项目介绍的相关网络工具用于任何违反法律法规的非法活动。
3. 任何第三方服务商的运营状态、线路质量变动及商业行为均由其独立承担，本项目不提供任何形式的商业明示或暗示担保。

---

<p align="center">
  Copyright © 2026 <strong>TiziCloud.blog</strong>. All rights reserved.
</p>
