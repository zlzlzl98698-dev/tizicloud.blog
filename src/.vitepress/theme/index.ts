import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 预留全局组件注册
  }
};
