import { useTranslation } from 'react-i18next';
import { Snowflake, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

/**
 * Q355 钢材技术对标模块
 * 
 * 设计意图：用技术参数消除"中国钢材"质疑
 * 对比 Q355 vs ASTM A572 Grade 50，突出 -30°C 冲击韧性
 * 关键措辞：Sub-zero resilient HSLA manganese steel
 */

/* 钢材对比数据：Q355 vs ASTM A572 Grade 50 */
const steelData = [
  {
    property: 'yieldStrength',
    q355: '≥ 355 MPa',
    astm: '≥ 345 MPa',
    unit: 'MPa',
    highlight: true,
  },
  {
    property: 'tensileStrength',
    q355: '470–630 MPa',
    astm: '450–620 MPa',
    unit: 'MPa',
    highlight: false,
  },
  {
    property: 'charpy',
    q355: '≥ 27J @ -30°C',
    astm: '≥ 27J @ -30°C',
    unit: 'Joules',
    highlight: true,
  },
  {
    property: 'weldability',
    q355: 'excellent',
    astm: 'excellent',
    unit: '',
    highlight: false,
  },
];

export function SteelSpecSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="bg-bih-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* 标题区 */}
        <div className="mb-16 max-w-3xl">
          <Badge variant="yellow" className="mb-4">
            <Snowflake className="mr-1 h-3 w-3" />
            -30°C RATED
          </Badge>
          <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-5xl">
            {t('steel.title')}
          </h2>
          <p className="mt-4 text-lg text-bih-gray-500">
            {t('steel.subtitle')}
          </p>
        </div>

        {/* 钢材对比表格 */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-3">
            {/* 表头 */}
            <div className="bg-bih-gray-100 p-4 text-sm font-bold uppercase tracking-wider text-bih-gray-500">
              Property
            </div>
            <div className="bg-bih-yellow p-4 text-center text-sm font-black uppercase tracking-wider text-bih-navy">
              {t('steel.q355')}
            </div>
            <div className="bg-bih-navy p-4 text-center text-sm font-black uppercase tracking-wider text-white">
              {t('steel.astm')}
            </div>

            {/* 数据行 */}
            {steelData.map((row, idx) => (
              <>
                <div
                  key={`prop-${idx}`}
                  className={`flex items-center gap-2 border-t border-bih-gray-200 p-4 text-sm font-bold text-bih-dark ${
                    row.highlight ? 'bg-bih-yellow/5' : ''
                  }`}
                >
                  {row.property === 'charpy' && <Snowflake className="h-4 w-4 text-bih-navy" />}
                  {row.property === 'yieldStrength' && <Shield className="h-4 w-4 text-bih-navy" />}
                  {row.property === 'weldability' && <Zap className="h-4 w-4 text-bih-navy" />}
                  {t(`steel.${row.property}`)}
                </div>
                <div
                  key={`q355-${idx}`}
                  className={`border-t border-bih-gray-200 p-4 text-center text-sm font-bold text-bih-dark ${
                    row.highlight ? 'bg-bih-yellow/5' : ''
                  }`}
                >
                  {row.property === 'weldability' ? t(`steel.${row.q355}`) : row.q355}
                </div>
                <div
                  key={`astm-${idx}`}
                  className={`border-t border-bih-gray-200 p-4 text-center text-sm font-bold text-bih-dark ${
                    row.highlight ? 'bg-bih-yellow/5' : ''
                  }`}
                >
                  {row.property === 'weldability' ? t(`steel.${row.astm}`) : row.astm}
                </div>
              </>
            ))}
          </div>
        </Card>

        {/* Hardox 450 补充说明 */}
        <div className="mt-8 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-bih-orange">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-bih-navy">
              Hardox 450 Wear Plates
            </p>
            <p className="mt-1 text-sm text-bih-gray-500">
              {t('steel.wearPlate')}
            </p>
          </div>
        </div>

        {/* 三个特性卡片 */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center bg-bih-yellow">
                <Snowflake className="h-6 w-6 text-bih-navy" />
              </div>
              <CardTitle className="mt-4">Sub-Zero Resilience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-bih-gray-500">
                Charpy V-notch tested at -30°C. Built for Northern Alberta, Saskatchewan, and the Territories.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center bg-bih-yellow">
                <Shield className="h-6 w-6 text-bih-navy" />
              </div>
              <CardTitle className="mt-4">OEM-Grade Welds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-bih-gray-500">
                Full-penetration welds inspected via ultrasonic testing. Every seam meets AWS D1.1 structural welding standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center bg-bih-yellow">
                <Zap className="h-6 w-6 text-bih-navy" />
              </div>
              <CardTitle className="mt-4">Factory Direct Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-bih-gray-500">
                No middlemen. No dealer markups. Direct from the production floor to your job site across Canada.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
