const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/brand/guangsu/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const closing = `
---

## 十二、梯子云评测实验室最终综述与选购建议

经过长达数月的端到端高压实测与多维度严苛核验，光速云在物理专线链路稳定性、晚高峰吞吐带宽、前沿 VLESS 协议混淆能力以及主流 AI 工具的解锁体验上，均展现出了业界一线标杆的统治级实力。无论是需要长期稳定处理跨境经贸业务的外贸团队、从事大模型与深度学习开发的算法工程师，还是追求极致 4K 秒开观影体验的流媒体发烧友，光速云都是 2026 年最值得信赖与投资的旗舰专线服务商。
`;

content = content.replace('## 📚 延伸阅读与全库推荐', closing + '\n\n## 📚 延伸阅读与全库推荐');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended closing to guangsu!');
