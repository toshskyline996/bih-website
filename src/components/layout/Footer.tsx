import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BIHLogo } from '@/components/logo/BIHLogo';

/**
 * Footer 页脚
 * 
 * 设计意图：深海蓝背景，与 Header 呼应
 * 包含品牌标识、法律声明、联系方式
 */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bih-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 品牌区 */}
          <div className="flex flex-col gap-4">
            <BIHLogo size="md" variant="navy" />
            <p className="text-sm text-white/60">
              {t('footer.tagline')}
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-bih-yellow">
              {t('nav.products')}
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li><Link to="/products" className="hover:text-bih-yellow transition-colors">{t('footer.buckets')}</Link></li>
              <li><Link to="/products" className="hover:text-bih-yellow transition-colors">{t('footer.breakers')}</Link></li>
              <li><Link to="/products" className="hover:text-bih-yellow transition-colors">{t('footer.couplers')}</Link></li>
              <li><Link to="/products" className="hover:text-bih-yellow transition-colors">{t('footer.thumbsRippers')}</Link></li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-bih-yellow">
              {t('nav.contact')}
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li>borealironheavy.ca</li>
              <li>Ontario, Canada</li>
            </ul>
          </div>
        </div>

        {/* 底部分隔线 + 版权 */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {year} {t('footer.brand')}. {t('footer.rights')}
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white/60 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white/60 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
