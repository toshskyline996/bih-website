import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BIHLogo } from '@/components/logo/BIHLogo';
import { Badge } from '@/components/ui/Badge';

/**
 * Hero 首屏区域
 * 
 * 设计意图：全宽深蓝背景，大号 Logo 居中
 * 传递"工厂直销 + 极寒环境 + 北美本土品牌"三重信息
 */
export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-bih-navy overflow-hidden">
      {/* 背景装饰：倾斜线条，呼应平行四边形 Logo */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(105deg, transparent, transparent 60px, rgba(255,197,0,0.15) 60px, rgba(255,197,0,0.15) 62px)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* 大号 Logo 展示 */}
          <BIHLogo size="lg" variant="navy" showTagline={true} />

          {/* 认证标识条 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Badge variant="yellow">
              <ShieldCheck className="mr-1 h-3 w-3" />
              CE Certified
            </Badge>
            <Badge variant="yellow">
              <ShieldCheck className="mr-1 h-3 w-3" />
              ISO 9001
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/80">
              Q355 + Hardox 450
            </Badge>
          </div>

          {/* 主标题 */}
          <h1 className="mt-8 max-w-4xl text-4xl font-black uppercase tracking-tight text-white lg:text-6xl">
            {t('hero.headline')}
          </h1>

          {/* 副标题 */}
          <p className="mt-6 max-w-2xl text-lg text-white/70 lg:text-xl">
            {t('hero.subheadline')}
          </p>

          {/* CTA 按钮组 */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button variant="primary" size="lg">
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>

      {/* 底部倾斜分割线：黄色，呼应品牌色 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-bih-white"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  );
}
