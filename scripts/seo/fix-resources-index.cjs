const fs = require('fs');
const f = 'src/resources/index.md';
let content = fs.readFileSync(f, 'utf8');
content = content.replace(/target="_blank"\s+rel="noreferrer"/g, 'target="_blank" rel="nofollow sponsored noopener"');
fs.writeFileSync(f, content, 'utf8');
console.log('Fixed remaining links in src/resources/index.md');
