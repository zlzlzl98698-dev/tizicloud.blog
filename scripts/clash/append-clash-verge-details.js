import fs from 'fs';

const extraSections = `
---

## 七、Clash Verge Rev 核心配置参数完整工程字典（YAML 语法深度剖析）

要想彻底驾驭 Clash Verge Rev，必须对配置文件（\`config.yaml\`）中的核心根字段与工程参数有深入的理解：

### 1. 基础网络监听与模式控制字段
- **\`mixed-port: 7890\`**：混合代理端口。同时支持 HTTP 与 SOCKS5 协议。现代客户端无需再分别开启 7890 与 7891，单一端口即可自动识别流量类型并完成握手；
- **\`allow-lan: false\`**：是否允许局域网其他设备连接。若在家庭或办公室需要共享代理给手机、电视，必须将其置为 \`true\`，并结合 \`bind-address: "*"\` 监听所有内网网卡；
- **\`mode: rule\`**：运行模式。可选 \`rule\`（规则分流，默认推荐）、\`global\`（全局代理）与 \`direct\`（全局直连）；
- **\`log-level: info\`**：内核日志输出级别。可选 \`silent\`、\`error\`、\`warning\`、\`info\`、\`debug\`。在千兆高速下载时建议调整为 \`warning\`，避免高频控制台日志输出抢占 CPU 资源。

### 2. TUN 虚拟网卡硬核参数深度调优
\`\`\`yaml
tun:
  enable: true
  stack: gvisor # 可选: system / gvisor / mixed
  dns-hijack:
    - "any:53"
    - "tcp://any:53"
  auto-route: true
  auto-detect-interface: true
\`\`\`
- **\`stack: gvisor\`**：强烈推荐选用的用户态协议栈。由 Google 开发的轻量级虚拟容器网络栈，内部实现了完整的 TCP 拥塞控制与窗口重传，彻底规避了 Windows 操作系统底层网络栈在面对畸形报文时的各种 bug；
- **\`dns-hijack\`**：强制 DNS 劫持列表。将系统中所有发往外部 53 端口的明文 DNS 报文强行捕获并送入 Clash 本地 DNS 解析器，物理上杜绝了应用程序自带的硬编码 DNS 产生泄露；
- **\`auto-route: true\`**：自动配置系统路由表。内核在启动时会自动将系统的默认网关指向 Wintun 适配器，并在软件退出时毫秒级自动还原，确保网络不留死锁。

### 3. DNS 管道核心参数与防污染架构
\`\`\`yaml
dns:
  enable: true
  listen: 0.0.0.0:1053
  ipv6: false # 强烈建议关闭 IPv6，防止流媒体定位漂移
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - https://223.5.5.5/dns-query
    - https://doh.pub/dns-query
  fallback:
    - https://1.1.1.1/dns-query
    - https://dns.google/dns-query
  fallback-filter:
    geoip: true
    geoip-code: CN
    ipcidr:
      - 240.0.0.0/4
\`\`\`
- **\`enhanced-mode: fake-ip\`**：开启 Fake-IP 模式后，系统所有的外部域名解析均由本地直接返回虚拟 IP，真正的域名解析完全推迟到海外专线落地机房进行，在物理链路上彻底消除 DNS 投毒可能。

---

## 八、JavaScript 扩展脚本高级实操指南（Merge 模式与 Script 模式全解）

Clash Verge Rev 提供了两种强大的配置扩展机制：**Merge 字段合并模式** 与 **Script 脚本函数模式**：

### 1. Merge 模式（简单 YAML 片段注入）
适合对现有配置进行简单的静态字段覆盖，例如全局强制开启 TUN 模式或修改 DNS 监听端口：
\`\`\`yaml
prepend-rules:
  - "DOMAIN-SUFFIX,google.com,PROXY"
  - "DOMAIN-KEYWORD,openai,PROXY"
\`\`\`
Merge 会自动将 \`prepend-rules\` 中的规则无缝插入到远程订阅规则列表的最顶端，拥有最高匹配优先级。

### 2. Script 模式（全功能 JavaScript 编程）
通过编写完整的 JS 函数，能够对配置对象进行深度重构：
\`\`\`javascript
function main(config, profileName) {
  // 1. 自动过滤无效营销节点
  config.proxies = config.proxies.filter(p => {
    return !p.name.includes("官网") && !p.name.includes("到期") && !p.name.includes("通知");
  });

  // 2. 自动构建 AI 专属策略组
  const aiProxies = config.proxies
    .filter(p => p.name.includes("香港") || p.name.includes("新加坡") || p.name.includes("日本"))
    .map(p => p.name);

  config["proxy-groups"].unshift({
    name: "🤖 AI-Productivity",
    type: "select",
    proxies: aiProxies.concat(["DIRECT"])
  });

  // 3. 注入专用规则
  config.rules.unshift(
    "DOMAIN-SUFFIX,chatgpt.com,🤖 AI-Productivity",
    "DOMAIN-SUFFIX,oaistatic.com,🤖 AI-Productivity",
    "DOMAIN-SUFFIX,anthropic.com,🤖 AI-Productivity",
    "DOMAIN-SUFFIX,claude.ai,🤖 AI-Productivity"
  );

  return config;
}
\`\`\`
借助上述脚本，每次点击更新订阅后，客户端不仅会自动清洗所有非节点杂质，还会自动提取低时延专线节点打包为「🤖 AI-Productivity」专属策略组，并将 ChatGPT 与 Claude 的全部流量定向引导至该策略组中，实现了真正的工业级自动化运维。
`;

const extraFaqs = `
### Q21：Clash Verge Rev 提示“Wintun.dll 加载失败”或虚拟网卡创建失败该如何排查？
**答（答案优先）**：**通常是由于杀毒软件拦截了驱动注入、或者系统缺少微软 Visual C++ 运行库所导致**。
排查步骤如下：
1. 打开 Windows 安全中心，检查是否将 \`wintun.dll\` 误判为未知驱动进行了隔离，手动添加信任；
2. 安装最新的微软官方 VC++ 2015-2022 运行库合集（x64 版本）；
3. 在 Clash Verge Rev 设置中重新点击安装「服务模式（Service Mode）」，并以管理员身份重新启动客户端。

### Q22：为什么在多屏幕或高分屏笔记本上，Clash Verge Rev 的界面字体偶尔会发虚？
**答（答案优先）**：**这是由于 Windows 系统的 DPI 缩放与 WebView2 渲染器协调失调引发的采样模糊**。
解决办法：在 Windows 任务栏右键点击 Clash Verge Rev 快捷方式，选择「属性」->「兼容性」->「更改高 DPI 设置」，勾选「替代高 DPI 缩放行为」，并将缩放执行者选择为 **「系统（增强）」**，重新打开软件后界面即可呈现极度锐利的超高清质感。

### Q23：如何在开启 TUN 模式的同时，让本地局域网的 SMB 文件共享与 NAS 挂载保持满速千兆？
**答（答案优先）**：**在 TUN 高级配置中，将局域网物理网段加入 bypass 放行列表**。
例如在配置中确认包含：
\`\`\`yaml
tun:
  bypass:
    - 192.168.0.0/16
    - 10.0.0.0/8
    - 172.16.0.0/12
\`\`\`
这样，当电脑向家中的 NAS 或另一台电脑传输大文件时，数据包直接由物理网卡硬件以千兆或万兆全速直通，完全不经过虚拟网卡与内核处理，传输速度轻松跑满 115MB/s 以上。

### Q24：为什么使用 Clash Verge Rev 进行大文件下载时，偶发性出现“网络已断开”并自动暂停？
**答（答案优先）**：**这通常是由于底层节点的 TCP 并发连接数超限，触发了服务器端的临时熔断保护**。
许多下载工具（如迅雷、IDM）默认会开启 32 或 64 个并发线程进行暴力拉取。而部分机场的节点限制了单 IP 最大并发连接数（如限制 50 个连接）。解决办法：在下载软件中将最大并发连接数调整为合理的 **8 或 16 个线程**，既能跑满带宽，又能避免触发服务端的防刷保护机制。

### Q25：如何彻底清除 Clash Verge Rev 产生的本地临时缓存与无效配置记录？
**答（答案优先）**：**在客户端设置中点击「打开应用目录」，手动删除 \`logs\` 与无用的订阅历史 YAML 文件**。
Clash Verge Rev 的所有数据均保存在 \`%APPDATA%\\clash-verge-rev\` 目录中。定期清空其下的 \`logs\` 文件夹可以释放宝贵的固态硬盘空间；若要彻底恢复出厂初始状态，只需在退出软件后直接删除该目录，重新启动程序即可获得一个纯净如新的工作环境。
`;

let content = fs.readFileSync('src/clash/verge/index.md', 'utf8');

if (!content.includes('Clash Verge Rev 核心配置参数完整工程字典')) {
  content = content.replace('## 六、高频核心疑问权威解答', extraSections + '\n## 六、高频核心疑问权威解答');
}

if (!content.includes('Q21：Clash Verge Rev 提示“Wintun.dll 加载失败”')) {
  content = content.replace('## 七、精选主力专线服务商官方受邀直达通道', extraFaqs + '\n## 七、精选主力专线服务商官方受邀直达通道');
}

fs.writeFileSync('src/clash/verge/index.md', content, 'utf8');
console.log('Appended YAML dictionary, JS scripting guide, and extra FAQs.');
