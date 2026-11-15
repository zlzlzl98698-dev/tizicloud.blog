import fs from 'fs';

const extraSections2 = `
---

## 十二、Linux 与 Windows WSL2 子系统终端透明代理配置全书

对于广大的程序员与 AI 算法工程师而言，让 WSL2（Windows Subsystem for Linux）与原生 Linux 终端顺畅拉取海外依赖（如 GitHub 代码、Docker 镜像、HuggingFace 模型权重）是刚性需求：

### 1. Windows 11 下 WSL2 镜像网络模式（Mirrored Mode）终极优雅解法
在 Windows 11 23H2 及更高版本中，微软官方推出了全新的 **Mirrored 网络模式**，彻底终结了过去复杂的跨网段 IP 寻址：
1. 打开 Windows 用户根目录（\`C:\\Users\\您的用户名\`），新建一个名为 **\`.wslconfig\`** 的纯文本文件；
2. 写入以下黄金配置：
   \`\`\`ini
   [wsl2]
   networkingMode=mirrored
   dnsTunneling=true
   autoProxy=true
   \`\`\`
3. 在 PowerShell 中执行 \`wsl --shutdown\` 重启 WSL2 子系统；
- **效果**：WSL2 将完全共享 Windows 宿主机的网络命名空间与网卡，宿主机开启 Clash Verge Rev 的 TUN 模式后，WSL2 内部的所有 \`apt update\`、\`git clone\` 与 \`docker\` 命令**无需配置任何环境变量，即可 100% 自动享受系统级专线加速**！

### 2. 原生 Linux 终端快捷别名函数（.bashrc / .zshrc）
在无法使用 TUN 模式的纯命令行 Linux 服务器中，在用户配置文件末尾追加以下自动化快捷函数：
\`\`\`bash
# 科学上网终端一键函数
function setproxy() {
    export http_proxy="http://127.0.0.1:7890"
    export https_proxy="http://127.0.0.1:7890"
    export all_proxy="socks5://127.0.0.1:7890"
    echo "⚡ 终端网络代理环境变量已成功激活！"
}

function unsetproxy() {
    unset http_proxy https_proxy all_proxy
    echo "🔌 终端网络代理已安全关闭，恢复本地直连。"
}

function testproxy() {
    curl -I -m 5 https://www.google.com
}
\`\`\`
保存后执行 \`source ~/.bashrc\`，以后在终端中只需输入 \`setproxy\` 即可一键挂载代理，输入 \`unsetproxy\` 即可一键卸载，操作极其高效敏捷。
`;

const extraFaqs2 = `
### Q26：为什么有时候终端输入 \`ping google.com\` 一直超时，但 \`curl google.com\` 却能正常返回网页？
**答（答案优先）**：**因为 Ping 命令使用的是网络层 ICMP 协议，而绝大多数 SOCKS5/HTTP 代理仅支持传输层的 TCP 与 UDP 协议**。
在没有开启 TUN 虚拟网卡模式的普通系统代理环境下，ICMP 数据包是无法被代理转发的，因此 Ping 海外域名会因为 GFW 阻断而永远超时；而 curl 命令发起的是标准的 HTTP/TCP 请求，能够成功通过代理端口转发，完全不影响正常的网页拉取与代码下载。

### Q27：在千兆光纤网络下，使用客户端下载海外大文件时，为什么下载速度在几兆与几十兆之间剧烈波动？
**答（答案优先）**：**这通常是由于本地宽带的“Wi-Fi 无线信道拥堵”或远端机房的单线程限速策略所导致**。
解决步骤：
1. 放弃 2.4GHz Wi-Fi，切换至 5GHz 频段，或直接插网线进行有线直连；
2. 在下载软件中开启多线程分块下载（例如将线程数设置为 8 或 16）；
3. 选用具备 2Gbps 充沛物理带宽储备的标杆专线服务商（如 [光速云](/brand/guangsu/) 或 [梯子云](/brand/tiziyun/)）。

### Q28：电脑开启代理后，为什么腾讯会议或钉钉视频通话偶尔会出现卡顿？
**答（答案优先）**：**这是由于国内会议软件的实时音视频 UDP 报文被错误判定为代理流量并绕道海外**。
解决办法：在自定义规则集（Script 或 Rule-Set）中，将国内会议平台的核心域名（如 \`meeting.qq.com\`、\`dingtalk.com\`）明确加入 \`DIRECT\` 直连策略，音视频报文直接由本地电信/联通宽带直通发送，延迟立刻缩减至个位数毫秒。

### Q29：如何彻底防止电脑在开机自启动客户端时弹出烦人的 Windows 管理员权限确认窗口？
**答（答案优先）**：**在 Clash Verge Rev 设置中正确安装「服务模式（Service Mode）」**。
安装服务模式后，后台守护进程拥有合法的系统服务特权，开机自启与开启 TUN 模式时系统完全不会弹出任何 UAC 授权弹窗，真正实现老少皆宜的开机即用。

### Q30：为什么说掌握了 Clash 客户端的规则模式，等于掌握了个人网络主权的最佳工具？
**答（答案优先）**：**因为它赋予了用户对进出自己电脑的每一个数据包的绝对知情权与精准调度权**。
您可以自由决定让哪些流量走最快的专线、让哪些流量走免费的本地宽带、让哪些恶意的广告跟踪探针在本地直接静默粉碎，让网络完全为您个人的工作与生活效率服务，彻底摆脱了中心化商业软件的算法绑架。

### Q31：手机开热点给笔记本使用时，笔记本上的代理为什么偶尔会显示连接失败？
**答（答案优先）**：**这是由于部分安卓手机或 iPhone 在共享蜂窝热点时，分配了不稳定的局域网私网网段或启用了运营商的 IPv6 优先策略**。
解决办法：在笔记本电脑的 Wi-Fi 属性中，手动取消勾选“Internet 协议版本 6 (IPv6)”，强制笔记本完全走 IPv4 与手机热点通信；并在客户端中重新点击切换一次节点，即可在 1 秒内恢复顺畅连接。

### Q32：如何给电脑上的特定浏览器（如只给 Chrome 开代理，Edge 保持纯直连）进行应用级隔离？
**答（答案优先）**：**不要开启 TUN 模式，仅在 Chrome 中安装 Proxy SwitchyOmega 扩展并绑定 Clash 监听端口**。
在普通系统代理模式下，如果您不想让全局软件都受代理影响，可以在客户端中关闭系统代理，然后在 Chrome 的 SwitchyOmega 插件中将代理服务器手动配置为 \`127.0.0.1:7890\`。这样只有 Chrome 浏览器内部的网页请求走专线代理，电脑上的 Edge、微信以及其他软件 100% 保持原生本地直连，实现了真正极致的单软件沙盒级隔离。

### Q33：对于完全零基础的小白用户，如何避免在学习配置 Clash 时产生挫败感？
**答（答案优先）**：**直接选用自带官方定制免配客户端的服务商（如飞猫云或梯子云）**。
成熟的服务商已经在云端为您调优好了全套最优的内核参数与分流拓扑。您完全不需要了解任何底层的 YAML 语法或网络原理，只需一键登录即可享受到顶级极客同款的极致出海体验。

### Q34：新手如何用最简单的一句话记住科学上网的核心配置原则？
**答（答案优先）**：**平时永远保持在「规则模式」与「TUN 模式」，选一个低延迟专线节点，不折腾就是最稳定的高级状态**。
只要遵循这条法则，您就可以像使用普通的国内软件一样自然流畅地上网，完全无需在工作与娱乐时反复纠结复杂的网络参数。
`;

let content = fs.readFileSync('src/clash/tutorial/index.md', 'utf8');

if (!content.includes('Linux 与 Windows WSL2 子系统终端透明代理配置全书')) {
  content = content.replace('## 七、精选主力专线服务商官方受邀直达通道', extraSections2 + '\n## 七、精选主力专线服务商官方受邀直达通道');
}

if (!content.includes('Q26：为什么有时候终端输入')) {
  content = content.replace('## 七、精选主力专线服务商官方受邀直达通道', extraFaqs2 + '\n## 七、精选主力专线服务商官方受邀直达通道');
}

fs.writeFileSync('src/clash/tutorial/index.md', content, 'utf8');
console.log('Appended WSL2 mirrored mode, Linux functions, and extra FAQs.');
