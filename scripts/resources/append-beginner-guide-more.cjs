const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/beginner-guide/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const finalPiece = `
### Q15：如果换了新电脑或重装了操作系统，之前的配置和套餐还能找回来吗？
答：**完全可以，100% 不受影响！**
- 您购买的机场套餐是存储在服务商的云端数据库服务器上的，与您的本地物理硬件没有任何强绑定关系；
- 换了新电脑或重装系统后，您只需在新设备上重新下载并安装一个全新的客户端（如 Clash Verge Rev）；
- 用浏览器重新登录您当时注册的机场官网用户中心后台，重新点击“一键导入”或“复制订阅链接”并粘贴进新客户端；
- 之前购买的所有套餐时间、剩余可用流量额度都会完整如初地恢复显示，继续畅快使用！

---

## 十二、新手上路结语：拥抱更广阔的全球知识海洋

科学上网不仅仅是一项网络技术，更是连接全球前沿知识、拓展国际商业视野与进行多元文化交流的强大桥梁。面对信息技术的飞速演进，保持学习的心态，守住安全的底线，理性甄别优质与低劣的网络服务，您就能在这座四通八达的数字高速公路上安全驰骋，探索无限可能的世界！
`;

content = content.replace('## 十二、精选主力专线服务商官方受邀直达通道', finalPiece + '\n\n## 十三、精选主力专线服务商官方受邀直达通道');
content = content.replace('## 十三、权威参考资料与全库延伸检索', '## 十四、权威参考资料与全库延伸检索');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended final piece to beginner guide!');
