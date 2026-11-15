import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '梯子云',
  titleTemplate: ':title - 梯子云 (tizicloud.blog)',
  description: '梯子云专注于 2026 高性价比机场推荐、专线机场排行、科学上网梯子测评、免费节点与 Clash Verge / Meta 客户端配置教程，打造客观量化、可验证事实的权威网络指南。',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://tizicloud.blog'
  },
  head: [
    ['link', { rel: 'icon', href: '/avatar.jpg' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'author', content: '梯子云技术评测实验室' }],
    ['meta', { property: 'og:site_name', content: '梯子云' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // 搜索引擎站长平台所有权验证插槽预留位（上线后填入真实验证代码即可自动输出至全局 HTML 源码）
    // ['meta', { name: 'google-site-verification', content: 'YOUR_GOOGLE_VERIFICATION_CODE' }],
    // ['meta', { name: 'msvalidate.01', content: 'YOUR_BING_VERIFICATION_CODE' }],
    // ['meta', { name: 'baidu-site-verification', content: 'YOUR_BAIDU_VERIFICATION_CODE' }],
    // ['meta', { name: 'shenma-site-verification', content: 'YOUR_SHENMA_VERIFICATION_CODE' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://tizicloud.blog/#website',
            name: '梯子云',
            url: 'https://tizicloud.blog/',
            description: '高性价比机场推荐、稳定专线梯子排行与 Clash 客户端配置全书',
            publisher: {
              '@id': 'https://tizicloud.blog/#organization'
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://tizicloud.blog/?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'Organization',
            '@id': 'https://tizicloud.blog/#organization',
            name: '梯子云技术评测实验室',
            url: 'https://tizicloud.blog/',
            logo: 'https://tizicloud.blog/avatar.jpg',
            description: '专注于国际网络通信协议、跨境传输物理架构与代理客户端性能审计的独立第三方评测实验室。'
          }
        ]
      })
    ]
  ],
  transformHead({ pageData }) {
    const rawPath = pageData.relativePath || '';
    const cleanPath = rawPath === 'index.md'
      ? ''
      : rawPath.replace(/(?:^|\/)index\.md$/, '/').replace(/\.md$/, '/');
    const canonicalUrl = `https://tizicloud.blog/${cleanPath}`.replace(/\/+/g, '/').replace('https:/', 'https://');
    const pageTitle = pageData.title ? `${pageData.title} - 梯子云 (tizicloud.blog)` : '梯子云 (tizicloud.blog) — 2026 机场推荐与科学上网指南';
    const pageDesc = pageData.description || '梯子云专注于 2026 高性价比机场推荐、专线机场排行、科学上网梯子测评与 Clash 客户端配置教程。';

    const tags: any[] = [];
    tags.push(['link', { rel: 'canonical', href: canonicalUrl }]);
    tags.push(['meta', { property: 'og:title', content: pageTitle }]);
    tags.push(['meta', { property: 'og:description', content: pageDesc }]);
    tags.push(['meta', { property: 'og:url', content: canonicalUrl }]);
    tags.push(['meta', { property: 'og:image', content: 'https://tizicloud.blog/avatar.jpg' }]);
    tags.push(['meta', { name: 'twitter:title', content: pageTitle }]);
    tags.push(['meta', { name: 'twitter:description', content: pageDesc }]);
    tags.push(['meta', { name: 'twitter:image', content: 'https://tizicloud.blog/avatar.jpg' }]);

    if (rawPath !== 'index.md') {
      // 1. BreadcrumbList Schema (通用面包屑)
      tags.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: 'https://tizicloud.blog/' },
            { '@type': 'ListItem', position: 2, name: pageData.title || '专题', item: canonicalUrl }
          ]
        })
      ]);

      // 2. 根据页面类型分类匹配精准 Schema
      const isHub = rawPath.endsWith('index.md') && !rawPath.startsWith('brand/') || rawPath === 'brand/index.md';
      const isBrandDetail = rawPath.startsWith('brand/') && rawPath !== 'brand/index.md';
      const isFaqPage = rawPath === 'resources/faq/index.md';

      if (isHub) {
        // 栏目/大系聚合页输出 CollectionPage
        tags.push([
          'script',
          { type: 'application/ld+json' },
          JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: pageData.title,
            description: pageDesc,
            url: canonicalUrl,
            inLanguage: 'zh-CN',
            publisher: {
              '@type': 'Organization',
              name: '梯子云技术评测实验室',
              url: 'https://tizicloud.blog/'
            }
          })
        ]);
      } else {
        // 文章与深度测评页输出 TechArticle
        tags.push([
          'script',
          { type: 'application/ld+json' },
          JSON.stringify({
            '@context': 'https://schema.org',
            '@type': isBrandDetail ? 'WebPage' : 'TechArticle',
            headline: pageData.title,
            description: pageDesc,
            url: canonicalUrl,
            inLanguage: 'zh-CN',
            author: {
              '@type': 'Organization',
              name: '梯子云技术评测实验室',
              url: 'https://tizicloud.blog/'
            },
            publisher: {
              '@type': 'Organization',
              name: '梯子云',
              url: 'https://tizicloud.blog/',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tizicloud.blog/avatar.jpg'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl
            }
          })
        ]);
      }

      // 3. 针对专属 FAQ 页面注入标准 FAQPage Schema
      if (isFaqPage) {
        tags.push([
          'script',
          { type: 'application/ld+json' },
          JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '为什么 2026 年选购梯子优先推荐 IEPL/IPLC 跨境专线？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'IEPL/IPLC 跨境物理专线完全经由电信运营商内网光纤传输，数据流不经过公网 GFW 审查节点，具备晚高峰零丢包、低延迟抖动和极高抗封锁韧性。'
                }
              },
              {
                '@type': 'Question',
                name: '什么是节点倍率？如何避免流量快速耗尽？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '节点倍率是服务商对不同质量线路的计费折算比例。例如 1.0x 节点消耗 1GB 扣除 1GB，0.2x 低倍率节点传输 10GB 仅扣 2GB（适合大文件下载），3.0x 高纯净专线节点扣除 3GB。'
                }
              },
              {
                '@type': 'Question',
                name: '如何彻底避免购买小作坊机场遭遇卷款跑路？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '严禁初次使用即购买超过一年的低价套餐，坚持月付或季付；认准储备多组防封域名与公开 Telegram 社群的老牌服务商；客户端中常备备用按量计费套餐。'
                }
              }
            ]
          })
        ]);
      }
    }

    return tags;
  },
  themeConfig: {
    siteTitle: '⚡ 梯子云 TiziCloud',
    logo: '/avatar.jpg',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '① 机场推荐',
        items: [
          { text: '★ 机场推荐核心专题', link: '/recommend/' },
          { text: '机场推荐精选', link: '/recommend/best/' },
          { text: '机场排行榜 2026', link: '/recommend/ranking/' },
          { text: '性价比机场精选', link: '/recommend/cost-effective/' },
          { text: '稳定专线机场', link: '/recommend/stable/' },
          { text: '便宜机场 (10元内)', link: '/recommend/cheap/' },
          { text: '免费梯子实测', link: '/recommend/free/' },
          { text: '科学上网新手大系', link: '/recommend/guide/' }
        ]
      },
      {
        text: '② VPN 与加速器',
        items: [
          { text: '★ VPN 与加速器专题', link: '/vpn/' },
          { text: 'VPN 推荐大系', link: '/vpn/recommend/' },
          { text: '免费 VPN 避坑指南', link: '/vpn/free/' },
          { text: '手机端 VPN 推荐', link: '/vpn/mobile/' },
          { text: 'VPN 软件深度评测', link: '/vpn/reviews/' },
          { text: 'VPN 加速器原理', link: '/vpn/accelerator/' },
          { text: '加速器全面对比', link: '/vpn/compare/' },
          { text: '好用的 VPN 精选', link: '/vpn/best/' }
        ]
      },
      {
        text: '③ Clash 客户端',
        items: [
          { text: '★ Clash 客户端枢纽', link: '/clash/' },
          { text: 'Clash 客户端推荐', link: '/clash/recommend/' },
          { text: 'Clash Verge 核心评测', link: '/clash/verge/' },
          { text: 'Clash Verge 下载中心', link: '/clash/download/' },
          { text: 'Clash Verge 订阅配置', link: '/clash/subscribe/' },
          { text: 'Clash Meta 内核详解', link: '/clash/meta/' },
          { text: 'Clash 从入门到精通教程', link: '/clash/tutorial/' },
          { text: 'Clash 常见故障排查', link: '/clash/troubleshooting/' }
        ]
      },
      {
        text: '④ 资源与情报',
        items: [
          { text: '★ 资源与情报中心', link: '/resources/' },
          { text: '免费节点与每日更新', link: '/resources/free-nodes/' },
          { text: '机场跑路预警雷达', link: '/resources/warning/' },
          { text: '机场高频 FAQ 问答库', link: '/resources/faq/' },
          { text: '机场风险情报与合规', link: '/resources/risk-intel/' },
          { text: '节点测速与连通检测', link: '/resources/node-check/' },
          { text: '订阅链接转换与报错', link: '/resources/subscription-issues/' },
          { text: '零基础新手上路帮助', link: '/resources/beginner-guide/' }
        ]
      },
      {
        text: '42 家机场评测库',
        link: '/brand/'
      },
      {
        text: '关于实验室',
        items: [
          { text: '关于我们', link: '/about/' },
          { text: '评测方法论 (DNO)', link: '/methodology/' },
          { text: '法律免责声明', link: '/disclaimer/' },
          { text: '隐私安全政策', link: '/privacy/' }
        ]
      }
    ],
    sidebar: {
      '/recommend/': [
        {
          text: '机场推荐 Pillar Hub',
          collapsed: false,
          items: [
            { text: '核心导航专题首页', link: '/recommend/' },
            { text: '机场推荐精选', link: '/recommend/best/' },
            { text: '机场排行榜 2026', link: '/recommend/ranking/' },
            { text: '性价比机场推荐', link: '/recommend/cost-effective/' },
            { text: '稳定专线机场选型', link: '/recommend/stable/' },
            { text: '便宜机场低价指南', link: '/recommend/cheap/' },
            { text: '免费梯子实测核验', link: '/recommend/free/' },
            { text: '科学上网全局选型指南', link: '/recommend/guide/' }
          ]
        },
        {
          text: '主推品牌直达',
          items: [
            { text: 'TOP 1 光速云深度评测', link: '/brand/guangsu/' },
            { text: 'TOP 2 暮光加速深度评测', link: '/brand/muguang/' },
            { text: 'TOP 3 飞猫云免配客户端', link: '/brand/feimao/' }
          ]
        }
      ],
      '/vpn/': [
        {
          text: 'VPN 与加速器专题',
          collapsed: false,
          items: [
            { text: 'VPN 与加速器总览', link: '/vpn/' },
            { text: 'VPN 推荐大系', link: '/vpn/recommend/' },
            { text: '免费 VPN 风险与避坑', link: '/vpn/free/' },
            { text: '手机端 VPN (iOS/Android)', link: '/vpn/mobile/' },
            { text: 'VPN 软件深度横评', link: '/vpn/reviews/' },
            { text: 'VPN 加速器技术原理', link: '/vpn/accelerator/' },
            { text: '游戏与网络加速器对比', link: '/vpn/compare/' },
            { text: '好用的 VPN 精选榜单', link: '/vpn/best/' }
          ]
        }
      ],
      '/clash/': [
        {
          text: 'Clash 客户端中心',
          collapsed: false,
          items: [
            { text: '客户端总枢纽', link: '/clash/' },
            { text: 'Clash 客户端推荐选型', link: '/clash/recommend/' },
            { text: 'Clash Verge Rev 核心档案', link: '/clash/verge/' },
            { text: 'Clash Verge 官方下载', link: '/clash/download/' },
            { text: 'Clash Verge 订阅导入指南', link: '/clash/subscribe/' },
            { text: 'Clash Meta (Mihomo) 内核', link: '/clash/meta/' },
            { text: 'Clash 全平台使用教程', link: '/clash/tutorial/' },
            { text: 'Clash 故障与报错排查', link: '/clash/troubleshooting/' }
          ]
        }
      ],
      '/resources/': [
        {
          text: '资源与情报中心',
          collapsed: false,
          items: [
            { text: '情报中心首页', link: '/resources/' },
            { text: '免费节点获取与安全规范', link: '/resources/free-nodes/' },
            { text: '机场跑路预警雷达', link: '/resources/warning/' },
            { text: '机场高频 FAQ 问答库', link: '/resources/faq/' },
            { text: '机场风险情报与防封避坑', link: '/resources/risk-intel/' },
            { text: '节点测速与延迟检测工具', link: '/resources/node-check/' },
            { text: '订阅转换与无法更新排查', link: '/resources/subscription-issues/' },
            { text: '零基础新手上路指南', link: '/resources/beginner-guide/' }
          ]
        }
      ],
      '/brand/': [
        {
          text: '第一梯队 (核心主推 TOP 1-10)',
          collapsed: false,
          items: [
            { text: '1. 光速云 (IEPL+内网双专线)', link: '/brand/guangsu/' },
            { text: '2. 暮光加速 (BGP智能调度)', link: '/brand/muguang/' },
            { text: '3. 飞猫云 (专属免配客户端)', link: '/brand/feimao/' },
            { text: '4. 微风网络 (7元三网优化)', link: '/brand/weifeng/' },
            { text: '5. 大佬云 (5.6元超低门槛)', link: '/brand/dalaoyun/' },
            { text: '6. 星岛梦 (不限时不过期)', link: '/brand/xingdaomeng/' },
            { text: '7. 二猫云 (20元130G高性价)', link: '/brand/ermao/' },
            { text: '8. 无忧链接 (原生订阅免转)', link: '/brand/wuyou/' },
            { text: '9. 唯兔云 (60+节点三网均衡)', link: '/brand/weitu/' },
            { text: '10. Firefly (全IPLC内网直连)', link: '/brand/firefly/' }
          ]
        },
        {
          text: '第二梯队 (深度评测 TOP 11-28)',
          collapsed: true,
          items: [
            { text: '11. 宇宙云', link: '/brand/yuzhou/' },
            { text: '12. U1S1', link: '/brand/u1s1/' },
            { text: '13. 灵猫网络', link: '/brand/lingmao/' },
            { text: '14. 极连云', link: '/brand/jilian/' },
            { text: '15. 光年梯', link: '/brand/guangnian/' },
            { text: '16. 一翻云', link: '/brand/yifan/' },
            { text: '17. SOGO云', link: '/brand/sogo/' },
            { text: '18. 可信云', link: '/brand/kexin/' },
            { text: '19. 速界', link: '/brand/sujie/' },
            { text: '20. 闪跃', link: '/brand/shanyue/' },
            { text: '21. 全球云', link: '/brand/quanqiu/' },
            { text: '22. 闪电鼠', link: '/brand/shandianshu/' },
            { text: '23. 云界线', link: '/brand/yunjiexian/' },
            { text: '24. 榴莲云', link: '/brand/liulianyun/' },
            { text: '25. 神行加速', link: '/brand/shenxing/' },
            { text: '26. 环球梯', link: '/brand/huanqiuti/' },
            { text: '27. 隐形人', link: '/brand/yinxingren/' },
            { text: '28. 梯子云 (同名推荐)', link: '/brand/tiziyun/' }
          ]
        },
        {
          text: '第三梯队 (历史存档与对比 TOP 29-42)',
          collapsed: true,
          items: [
            { text: '29. WgetCloud', link: '/brand/wgetcloud/' },
            { text: '30. 白月光', link: '/brand/baiyueguang/' },
            { text: '31. FlyingBird', link: '/brand/flyingbird/' },
            { text: '32. CyberGuard', link: '/brand/cyberguard/' },
            { text: '33. 龙猫云', link: '/brand/longmaoyun/' },
            { text: '34. FATCAT', link: '/brand/fatcat/' },
            { text: '35. TNTCloud', link: '/brand/tntcloud/' },
            { text: '36. 青云梯', link: '/brand/qingyunti/' },
            { text: '37. 山水云', link: '/brand/shanshuiyun/' },
            { text: '38. 灵动云', link: '/brand/lingdongyun/' },
            { text: '39. 浪网', link: '/brand/langwang/' },
            { text: '40. EdgeNova', link: '/brand/edgenova/' },
            { text: '41. 萤火虫历史档', link: '/brand/yinghuochong/' },
            { text: '42. sslar', link: '/brand/sslar/' }
          ]
        }
      ]
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索机场评测、客户端与知识库...',
                buttonAriaLabel: '搜索机场评测、客户端与知识库'
              },
              modal: {
                noResultsText: '未检索到相关评测或节点信息',
                resetButtonTitle: '清除搜索词',
                footer: {
                  selectText: '进入页面',
                  navigateText: '上下切换',
                  closeText: '退出搜索'
                }
              }
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: '本篇目录导航'
    },
    docFooter: {
      prev: '上一篇专题',
      next: '下一篇专题'
    },
    footer: {
      message: '免责声明：本站提供之网络工具测评信息仅供科研与网络工程学习。部分注册链接含商业推荐返利，不影响用户实付价格与客观测评结论。<br><span style="display:inline-block; margin-top:0.35rem;"><a href="/about/">关于我们</a> · <a href="/methodology/">评测方法论 (DNO)</a> · <a href="/disclaimer/">法律免责</a> · <a href="/privacy/">隐私政策</a></span>',
      copyright: 'Copyright © 2026 梯子云 (tizicloud.blog) · 保留所有权利 · 基于 Apache 静态分发'
    }
  }
});
