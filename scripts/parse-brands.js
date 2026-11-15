import fs from 'fs';
import path from 'path';

// Parse brands from Desktop file
const rawFile = 'c:/Users/Pro User/Desktop/机场品牌信息/42家机场品牌清单.txt';
const content = fs.readFileSync(rawFile, 'utf8');

// Known brands mapping
const brandSlugs = {
  '光速云': 'guangsu',
  '暮光加速': 'muguang',
  '飞猫云': 'feimao',
  '微风网络': 'weifeng',
  '大佬云': 'dalaoyun',
  '星岛梦': 'xingdaomeng',
  '二猫云': 'ermao',
  '无忧链接': 'wuyou',
  '唯兔云': 'weitu',
  'Firefly': 'firefly',
  '宇宙云': 'yuzhou',
  'U1S1': 'u1s1',
  '灵猫网络': 'lingmao',
  '极连云': 'jilian',
  '光年梯': 'guangnian',
  '一翻云': 'yifan',
  'SOGO云': 'sogo',
  'SOGO 云': 'sogo',
  '可信云': 'kexin',
  '速界': 'sujie',
  '闪跃': 'shanyue',
  '全球云': 'quanqiu',
  '闪电鼠': 'shandianshu',
  '云界线': 'yunjiexian',
  '榴莲云': 'liulianyun',
  '神行加速': 'shenxing',
  '环球梯': 'huanqiuti',
  '隐形人': 'yinxingren',
  '梯子云': 'tiziyun',
  'WgetCloud': 'wgetcloud',
  '白月光': 'baiyueguang',
  'FlyingBird': 'flyingbird',
  'CyberGuard': 'cyberguard',
  '龙猫云': 'longmaoyun',
  'FATCAT': 'fatcat',
  'TNTCloud': 'tntcloud',
  '青云梯': 'qingyunti',
  '山水云': 'shanshuiyun',
  '灵动云': 'lingdongyun',
  '浪网': 'langwang',
  'EdgeNova': 'edgenova',
  '萤火虫': 'yinghuochong',
  'sslar': 'sslar',
  '快狸': 'kaili'
};

// Known speedtest image map in public/images/speedtest
const imageMap = {
  'guangsu': ['/images/speedtest/光速云-节点测速实测.png', '/images/speedtest/photo_2026-08-19_12-13-01.jpg', '/images/speedtest/photo_2026-08-19_12-13-50.jpg'],
  'muguang': ['/images/speedtest/幕光加速-节点测速实测.png'],
  'feimao': ['/images/speedtest/飞猫云-节点测速实测.png'],
  'weifeng': ['/images/speedtest/微风-节点测速实测.png'],
  'xingdaomeng': ['/images/speedtest/星岛梦-节点测速实测.png'],
  'ermao': ['/images/speedtest/二猫云-节点测速实测.png'],
  'wuyou': ['/images/speedtest/无忧链接.jpg', '/images/speedtest/无忧链接2.jpg'],
  'weitu': ['/images/speedtest/唯兔云-节点测速实测.png'],
  'yuzhou': ['/images/speedtest/宇宙云-节点测速实测.png'],
  'u1s1': ['/images/speedtest/U1S1-节点测速实测.png'],
  'lingmao': ['/images/speedtest/灵猫网络-节点测速实测.png'],
  'jilian': ['/images/speedtest/极连云-节点测速实测.png'],
  'guangnian': ['/images/speedtest/光年梯-节点测速实测.png'],
  'yifan': ['/images/speedtest/一翻云-节点测速实测.png'],
  'sogo': ['/images/speedtest/SOGO云-节点测速实测.png'],
  'kexin': ['/images/speedtest/可信云-节点测速实测.png'],
  'sujie': ['/images/speedtest/速界-节点测速实测.png'],
  'quanqiu': ['/images/speedtest/全球云-节点测速实测.png']
};

console.log('Parser ready to generate brand registry.');
