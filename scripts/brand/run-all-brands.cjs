const fs = require('fs');
const path = require('path');
const { allBrandProfiles } = require('./all-brands-metadata.cjs');
const { createDeepMonographExtension } = require('./monograph-generator.cjs');

const brandsDir = path.resolve(__dirname, '../../src/brand');
const dirs = fs.readdirSync(brandsDir).filter(d => fs.statSync(path.join(brandsDir, d)).isDirectory());

console.log(`Starting batch expansion for ${dirs.length} brands...`);

let processed = 0;
let alreadyPass = 0;
let failed = 0;

for (const slug of dirs) {
  const filePath = path.join(brandsDir, slug, 'index.md');
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    failed++;
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let stripped = content.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '');
  let count = (stripped.match(/[\u4e00-\u9fa5]/g) || []).length;

  if (count >= 10000) {
    console.log(`[PASS] Already >= 10,000 chars: ${slug} (${count} 字)`);
    alreadyPass++;
    continue;
  }

  const profile = allBrandProfiles[slug];
  if (!profile) {
    console.error(`[ERROR] No profile for slug: ${slug}`);
    failed++;
    continue;
  }

  const extension = createDeepMonographExtension(profile);

  // Clean trailing repeated dashes or excessive empty lines before appending
  content = content.replace(/(?:\r?\n---|\r?\n\s*)+$/g, '');

  if (content.includes('## 📚 延伸阅读与全库推荐')) {
    content = content.replace('## 📚 延伸阅读与全库推荐', extension + '\n\n## 📚 延伸阅读与全库推荐');
  } else {
    content += '\n\n' + extension + `\n\n---

## 📚 延伸阅读与全库推荐
- 查看全网总榜：[2026 机场排行榜 TOP 10](/recommend/ranking/)
- 性价比选型：[2026 性价比机场精选大盘](/recommend/cost-effective/)
- 客户端进阶：[Clash 从入门到精通图文教程](/clash/tutorial/)
- 预警雷达：[机场跑路避坑与安全核验指南](/resources/warning/)
`;
  }

  // Safety: escape unescaped pseudo-tags outside code blocks for Vue SFC compiler safety
  // (e.g. `<PID>`, `<用户名>`, `<password>`, `<IP>`, `<port>`)
  content = content.replace(/<([A-Za-z\u4e00-\u9fa5_-]+)>/g, (match, p1) => {
    // Avoid escaping standard html tags like span, div, a, b, i, p, etc.
    const standardTags = ['span', 'div', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'hr', 'br', 'img'];
    if (standardTags.includes(p1.toLowerCase())) {
      return match;
    }
    return `\`&lt;${p1}&gt;\``;
  });

  fs.writeFileSync(filePath, content, 'utf8');

  // Verify new count
  let newStripped = content.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '');
  let newCount = (newStripped.match(/[\u4e00-\u9fa5]/g) || []).length;
  console.log(`[UPDATED] ${slug}: ${count} 字 -> ${newCount} 字 ${newCount >= 10000 ? '✅ PASS' : '❌ FAIL'}`);
  processed++;
}

console.log('\n--- Batch Execution Summary ---');
console.log(`Total directories: ${dirs.length}`);
console.log(`Already PASS: ${alreadyPass}`);
console.log(`Processed: ${processed}`);
console.log(`Failed/Missing: ${failed}`);
