import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * Hero 首屏区域
 *
 * 背景视频：将 hero-video.mp4 放入 public/ 目录即自动启用
 * 无视频时降级为 bg-bih-navy 纯色背景（体验不降级）
 */
export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px] bg-bih-navy">
      {/* 背景视频：autoPlay + muted + loop，iOS 需要 playsInline */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 深色遮罩：navy 70% 透明度，保证文字对比度 */}
      <div className="absolute inset-0 bg-bih-navy/70" />

      {/* 倾斜线条装饰 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(105deg, transparent, transparent 60px, rgba(255,197,0,0.15) 60px, rgba(255,197,0,0.15) 62px)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* 认证标识条 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
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
          <p className="mt-6 max-w-2xl text-lg text-white/80 lg:text-xl">
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

      {/* 底部倾斜分割线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  );
}
