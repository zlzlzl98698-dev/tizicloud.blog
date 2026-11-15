import fs from 'fs';

const files = [
  { name: 'Pillar Hub (核心专题首页)', path: 'src/recommend/index.md' },
  { name: 'Subtopic 1 (机场推荐精选)', path: 'src/recommend/best/index.md' },
  { name: 'Subtopic 2 (机场排行榜 2026)', path: 'src/recommend/ranking/index.md' },
  { name: 'Subtopic 3 (性价比机场推荐)', path: 'src/recommend/cost-effective/index.md' },
  { name: 'Subtopic 4 (稳定专线机场选型)', path: 'src/recommend/stable/index.md' },
  { name: 'Subtopic 5 (便宜机场低价指南)', path: 'src/recommend/cheap/index.md' },
  { name: 'Subtopic 6 (免费梯子实测核验)', path: 'src/recommend/free/index.md' },
  { name: 'Subtopic 7 (科学上网全局选型指南)', path: 'src/recommend/guide/index.md' },
];

console.log('='.repeat(80));
console.log('7 大二级专题 + 核心 Pillar Hub 纯汉字字数审计核验报告');
console.log('='.repeat(80));

let allPass = true;
files.forEach((f, idx) => {
  const content = fs.readFileSync(f.path, 'utf8');
  const hanMatches = content.match(/[\u4e00-\u9fa5]/g);
  const count = hanMatches ? hanMatches.length : 0;
  const isPass = count >= 10000 && count <= 15000;
  if (!isPass) allPass = false;
  console.log(`[${idx}] ${f.name}`);
  console.log(`    文件路径: ${f.path}`);
  console.log(`    总字符数: ${content.length} | 纯汉字字符数: ${count} | 标准合规(10000-15000): ${isPass ? '✅ 合规达标' : '❌ 不达标'}`);
});
console.log('='.repeat(80));
console.log(`全局验收结论: ${allPass ? '🎉 全部 8 大核心专著页面 100% 达标！' : '⚠️ 存在未达标页面'}`);
