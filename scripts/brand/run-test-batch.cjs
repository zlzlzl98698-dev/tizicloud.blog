const fs = require('fs');
const path = require('path');
const { createDeepMonographExtension } = require('./monograph-generator.cjs');
const { brandProfiles } = require('./batch-expand-brands.cjs');

const targetSlugs = ['muguang', 'feimao', 'weifeng', 'dalaoyun', 'xingdaomeng'];

for (const slug of targetSlugs) {
  const profile = brandProfiles[slug];
  if (!profile) continue;
  const filePath = path.resolve(__dirname, `../../src/brand/${slug}/index.md`);
  if (!fs.existsSync(filePath)) continue;

  let originalContent = fs.readFileSync(filePath, 'utf8');
  let stripped = originalContent.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '');
  const existingCount = (stripped.match(/[\u4e00-\u9fa5]/g) || []).length;
  if (existingCount >= 10000) {
    console.log(`Already PASS [${existingCount} 字] ${slug}`);
    continue;
  }

  const extension = createDeepMonographExtension(profile);
  let updated = originalContent;
  if (updated.includes('## 📚 延伸阅读与全库推荐')) {
    updated = updated.replace('## 📚 延伸阅读与全库推荐', extension + '\n\n## 📚 延伸阅读与全库推荐');
  } else {
    updated += '\n\n' + extension;
  }

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated ${slug}!`);
}
