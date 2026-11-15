const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/clash/troubleshooting/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const devAndMobileTroubleshoot = `
### 7. WSL2、Docker 与本地开发者环境代理流量穿透与循环回环死锁修复

对于软件开发者、算法工程师与 DevOps 运维人员，在 Windows 10/11 的 WSL2（Windows Subsystem for Linux 2）子系统或 Docker 容器内拉取海外镜像（如 Docker Hub、GitHub、HuggingFace、npm、pip）时，经常遇到即使宿主机开启了 Clash，子系统依然报出 Connection refused 或 Failed to connect to github.com port 443 的棘手故障。

#### WSL2 网络虚拟化隔离机制与根因诊断：
1. **WSL2 基于 Hyper-V 虚拟化架构运行**，默认采用 NAT 虚拟网络交换机。WSL2 拥有独立的虚拟 IP 地址，并非与 Windows 宿主机共用 127.0.0.1 回环接口。
2. 当你在 WSL2 终端中设置 export http_proxy 时，WSL2 会尝试连接容器内部的 7890 端口，而 Clash 实际运行在宿主机上，因此连接必定会被立即拒绝。
3. 如果宿主机开启了 TUN 虚拟网卡，且未配置好宿主机虚拟交换机防火墙放行规则，WSL2 发出的所有数据包会被错误地循环封装，陷入路由黑洞死锁。

#### 两种终极解决方案与自动化配置代码：
- **方案一：开启 Clash 的“允许局域网连接”（Allow LAN）并绑定宿主机真实虚拟网关**。
  在 Clash Verge Rev 中开启“允许来自局域网的连接”。并在 Windows 高级安全 Defender 防火墙中，添加入站规则允许 7890 端口接收来自 vEthernet (WSL) 网段的数据包。
- **方案二：升级为 WSL2 镜像网络模式（Mirrored Mode，推荐 Windows 11 23H2+）**。
  在 Windows 用户主目录下创建或编辑 .wslconfig 配置文件，设置 networkingMode=mirrored，dnsTunneling=true。重启 WSL2 实例后，WSL2 完全与 Windows 共享网络栈，直接使用 127.0.0.1 即可完美走代理，无需任何复杂网关脚本！

---

### 8. 节点延迟测试全红（Timeout / 9999ms）的六层漏斗排查法则

在节点列表中点击右下角的“测速”图标，所有节点整整齐齐地全部显示超时（Timeout）或 9999ms，没有任何一个绿色延迟数值，这是最容易让新手陷入恐慌的经典故障。请牢记：**节点测速全红并不一定代表节点全部挂掉，往往是测速探针 URL 阻断或本地网络链路阻断**。

#### 六层漏斗排查步骤：
- **第一层：排查测试 URL（Delay Test URL）有效性**：Clash 默认的测速地址通常为 gstatic 生成的 204 地址。如果本地网络运营商骨干网对特定关键字嗅探丢包，所有测速包均无法在规定超时内返回。对策是在设置中将测速 URL 替换为高可用公共探针。
- **第二层：检查本地物理宽带与 DNS 是否存活**：先断开代理，打开国内网站（如百度或哔哩哔哩），确认本地家庭宽带本身是否欠费断网。如果物理网络断开，代理自然全红。
- **第三层：验证订阅链接是否已过期或流量耗尽**：登录你的机场后台面板，检查用户中心仪表盘：订阅账户是否已到达套餐截止日期？本月可用流量是否已经全部消耗完毕？
- **第四层：检查系统时钟同步状态**：正如前文所述，系统时间如果与真实时间相差超过一分钟，所有基于 TLS 的加密握手在测速阶段直接被服务器安全机制静默丢弃。
- **第五层：检查代理协议是否遭到运营商全端口丢包**：如果在某些敏感时期，或者使用了不具备伪装混淆特性的旧版 Shadowsocks 节点，运营商的动态深度包检测系统会对特定的入站 IP 和端口施加临时阻断。此时请在列表中切换为支持 Reality 或 VLESS 伪装的高阶专线节点。
- **第六层：检查系统防火墙或杀毒软件是否拦截了 Clash 内核二进制程序**：进入 Windows 安全中心，查看保护历史记录，确认 clash-meta 或 mihomo 是否被误当成未识别工具隔离入沙箱。如被拦截，点击在设备上允许并恢复。

---

### 9. 移动端（iOS / Android）特有后台冻结断联与省电策略深度排障

在智能手机端（如使用 Shadowrocket 小火箭、Clash Meta for Android 等客户端）运行代理时，用户最常抱怨的是“息屏锁屏 5 分钟后再亮屏，微信收不到推送，或者必须重新进 App 点击开关才能恢复上网”。

#### 移动端网络假死三大根因：
1. **Android 系统 Doze 低电耗休眠模式强制切断 VPN Service**：国产 Android 定制系统（MIUI/HyperOS、OriginOS、ColorOS、HarmonyOS）为追求续航跑分，在屏幕熄灭 3-10 分钟后，会自动限制后台进程的 CPU 调度和网络套接字句柄，强制回收 VPN 线程占用的内存。
   - **对策**：在手机系统“应用管理”中找到客户端，将“省电策略/电池优化”改为“无限制/不优化”；在多任务界面将客户端卡片“加锁（Lock）”；并在“自启动管理”中开启允许自启动和关联启动。
2. **iOS 内存管理机制（Jetsam）对 Network Extension 的 15MB 严苛限制**：iOS 系统对网络扩展进程（Packet Tunnel Provider）分配的内存上限极其苛刻（通常仅为 15MB 左右）。如果 Clash 订阅规则集过于臃肿（规则条目超过数万条），或者同时并发下载大量高清视频切片，内存占用突破 15MB 阈值，iOS 内核会瞬间触发 EXC_RESOURCE 信号强行将小火箭后台杀死。
   - **对策**：精简移动端订阅规则集，优先使用基于 GeoSite / GeoIP 二进制数据库的轻量规则；避免在手机端加载体积超过 5MB 的纯文本过滤规则列表。
3. **Wi-Fi 与蜂窝移动网络热切换引发的路由表脱节**：当手机从室外蜂窝 5G 走进室内连接家庭 Wi-Fi 时，操作系统的物理网卡 IP 地址发生跃变，而底层的代理客户端尚未完成 Socket 重建，导致临时网络失联。
   - **对策**：在客户端高级设置中开启“网络切换时自动重置连接（Reset Connections on Network Change）”，确保在网络接口切换时瞬间平滑完成 Socket 会话迁移。
`;

if (content.includes('## 八、精选主力专线服务商官方受邀直达通道')) {
  content = content.replace('## 八、精选主力专线服务商官方受邀直达通道', devAndMobileTroubleshoot + '\n\n## 八、精选主力专线服务商官方受邀直达通道');
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Appended successfully via CJS!');
} else {
  console.log('Target string not found');
}
