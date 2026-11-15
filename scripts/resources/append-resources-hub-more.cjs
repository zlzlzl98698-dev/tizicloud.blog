const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/resources/index.md');
let content = fs.readFileSync(targetFile, 'utf8');

const legalCompliance = `
### Q13：外贸企业与跨国团队使用跨境网络，如何确保合规与数据安全？
答：对于在中国大陆境内注册的正规外贸公司、跨境电商企业及科研机构，工信部与电信管理部门均有清晰明确的跨境互联规范指引：
1. **优先申请官方跨境物理专线**：企业用户可向中国电信、中国联通或中国移动直接申请企业专网（如 CN2 国际企业专线或 IPLC 跨境数据专线），并在当地通信管理局完成合规备案，用于企业正常跨国办公、视频会议及海外服务器运维；
2. **严格禁止用于非经营范围的违规翻墙**：企业采购的网络通道仅限用于经核准的经营性跨国业务往来，严禁私自将线路共享或转租给未经许可的外部第三方；
3. **数据出境合规审计评估**：如果日常业务涉及大规模客户个人信息（PII）或行业关键数据出境，需按照《网络安全法》与《个人信息保护法》相关要求，定期开展个人信息出境标准合同备案或安全评估，从法理和技术层面双重确保业务持续稳健经营。
`;

content = content.replace('## 十、精选主力专线服务商官方受邀直达通道', legalCompliance + '\n\n## 十、精选主力专线服务商官方受邀直达通道');
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Appended legal compliance to resources hub!');
