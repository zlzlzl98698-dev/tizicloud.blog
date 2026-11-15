const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/free-nodes/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const finalFaq = `
### Q11：某些所谓“免费科学上网浏览器”声称开箱即用，真的可以放心使用吗？
答：这类打着“内置免费翻墙节点、无须配置开箱即用”旗号的定制浏览器（如各类二次打包的 Chromium 变种），安全风险甚至高于普通免费节点。安全研究员在反编译这类浏览器时多次发现，其作者在底层 Chromium 源码中修改了网络栈，硬编码了全局后门。所有的用户输入（包含网页表单密码、银行卡号）都会在客户端本地被明文镜像发送给开发者的私人服务器。同时，浏览器还会强制篡改默认主页和搜索引擎，静默在后台为恶意黑产站点刷量。使用科学上网，必须严格遵循“正规原版浏览器（如官方 Chrome、Firefox、Edge）+ 权威开源代理客户端（如 Clash Verge Rev、v2rayN）”的双层分离架构，绝不使用任何未知第三方打包的所谓翻墙浏览器。

### Q12：如果在不知情的情况下使用了恶意免费节点，如何判断自己的账号是否已被盗用？
答：可以通过以下三个关键信号进行自检排查：
1. **查看常用平台的异地登录历史与安全活动日志**：第一时间登录 Google、Telegram、Twitter、Apple ID、GitHub 的安全设置中心，查看“最近活跃会话（Active Sessions）”与“登录设备列表”。如果列表中出现了未知的 IP 地址、来自未去过的异国他乡（如俄罗斯、尼日利亚、东欧等地区），或者出现了未知型号的设备，立即点击“强制登出所有其他设备（Terminate all other sessions）”；
2. **检查邮箱是否被悄悄设置了邮件自动转发规则**：攻击者在盗取邮箱后，为了避免惊动受害者，通常会在邮箱设置中添加一条隐蔽的“自动转发规则（Mail Forwarding）”，将所有包含“验证码”、“password”、“invoice”的邮件静默转发到黑客的收集箱，务必彻底清空此类未经授权的规则；
3. **全面开启基于硬件或 Authenticator 的两步验证（2FA）**：立即为所有关键账号重置强随机密码，并强制开启 Google Authenticator、1Password 或 YubiKey 硬件密钥的双因子身份鉴权，即便黑客掌握了密码也无法完成二次登录。
`;

content = content.replace('## 十三、精选主力专线服务商官方受邀直达通道', finalFaq + '\n\n## 十三、精选主力专线服务商官方受邀直达通道');
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended final FAQ to free nodes!');
