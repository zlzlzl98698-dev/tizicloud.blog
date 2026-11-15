const fs = require('fs');
const path = require('path');

const commonFile = path.resolve(__dirname, 'resources/common.cjs');
let commonContent = fs.readFileSync(commonFile, 'utf8');

// Update resourcesFooter in common.cjs
commonContent = commonContent.replace(
  /\/brand\/guangsucloud\//g,
  '/brand/guangsu/'
);
commonContent = commonContent.replace(
  /\/brand\/feimaoyun\//g,
  '/brand/feimao/'
);
commonContent = commonContent.replace(
  /\[TAG 机场深度评测\]\(\/brand\/tag\/\) · \[Flyint 飞燕深度评测\]\(\/brand\/flyint\/\) · \[Bitz 深度评测\]\(\/brand\/bitz\/\) · \[泡泡狗深度评测\]\(\/brand\/paopaogou\/\)/g,
  '[白月光深度评测](/brand/baiyueguang/) · [肥猫云深度评测](/brand/fatcat/) · [闪电鼠深度评测](/brand/shandianshu/) · [榴莲云深度评测](/brand/liulianyun/)'
);

fs.writeFileSync(commonFile, commonContent, 'utf8');
console.log('Updated scripts/resources/common.cjs');

// Now batch replace in all files under src/resources/
const resourcesDir = path.resolve(__dirname, '../src/resources');

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (item.endsWith('.md')) {
      let txt = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (txt.includes('/brand/guangsucloud/')) {
        txt = txt.replace(/\/brand\/guangsucloud\//g, '/brand/guangsu/');
        changed = true;
      }
      if (txt.includes('/brand/feimaoyun/')) {
        txt = txt.replace(/\/brand\/feimaoyun\//g, '/brand/feimao/');
        changed = true;
      }
      if (txt.includes('/brand/tag/')) {
        txt = txt.replace(/\/brand\/tag\//g, '/brand/baiyueguang/');
        changed = true;
      }
      if (txt.includes('/brand/flyint/')) {
        txt = txt.replace(/\/brand\/flyint\//g, '/brand/fatcat/');
        changed = true;
      }
      if (txt.includes('/brand/bitz/')) {
        txt = txt.replace(/\/brand\/bitz\//g, '/brand/shandianshu/');
        changed = true;
      }
      if (txt.includes('/brand/paopaogou/')) {
        txt = txt.replace(/\/brand\/paopaogou\//g, '/brand/liulianyun/');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, txt, 'utf8');
        console.log('Fixed brand links in ' + fullPath);
      }
    }
  }
}

walk(resourcesDir);
