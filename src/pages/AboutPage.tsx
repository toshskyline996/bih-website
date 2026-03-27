import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Factory,
  Award,
  ArrowRight,
  CheckCircle,
  Globe,
  Wrench,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { SEO } from '@/components/seo/SEO';

/**
 * "烟台制造：全球力量源泉" 完整叙事页面
 * 
 * 核心策略：变"进口"为"源头直供"
 * 措辞红线：绝不出现 "Chinese steel" / "imported from China"
 * 全部使用 "global manufacturing hub" / "source facility" / "HSLA manganese steel"
 */
export function AboutPage() {
  const { t } = useTranslation();

  /* 时间线数据：20年制造沉淀 */
  const timeline = [
    { year: '2003', event: t('about.tl2003') },
    { year: '2008', event: t('about.tl2008') },
    { year: '2012', event: t('about.tl2012') },
    { year: '2016', event: t('about.tl2016') },
    { year: '2020', event: t('about.tl2020') },
    { year: '2024', event: t('about.tl2024') },
  ];

  /* 质量保障流程 */
  const qualitySteps = [
    { icon: Shield, title: t('about.qa1Title'), desc: t('about.qa1Desc') },
    { icon: Wrench, title: t('about.qa2Title'), desc: t('about.qa2Desc') },
    { icon: CheckCircle, title: t('about.qa3Title'), desc: t('about.qa3Desc') },
    { icon: Award, title: t('about.qa4Title'), desc: t('about.qa4Desc') },
  ];

  return (
    <>
      <SEO
        title="About — Our Manufacturing Story"
        description="20+ years of heavy equipment manufacturing excellence. ISO 9001 certified facility with robotic welding, CNC plasma cutting, and ultrasonic weld inspection. Factory-direct to Canada."
        keywords="heavy equipment manufacturer, excavator attachment factory, ISO 9001 certified, robotic welding, factory direct Canada"
        canonical="/about"
      />

      {/* ===== 页面 Hero ===== */}
      <section className="bg-bih-navy py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Badge variant="yellow" className="mb-4">
            <Globe className="mr-1 h-3 w-3" />
            {t('about.badge')}
          </Badge>
          <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight text-white lg:text-6xl">
            {t('origin.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            {t('origin.subtitle')}
          </p>
        </div>
      </section>

      {/* ===== 核心数据条 ===== */}
      <section className="bg-bih-yellow py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '20+', label: t('about.statsYears') },
              { value: '5,000+', label: t('about.statsUnits') },
              { value: '50+', label: t('about.statsCountries') },
              { value: '99.7%', label: t('about.statsQuality') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-bih-navy lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-bih-navy/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 工厂实力展示 ===== */}
      <section className="bg-bih-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* 左侧：工厂图占位 */}
            <div className="relative">
              <div className="aspect-4/3 border-2 border-dashed border-bih-navy/20 bg-bih-navy/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <Factory className="mx-auto h-16 w-16 text-bih-navy/30" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-wider text-bih-navy/40">
                    {t('about.facilityPlaceholder')}
                  </p>
                  <p className="mt-1 text-xs text-bih-gray-500">
                    {t('about.facilityPhotoNote')}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-bih-navy p-4">
                <p className="text-2xl font-black text-bih-yellow">60,000 m²</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                  {t('about.productionFloor')}
                </p>
              </div>
            </div>

            {/* 右侧：叙事文字 */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-4xl">
                {t('about.factoryTitle')}
              </h2>
              <p className="mt-6 text-bih-gray-500 leading-relaxed">
                {t('about.factoryP1')}
              </p>
              <p className="mt-4 text-bih-gray-500 leading-relaxed">
                {t('about.factoryP2')}
              </p>

              {/* 产线能力列表 */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  t('about.capCNC'),
                  t('about.capWeld'),
                  t('about.capBore'),
                  t('about.capHeat'),
                  t('about.capBlast'),
                  t('about.capTest'),
                ].map((capability) => (
                  <div key={capability} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-bih-yellow-dark" />
                    <span className="text-sm font-bold text-bih-dark">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 质量保障流程 ===== */}
      <section className="bg-bih-gray-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-4xl">
            {t('about.qaTitle')}
          </h2>
          <p className="mt-4 max-w-2xl text-bih-gray-500">
            {t('about.qaSubtitle')}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {qualitySteps.map((step, idx) => (
              <Card key={step.title}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center bg-bih-yellow text-sm font-black text-bih-navy">
                      {idx + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-bih-navy" />
                  </div>
                  <h3 className="mt-4 text-sm font-black uppercase tracking-wider text-bih-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-bih-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 20年时间线 ===== */}
      <section className="bg-bih-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-4xl">
            {t('origin.experience')}
          </h2>
          <p className="mt-4 max-w-2xl text-bih-gray-500">
            {t('about.timelineSubtitle')}
          </p>

          <div className="mt-12 relative">
            {/* 时间线竖线 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-bih-gray-200 lg:left-1/2 lg:-translate-x-1/2" />

            <div className="flex flex-col gap-8">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6 pl-12 lg:pl-0 ${
                    idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* 年份圆点 */}
                  <div className="absolute left-2 top-1 h-5 w-5 border-2 border-bih-yellow bg-bih-white lg:static lg:mx-auto lg:shrink-0" />

                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                    <span className="text-xl font-black text-bih-yellow-dark">{item.year}</span>
                    <p className="mt-1 text-sm text-bih-gray-500">{item.event}</p>
                  </div>

                  {/* 占位区：保持两栏对称 */}
                  <div className="hidden flex-1 lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-bih-navy py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white lg:text-3xl">
            {t('about.ctaTitle')}
          </h2>
          <p className="mt-3 text-white/60">
            {t('about.ctaSubtitle')}
          </p>
          <div className="mt-8">
            <Link to="/steel-spec">
              <Button variant="primary" size="lg">
                {t('about.ctaButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
