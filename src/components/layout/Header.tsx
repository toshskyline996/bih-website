import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { BIHLogo } from '@/components/logo/BIHLogo';
import { Button } from '@/components/ui/Button';

/**
 * Header 导航栏
 * 
 * 设计意图：深海蓝背景 + 黄色 Logo，模拟重工业企业官网
 * 支持移动端汉堡菜单 + EN/FR 语言切换
 * 使用 React Router Link 实现 SPA 路由导航
 */
export function Header() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* 语言切换：EN ↔ FR */
  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(next);
  };

  const navItems = [
    { label: t('nav.products'), to: '/products' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.compatibility'), to: '/steel-spec' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  return (
    <header className="bg-bih-navy sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <BIHLogo size="sm" variant="navy" showTagline={false} />
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to + item.label}
              to={item.to}
              className="text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-bih-yellow"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* 语言切换按钮 */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-bih-yellow"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </button>

          {/* 主 CTA */}
          <Button variant="primary" size="sm">
            {t('nav.getQuote')}
          </Button>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 移动端展开菜单 */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-bih-navy-dark px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-2 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.to + item.label}
                to={item.to}
                className="py-3 text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-bih-yellow"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm font-bold uppercase text-white/80 hover:text-bih-yellow"
            >
              <Globe className="h-4 w-4" />
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </button>
            <Button variant="primary" size="sm" className="flex-1">
              {t('nav.getQuote')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
