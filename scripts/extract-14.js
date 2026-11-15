import fs from 'fs';

const content = fs.readFileSync('c:/Users/Pro User/Desktop/机场品牌信息/42家机场品牌清单.txt', 'utf8');
const brands14 = ['WgetCloud', '白月光', 'FlyingBird', 'CyberGuard', '龙猫云', 'FATCAT', 'TNTCloud', '青云梯', '山水云', '灵动云', '浪网', 'EdgeNova', '萤火虫', 'sslar'];

brands14.forEach(b => {
  const idx = content.indexOf(b);
  if (idx !== -1) {
    const chunk = content.slice(idx, idx + 800);
    const linkMatch = chunk.match(/https?:\/\/[^\s\)\'\"]+/);
    const protoMatch = chunk.match(/协议记录[：:]\s*([^\r\n]+)/);
    const priceMatch = chunk.match(/最低报价[：:]\s*([^\r\n]+)/);
    console.log(JSON.stringify({
      name: b,
      link: linkMatch ? linkMatch[0] : '',
      protocol: protoMatch ? protoMatch[1].trim() : '待核实',
      pricing: priceMatch ? priceMatch[1].trim() : '待核实'
    }));
  }
});
