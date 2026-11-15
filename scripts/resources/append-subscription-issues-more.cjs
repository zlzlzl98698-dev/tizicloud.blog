const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/subscription-issues/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const closing = `
### 结语：掌握订阅自愈排查技能，让数字化连接永不掉线
订阅更新是连接广阔外部数字世界的关键神经元。理解其背后的 HTTP 协议通信、DNS 解析与配置语法，能让我们在面对突发网络断联时保持从容不迫。遵循科学的自愈排障规范，构建多层次冗余网络体系，让我们在现代数字化互联的浪潮中始终畅行无阻。
`;

content = content.replace('## 十二、精选主力专线服务商官方受邀直达通道', closing + '\n\n## 十二、精选主力专线服务商官方受邀直达通道');
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended closing to subscription issues!');
