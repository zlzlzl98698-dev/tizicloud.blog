const fs = require('fs');
const glob = require('path');

const files = [
  'src/clash/troubleshooting/index.md',
  'src/resources/index.md',
  'src/resources/free-nodes/index.md',
  'src/resources/warning/index.md',
  'src/resources/faq/index.md',
  'src/resources/risk-intel/index.md',
  'src/resources/node-check/index.md',
  'src/resources/subscription-issues/index.md',
  'src/resources/beginner-guide/index.md'
];

for (const file of files) {
  let txt = fs.readFileSync(file, 'utf8');
  const replacements = [
    [/<PID>/g, '`&lt;PID&gt;`'],
    [/<用户名>/g, '`&lt;用户名&gt;`'],
    [/<包名>/g, '`&lt;包名&gt;`'],
    [/<宿主机IP>/g, '`&lt;宿主机IP&gt;`'],
    [/<你的私有服务器IP>/g, '`&lt;你的私有服务器IP&gt;`'],
    [/<你的机场原始订阅链接>/g, '`&lt;你的机场原始订阅链接&gt;`'],
    [/<安装包路径>/g, '`&lt;安装包路径&gt;`'],
    [/<!DOCTYPE html>/g, '`&lt;!DOCTYPE html&gt;`'],
    [/<html>/g, '`&lt;html&gt;`']
  ];
  let changed = false;
  for (const [re, rep] of replacements) {
    if (re.test(txt)) {
      txt = txt.replace(re, rep);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, txt, 'utf8');
    console.log('Fixed pseudo HTML tags in ' + file);
  }
}
