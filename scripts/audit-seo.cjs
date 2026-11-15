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

// 1. Detailed Affiliate Links Check
console.log('========================================================');
console.log('1. OUTBOUND SPONSORED / AFFILIATE LINKS AUDIT');
console.log('========================================================');
let missingRelList = [];
for (const file of htmlFiles) {
  const rel = path.relative('src/.vitepress/dist', file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const aMatches = html.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  for (const a of aMatches) {
    const hrefMatch = a.match(/href=["']([^"']*)["']/i);
    const relMatch = a.match(/rel=["']([^"']*)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.includes('tizicloud.blog') && !href.includes('localhost')) {
        const isCommercial = href.includes('aff') || href.includes('code=') || href.includes('register') || href.includes('tiziyun') || href.includes('twilight');
        if (isCommercial) {
          const relVal = relMatch ? relMatch[1].toLowerCase() : '';
          const hasNofollow = relVal.includes('nofollow');
          const hasSponsored = relVal.includes('sponsored');
          if (!hasNofollow || !hasSponsored) {
            missingRelList.push({ file: rel, href, aTag: a, hasNofollow, hasSponsored });
          }
        }
      }
    }
  }
}
console.log(`Total non-compliant affiliate links: ${missingRelList.length}`);
missingRelList.forEach((item, idx) => {
  console.log(`[${idx+1}] File: ${item.file}`);
  console.log(`    Link: ${item.href}`);
  console.log(`    Tag:  ${item.aTag}`);
});

// 2. SSR vs CSR Content Check
console.log('\n========================================================');
console.log('2. SSR HYDRATION & DOM ACCESSIBILITY CHECK');
console.log('========================================================');
let ssrOk = 0;
let ssrFail = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  // Check if main content is rendered statically inside <div class="vp-doc ..."> or similar
  if (html.includes('<main') && html.includes('<h1')) {
    ssrOk++;
  } else {
    ssrFail++;
  }
}
console.log(`SSR Pre-rendered HTML Pages: ${ssrOk} / ${htmlFiles.length}`);

// 3. E-E-A-T & Trust Pages Check
console.log('\n========================================================');
console.log('3. E-E-A-T TRUST SIGNALS & DEDICATED PAGES CHECK');
console.log('========================================================');
const trustPaths = [
  'about/index.html',
  'about.html',
  'privacy/index.html',
  'privacy.html',
  'disclaimer/index.html',
  'disclaimer.html',
  'terms/index.html',
  'terms.html',
  'methodology/index.html'
];
trustPaths.forEach(tp => {
  const exists = fs.existsSync(path.join('src/.vitepress/dist', tp));
  console.log(`Trust page [/${tp}]: ${exists ? 'EXISTS' : 'MISSING (404)'}`);
});

// 4. Lexical Similarity / Template Fingerprint across 42 Brand Pages
console.log('\n========================================================');
console.log('4. TEMPLATE FINGERPRINT & SIMILARITY ACROSS BRAND PAGES');
console.log('========================================================');
const brandHtmls = htmlFiles.filter(f => f.includes('brand') && !f.endsWith('brand\\index.html') && !f.endsWith('brand/index.html'));
console.log(`Total brand review pages: ${brandHtmls.length}`);

// Sample 5 brand texts to compute Jaccard similarity of 3-grams
function getShingles(str) {
  const cleaned = str.replace(/<[^>]+>/g, ' ').replace(/[^\u4e00-\u9fa5]/g, '');
  const shingles = new Set();
  for (let i = 0; i < cleaned.length - 4; i += 2) {
    shingles.add(cleaned.slice(i, i + 4));
  }
  return shingles;
}

function jaccard(s1, s2) {
  let inter = 0;
  for (const item of s1) {
    if (s2.has(item)) inter++;
  }
  const union = s1.size + s2.size - inter;
  return union === 0 ? 0 : inter / union;
}

const sampleSlugs = ['sogo', 'u1s1', 'kexin', 'ermao', 'yifan'];
const brandShingles = {};
sampleSlugs.forEach(s => {
  const f = brandHtmls.find(b => b.includes(`brand\\${s}\\`) || b.includes(`brand/${s}/`));
  if (f) {
    brandShingles[s] = getShingles(fs.readFileSync(f, 'utf8'));
  }
});

console.log('Pairwise Jaccard Lexical Similarity (4-character shingles):');
for (let i = 0; i < sampleSlugs.length; i++) {
  for (let j = i + 1; j < sampleSlugs.length; j++) {
    const s1 = sampleSlugs[i];
    const s2 = sampleSlugs[j];
    if (brandShingles[s1] && brandShingles[s2]) {
      const sim = (jaccard(brandShingles[s1], brandShingles[s2]) * 100).toFixed(2);
      console.log(`- ${s1} vs ${s2}: ${sim}% 相似度`);
    }
  }
}

// 5. Leak Inspection Details
console.log('\n========================================================');
console.log('5. PATH & ENVIRONMENT LEAK DETAILS');
console.log('========================================================');
for (const file of htmlFiles) {
  const rel = path.relative('src/.vitepress/dist', file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('C:\\Users\\') || html.includes('C:/Users/')) {
    console.log(`[PATH LEAK] ${rel}`);
    const matches = html.match(/(?:C:[\\/][^"'\s<]+)/g);
    console.log('    Matches:', matches);
  }
}

// 6. JSON-LD Inspection Details
console.log('\n========================================================');
console.log('6. JSON-LD SCHEMA STRUCTURE DETAILS');
console.log('========================================================');
const sampleFile = htmlFiles[0];
const sampleHtml = fs.readFileSync(sampleFile, 'utf8');
const sampleSchemaMatch = sampleHtml.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
if (sampleSchemaMatch) {
  console.log('Sample JSON-LD from ' + sampleFile + ':');
  console.log(sampleSchemaMatch[1].trim());
}
