const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../../src/clash/troubleshooting/index.md');
let content = fs.readFileSync(file, 'utf8');

const additionalFaqs = `
### Q16：Fake-IP 模式下局域网 Samba 共享、网络打印机与群晖 NAS 无法访问该如何解决？
答：这是由于 Fake-IP 将局域网内部的主机名也错误地映射为了虚拟 IP（如 198.18.0.x）导致的连接黑洞：
- **故障定位**：在 Fake-IP 模式下，当操作系统尝试解析 nas.local 或局域网打印机 IP 时，若规则未做排除，Clash 会接管该解析请求并返回虚假 IP，而局域网设备无法在该虚拟网段上建立握手；
- **排障对策**：在配置文件的 dns 模块中，找到 fake-ip-filter 列表，将局域网专属域名和本地私有网段追加进去：
  - 显式声明排除规则：\`*.local\`、\`*.lan\`、\`*.home.arpa\` 以及群晖自定义域名；
  - 确保局域网直连规则置顶：在 rules 最前列声明 \`IP-CIDR,192.168.0.0/16,DIRECT,no-resolve\` 与 \`IP-CIDR,10.0.0.0/8,DIRECT,no-resolve\`，彻底规避内网流量穿透代理。

### Q17：为什么访问部分网站时，Chrome 浏览器突然报错 ERR_CERT_COMMON_NAME_INVALID 或证书不受信任？
答：这是由于客户端开启了 MITM（中间人解密）或本地杀毒软件劫持了 HTTPS 证书链：
- **故障根因**：Clash 本身作为传输层代理，默认只做 TCP 流转发，不碰应用层证书。如果浏览器出现证书不匹配报错，通常有两大诱因：一是本地安装的第三方杀毒软件（如卡巴斯基、火绒、ESET）开启了“SSL/TLS 流量扫描”并注入了自签名根证书；二是某些特定分流规则将目标域名的 DNS 解析重定向到了错误的落地机房反代入口；
- **排障步骤**：在浏览器报错页面点击“高级”查看证书颁发机构。若是本地安全软件证书，进入杀毒软件设置关闭“HTTPS 扫描”；若是节点 DNS 污染导致，在 Clash 设置中点击“Flush DNS”清空缓存，并切换为纯净公共 DNS（如 1.1.1.1）。

### Q18：Docker Desktop 在 Windows 开启后，为什么容器内拉取镜像依然 Connection Timed Out？
答：Docker Desktop 运行在一个独立的 WSL2 虚拟机或 Hyper-V 实例中，其内部网络具有完全独立的网络命名空间（Network Namespace）：
- **故障根因**：宿主机开启的“系统代理”仅对 Windows 用户态常规应用生效，WSL2 内核中的 Docker Daemon 根本无法直接感知 127.0.0.1:7890 端口；
- **标准解决方案**：
  1. 打开 Docker Desktop 设置界面，进入“Resources” -> “Proxies”；
  2. 开启“Manual proxy configuration”，在 Web Server (HTTP) 与 Secure Web Server (HTTPS) 中统一填入宿主机的虚拟网关 IP（或开启 Clash TUN 模式实现全局透明劫持）；
  3. 或者直接在 \`~/.docker/config.json\` 中配置全局代理环境变量，使 Docker 客户端在发起镜像 Pull 请求时自动通过专线通道建立长连接。

### Q19：苹果 macOS 升级新系统后，每次休眠唤醒网络无响应、必须重启客户端怎么解决？
答：这是 macOS 的系统电源管理（Power Management）在休眠时重置了网络接口的 Socket 句柄：
- **故障表象**：笔记本合盖休眠 10 分钟以上，重新打开屏幕后，系统虽然显示 Wi-Fi 已连接，但所有网页转圈无响应，直到在 Clash Verge 中手动关闭系统代理再重新打开才恢复；
- **工程解决对策**：
  1. 在 Clash Verge Rev 的“设置”中，开启**“休眠唤醒自动重连（Reconnect on Sleep Wake）”**功能；
  2. 在“通用设置”中开启**“静默内核守护进程（Silent Core Daemon）”**，防止系统休眠时向 mihomo 内核发送强制 SIGTERM 信号；
  3. 如果问题依然存在，可在终端执行命令 \`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder\` 重置系统底层 DNS 响应服务。

### Q20：为什么使用 Clash 访问某些特定学术数据库（如 ScienceDirect 或 IEEE）时报 HTTP 403 Forbidden？
答：这是由于高校教育网校外访问（CARSI 认证或 Shibboleth）与商业代理分流发生冲突：
- **故障根因**：许多大学订购的高校学术数据库采用“IP 白名单认证模式”或“教育网统一身份认证”。当您开启了全局代理或规则模式未做好学校域名的本地直连声明时，访问请求被导向了境外的香港或美国商业节点，学术数据库检测到访问来自未授权的海外公网机房，便会立即返回 403 访问拒绝；
- **精准修复规则**：在规则配置的最前列添加学校专属域名的直连规则，声明 \`DOMAIN-SUFFIX,edu.cn,DIRECT\` 以及 \`DOMAIN-KEYWORD,carsi,DIRECT\`。这样即可实现访问学术认证直连校园网，下载海外 PDF 原文走高速专线，两者兼得。

### Q21：跨平台使用时，如何通过自动化批处理脚本一键修复 Windows 代理注销残留？
答：当 Clash 异常崩溃或电脑在未关代理时强制关机，Windows 注册表中的 ProxyEnable 会被残留在 1 的状态，导致开机国内网页打不开微信能聊：
- **批处理一键自愈代码**：
  创建一个名为 \`fix_proxy.bat\` 的文本文件，写入两行系统指令：\`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f\` 与 \`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /d "" /f\`；
- 右键以管理员身份运行该脚本，即可在 1 秒钟内强制清空系统代理残留，瞬间复原网络。

### Q22：为什么手机热点共享给电脑使用时，电脑客户端死活连不上代理节点？
答：这是由于手机运营商在 4G/5G 热点共享时对特定长连接端口执行了强制的 NAT444 级联与 APN 策略限制：
- **故障定位**：中国移动或中国广电的某些手机流量卡在开启个人热点时，分配给电脑的是深层私有 IP，且对热点流量强制启用深度包检测（DPI）；
- **应对方案**：在手机端将蜂窝网络的 APN 设置由默认的“通用接入点”修改为“3gnet / cnet / ctnet”等高质量 APN；并在电脑客户端的 TUN 配置中，将 MTU 进一步调低至 1340，以抵御手机热点封装产生的报头溢出丢包。

### Q23：什么是 DNS 泄漏？如何在客户端中彻底杜绝运营商 DNS 劫持与地理位置泄漏？
答：DNS 泄漏是指虽然您的数据流量走了加密专线，但您的域名查询请求依然被偷偷发往了本地宽带运营商的 114.114.114.114 等明文 DNS 服务器：
- **安全风险**：本地宽带运营商可通过记录您的 DNS 查询日志，获知您在何时访问了哪些海外网站，从而精准刻画用户行为甚至实施精准阻断；
- **防泄漏配置**：在 Clash Verge 中开启**“防 DNS 泄漏（Prevent DNS Leak）”**，在 nameserver-policy 中为海外域名指定端到端加密的 DoH（DNS over HTTPS）服务器（例如 \`https://1.1.1.1/dns-query\`），彻底切断明文 DNS 旁路。

### Q24：为什么客户端连接一段时间后，内存占用持续飙升甚至导致系统卡顿？
答：这通常是由“内存日志级别设置过高”或“并发连接堆积未释放”引起的内存泄漏现象：
- **排查步骤**：检查 Clash 客户端设置中的“日志级别（Log Level）”。如果被误设置为了 debug 或 verbose，内核会在内存中缓存数以百万计的数据包抓包记录；
- **优化对策**：将日志级别改为 silent 或 error；并在高级设置中将 TCP 空闲连接回收超时（TCP Idle Timeout）由默认的 600 秒调低至 120 秒，促使系统主动释放闲置套接字句柄。

### Q25：面对复杂的网络故障，专业网络工程师的五步标准诊断漏斗（SOP）是什么？
答：资深工程师排障绝不盲目重装软件，而是严格遵循自底向上的五步漏斗法则：
1. **第一步（物理层与链路层）**：ping 本地路由器网关（如 192.168.1.1），确认局域网物理信道是否存活；
2. **第二步（系统代理层）**：检查系统代理开关与端口（7890）是否正常监听，排除端口占用冲突；
3. **第三步（DNS 解析层）**：使用 nslookup 或 dig 测试目标域名是否能成功返回 IP，识别是 DNS 挂掉还是连接挂掉；
4. **第四步（节点出口层）**：在客户端中切换不同地区、不同协议的节点，识别是个别节点问题还是整个订阅问题；
5. **第五步（分流规则层）**：在客户端“连接”页面观察目标域名的实际匹配规则，确认是否被误判为 DIRECT 或匹配到错误的代理组。通过此五步排查，任何疑难杂症均能在 60 秒内准确定位！
`;

content = content.replace('## 七、内核级 TUN 虚拟网卡与网络栈底层崩溃故障攻坚指南', additionalFaqs + '\n\n---\n\n## 八、内核级 TUN 虚拟网卡与网络栈底层崩溃故障攻坚指南');
content = content.replace('## 八、精选主力专线服务商官方受邀直达通道', '## 九、精选主力专线服务商官方受邀直达通道');
content = content.replace('## 九、权威参考资料与全库延伸检索', '## 十、权威参考资料与全库延伸检索');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully expanded troubleshooting FAQs!');
