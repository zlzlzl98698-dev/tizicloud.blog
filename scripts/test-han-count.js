import fs from 'fs';
import path from 'path';

export function countHanInFile(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  // Strip frontmatter and code blocks
  const body = content.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '');
  const matches = body.match(/[\u4e00-\u9fa5]/g);
  return matches ? matches.length : 0;
}

const targetFiles = process.argv.slice(2);
if (targetFiles.length > 0) {
  targetFiles.forEach(f => {
    const c = countHanInFile(f);
    const status = c >= 10000 ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} [${c} 字] ${f}`);
  });
}
