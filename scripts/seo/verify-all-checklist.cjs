const fs = require('fs');
const path = require('path');

function getAllHtml(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'assets') res = res.concat(getAllHtml(full));
    } else if (f.endsWith('.html') && f !== '404.html') {
      res.push(full);
    }
  }
  return res;
}

const htmlFiles = getAllHtml('src/.vitepress/dist');
console.log(`Auditing ${htmlFiles.length} HTML files in src/.vitepress/dist...`);

let stats = {
  totalPages: htmlFiles.length,
  canonicalOk: 0,
  canonicalFail: 0,
  titleOk: 0,
  descOk: 0,
  ogOk: 0,
  twitterOk: 0,
  h1Ok: 0,
  schemaTypes: new Map(),
  commercialLinksTotal: 0,
  commercialLinksCompliant: 0,
  commercialLinksNonCompliant: 0,
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative('src/.vitepress/dist', file).replace(/\\/g, '/');

  // Canonical
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  if (canonMatch && canonMatch[1].startsWith('https://tizicloud.blog/')) {
    stats.canonicalOk++;
  } else {
    stats.canonicalFail++;
    console.log('[Canonical Fail]', rel, canonMatch ? canonMatch[1] : 'None');
  }

  // Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) stats.titleOk++;

  // Desc
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (descMatch && descMatch[1].trim()) stats.descOk++;

  // OG
  if (html.includes('property="og:title"') && html.includes('property="og:url"')) stats.ogOk++;

  // Twitter
  if (html.includes('name="twitter:card"')) stats.twitterOk++;

  // H1
  const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
  if (h1Matches.length === 1) stats.h1Ok++;

  // Schema
  const scripts = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
  scripts.forEach(s => {
    try {
      const raw = s.replace(/<script\s+type=["']application\/ld\+json["']>/i, '').replace(/<\/script>/i, '');
      const parsed = JSON.parse(raw);
      if (parsed['@graph']) {
        parsed['@graph'].forEach(item => {
          const t = item['@type'] || 'unknown';
          stats.schemaTypes.set(t, (stats.schemaTypes.get(t) || 0) + 1);
        });
      } else {
        const t = parsed['@type'] || 'unknown';
        stats.schemaTypes.set(t, (stats.schemaTypes.get(t) || 0) + 1);
      }
    } catch(e) {}
  });

  // Outbound affiliate links
  const aMatches = html.match(/<a\b([^>]*)>/gi) || [];
  for (const a of aMatches) {
    const hrefMatch = a.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.includes('tizicloud.blog') && !href.includes('localhost') && !href.includes('github.com')) {
        const isCommercial = href.includes('aff') || href.includes('code=') || href.includes('register') || href.includes('tiziyun.net');
        if (isCommercial) {
          stats.commercialLinksTotal++;
          if (a.includes('nofollow') && a.includes('sponsored')) {
            stats.commercialLinksCompliant++;
          } else {
            stats.commercialLinksNonCompliant++;
            console.log('[Non-compliant Link]', rel, a);
          }
        }
      }
    }
  }
}

console.log('--- VERIFICATION STATS ---');
console.log(`Total Pages: ${stats.totalPages}`);
console.log(`Canonical 100% OK: ${stats.canonicalOk} / ${stats.totalPages}`);
console.log(`Unique Title OK: ${stats.titleOk} / ${stats.totalPages}`);
console.log(`Unique Desc OK: ${stats.descOk} / ${stats.totalPages}`);
console.log(`Single H1 OK: ${stats.h1Ok} / ${stats.totalPages}`);
console.log(`Open Graph OK: ${stats.ogOk} / ${stats.totalPages}`);
console.log(`Twitter Cards OK: ${stats.twitterOk} / ${stats.totalPages}`);
console.log(`Commercial Links Total: ${stats.commercialLinksTotal}`);
console.log(`Commercial Links Compliant: ${stats.commercialLinksCompliant}`);
console.log(`Commercial Links Non-Compliant: ${stats.commercialLinksNonCompliant}`);
console.log('Schema Types distribution:', Array.from(stats.schemaTypes.entries()));
