import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Snowflake,
  Shield,
  Zap,
  ArrowRight,
  Thermometer,
  FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { SEO } from '@/components/seo/SEO';

/**
 * Q355 钢材交互式技术对标页面
 * 
 * 柔性措辞策略：数据使用 "meets or exceeds" / "tested to"
 * 等用户拿到 Mill Test Certificate 后再定死具体数值
 * 
 * Tab 切换：力学性能 / 化学成分 / 低温冲击 / 焊接性
 */

/* 力学性能对比数据（柔性措辞） — 文案在组件内通过 t() 加载 */
const mechanicalValues = [
  { propKey: 'mechYield', q355: '≥ 355 MPa', astm: '≥ 345 MPa', noteKey: 'mechYieldNote' },
  { propKey: 'mechTensile', q355: '470–630 MPa', astm: '450–620 MPa', noteKey: 'mechTensileNote' },
  { propKey: 'mechElong', q355: '≥ 20%', astm: '≥ 18%', noteKey: 'mechElongNote' },
];

/* 化学成分对比（典型值范围） — 文案在组件内通过 t() 加载 */
const chemicalValues = [
  { elemKey: 'chemC', q355: '≤ 0.20%', astm: '≤ 0.23%', noteKey: 'chemCNote' },
  { elemKey: 'chemMn', q355: '≤ 1.60%', astm: '≤ 1.35%', noteKey: 'chemMnNote' },
  { elemKey: 'chemSi', q355: '≤ 0.55%', astm: '≤ 0.40%', noteKey: '' },
  { elemKey: 'chemP', q355: '≤ 0.025%', astm: '≤ 0.04%', noteKey: 'chemPNote' },
  { elemKey: 'chemS', q355: '≤ 0.025%', astm: '≤ 0.05%', noteKey: 'chemSNote' },
];

/* 低温冲击数据（Charpy V-Notch）— 数值保持不变，不需翻译 */
const charpyData = [
  { temp: '0°C', q355: '≥ 34J', astm: 'Not specified', highlight: false },
  { temp: '-20°C', q355: '≥ 27J', astm: '≥ 27J (if specified)', highlight: false },
  { temp: '-30°C', q355: '≥ 27J (Q355D grade)', astm: '≥ 27J (if specified)', highlight: true },
  { temp: '-40°C', q355: '≥ 27J (Q355E grade)', astm: 'Typically not tested', highlight: false },
];

export function SteelSpecPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="Steel Specifications — Q355 vs ASTM A572 Grade 50"
        description="Interactive comparison of Q355 HSLA manganese steel and ASTM A572 Grade 50. Mechanical properties, chemical composition, low-temperature impact, and weldability data. Hardox 450 wear parts."
        keywords="Q355 HSLA steel, ASTM A572 Grade 50, Hardox 450, excavator bucket steel, sub-zero impact steel, weldable structural steel Canada"
        canonical="/steel-spec"
      />

      {/* ===== 页面 Hero ===== */}
      <section className="bg-bih-navy py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Badge variant="yellow" className="mb-4">
            <Snowflake className="mr-1 h-3 w-3" />
            -30°C Rated
          </Badge>
          <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight text-white lg:text-6xl">
            {t('steel.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            {t('steel.subtitle')}
          </p>
        </div>
      </section>

      {/* ===== 交互式 Tab 对比模块 ===== */}
      <section className="bg-bih-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-4xl">
            {t('steel.compTitle')}
          </h2>
          <p className="mt-4 max-w-2xl text-bih-gray-500">
            {t('steel.compSubtitle')}
          </p>

          <div className="mt-10">
            <Tabs defaultValue="mechanical">
              <TabsList className="overflow-x-auto">
                <TabsTrigger value="mechanical">
                  <Shield className="mr-2 h-4 w-4 hidden sm:inline-block" />
                  {t('steel.tabMechanical')}
                </TabsTrigger>
                <TabsTrigger value="chemical">
                  <FlaskConical className="mr-2 h-4 w-4 hidden sm:inline-block" />
                  {t('steel.tabChemical')}
                </TabsTrigger>
                <TabsTrigger value="charpy">
                  <Thermometer className="mr-2 h-4 w-4 hidden sm:inline-block" />
                  {t('steel.tabCharpy')}
                </TabsTrigger>
                <TabsTrigger value="weldability">
                  <Zap className="mr-2 h-4 w-4 hidden sm:inline-block" />
                  {t('steel.tabWeldability')}
                </TabsTrigger>
              </TabsList>

              {/* ===== Tab 1: 力学性能 ===== */}
              <TabsContent value="mechanical">
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr>
                          <th className="bg-bih-gray-100 p-4 font-bold uppercase tracking-wider text-bih-gray-500">
                            {t('steel.thProperty')}
                          </th>
                          <th className="bg-bih-yellow p-4 text-center font-black uppercase tracking-wider text-bih-navy">
                            Q355 HSLA
                          </th>
                          <th className="bg-bih-navy p-4 text-center font-black uppercase tracking-wider text-white">
                            ASTM A572 Gr.50
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mechanicalValues.map((row) => (
                          <tr key={row.propKey} className="border-t border-bih-gray-200">
                            <td className="p-4 font-bold text-bih-dark">{t(`steel.${row.propKey}`)}</td>
                            <td className="p-4 text-center font-bold text-bih-dark">{row.q355}</td>
                            <td className="p-4 text-center font-bold text-bih-dark">{row.astm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <CardContent className="bg-bih-gray-100 p-4">
                    <p className="text-xs text-bih-gray-500">
                      <strong>Note:</strong> {t('steel.mechNote')}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ===== Tab 2: 化学成分 ===== */}
              <TabsContent value="chemical">
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr>
                          <th className="bg-bih-gray-100 p-4 font-bold uppercase tracking-wider text-bih-gray-500">
                            {t('steel.thElement')}
                          </th>
                          <th className="bg-bih-yellow p-4 text-center font-black uppercase tracking-wider text-bih-navy">
                            Q355 (max)
                          </th>
                          <th className="bg-bih-navy p-4 text-center font-black uppercase tracking-wider text-white">
                            A572 Gr.50 (max)
                          </th>
                          <th className="bg-bih-gray-100 p-4 font-bold uppercase tracking-wider text-bih-gray-500 hidden md:table-cell">
                            {t('steel.thSignificance')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chemicalValues.map((row) => (
                          <tr key={row.elemKey} className="border-t border-bih-gray-200">
                            <td className="p-4 font-bold text-bih-dark">{t(`steel.${row.elemKey}`)}</td>
                            <td className="p-4 text-center font-bold text-bih-dark">{row.q355}</td>
                            <td className="p-4 text-center font-bold text-bih-dark">{row.astm}</td>
                            <td className="p-4 text-xs text-bih-gray-500 hidden md:table-cell">{row.noteKey ? t(`steel.${row.noteKey}`) : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <CardContent className="bg-bih-gray-100 p-4">
                    <p className="text-xs text-bih-gray-500">
                      <strong>Note:</strong> {t('steel.chemNote')}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ===== Tab 3: 低温冲击（Charpy V-Notch） ===== */}
              <TabsContent value="charpy">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* 左侧：数据表 */}
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr>
                            <th className="bg-bih-gray-100 p-4 font-bold uppercase tracking-wider text-bih-gray-500">
                              {t('steel.thTestTemp')}
                            </th>
                            <th className="bg-bih-yellow p-4 text-center font-black uppercase tracking-wider text-bih-navy">
                              Q355
                            </th>
                            <th className="bg-bih-navy p-4 text-center font-black uppercase tracking-wider text-white">
                              A572 Gr.50
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {charpyData.map((row) => (
                            <tr
                              key={row.temp}
                              className={`border-t border-bih-gray-200 ${
                                row.highlight ? 'bg-bih-yellow/10' : ''
                              }`}
                            >
                              <td className="p-4 font-bold text-bih-dark">
                                {row.highlight && <Snowflake className="mr-1 inline h-4 w-4 text-bih-navy" />}
                                {row.temp}
                              </td>
                              <td className="p-4 text-center font-bold text-bih-dark">{row.q355}</td>
                              <td className="p-4 text-center font-bold text-bih-dark">{row.astm}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* 右侧：可视化条形图 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {t('steel.charpyTitle')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-6">
                        {/* Q355 条 */}
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-bih-navy">Q355D</span>
                            <span className="font-bold text-bih-navy">≥ 27J</span>
                          </div>
                          <div className="mt-2 h-8 w-full bg-bih-gray-200">
                            <div
                              className="h-full bg-bih-yellow transition-all duration-1000"
                              style={{ width: '85%' }}
                            />
                          </div>
                        </div>
                        {/* A572 条 */}
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-bih-navy">A572 Gr.50</span>
                            <span className="font-bold text-bih-navy">≥ 27J</span>
                          </div>
                          <div className="mt-2 h-8 w-full bg-bih-gray-200">
                            <div
                              className="h-full bg-bih-navy transition-all duration-1000"
                              style={{ width: '85%' }}
                            />
                          </div>
                        </div>
                        {/* Hardox 参考条 */}
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-bih-orange">Hardox 450 (wear plates)</span>
                            <span className="font-bold text-bih-orange">≥ 50J</span>
                          </div>
                          <div className="mt-2 h-8 w-full bg-bih-gray-200">
                            <div
                              className="h-full bg-bih-orange transition-all duration-1000"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>

                      <p className="mt-6 text-xs text-bih-gray-500">
                        {t('steel.charpyNote')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ===== Tab 4: 焊接性 ===== */}
              <TabsContent value="weldability">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-black uppercase tracking-tight text-bih-navy">
                        {t('steel.ceTitle')}
                      </h3>
                      <p className="mt-2 text-sm text-bih-gray-500 leading-relaxed">
                        {t('steel.ceDesc')}
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="border border-bih-gray-200 p-4 text-center">
                          <p className="text-2xl font-black text-bih-navy">≤ 0.45%</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-bih-gray-500">
                            Q355 CE (IIW)
                          </p>
                        </div>
                        <div className="border border-bih-gray-200 p-4 text-center">
                          <p className="text-2xl font-black text-bih-navy">≤ 0.45%</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-bih-gray-500">
                            A572 CE (IIW)
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-bih-gray-500">
                        {t('steel.ceNote')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-black uppercase tracking-tight text-bih-navy">
                        {t('steel.weldCompat')}
                      </h3>
                      <div className="mt-4 flex flex-col gap-3">
                        {[
                          { process: 'MIG/MAG (GMAW)', status: t('steel.fullyCompat') },
                          { process: 'Stick (SMAW)', status: t('steel.fullyCompat') },
                          { process: 'TIG (GTAW)', status: t('steel.fullyCompat') },
                          { process: 'Submerged Arc (SAW)', status: t('steel.fullyCompat') },
                          { process: 'Flux-Cored (FCAW)', status: t('steel.fullyCompat') },
                        ].map((item) => (
                          <div key={item.process} className="flex items-center justify-between gap-2 border-b border-bih-gray-200 pb-2">
                            <span className="text-sm font-bold text-bih-dark">{item.process}</span>
                            <Badge variant="yellow">{item.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* ===== Hardox 450 专区 ===== */}
      <section className="bg-bih-gray-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="orange" className="mb-4">
                <Shield className="mr-1 h-3 w-3" />
                {t('steel.dualBadge')}
              </Badge>
              <h2 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-4xl">
                {t('steel.dualTitle')}
              </h2>
              <p className="mt-6 text-bih-gray-500 leading-relaxed">
                {t('steel.dualDesc')}
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-bih-yellow text-sm font-black text-bih-navy">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-bih-navy">
                      {t('steel.layer1Title')}
                    </p>
                    <p className="mt-1 text-sm text-bih-gray-500">
                      {t('steel.layer1Desc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-bih-orange text-sm font-black text-white">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-bih-navy">
                      {t('steel.layer2Title')}
                    </p>
                    <p className="mt-1 text-sm text-bih-gray-500">
                      {t('steel.layer2Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardox 数据卡片 */}
            <Card className="border-2 border-bih-orange/30">
              <CardHeader className="bg-bih-orange/5">
                <CardTitle>{t('steel.hardoxTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {[
                    { prop: t('steel.hardoxHardness'), value: '~450 HBW', desc: t('steel.hardoxHardnessDesc') },
                    { prop: t('steel.hardoxTensile'), value: '~1400 MPa', desc: t('steel.hardoxTensileDesc') },
                    { prop: t('steel.hardoxCharpy'), value: '≥ 50J', desc: t('steel.hardoxCharpyDesc') },
                    { prop: t('steel.hardoxThickness'), value: '10–40 mm', desc: t('steel.hardoxThicknessDesc') },
                  ].map((item) => (
                    <div key={item.prop} className="flex items-center justify-between gap-3 border-b border-bih-gray-200 pb-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-bih-dark">{item.prop}</p>
                        <p className="text-xs text-bih-gray-500">{item.desc}</p>
                      </div>
                      <span className="shrink-0 text-lg font-black text-bih-navy">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-bih-gray-500">
                  {t('steel.hardoxNote')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-bih-navy py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white lg:text-3xl">
            {t('steel.ctaTitle')}
          </h2>
          <p className="mt-3 text-white/60">
            {t('steel.ctaSubtitle')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/about">
              <Button variant="primary" size="lg">
                {t('steel.ctaStory')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="#contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                {t('steel.ctaMTC')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
