import { useTranslation } from 'react-i18next';
import { Factory, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/**
 * "烟台制造：全球力量源泉" 叙事区域
 * 
 * 设计意图：变"进口"为"源头直供"
 * 将烟台描述为 Global Hub of Hydraulic Excellence
 * 强调工厂自动化和 20 年制造沉淀
 */
export function OriginSection() {
  const { t } = useTranslation();

  const highlights = [
    {
      icon: Factory,
      title: t('origin.factoryLine'),
      desc: 'CNC plasma cutting, robotic welding, and precision machining — all under one roof.',
    },
    {
      icon: Clock,
      title: t('origin.experience'),
      desc: 'Our partner facilities have supplied attachments to OEMs across five continents since 2003.',
    },
    {
      icon: Award,
      title: t('origin.certifications'),
      desc: 'Every attachment is manufactured under ISO 9001 quality management and carries CE marking.',
    },
  ];

  return (
    <section className="bg-bih-gray-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* 左侧文字叙事 */}
          <div>
            <Badge variant="default" className="mb-4">
              Source of Strength
            </Badge>
            <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-5xl">
              {t('origin.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bih-gray-500">
              {t('origin.subtitle')}
            </p>

            {/* 特性列表 */}
            <div className="mt-10 flex flex-col gap-8">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-bih-yellow">
                    <item.icon className="h-6 w-6 text-bih-navy" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-bih-navy">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-bih-gray-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：工厂生产线视觉占位 */}
          <div className="relative">
            <div className="aspect-4/3 bg-bih-navy/10 border-2 border-dashed border-bih-navy/20 flex items-center justify-center">
              <div className="text-center p-8">
                <Factory className="mx-auto h-16 w-16 text-bih-navy/30" />
                <p className="mt-4 text-sm font-bold uppercase tracking-wider text-bih-navy/40">
                  Factory Production Line
                </p>
                <p className="mt-1 text-xs text-bih-gray-500">
                  Photo placeholder — automated welding & CNC line
                </p>
              </div>
            </div>
            {/* 角标：产量数据 */}
            <div className="absolute -bottom-4 -right-4 bg-bih-yellow p-4">
              <p className="text-3xl font-black text-bih-navy">5,000+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-bih-navy/70">
                Units / Year
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
