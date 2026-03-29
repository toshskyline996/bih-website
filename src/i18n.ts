import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';

// 初始化 i18n，资源直接导入以获得最快加载速度
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      // fr: { translation: frTranslation }, // 后续加入
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React 已有 XSS 防护
    },
    // 优化：禁用异步资源加载，减少请求
    initImmediate: false, 
  });

export default i18n;
