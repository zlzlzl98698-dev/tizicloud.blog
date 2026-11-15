import fs from 'fs';

// 1. Boost src/vpn/index.md (currently 9886, needs ~300)
let vpnHub = fs.readFileSync('src/vpn/index.md', 'utf8');
const hubExtra = `
### Q16：为什么很多用户在使用了优质专线后，依然发现自己的网络时延比宣传的高？
**答（答案优先）**：**本地局域网环境（如劣质 Wi-Fi 路由器、信道拥堵或穿墙衰减）往往贡献了额外的 15ms–40ms 本地时延**。
许多用户在测试节点时，忽视了从终端设备（手机或电脑）到家庭路由器的第一公里传输质量。隔着承重墙连接 2.4GHz Wi-Fi 会导致无线空中协商速率断崖式下跌并产生严重的重传丢包。真正要压榨出 IEPL 专线的极致低时延，建议在电脑端使用超五类（CAT5e）或六类（CAT6）千兆网线直连路由器 LAN 口，或者升级至支持 160MHz 频宽的 Wi-Fi 6 / 7 路由器，才能将本地局域网时延严格压缩在 1ms 以内。

### Q17：在移动端（iPhone / Android）使用科学上网，如何防止后台耗电异常与发热？
**答（答案优先）**：**坚决开启「按规则分流模式（Rule Mode）」，并彻底关闭不必要的后台高频测速插件**。
如果客户端被粗暴配置为「全局代理（Global Mode）」，手机后台运行的所有国产日常软件（如微信朋友圈、高德地图、网易云音乐）也会持续通过加密代理内核进行传输，不仅导致 CPU 无法进入低功耗待机状态，还会使手机在口袋中莫名发烫并大幅缩短电池寿命。切换为规则模式后，国内数据走系统硬件直出，只有目标海外流量才调用代理线程，可使整机全天续航损耗控制在极低水平。
`;
if (!vpnHub.includes('Q16：为什么很多用户在使用了优质专线后')) {
  vpnHub = vpnHub.replace('## 十三、精选主力品牌官方受邀直达通道与专享折扣', hubExtra + '\n## 十三、精选主力品牌官方受邀直达通道与专享折扣');
  fs.writeFileSync('src/vpn/index.md', vpnHub, 'utf8');
}

// 2. Boost src/vpn/recommend/index.md (currently 9607, needs ~500)
let vpnRec = fs.readFileSync('src/vpn/recommend/index.md', 'utf8');
const recExtra = `
### Q16：为什么说选择机场服务商时，“运营年限超过 3 年”是一个极其核心的安全风控指标？
**答（答案优先）**：**因为科学上网行业的资金链与运维抗压能力需要经历至少一轮以上的全网严打大考才能真正沉淀**。
很多新入局的小作坊机场在初期以极低的价格（如几元钱年付）狂揽用户，但在运营数月后，一旦遭遇中转机房被查封或物理专线续费成本激增，往往由于资金链彻底断裂而选择连夜跑路关站。而能够在行业中持续稳定运营 3 年以上的老牌服务商（如 [光速云](/brand/guangsu/) 与 [梯子云](/brand/tiziyun/)），不仅拥有稳健的境外企业化财务储备，更与上游大型数据中心建立了长期的商务信任关系，具备强大的容灾兜底能力。

### Q17：对于从事外贸或海外独立站（Shopify）的创业团队，如何科学规划多员工协同出海方案？
**答（答案优先）**：**采用「主力高并发专线机场 + 软路由透明代理网关 + 独立静态住宅 IP 分配」的综合方案**。
企业团队不应急于给每台电脑安装独立的客户端，这样既容易因员工配置错误导致重要数据泄露，又难以统一管控流量。最佳工程实践是在办公室部署一台高性能 All-in-One 软路由，接入 [暮光加速](/brand/muguang/) 或 [光速云](/brand/guangsu/) 的企业级大流量专线包，通过局域网 MAC 地址绑定策略，将负责客服、选品与财务的电脑分别指派给不同的固定住宅 IP 出口，既保证了全员高速稳定的办公网络，又彻底消除了店铺多账号关联被封的商业风险。
`;
if (!vpnRec.includes('Q16：为什么说选择机场服务商时')) {
  vpnRec = vpnRec.replace('## 十三、精选主力品牌官方受邀直达通道与专享折扣', recExtra + '\n## 十三、精选主力品牌官方受邀直达通道与专享折扣');
  fs.writeFileSync('src/vpn/recommend/index.md', vpnRec, 'utf8');
}

// 3. Boost src/vpn/free/index.md (currently 9640, needs ~500)
let vpnFree = fs.readFileSync('src/vpn/free/index.md', 'utf8');
const freeExtra = `
### Q16：很多声称“大学教育网学术翻墙镜像站”，在安全技术上真的可靠吗？
**答（答案优先）**：**绝大多数非官方认可的第三方镜像站属于典型的“反向代理中间人（MITM）”架构，存在严重的账号密码窃取隐患**。
第三方搭建的所谓 Google Scholar 或 GitHub 镜像站，本质是利用海外服务器反向拉取官方内容并在网页中强行重写链接。当您在该镜像站上输入个人账号、密码或进行第三方 OAuth 授权登录时，搭建者完全可以在中间人服务器上以明文形式记录您的所有通信报文与 Cookie 凭证，造成极大的学术资产与隐私外泄风险。进行正规学术研究，务必使用正规的独立专线代理直接访问官方原版域名。

### Q17：使用公共免费节点时，为什么电脑杀毒软件（如 Windows Defender）经常弹出木马报警？
**答（答案优先）**：**因为大量公开免费节点所在的公网服务器本身就是已被黑客入侵沦陷的“肉鸡（Botnet）”**。
黑产团伙为了维持肉鸡服务器的活跃度并诱骗访客流量，会在服务器上开放代理端口对外发布“免费节点”。当客户端连接这些受感染的主机时，黑客控制端会尝试利用已知协议漏洞向客户端反向推送特制的恶意探测载荷或尝试渗透内网，从而直接触发本地杀毒软件的最高级别防御告警。
`;
if (!vpnFree.includes('Q16：很多声称“大学教育网学术翻墙镜像站”')) {
  vpnFree = vpnFree.replace('## 十四、精选主力品牌官方受邀直达通道与专享折扣', freeExtra + '\n## 十四、精选主力品牌官方受邀直达通道与专享折扣');
  fs.writeFileSync('src/vpn/free/index.md', vpnFree, 'utf8');
}

// 4. Boost src/vpn/mobile/index.md (currently 9668, needs ~500)
let vpnMobile = fs.readFileSync('src/vpn/mobile/index.md', 'utf8');
const mobileExtra = `
### Q16：手机开启代理后，为什么高德地图或美团定位偶尔会漂移到香港或国外？
**答（答案优先）**：**这是由于系统在获取基于 IP 的粗略地理位置时，命中了代理出口 IP 导致的映射漂移**。
智能手机通常采用“卫星 GPS / 北斗物理硬件定位 + Wi-Fi 基站定位 + 运营商蜂窝基站定位 + IP 辅助定位”四重混合模式。若某些国内 App 在刚启动时未获得精确 GPS 硬件授权，会优先根据当前出网 IP 查询城市。解决办法：在手机权限管理中，将国内导航与外卖软件的定位权限设置为「精确位置（Precise Location）」，并在客户端规则中将高德、百度等地图 API 域名明确加入 \`DIRECT\` 直连放行名单。

### Q17：在 iPhone 上如何配置捷径（Shortcuts）实现“打开指定海外 App 自动连梯子、退出自动断开”？
**答（答案优先）**：**利用 iOS 系统自带的「快捷指令」自动化（Automation）触发器与小火箭的 URL Scheme 实现**。
实操步骤如下：
1. 打开苹果「快捷指令」App，点击底部「自动化」并新建一个个人自动化；
2. 触发条件选择「App」，勾选目标应用（例如 Twitter、ChatGPT 或 YouTube），并设置为「打开时立即运行」；
3. 执行操作中添加「打开 URL」，输入小火箭的启动连接 Scheme：\`shadowrocket://start\`；
4. 同样新建一个「关闭该 App 时」触发的自动化，执行操作输入 \`shadowrocket://stop\`。这样即可实现全自动智能按需连通，彻底解放双手与手机电量。
`;
if (!vpnMobile.includes('Q16：手机开启代理后')) {
  vpnMobile = vpnMobile.replace('## 十四、精选主力品牌官方受邀直达通道与专享折扣', mobileExtra + '\n## 十四、精选主力品牌官方受邀直达通道与专享折扣');
  fs.writeFileSync('src/vpn/mobile/index.md', vpnMobile, 'utf8');
}

console.log('Successfully applied extra FAQs to first four VPN pages.');
