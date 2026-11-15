const fs = require('fs');
const html = fs.readFileSync('src/.vitepress/dist/brand/guangsu/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];
console.log('Canonical:', head.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0]);
console.log('OG Title:', head.match(/<meta\s+property=["']og:title["'][^>]*>/i)?.[0]);
console.log('OG Image:', head.match(/<meta\s+property=["']og:image["'][^>]*>/i)?.[0]);
console.log('OG URL:', head.match(/<meta\s+property=["']og:url["'][^>]*>/i)?.[0]);
const scripts = head.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
console.log('JSON-LD scripts count:', scripts ? scripts.length : 0);
if (scripts) {
  scripts.forEach((s, i) => console.log(`Schema ${i}:`, s));
}
