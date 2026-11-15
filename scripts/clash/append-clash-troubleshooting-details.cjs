const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/clash/troubleshooting/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const technicalDeepDive = `
## 七、内核级 TUN 虚拟网卡与网络栈底层崩溃故障攻坚指南

在开启 Clash 的 TUN 模式（虚拟网卡全局拦截模式）时，大量资深用户与生产级开发者常遭遇系统级断网、网卡驱动无法加载或蓝屏假死。TUN 模式与常规系统代理不同，它通过在操作系统内核层创建一块软件虚拟网卡（在 Windows 下通常为 Wintun 或 WinTUN/TAP，在 macOS 下为 utun 驱动，在 Linux 下为 tun 设备），并将所有 IP 数据包重定向至 Clash 内核的 TCP/IP 协议栈中。

### 1. Wintun 网卡创建失败与系统驱动冲突深度排查

在 Windows 10/11 环境下，最常见的控制台核心报错为：
\`FATAL[0001] create tun interface error: failed to open wintun adapter: The system cannot find the file specified\` 或 \`wintun adapter already exists\`。

#### 故障根本原因深度解剖：
1. **多重安全软件与老旧 VPN 驱动残留**：360 安全卫士、火绒安全、旧版 OpenVPN、AnyConnect 或老旧 TAP-Windows Adapter V9 残留的注册表项占用了系统虚拟网卡池标识符（GUID），导致 Wintun 动态创建句柄时返回拒绝访问（Error 5: Access Denied）。
2. **Windows 注册表设备网络配置树损坏**：在注册表项 \`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\` 下存在幽灵网卡键值，缺少必需的 IPAddress、SubnetMask 与 DefaultGateway 初始化定义。
3. **Clash 进程权限降权与 UAC 限制**：Clash Verge Rev 或内核主程序未以管理员权限启动，无法加载未签名的临时动态链接库 \`wintun.dll\`。

#### 标准化五步自愈流程：
- **步骤一：清除幽灵网络适配器与驱动注册表**。按下 Win+X 选择“终端管理员”，运行命令 \`netsh winsock reset\` 以及 \`netsh int ip reset\`，强制清空 Windows 网络套接字层与 TCP/IP 堆栈缓存。
- **步骤二：设备管理器深层卸载**。按下 Win+R 输入 \`devmgmt.msc\` 打开设备管理器，点击菜单栏“查看” -> “显示隐藏的设备”，展开“网络适配器”，找到所有带有“Wintun Userspace Tunnel”、“TAP-Windows Adapter”、“VirtualBox Host-Only Ethernet”字样的设备，右键选择“卸载设备”，并务必勾选“尝试为此设备删除驱动程序”。
- **步骤三：手动重置 Clash 内核驱动环境**。进入 Clash Verge Rev 安装目录下的 \`resources\` 目录，定位 \`wintun.dll\`。以管理员身份打开 PowerShell，执行 \`sfc /scannow\` 修复系统底层组件完整性，确保驱动签名验证机制工作正常。
- **步骤四：修改内核配置文件网卡栈类型**。如果在默认的 \`gvisor\` 虚拟栈下频繁发生缓冲区溢出，可在配置中将 \`stack\` 切换为系统原生栈 \`system\` 或性能最优的 \`mixed\` 模式。
- **步骤五：冷重启操作系统**。执行完整的系统冷重启（非混合快速启动），使 Windows 内核重新分配网络接口索引（Interface Metric）。

---

### 2. Fake-IP 缓存投毒与局域网 DNS 污染死锁消除

Clash 的 Fake-IP 模式通过为境外未解析域名立即分配一个保留内网地址（如 198.18.0.1/16 网段中的虚拟 IP），从而将 DNS 解析动作后置到远端代理节点执行，实现毫秒级的连接建连。然而，当 Clash 异常崩溃、强制关机或网络断开时，本机的操作系统 DNS 缓存中仍驻留着大量 198.18.x.x 的虚假映射，导致重启后“所有网页打不开、QQ/微信等非域名直连软件正常运行”的典型断网故障。

#### 核心特征与根因诊断：
- 在 Windows 命令行运行 \`ping baidu.com\`，返回的 IP 地址居然是 \`198.18.0.25\`，且 ping 超时。
- 浏览器控制台出现 \`ERR_NAME_NOT_RESOLVED\` 或 \`ERR_CONNECTION_REFUSED\`。
- 根本原因在于 Windows 的 DNS Client 服务（dnscache）缓存了 Fake-IP 解析应答，而在 Clash 内核退出后，没有外部网关能够对 198.18.0.0/16 网段的数据报文进行路由解封装，所有出站数据包直接被操作系统路由表扔进黑洞路由（Blackhole Route）。

#### 三步彻底修复与长效防御方案：
1. **执行系统级 DNS 与路由表清退**：在管理员命令行中顺序输入以下三行指令：
   - \`ipconfig /flushdns\`（刷新 Windows 本地解析器缓存）；
   - \`route delete 198.18.0.0 mask 255.255.0.0\`（删除遗留在系统静态路由表中的 TUN 虚拟网段路由）；
   - \`netsh interface ipv4 set address "以太网" dhcp\`（将物理网卡重新重置为自动获取 IP，避免网关被锁死在 127.0.0.1）。
2. **优化 Clash 的 Fake-IP 过滤名单（fake-ip-filter）**：编辑配置文件的 \`dns\` 模块，确保所有国内政务、银行、金融及局域网直连域名加入白名单，强制走原生 DNS 直连解析：
   - \`*.lan\`、\`*.local\`、\`*.msftconnecttest.com\`、\`*.msftncsi.com\`（Windows 网络连通性测试探针）；
   - 国内关键支付网关与直连域名：\`*.alipay.com\`、\`*.tenpay.com\`、\`*.baidu.com\`。
3. **禁用 Windows 智能多宿主名称解析（Smart Multi-Homed Name Resolution）**：Windows 10/11 会向所有活动物理网卡与虚拟网卡并发广播 DNS 请求，谁先返回用谁，极易导致局域网 DNS 泄露与污染。在组策略编辑器中依次展开“计算机配置” -> “管理模板” -> “网络” -> “DNS 客户端”，将“关闭智能多宿主名称解析”设置为“已启用”。

---

### 3. TLS 握手失败、X509 证书链失效与系统时钟漂移排查

在 Clash 控制台的日志流（Logs）中，如果持续爆红出现以下两类错误信息：
- \`x509: certificate has expired or is not yet valid\`
- \`remote error: tls: handshake failure\` 或 \`tls: unrecognized name\`
这表明在建立 TLS 1.3 / Reality 隧道时，客户端与目标代理服务器或落地端握手过程遭遇了加密学级别的身份鉴权挫败。

#### 故障原因逐级排查链条：
1. **系统时钟严重漂移（误差大于 90 秒）**：VLESS Reality、VMess 以及现代双向 TLS 握手协议，均在时间戳上引入了重放攻击防护机制。如果本机的 BIOS 电池耗尽、双系统引导或未开启网络时间自动同步，导致本地系统时间与国际标准时间（UTC）相差超过 60-90 秒，TLS 证书将被内核判定为“尚未生效”或“已经失效”，从而在握手第一阶段直接断开连接。
   - **解决方案**：在系统设置中进入“时间和语言” -> “日期和时间”，点击“立即同步”。Windows 用户亦可在终端执行 \`w32tm /resync\` 强制与微软授时服务器对齐时钟。
2. **中间人证书嗅探与杀毒软件 SSL 扫描**：部分杀毒软件（如卡巴斯基、ESET、Bitdefender 等）默认启用了“HTTPS/SSL 安全流量扫描”功能，会在系统根证书存储区中植入自签名根证书，并劫持本地 443 端口的入站连接。Clash 内核默认开启了严格的证书链校验（strict-ssl），检测到中间人证书公钥指纹不匹配时会主动阻断通信。
   - **解决方案**：在杀毒软件设置中将 Clash 客户端程序目录及内核二进制执行文件加入“全面排除项/豁免证书扫描名单”；或者在 Clash 订阅配置中临时将 \`skip-cert-verify: true\`，但请注意此项仅供临时排查测试，长期开启会降低通信抗中间人攻击的安全性。
3. **节点域名 TLS SNI 与 Reality Target 伪装失配**：如果使用的是 VLESS Reality 协议，机场服务端配置的伪装域名（dest / serverNames）可能遭遇了 Cloudflare 或目标 CDN 的封锁，或者客户端配置文件中的 public-key（公钥）或 shortId 与服务端密钥对不一致。
   - **解决方案**：第一时间在客户端点击“更新订阅”，拉取服务商最新的节点凭证；如仍报错，需在控制台节点列表中切换到备用的 Trojan 或传统 Shadowsocks-2022 节点。

---

### 4. ChatGPT / Claude / Netflix / Disney+ 分流失效与 403 / 1020 报错修复实战

很多用户反馈：“Clash 能够正常打开 Google 和 YouTube 4K，但只要访问 ChatGPT 就提示 Access Denied 1020，打开 Claude 提示 App 403 Forbidden，登录 Netflix 提示使用了代理只能看自制剧”。这通常不是由于节点完全断网，而是分流规则未命中或落地的节点 IP 被目标平台风控系统标记为数据中心机房（Data Center IP）。

#### 平台风控特征矩阵与排查对策表：

| 受限平台 | 典型客户端报错代码 | 核心触发根因 | 针对性分流修复策略 |
| :--- | :--- | :--- | :--- |
| **OpenAI / ChatGPT** | Access Denied (Error 1020) / Unable to load site | 节点落地 IP 为机房广播 IP，或 Cloudflare Turnstile 验证未通过 | 在规则组中为 OpenAI 配置独立规则集，将流量导向拥有家庭原生住宅 IP 的节点（如美区或日区专线） |
| **Anthropic / Claude** | App Unavailable (403 Forbidden) / Organization Disabled | 节点 IP 处于非支持国家地区，或同一节点并发登录过多被批量标记 | 切换至冷门住宅出口节点，清除浏览器 IndexedDB 与 LocalStorage，并禁用 WebRTC 真实公网 IP 广播 |
| **Netflix 网飞** | Pardon the interruption / 仅展示自制剧 (Netflix Originals) | 目标节点 IP 被 Netflix 流媒体数据库识别为机房代理 | 在规则集配置中开启针对 Netflix 域名的定向分流，指定原生解锁（Residential Unlock）倍率节点 |
| **Disney+ 迪士尼** | Error Code 83 / 无法加载服务 | IP 纯净度检测失败或 CDN 边缘节点阻断 | 清空客户端 DNS 缓存，开启 Fake-IP 模式并确保节点支持 IPv4 原生广播 |
| **Spotify 声破天** | 登录页面白屏 / 自动切换离线 | 注册国别与节点国别不符，每 14 天强制鉴权 | 将节点切换至与 Spotify 个人账户所属国家完全一致的落地服务器 |

#### 分流规则自定义覆盖代码注入：
在 Clash Verge Rev 中，可利用“扩展脚本（Script）”或“规则预处理（Merge Rules）”在最前列追加专属定向分流，强行重定向流媒体与大模型流量：
\`\`\`yaml
# 强行置顶大模型与流媒体高优先级路由组
rules:
  - DOMAIN-SUFFIX,oaistatic.com,OpenAI
  - DOMAIN-SUFFIX,oaiusercontent.com,OpenAI
  - DOMAIN-SUFFIX,openai.com,OpenAI
  - DOMAIN-SUFFIX,anthropic.com,Claude
  - DOMAIN-SUFFIX,claude.ai,Claude
  - DOMAIN-KEYWORD,netflix,Netflix
  - DOMAIN-SUFFIX,disneyplus.com,Disney
  - GEOIP,CN,DIRECT
  - MATCH,兜底漏斗
\`\`\`

---

### 5. 跨平台（Windows / macOS / Android / iOS）端口冲突与进程占用排查全景

Clash 默认在操作系统中侦听本地特定网络端口：常规混合代理端口（Mixed Port）通常为 \`7890\`，SOCKS5 端口为 \`7891\`，HTTP 端口为 \`7892\`，外部控制 RESTful API 端口为 \`9090\`。一旦这些关键端口被其他软件占用，Clash 内核在初始化启动阶段将发生致命崩溃（Fatal Crash）。

#### 端口冲突典型表象：
- Clash 图标闪退，或主界面弹出提示：\`listen tcp 127.0.0.1:7890: bind: address already in use\`。
- 点击开关无法开启系统代理，反复自动弹回关闭状态。

#### 各平台端口占用定位与清除实操：

#### Windows 平台精准杀除占用进程：
1. 按下 Win+R 输入 \`cmd\`，执行以下端口探测命令：
   \`netstat -ano | findstr :7890\`
2. 控制台将输出类似：\`TCP 127.0.0.1:7890 0.0.0.0:0 LISTENING 14280\`，其中末尾数字 \`14280\` 即为占用该端口的进程标识符（PID）。
3. 查找该 PID 对应的可执行程序名称：
   \`tasklist | findstr 14280\`
   （常见占用程序：旧版 v2rayN、ShadowsocksR、迅雷、各类安卓模拟器后台 ADB 进程、企业级监控软件）。
4. 强制结束该进程：
   \`taskkill /F /PID 14280\`
5. 或者在 Clash Verge Rev 的“通用设置”中，将混合代理端口由 7890 更改为冷门端口（例如 27890），彻底避开系统端口争夺。

#### macOS 平台端口冲突排查命令：
1. 打开“终端”，输入命令：
   \`lsof -i tcp:7890\`
2. 识别出占用进程的 PID 后，执行安全终止命令：
   \`kill -9 <PID>\`
3. 检查 macOS 系统偏好设置中的“网络” -> “详细信息” -> “代理”，确认网页代理（HTTP）和安全网页代理（HTTPS）指向的端口已与当前 Clash 实际侦听端口保持完全同步。

---

### 6. 运营商深层 QoS 抑制、UDP 443 (QUIC) 阻断与 TCP MSS Clamping 调优

在晚高峰时段（20:00 - 23:30），很多用户遇到“节点测速延迟很低，但实际看网页卡顿、油管 4K 严重丢包缓冲、SSH 终端频繁假死断联”的现象。这往往是由于本地家庭宽带运营商（如中国移动、中国联通、长城宽带等）对出境跨境 UDP 协议执行了粗暴的流量整形（Traffic Shaping）与 QoS 丢包率惩罚。

#### 技术原理深度剖析：
- **QUIC / HTTP3 的致命缺陷**：YouTube、Google、Twitter 等海外主流站点默认优先采用基于 UDP 协议的 HTTP/3 (QUIC) 进行内容传输。国内部分省份运营商的省级出口网关对未经认证的海外 UDP 443 端口流量设置了高达 30% - 60% 的随机丢包阈值，导致浏览器在发起 QUIC 握手时陷入长达数十秒的无响应等待，直至超时后才降级回传统的 TCP/TLS 1.3。
- **MTU（最大传输单元）分片黑洞**：跨境隧道（特别是嵌套了 TLS、WireGuard 或多层封装的数据包）会附加额外的报文协议头。如果网卡默认 MTU 为 1500 字节，封装后数据包体积超过了骨干网路由器路径 MTU（Path MTU），而路由器又禁用了 ICMP 差错应答（Type 3 Code 4: Fragmentation Needed），数据包便会被静默丢弃，导致网页大图片加载到一半直接停滞。

#### 三项顶级调优实操步骤：
1. **浏览器端强行禁用 HTTP/3 (QUIC)**：
   - 打开 Chrome 浏览器，在地址栏输入：\`chrome://flags/#enable-quic\`
   - 将“Experimental QUIC protocol”选项由 Default 更改为 **Disabled**。
   - 重启浏览器后，所有网页通信将强制回退至稳定的 TCP 连接，瞬间消除运营商 UDP 丢包卡顿。
2. **在 Clash 内核中调整 TUN 网卡 MTU 数值**：
   - 打开配置文件的 \`tun\` 模块，显式声明 MTU 大小为 \`1400\` 或 \`1280\`（IPv6 最低保障尺寸）：
   \`\`\`yaml
   tun:
     enable: true
     stack: mixed
     mtu: 1400 # 避免经过骨干网路由器分片丢包
     auto-route: true
     auto-detect-interface: true
   \`\`\`
3. **启用 TCP Keep-Alive 探针心跳保活**：在 \`experimental\` 配置中设置心跳周期，防止本地家庭路由器由于 NAT 表项超时过短而提前丢弃 TCP 连接会话，从而彻底根除长时间闲置时 SSH 会话莫名断开的顽疾。
`;

// Append before conversion cards
content = content.replace('## 七、梯子云实测推荐：高容错与高可用专线机场矩阵', technicalDeepDive + '\n\n## 八、梯子云实测推荐：高容错与高可用专线机场矩阵');
// Adjust section numbering
content = content.replace('## 八、Clash 全场景高频故障排查 FAQ', '## 九、Clash 全场景高频故障排查 FAQ');
content = content.replace('## 九、延伸阅读与全站专栏索引', '## 十、延伸阅读与全站专栏索引');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully expanded troubleshooting technical sections!');
