const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/warning/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const closing = `
### 结语：建立健康的数字安全意识与资金防御屏障
科学上网是我们拓展全球视野、提升科研开发效率与开展跨国经贸业务的数字化翅膀。面对纷繁复杂的网络服务市场，保持理性与清醒，不轻信天花乱坠的虚假宣传，不盲目追求虚幻的永久低价，用知识武装认知，构建多层次网络灾备防线，方能在风云变幻的跨境数字世界中行稳致远。
`;

content = content.replace('## 十三、精选主力专线服务商官方受邀直达通道', closing + '\n\n## 十三、精选主力专线服务商官方受邀直达通道');
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended closing to warning!');
