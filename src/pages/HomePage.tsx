import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Snowflake, Factory, Truck } from 'lucide-react';
import { BIHLogo } from '@/components/logo/BIHLogo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/seo/SEO';
import { organizationJsonLd } from '@/components/seo/json-ld';

/**
 * 主页：简洁大方
 * 
 * 设计意图：首屏即传递品牌核心信息，不堆砌内容
 * Hero + 4个核心卖点 + CTA 引导至子页面
 */
export function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Snowflake,
      title: t('home.features.subzero'),
      desc: t('home.features.subzeroDesc'),
      link: '/steel-spec',
      linkText: t('home.features.viewSpecs'),
    },
    {
      icon: ShieldCheck,
      title: t('home.features.oem'),
      desc: t('home.features.oemDesc'),
      link: '/about',
      linkText: t('home.features.ourStandards'),
    },
    {
      icon: Factory,
      title: t('home.features.factory'),
      desc: t('home.features.factoryDesc'),
      link: '/about',
      linkText: t('home.features.ourStory'),
    },
    {
      icon: Truck,
      title: t('home.features.delivery'),
      desc: t('home.features.deliveryDesc'),
      link: '/contact',
      linkText: t('home.features.getQuote'),
    },
  ];

  return (
    <>
      <SEO
        title="Factory-Direct Heavy Equipment Attachments"
        description="Boreal Iron Heavy — factory-direct excavator buckets, hydraulic breakers, quick couplers & more. Q355 HSLA steel bodies with Hardox 450 wear parts. Shipping coast-to-coast across Canada."
        keywords="excavator attachments Canada, Q355 HSLA steel excavator bucket, heavy duty excavator thumbs Canada, quick attach buckets Toronto, weld-on skid steer attachments Ontario, heavy equipment buckets Ontario"
        canonical="/"
        jsonLd={organizationJsonLd}
      />

      {/* ===== HERO 首屏 ===== */}
      <section className="relative bg-bih-navy overflow-hidden">
        {/* 背景装饰：倾斜线条 */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(105deg, transparent, transparent 60px, rgba(255,197,0,0.15) 60px, rgba(255,197,0,0.15) 62px)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
          <div className="flex flex-col items-center text-center">
            <BIHLogo size="lg" variant="navy" showTagline={true} />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Badge variant="yellow">
                <ShieldCheck className="mr-1 h-3 w-3" />
                CE Certified
              </Badge>
              <Badge variant="yellow">
                <ShieldCheck className="mr-1 h-3 w-3" />
                ISO 9001
              </Badge>
            </div>

            <h1 className="mt-8 max-w-4xl text-4xl font-black uppercase tracking-tight text-white lg:text-6xl">
              {t('hero.headline')}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/70 lg:text-xl">
              {t('hero.subheadline')}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/steel-spec">
                <Button variant="primary" size="lg">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="#contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  {t('hero.ctaSecondary')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ===== 4 个核心卖点 ===== */}
      <section className="bg-bih-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group flex flex-col">
                <div className="flex h-14 w-14 items-center justify-center bg-bih-yellow">
                  <f.icon className="h-7 w-7 text-bih-navy" />
                </div>
                <h3 className="mt-5 text-lg font-black uppercase tracking-tight text-bih-navy">
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-bih-gray-500">
                  {f.desc}
                </p>
                <Link
                  to={f.link}
                  className="mt-4 inline-flex items-center text-sm font-bold uppercase tracking-wider text-bih-navy transition-colors hover:text-bih-yellow-dark"
                >
                  {f.linkText}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 简要 CTA 条 ===== */}
      <section className="bg-bih-yellow py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-bih-navy lg:text-3xl">
            {t('home.cta.title')}
          </h2>
          <p className="mt-3 text-bih-navy/70">
            {t('home.cta.subtitle')}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/steel-spec">
              <Button variant="secondary" size="lg">
                {t('home.cta.specs')}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-bih-navy">
                {t('home.cta.story')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
