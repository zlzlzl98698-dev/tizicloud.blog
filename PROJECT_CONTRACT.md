# PROJECT_CONTRACT — 梯子云 (tizicloud.blog)

创建时间：2026-11-15 · 状态：**立项完成 / 规划锁定** · 规则层级：PROJECT_ONLY  
执行标准：《网站全站落地总指令》、《AI 搜索引擎优先 GEO/AEO 规范》与《快速执行模式》

---

## 一、站点核心契约

| 契约字段 | 约定取值 | 详细设计与依据 |
| :--- | :--- | :--- |
| **正式主域名** | `https://tizicloud.blog/` | 唯一主域，规范尾斜杠策略（目录型 URL 带 `/`），全站绝不混入测试域名 |
| **品牌名称** | **梯子云** (TiziCloud) | 商业定位：高转化 SEO/GEO 机场评测、科学上网工具指南与流量变现矩阵 |
| **核心商业目标** | Google / Bing 自然搜索流量 + AI 引擎（ChatGPT、Perplexity、AIO、Gemini）直接引用 | 通过客观技术评测、测速面板、解锁矩阵与套餐对比，引导用户注册 42 家机场 |
| **推广合规策略** | 严格执行 `target="_blank" rel="nofollow sponsored noopener"` | 所有出站推广链接添加透明提示，不硬编码在文章中，由数据层统一注入 |
| **核心技术栈** | **VitePress 1.6+ ＋ Vue 3 ＋ 多级文档主题 ＋ 自动 Sitemap** | 静态生成（SSG），极限首屏渲染速度，原生 Markdown 驱动，爬虫抓取最友好 |
| **搜索方案** | **多层级全文搜索（Algolia DocSearch 预留 + 本地 Pagefind WASM 双轨兼容）** | 既支持 Algolia 官方爬虫接入，又保障静态离线环境下的毫秒级中文分词搜索 |
| **部署架构** | **Apache 2.4+ 静态虚拟主机** | `.htaccess` 提供 Gzip/Brotli 压缩、严格安全响应头、静态资源 1 年长缓存与 301 规范化 |
| **视觉设计语言** | **卡片式专业文档 ＋ 暗黑网络天文台（Dark Network Observatory）** | 浅色高可读性正文搭配深灰蓝/深海军蓝技术监控面板，还原 Grafana/Cloudflare 级公信力 |
| **数据证据口径** | **五级证据体系**（实测 `measured` / 厂商宣称 `vendor` / 商务 `commercial` / 编辑 `editorial` / 虚构 `mock` 严禁） | 凡未实测指标一律标注「待核实」或厂商声明，绝不编造数据 |
| **内容组织模式** | **Answer-First（答案优先）＋ 蜂巢式 Topic Cluster 闭环回链** | 重要章节首段直接给出结论，三级深度（一级 Hub → 二级专题 → 三级文章 → 品牌评测） |

---

## 二、顶部 4 个一级主导航及 28 个二级下拉专题真实 URL 映射

全站采用扁平语义化路由，所有二级专题均对应真实 Markdown 页面（`index.md`），杜绝死链：

```
顶部导航架构
├── ① 机场推荐 (Hub: /recommend/)
│   ├── 机场推荐 ──────────────> /recommend/best/
│   ├── 机场排行 ──────────────> /recommend/ranking/
│   ├── 性价比机场 ────────────> /recommend/cost-effective/
│   ├── 稳定机场 ──────────────> /recommend/stable/
│   ├── 便宜机场 ──────────────> /recommend/cheap/
│   ├── 免费梯子 ──────────────> /recommend/free/
│   └── 科学上网 ──────────────> /recommend/guide/
│
├── ② VPN 与加速器 (Hub: /vpn/)
│   ├── VPN 推荐 ──────────────> /vpn/recommend/
│   ├── 免费 VPN ──────────────> /vpn/free/
│   ├── 手机 VPN ──────────────> /vpn/mobile/
│   ├── VPN 软件评测 ──────────> /vpn/reviews/
│   ├── VPN 加速器 ────────────> /vpn/accelerator/
│   ├── 加速器对比 ────────────> /vpn/compare/
│   └── 好用的 VPN ────────────> /vpn/best/
│
├── ③ Clash 客户端 (Hub: /clash/)
│   ├── Clash 推荐 ────────────> /clash/recommend/
│   ├── Clash Verge ───────────> /clash/verge/
│   ├── Clash Verge 下载 ──────> /clash/download/
│   ├── Clash Verge 订阅 ──────> /clash/subscribe/
│   ├── Clash Meta ────────────> /clash/meta/
│   ├── Clash 使用教程 ────────> /clash/tutorial/
│   └── Clash 故障排查 ────────> /clash/troubleshooting/
│
└── ④ 资源与情报 (Hub: /resources/)
    ├── 免费节点 ──────────────> /resources/free-nodes/
    ├── 跑路预警 ──────────────> /resources/warning/
    ├── 机场 FAQ ──────────────> /resources/faq/
    ├── 机场风险情报 ──────────> /resources/risk-intel/
    ├── 节点检测 ──────────────> /resources/node-check/
    ├── 订阅问题 ──────────────> /resources/subscription-issues/
    └── 新手帮助 ──────────────> /resources/beginner-guide/
```

---

## 三、42 家机场品牌库推广矩阵与实测资产映射

根据原始资料《42家机场品牌清单.txt》及实测测速包，品牌矩阵严格按以下阶梯排布：

### 1. 主推 TOP 1
- **光速云** (`/brand/guangsu/`)：IEPL 专线 + 企业级内网专线双架构，VLESS 协议，自研客户端与第三方订阅双持，年付折合约 8 元/月，配备 5 张完整实测解锁/测速原图，全站核心引导转化首选。

### 2. 前十主力推荐梯队 (TOP 2–10)
- **暮光加速** (`/brand/muguang/`)：BGP 智能调度专线级出口，7×24 真人客服，全平台覆盖（含实测测速图）
- **飞猫云** (`/brand/feimao/`)：年付约 7 元/月，专属客户端免配订阅，新手友好（含实测测速图）
- **微风网络** (`/brand/weifeng/`)：7 元档轻量起步，三网优化直连（含实测测速图）
- **大佬云** (`/brand/dalaoyun/`)：月付 5.6 元起极低门槛（含测速与解锁档案）
- **星岛梦** (`/brand/xingdaomeng/`)：2020 年老牌运营，支持不限时流量包（含实测测速图）
- **二猫云** (`/brand/ermao/`)：20 元 130GB 均衡高性价比（含实测测速图）
- **无忧链接** (`/brand/wuyou/`)：原生订阅无需转换，6 元起轻量体验（含实测截图 2 张）
- **唯兔云** (`/brand/weitu/`)：60+ 优质节点，三网优化智能负载均衡（含实测测速图）
- **Firefly (萤火虫)** (`/brand/firefly/`)：全 IPLC 专线，6 档丰富套餐，免翻墙官网访问

### 3. 第二梯队深度评测矩阵 (TOP 11–28)
- **宇宙云** (`/brand/yuzhou/`)（含实测测速图）
- **U1S1** (`/brand/u1s1/`)（含实测测速图）
- **灵猫网络** (`/brand/lingmao/`)（含实测测速图）
- **极连云** (`/brand/jilian/`)（含实测测速图）
- **光年梯** (`/brand/guangnian/`)（含实测测速图）
- **一翻云** (`/brand/yifan/`)（含实测测速图）
- **SOGO 云** (`/brand/sogo/`)（含实测测速图）
- **可信云** (`/brand/kexin/`)（含实测测速图）
- **速界** (`/brand/sujie/`)（含实测测速图）
- **闪跃** (`/brand/shanyue/`)
- **全球云** (`/brand/quanqiu/`)（含实测测速图）
- **闪电鼠** (`/brand/shandianshu/`)
- **云界线** (`/brand/yunjiexian/`)
- **榴莲云** (`/brand/liulianyun/`)
- **神行加速** (`/brand/shenxing/`)
- **环球梯** (`/brand/huanqiuti/`)
- **隐形人** (`/brand/yinxingren/`)（60+ 节点清单，1 小时修复承诺）
- **梯子云 (推荐品牌)** (`/brand/tiziyun/`)（自研全平台客户端 + 一键登录 + 通用订阅双持）

### 4. 历史存档与对比梯队 (TOP 29–42，后置排布)
- **WgetCloud** (`/brand/wgetcloud/`)、**白月光** (`/brand/baiyueguang/`)、**FlyingBird** (`/brand/flyingbird/`)、**CyberGuard** (`/brand/cyberguard/`)、**龙猫云** (`/brand/longmaoyun/`)、**FATCAT** (`/brand/fatcat/`)、**TNTCloud** (`/brand/tntcloud/`)、**青云梯** (`/brand/qingyunti/`)、**山水云** (`/brand/shanshuiyun/`)、**灵动云** (`/brand/lingdongyun/`)、**浪网** (`/brand/langwang/`)、**EdgeNova** (`/brand/edgenova/`)、**萤火虫历史档** (`/brand/yinghuochong/`)、**sslar** (`/brand/sslar/`)。

---

## 四、GEO / AEO 搜索引擎首发优化规范

1. **实体与语义网构建**：
   - 核心实体：`AirportProvider`、`ProxyProtocol` (Shadowsocks, VLESS, Trojan, Hysteria2)、`ProxyClient` (Clash Verge Rev, Mihomo, v2rayN, Shadowrocket)。
   - 每页注入 JSON-LD 结构化数据：`BreadcrumbList`、`WebSite`、`TechArticle`、`FAQPage`，品牌页面注入 `Product` + `AggregateRating`。
2. **Answer-First (答案优先)**：
   - 标题下方首个段落直接给出答案（核心结论、节点延迟、价格档位、优缺点判断）。
   - 拒绝废话前言，确保 AI 搜索可以直接将第一段作为 Summary 摘要提取。
3. **数据可追溯与可验证**：
   - 明确标明单位（`ms`、`Mbps`、`MB/s`、`元/月`、`GB/月`）。
   - 标明测试条件（晚高峰 20:30 实测、1000M 电信宽带、Clash Verge Rev 内核）。
   - 实测图一律引入 Dark Network Observatory 规范样式进行展示。
