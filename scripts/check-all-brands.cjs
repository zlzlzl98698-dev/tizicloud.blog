const fs = require('fs');
const path = require('path');

const brands = fs.readdirSync('src/brand').filter(d => fs.statSync('src/brand/' + d).isDirectory());
let pass = 0, fail = 0;
for (const b of brands) {
  const file = 'src/brand/' + b + '/index.md';
  if (fs.existsSync(file)) {
    let txt = fs.readFileSync(file, 'utf8');
    txt = txt.replace(/^---[\s\S]*?---/, '');
    txt = txt.replace(/```[\s\S]*?```/g, '');
    const count = (txt.match(/[\u4e00-\u9fa5]/g) || []).length;
    if (count >= 10000) {
      pass++;
      console.log(`✅ [${count} 字] ${b}`);
    } else {
      fail++;
      console.log(`❌ [${count} 字] ${b}`);
    }
  } else {
    console.log(`⚠️ Not found: ${file}`);
  }
}
console.log({ pass, fail });
