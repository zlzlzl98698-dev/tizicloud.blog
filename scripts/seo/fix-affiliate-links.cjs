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
console.log('Total markdown files scanned:', mdFiles.length);

let totalFilesModified = 0;
let totalLinksModified = 0;

for (const file of mdFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Match all <a ... href="..." ...>
  content = content.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) return match;
    const href = hrefMatch[1];

    // Check if it is an external commercial affiliate/tracking URL
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const isCommercial = href.includes('aff') || href.includes('code=') || href.includes('register') || 
                         href.includes('tiziyun.net') || href.includes('mgjs.xyz') || href.includes('feimaoyun') ||
                         href.includes('gsyvipaff') || href.includes('twilightaff') || href.includes('breezenetaff') ||
                         href.includes('dalaoyunaff') || href.includes('xingdaomeng') || href.includes('fireflyaff') ||
                         href.includes('ladderaff') || href.includes('invisibleaff');

    if (isExternal && isCommercial) {
      const relMatch = attrs.match(/rel=["']([^"']*)["']/i);
      const targetMatch = attrs.match(/target=["']([^"']*)["']/i);
      let newAttrs = attrs;

      if (relMatch) {
        const curRel = relMatch[1].toLowerCase();
        if (!curRel.includes('nofollow') || !curRel.includes('sponsored')) {
          newAttrs = newAttrs.replace(/rel=["'][^"']*["']/i, 'rel="nofollow sponsored noopener"');
          totalLinksModified++;
        }
      } else {
        newAttrs += ' rel="nofollow sponsored noopener"';
        totalLinksModified++;
      }

      if (!targetMatch) {
        newAttrs += ' target="_blank"';
      }

      return `<a${newAttrs}>`;
    }

    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFilesModified++;
    console.log(`[FIXED] ${file}`);
  }
}

console.log(`\nLink remediation complete:`);
console.log(`Files modified: ${totalFilesModified}`);
console.log(`Total links updated: ${totalLinksModified}`);
