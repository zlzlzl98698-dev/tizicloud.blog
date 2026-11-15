const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/node-check/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const summary = `
---

## 十四、测速实战小结：拒绝唯数字论，回归真实体验

网络测速的终极意义在于帮助我们发现网络链路中的瓶颈，而不是为了追求跑分截图而盲目陷入参数内卷。在日常数字化办公与学习中：
- 只要晚高峰 YouTube 能够秒开 4K、拖动进度条无需转圈等待；
- 只要调用 ChatGPT 与 Claude 能够即时响应、零错误码报错；
- 只要日常网页检索与学术下载能够流畅无阻；
这就已经完全满足了 99% 的生产力诉求。将宝贵的时间投入到有价值的内容创造与业务增长中，让底层网络默默而可靠地保驾护航，才是衡量一套网络方案优劣的最高哲学。
`;

content = content.replace('## 十四、精选主力专线服务商官方受邀直达通道', summary + '\n\n## 十五、精选主力专线服务商官方受邀直达通道');
content = content.replace('## 十五、权威参考资料与全库延伸检索', '## 十六、权威参考资料与全库延伸检索');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended summary to node check!');
