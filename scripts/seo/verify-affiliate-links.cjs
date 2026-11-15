const fs = require('fs');
const path = require('path');

function getMdFiles(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'public' && f !== '.vitepress') res = res.concat(getMdFiles(full));
    } else if (f.endsWith('.md')) {
      res.push(full);
    }
  }
  return res;
}

const mdFiles = getMdFiles('src');
let issues = [];

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const aMatches = content.match(/<a\b([^>]*)>/gi) || [];
  for (const a of aMatches) {
    const hrefMatch = a.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.includes('tizicloud.blog') && !href.includes('localhost') && !href.includes('github.com')) {
        const isCommercial = href.includes('aff') || href.includes('code=') || href.includes('register') || href.includes('tiziyun.net') || href.includes('mgjs.xyz') || href.includes('feimaoyun');
        if (isCommercial) {
          const relMatch = a.match(/rel=["']([^"']*)["']/i);
          const relVal = relMatch ? relMatch[1].toLowerCase() : '';
          if (!relVal.includes('nofollow') || !relVal.includes('sponsored')) {
            issues.push({ file, a, href });
          }
        }
      }
    }
  }
}

console.log('Remaining commercial links without nofollow & sponsored:', issues.length);
if (issues.length > 0) {
  console.log(issues);
}
