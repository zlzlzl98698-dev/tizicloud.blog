const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/faq/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const finalDetails = `
### Q41：如何使用 Wireshark 或 Charles 抓包工具排查手机 App 走代理失败的具体原因？
答：当遇到特定手机 App 哪怕挂了代理也无法加载数据时，可以通过中间人抓包进行深度协议诊断：
1. **排查是否启用了 SSL Pinning（证书绑定技术）**：许多高安全级别的金融 App 或海外社交软件（如 Instagram、PayPal）在代码中硬编码了服务端的公钥哈希，当检测到本地安装了代理软件的自签 CA 证书时，App 会主动拒绝发起任何 TLS 握手并直接报错。这种情况下，纯粹的中间人解密抓包会失败，必须在已 Root 的 Android 设备上配合 Xposed / LSPosed 框架并安装“JustTrustMe”模块强行绕过 SSL Pinning，或者在客户端中将该 App 的域名设置为纯粹的 TCP 透传直通；
2. **排查是否直接使用了原生 UDP 通信**：部分音视频通话或直播 App 会跳过 HTTP 代理直接通过 UDP 端口传输媒体流。如果客户端未开启全局 TUN 虚拟网卡接管 UDP，或者节点本身不支持 UDP 转发，媒体流便会直接中断，此时开启 TUN 模式并选用支持 Full-Cone NAT 的专线节点即可解决。

### Q42：未来几年科学上网与网络攻防的发展趋势是什么？普通用户该如何应对？
答：随着人工智能和大模型技术全面渗透进网络安全领域，未来的跨境网络对抗呈现出三大显著趋势：
- **AI 赋能的动态流量特征分析普及化**：传统的静态规则库和简单的域名拦截已被淘汰，审查系统基于机器学习对数据流的包长序列分布、往返时延抖动、握手报文熵值进行多模态综合识别；
- **纯物理专线与借用大厂证书的终极混淆将成为唯一主流**：以普通公网直连为基础的代理生存空间将进一步被极度压缩，具备内网物理隔离的 IEPL 专线以及借用苹果、微软大厂合法证书的 VLESS Reality 架构将成为所有高可用网络服务的标配基石；
- **对于普通用户而言，合规与专业分工是最佳解**：不要在自建和折腾协议上浪费大量时间，将底层网络通信交给拥有雄厚技术积累与物理专线资产的正规专业品牌（如[光速云](/brand/guangsucloud/)、[暮光加速](/brand/muguang/)），自己专注于本职业务创造与学术研究，才是拥抱数字化未来的最智慧之道。
`;

content = content.replace('## 十一、精选主力专线服务商官方受邀直达通道', finalDetails + '\n\n## 十一、精选主力专线服务商官方受邀直达通道');
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended final details to FAQ!');
