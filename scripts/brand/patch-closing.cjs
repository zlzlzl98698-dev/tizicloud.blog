const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, 'monograph-generator.cjs');
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(
  '理性消费，按需选择，让我们在全球数字化的广阔天地中自由创造更大价值！',
  '理性消费，按需选择，多方对比，建立健全的个人数字资产防护与网络冗余灾备，让我们在全球数字化的广阔天地中自由创造更大价值，行稳致远！'
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Updated closing sentence!');
