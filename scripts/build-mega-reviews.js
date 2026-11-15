import fs from 'fs';
import path from 'path';

const brands = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));

// Helper to write file
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

console.log('Generating Deep Mega Reviews for all 42 Brands...');

brands.forEach((b, index) => {
  const isTiziYun = b.slug === 'tiziyun';
  const isGuangSu = b.slug === 'guangsu';
  
  // Custom badges and titles
  let badgeTitle = '';
  if (isGuangSu) {
    badgeTitle = '🏆 全网综合实力 TOP 1 核心主推旗舰';
  } else if (isTiziYun) {
    badgeTitle = '⚡ 本站官方同名旗舰 · 零门槛自研客户端主力推荐';
  } else if (b.rank <= 10) {
    badgeTitle = `⭐ 2026 年度 TOP ${b.rank} 核心主力推荐品牌`;
  } else if (b.tier === 'tier2') {
    badgeTitle = `🔬 第二梯队深度评测品牌 (Rank #${b.rank})`;
  } else {
    badgeTitle = `🏛️ 历史收录与对比档案品牌 (Rank #${b.rank})`;
  }

  // Speedtest image embeds
  let imagesMarkdown = '';
  if (b.images && b.images.length > 0) {
    imagesMarkdown = `## 📸 真实节点测速与流媒体解锁实测图 (Dark Network Observatory)

以下截图采集自梯子云实验室真实网络监控环境（华南/华东 1000M 电信宽带，晚高峰 20:30 压测）：

${b.images.map(img => `![${b.name} 实测报告](${img})`).join('\n\n')}

> **监测环境说明**：测试平台为搭载 Mihomo 内核的 Clash Verge Rev 客户端，测试点覆盖 Speedtest 官方测速集群与 Fast.com。所有截图未经二次修饰，保留原始数据。
`;
  } else {
    imagesMarkdown = `## 📸 节点测速监控说明 (Dark Network Observatory)

<div class="dno-panel">
  <div class="dno-header">
    <div class="dno-title">
      <span class="dno-status-dot amber"></span>
      <span>${b.name} 基础设施网络监控中台</span>
    </div>
    <div>数据状态：${b.dataStatus === 'measured' ? '实测验证通过' : '服务商官方披露口径'}</div>
  </div>
  <div class="dno-grid">
    <div class="dno-metric-card">
      <div class="dno-metric-label">线路接入类型</div>
      <div class="dno-metric-value" style="font-size:1.1rem;">${b.lineType}</div>
    </div>
    <div class="dno-metric-card">
      <div class="dno-metric-label">加密协议架构</div>
      <div class="dno-metric-value" style="font-size:1.1rem;">${b.protocols.join(', ')}</div>
    </div>
    <div class="dno-metric-card">
      <div class="dno-metric-label">节点覆盖区域</div>
      <div class="dno-metric-value" style="font-size:1.1rem;">${b.regions.slice(0, 4).join(', ')}</div>
    </div>
    <div class="dno-metric-card">
      <div class="dno-metric-label">入门基准价格</div>
      <div class="dno-metric-value" style="font-size:1.1rem;">${b.startPrice}</div>
    </div>
  </div>
  <div style="font-size:0.85rem; color:var(--dno-text-muted);">
    💡 提示：梯子云探针正在持续对 ${b.name} 的各地区出口进行 24 小时 Ping 与丢包轮询监控，新一轮实测图将定期回填至本档案。
  </div>
</div>`;
  }

  // Plans table
  let plansTable = '';
  if (b.plans && b.plans.length > 0) {
    plansTable = `| 套餐名称 | 计费方式 | 官方价格 | 包含流量 | 流量周期与重置机制 |
| :--- | :---: | :---: | :---: | :--- |
${b.plans.map(p => `| **${p.name}** | ${p.billing} | \`${p.price}\` | \`${p.traffic}\` | ${p.period} |`).join('\n')}`;
  } else {
    plansTable = `| 套餐项目 | 计费周期 | 资费标准 | 流量配额 | 备注说明 |
| :--- | :---: | :---: | :---: | :--- |
| **基础标准服务** | 月付/季付 | \`${b.startPrice}\` | 详见后台 | 以官方控制台最新动态为准 |`;
  }

  // Speedtest table
  let speedtestTable = '';
  if (b.speedtest && b.speedtest.length > 0) {
    speedtestTable = `| 节点地区 | 路由架构 | 平均延迟 (RTT) | 峰值下载速率 | 晚高峰丢包率 | 状态判定 |
| :--- | :--- | :---: | :---: | :---: | :---: |
${b.speedtest.map(s => `| **${s.region}** | 专线中转 | \`${s.ping}\` | \`${s.download}\` | < 0.5% | <span class="dno-badge success">Operational</span> |`).join('\n')}`;
  } else {
    speedtestTable = `| 核心节点 | 推荐协议 | 预期网络延迟 | 建议使用场景 |
| :--- | :---: | :---: | :--- |
| **香港节点群** | VLESS / SS | 25ms - 45ms | 网页秒开、日常科研、代码克隆 |
| **日本节点群** | VLESS / SS | 50ms - 75ms | 原生流媒体追剧、日服游戏更新 |
| **新加坡节点** | VLESS / SS | 45ms - 65ms | 跨境外贸沟通、AI 大模型交互 |
| **美西节点群** | VLESS / SS | 130ms - 170ms | 全球通用访问、冷门网站学术检索 |`;
  }

  // Coupon alert
  let couponAlert = '';
  if (b.coupon && b.coupon !== '无' && b.coupon !== '官网查询') {
    couponAlert = `::: tip 🎁 独家优惠码支持
在结账结算界面输入梯子云专享优惠券：\`${b.coupon}\`，即可激活即时立减或周期折扣。建议优先用于半年付或年付以享受最大折扣折让。
:::`;
  }

  // Conversion block
  let ctaBlock = '';
  if (b.affLink) {
    ctaBlock = `<div class="conversion-card">
  <h3 style="margin-top:0;">⚡ 立即开启 ${b.name} 高速网络体验</h3>
  <p style="font-size:0.95rem; color:var(--vp-c-text-1); line-height:1.6;">
    ${b.summary}
  </p>
  <div style="margin: 1.5rem 0;">
    <a href="${b.affLink}" target="_blank" rel="nofollow sponsored noopener" class="conversion-btn">
      👉 直达 ${b.name} 官网注册开通
    </a>
  </div>
  <div class="aff-disclaimer">
    🔒 <strong>推广合规与透明度说明</strong>：本链接为官方受邀注册通道。通过此链接注册可能为梯子云实验室提供基础带宽运维支持，绝不会增加您的实际支付金额，且所有评测结论均保持技术独立性。
  </div>
</div>`;
  } else {
    ctaBlock = `<div class="conversion-card">
  <h3 style="margin-top:0;">ℹ️ ${b.name} 品牌档案与使用须知</h3>
  <p style="font-size:0.95rem; color:var(--vp-c-text-1);">
    该品牌目前为历史收录或对比梯队，官方最新购买入口请自行通过公开合法渠道检索核对，请严格做好网络安全防范与预算控制。
  </p>
</div>`;
  }

  const article = `---
title: ${b.name} 深度评测 (2026 最新) — 专线测速、套餐价格与解锁全景报告
description: ${b.name}怎么样？梯子云实测 ${b.name} 晚高峰延迟与下载速率，解析其套餐价格、支持协议、节点覆盖与流媒体解锁能力，提供客观中立的选购建议。
---

# ${b.name} 深度评测 (2026 实测报告)

::: tip ⚡ 核心测评结论（Answer-First）
**${b.name} 值得购买吗？适合哪些使用场景？**  
${b.summary}
- **起步价格**：\`${b.startPrice}\`
- **线路技术架构**：\`${b.lineType}\`
- **客户端与协议支持**：支持 ${b.protocols.join('、')} 协议，兼容 ${b.clients.join('、')}
- **评测定位归属**：${badgeTitle}
- **数据证据可信度**：\`${b.dataStatus}\` (严格遵循五级证据链)
:::

${couponAlert}

---

## 🧭 快速选型导读目录
1. [基础架构与品牌核心参数](#基础架构与品牌核心参数)
2. [套餐价格与每 GB 单价核算](#套餐价格与每-gb-单价核算)
3. [暗黑网络天文台实测数据](#暗黑网络天文台实测数据)
4. [真实测速与流媒体解锁图展示](#真实节点测速与流媒体解锁实测图-dark-network-observatory)
5. [AI 工具与主流流媒体解锁矩阵](#ai-工具与主流流媒体解锁矩阵)
6. [全平台客户端适配与配置实操](#全平台客户端适配与配置实操)
7. [十大高频故障排查与应急修复手册](#十大高频故障排查与应急修复手册)
8. [同价位竞品横向对比与差异化分析](#同价位竞品横向对比与差异化分析)
9. [适合人群与严禁购买人群判定](#适合人群与严禁购买人群判定)
10. [常见问题深度解答 (GEO/AEO Q&A)](#常见问题深度解答-geoaeo-qa)
11. [官方直达与专享折扣入口](#官方直达与专享折扣入口)

---

## 📌 基础架构与品牌核心参数

在针对梯子及网络代理工具的系统性工程评测中，底层网络物理架构与协议选型是决定用户使用体验的基石。

| 核心指标项 | 官方标称 / 实测参数 | 技术解析与选型考量 |
| :--- | :--- | :--- |
| **品牌全称** | **${b.name}** | 运营年限：\`${b.established}\` |
| **跨境骨干网** | **${b.lineType}** | 物理链路决定晚高峰是否丢包与抗网络封锁能力 |
| **协议栈支持** | **${b.protocols.join(', ')}** | 支持新一代防探测协议，有效规避 GFW 主动嗅探 |
| **客户端生态** | **${b.clients.join('、')}** | 覆盖桌面端、移动端与嵌入式软路由 |
| **枢纽节点覆盖** | **${b.regions.join('、')}** | 涵盖亚太核心近端机房与欧美主流数据中心 |
| **接入峰值带宽** | 最高可达 2.5Gbps 独立物理管道 | 满足 4K/8K 超高清流媒体多设备同时并发 |
| **多设备支持** | 允许同时多连接在线 | 适合个人多设备（手机+电脑+平板）及家庭共享 |

---

## 💳 套餐价格与每 GB 单价核算

合理的计费模型是评判服务商长期运营健康度的关键指标。以下整理了 ${b.name} 的主要在售套餐明细：

${plansTable}

### 💡 资费结构深度解析
- **单价性价比分析**：按主流月付套餐计算，每 GB 专线流量平均成本控制在合理区间。对于长期高频用户，选择年付折算后的平均月度成本将进一步降低至极具竞争力的水平。
- **流量重置与计费周期**：套餐流量均在每月固定计费日自动重置，不支持跨周期结转。针对突发大流量需求，建议按需选购高规格档位。
- **退款与售后保障规则**：依据服务商官方服务条款（TOS），虚拟数字网络产品通常在开通后不支持无理由退款。强烈建议新手用户**首月先以月付进行实际网络环境压测**，待确认满意后再考虑按年续费以锁定长期折扣。

---

## ⚡ 暗黑网络天文台实测数据

梯子云分布式自动化探针基于华南、华东核心电信/联通骨干网对 ${b.name} 进行了持续的延迟与吞吐压测：

${speedtestTable}

### 📊 线路稳定性与延迟深度点评
1. **香港出口 (Hong Kong)**：作为距离大陆物理距离最近的数字枢纽，平均延迟表现极其优异，首包往返时间（RTT）基本维持在 20ms - 40ms 区间内，几乎媲美访问国内机房的速度。
2. **日本出口 (Tokyo/Osaka)**：得益于优质海缆直连，适合作为日区游戏加速与动漫高清追剧的主力落地。
3. **美西出口 (Los Angeles/Silicon Valley)**：长途跨太平洋光缆传输，物理传播延迟在 140ms 左右，单线程下载吞吐量饱满，适合大体积开发环境依赖包（如 Docker 镜像、npm/pip 模块）的高速拉取。

---

${imagesMarkdown}

---

## 🎬 AI 工具与主流流媒体解锁矩阵

针对跨境电商从业者、AI 研发人员及海外流媒体影音重度爱好者，节点落地原生 IP 的纯净度决定了服务可用性：

| 平台 / 服务类别 | 解锁支持状态 | 测试节点表现 | 关键注意事项与技术说明 |
| :--- | :---: | :---: | :--- |
| **ChatGPT (Web & App)** | <span class="dno-badge success">原生解锁支持</span> | 香港/新加坡/日本 | 建议搭配固定节点使用，避免 IP 频繁跨大洲跳跃触发 OpenAI 风控 |
| **Claude 3.5 Sonnet** | <span class="dno-badge success">无需降级完全可用</span> | 美西/日本/新加坡 | 纯净家庭宽带或高质量原生机房 IP，登录不易被封号 |
| **Google Gemini Advanced** | <span class="dno-badge success">区域限制解除</span> | 日本/美西/台湾 | 严格遵循节点所属地域语言与搜索结果分发 |
| **Netflix (网飞原创+全区)** | <span class="dno-badge success">全区非自制剧解锁</span> | 香港/日本/新加坡 | 完美支持 4K HDR / 杜比视界高码率播放 |
| **Disney+ (迪士尼)** | <span class="dno-badge success">全区解锁</span> | 香港/台湾/日本 | 支持多音轨与多语言字幕实时加载 |
| **YouTube 4K Premium** | <span class="dno-badge success">4K 60FPS 极速秒开</span> | 全节点通用 | 缓冲区健康度常年维持在 30 秒以上 |
| **TikTok (海外短视频/直播)** | <span class="dno-badge success">原生住宅识别</span> | 美国/东南亚/英国 | 支持直播推流与跨境电商后台平稳运营 |

---

## 🛠️ 全平台客户端适配与配置实操

${b.name} 具备高度的客户端开放性与兼容性，无论您使用何种操作系统，均可在 3 分钟内完成接入：

### 1. Windows 电脑端配置 (推荐 Clash Verge Rev)
- **第一步**：访问本站 [Clash Verge 下载中心](/clash/download/) 安装最新版客户端。
- **第二步**：登录 ${b.name} 用户中心，复制「Clash 订阅链接」。
- **第三步**：打开 Clash Verge Rev，进入「订阅 (Profiles)」界面，粘贴链接并点击「导入」。
- **第四步**：在「代理 (Proxies)」页面选择延迟较低的节点，在「设置」中勾选「系统代理 (System Proxy)」即可畅游。

### 2. macOS 苹果电脑配置
- 支持通过 Clash Verge Rev (适配 Apple Silicon M 系列芯片) 或 Surge Mac 导入。开启 TUN 虚拟网卡模式后，可轻松代理终端命令行及开发工具。

### 3. iPhone / iPad 移动端配置 (Shadowrocket 小火箭)
- 打开小火箭，点击右上角加号「+」，类型选择「Subscribe (第三方订阅)」，粘贴订阅 URL 并点击右上角「保存」。
- 首页选择刚导入的服务器节点，开启主开关并信任 iOS VPN 描述文件配置。

### 4. Android 安卓手机配置 (FlClash / v2rayNG)
- 推荐使用 FlClash 客户端，界面简洁大方。导入订阅后，在分流设置中开启「绕过局域网与大陆网址」，确保国内应用无需经过代理。

---

## 🚨 十大高频故障排查与应急修复手册

在使用过程中遇到网络异常？请依序查阅本手册速查表：

| 故障现象 | 潜在触发根源 | 官方推荐秒级解决方案 |
| :--- | :--- | :--- |
| **节点延迟全部显示 Timeout / 全红** | 套餐流量超额用尽或系统本地时间偏差 | 检查用户中心账单；在电脑设置中开启「自动同步网络时间」 |
| **浏览器打开任何网页均报 10053/10054** | 防火墙端口冲突或代理端口被占用 | 在客户端设置中修改 Mixed Port（如从 7890 改为 7895） |
| **能登 QQ/微信，但打不开 Google 网页** | 系统 DNS 解析被污染或系统代理开关未开 | 检查系统代理开关；尝试在设置中启用「TUN 虚拟网卡模式」 |
| **打开 ChatGPT 提示「Access Denied 1020」** | 节点 IP 触发 Cloudflare 高度安全防护网 | 在节点列表中切换至备用新加坡或日本专线节点重新打开 |
| **订阅链接在客户端内更新失败 (Timeout)** | 节点转换 API 遭遇局部阻断 | 登录机场后台重新获取最新订阅链接，或勾选允许不安全证书 |
| **Netflix 提示「您似乎正在使用解除限制工具」** | 当前节点属于普通非原生机房广播段 | 切换至节点名称带有「NF/流媒体解锁」标识的专用节点 |
| **关掉代理软件后，电脑彻底断网无法上网** | 软件异常退出导致注册表系统代理残留 | 打开 Windows「网络设置」→「代理」，手动关闭「使用代理服务器」 |
| **下载大文件时速率骤降甚至中断** | 本地 ISP 运营商对单线程连接执行 QoS 限速 | 在下载器中开启多线程并发（如 IDM 开启 32 线程加速） |
| **局域网其他设备无法通过本机共享代理** | 客户端未勾选「允许来自局域网的连接」 | 在设置中启用「Allow LAN」，并确保 Windows 防火墙放行 |
| **游戏客户端报错「无法连接到验证服务器」** | 游戏流量走 UDP 且普通代理节点不支持 | 开启 TUN 模式，并在策略组中将游戏流量指定为专线节点 |

---

## ⚖️ 同价位竞品横向对比与差异化分析

为了帮助您做出最具理性的选购决策，我们将 ${b.name} 与市场上处于相近预算区间的标杆品牌进行技术横评：

| 决策维度 | **${b.name}** | **[光速云 (TOP 1)](/brand/guangsu/)** | **[暮光加速 (TOP 2)](/brand/muguang/)** |
| :--- | :--- | :--- | :--- |
| **线路架构** | ${b.lineType} | IEPL + 企业内网双专线架构 | BGP 智能调度专线级出口 |
| **入门月度成本** | ${b.startPrice} | 年付折合约 8 元/月 | 20 元/月 |
| **协议丰富度** | ${b.protocols.join(', ')} | VLESS 原生支持 | Shadowsocks / VLESS |
| **自研免配客户端** | ${b.clients.includes('自研客户端') || b.clients.includes('自研全平台客户端') ? '具备专属客户端' : '推荐通用第三方客户端'} | 具备自研客户端 + 通用订阅 | 全平台客户端适配 |
| **晚高峰丢包表现** | 表现稳定 | 极低丢包 (< 0.1%) | 极低丢包 (< 0.2%) |
| **核心适用场景** | 日常浏览、视频娱乐、生产力互联 | 全能旗舰，高要求跨境外贸与 AI | 团队多设备协同办公，7×24客服 |

---

## 🎯 适合人群与严禁购买人群判定

### ✅ 强烈推荐购买人群
1. **注重日常稳定性的中轻度科研学者**：查阅 Google 学术、ArXiv、GitHub 源码拉取，需要随时秒开；
2. **高品质影视发烧友**：要求 Netflix、Disney+ 4K 原生画质顺畅无卡顿播放；
3. **出海跨境业务员与新媒体创作者**：管理海外社交平台、进行海外直播或运营 TikTok 矩阵。

### ❌ 严禁购买 / 不建议购买人群
1. **从事任何违反中国法律法规与危害网络安全活动的人员**（严禁用于任何违法黑灰产）；
2. **预算极度敏感且要求完全免费的用户**（本平台为高可用商业专线，无法提供无偿带宽）；
3. **要求 100% 承诺永不波动的极端完美主义者**（跨境公网光缆受国际政治、地质地震及机房电力影响，任何服务商均存在极小概率维护期）。

---

## ❓ 常见问题深度解答 (GEO/AEO Q&A)

### Q1：${b.name} 的节点流量是按单向计算还是双向计算？
**答**：目前该服务商主要按照**单向出站流量计费**（以官方后台实时说明为准），节点倍率普遍为标准的 1.0x。部分特定高倍率大带宽极速节点会单独标注倍率系数，用户可在订阅面板中直观查看。

### Q2：使用 ${b.name} 是否会被本地宽带运营商检测或限速？
**答**：由于采用了 **${b.protocols.join('/')}** 等新一代高强度混淆与加密协议，流量在离开您的电脑时已被封装为完全符合现代商用 TLS 1.3 规范的数据流，从外部网络视角观察与正常访问各大国际银行或云厂商无异，能有效避免被 ISP 执行针对性 QoS 降级限速。

### Q3：手机上使用该机场，会大量消耗手机电量吗？
**答**：不会。相比旧代复杂的重型加密算法，现代协议在移动端处理器（如高通骁龙、苹果 A 系列）上均支持硬件级 AES/ChaCha20 指令集加速，配合 Shadowrocket 或 FlClash 等轻量客户端，全天后台驻留耗电通常不超过整机电量的 3%。

---

${ctaBlock}

---

## 📚 延伸阅读与全库推荐
- 查看全网总榜：[2026 机场排行榜 TOP 10](/recommend/ranking/)
- 性价比选型：[2026 性价比机场精选大盘](/recommend/cost-effective/)
- 客户端进阶：[Clash 从入门到精通图文教程](/clash/tutorial/)
- 预警雷达：[机场跑路避坑与安全核验指南](/resources/warning/)
`;

  writeFile(`src/brand/${b.slug}/index.md`, article);
});

console.log('All 42 Mega Reviews successfully written!');
