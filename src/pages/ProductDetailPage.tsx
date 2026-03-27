import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  Download,
  Camera,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { QuoteModal } from '@/components/forms/QuoteModal';
import { getProductBySlug, getLocalizedProduct } from '@/data/products';
import { carriers } from '@/data/carriers';
import { SEO } from '@/components/seo/SEO';
import { productJsonLd } from '@/components/seo/json-ld';

/**
 * 产品详情页 (PDP) 模板
 * 
 * 设计意图：
 * - 多角度图片画廊（暂用占位符）
 * - 技术规格表含 Q355 + Hardox 450 材质声明
 * - CE/ISO 证书下载入口（占位链接）
 * - 焊缝细节特写区（占位图片）
 * - 全部走 Get Quote 模式
 */
export function ProductDetailPage() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const rawProduct = slug ? getProductBySlug(slug) : undefined;
  const product = rawProduct ? getLocalizedProduct(rawProduct, i18n.language) : undefined;
  const [quoteOpen, setQuoteOpen] = useState(false);

  /* 404 处理 */
  if (!product) {
    return (
      <section className="bg-bih-white py-32 text-center">
        <Package className="mx-auto h-16 w-16 text-bih-gray-300" />
        <h1 className="mt-6 text-2xl font-black uppercase text-bih-navy">{t('pdp.notFound')}</h1>
        <p className="mt-2 text-bih-gray-500">{t('pdp.notFoundDesc')}</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button variant="primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('pdp.backToProducts')}
          </Button>
        </Link>
      </section>
    );
  }

  /* 兼容品牌名称 */
  const compatBrandNames = product.compatibleBrands.map((id) => {
    const brand = carriers.find((c) => c.id === id);
    return brand?.name ?? id;
  });

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.categoryLabel}, excavator attachment Canada, ${product.material.body}, ${product.material.wearParts}`}
        canonical={`/products/${product.slug}`}
        ogType="product"
        jsonLd={productJsonLd(product)}
      />

      {/* ===== 面包屑 ===== */}
      <section className="bg-bih-navy py-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/60">
            <Link to="/" className="hover:text-bih-yellow">{t('pdp.breadcrumbHome')}</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-bih-yellow">{t('pdp.breadcrumbProducts')}</Link>
            <span>/</span>
            <span className="text-white/90">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* ===== 主内容 ===== */}
      <section className="bg-bih-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">

            {/* ===== 左侧：图片画廊 ===== */}
            <div>
              {/* 主图占位 */}
              <div className="aspect-square border-2 border-dashed border-bih-navy/20 bg-bih-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <Camera className="mx-auto h-16 w-16 text-bih-gray-300" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-wider text-bih-gray-400">
                    {t('pdp.productPhoto')}
                  </p>
                  <p className="mt-1 text-xs text-bih-gray-500">
                    {t('pdp.photoPlaceholder')}
                  </p>
                </div>
              </div>

              {/* 缩略图行 */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[t('pdp.thumbFront'), t('pdp.thumbSide'), t('pdp.thumbDetail'), t('pdp.thumbWeld')].map((label) => (
                  <div
                    key={label}
                    className="aspect-square border border-dashed border-bih-gray-200 bg-bih-gray-100 flex items-center justify-center"
                  >
                    <p className="text-[9px] font-bold uppercase text-bih-gray-400 text-center px-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* 焊缝特写区 */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">{t('pdp.weldCloseUp')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video border border-dashed border-bih-gray-200 bg-bih-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="mx-auto h-8 w-8 text-bih-gray-300" />
                      <p className="mt-2 text-xs text-bih-gray-400">
                        {t('pdp.weldDesc')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ===== 右侧：产品信息 ===== */}
            <div>
              <Badge variant="muted" className="mb-3">
                {product.categoryLabel}
              </Badge>

              <h1 className="text-3xl font-black uppercase tracking-tight text-bih-navy lg:text-4xl">
                {product.name}
              </h1>

              {/* 认证标识 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {product.certificates.map((cert) => (
                  <Badge key={cert} variant="yellow">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
                <Badge variant="outline">
                  {product.tonnageRange[0]}–{product.tonnageRange[1]}T Class
                </Badge>
              </div>

              {/* 描述 */}
              <p className="mt-6 text-bih-gray-500 leading-relaxed">
                {product.description}
              </p>

              {/* 特性列表 */}
              <div className="mt-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-bih-navy">{t('pdp.keyFeatures')}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-bih-gray-500">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-bih-yellow-dark" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 材质声明 */}
              <Card className="mt-6 border-bih-yellow/30">
                <CardContent className="p-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-bih-navy">
                    {t('pdp.materialDeclaration')}
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="border border-bih-gray-200 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-bih-gray-500">
                        {t('pdp.structuralBody')}
                      </p>
                      <p className="mt-1 text-sm font-black text-bih-navy">
                        {product.material.body}
                      </p>
                    </div>
                    <div className="border border-bih-orange/30 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-bih-gray-500">
                        {t('pdp.wearParts')}
                      </p>
                      <p className="mt-1 text-sm font-black text-bih-orange">
                        {product.material.wearParts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA — Get Quote */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" size="lg" className="flex-1" onClick={() => setQuoteOpen(true)}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t('pdp.getQuote')}
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  {t('pdp.downloadSpecs')}
                </Button>
              </div>

              {/* 证书下载 */}
              <div className="mt-6 flex flex-wrap gap-3">
                {product.certificates.map((cert) => (
                  <a
                    key={cert}
                    href="#"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-bih-navy hover:text-bih-yellow-dark"
                  >
                    <Download className="h-3 w-3" />
                    {t('pdp.certPdf', { cert })}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ===== 技术规格表 ===== */}
          <div className="mt-16">
            <h2 className="text-2xl font-black uppercase tracking-tight text-bih-navy">
              {t('pdp.techSpecs')}
            </h2>
            <Card className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="bg-bih-navy p-4 font-black uppercase tracking-wider text-white w-1/3">
                        {t('pdp.parameter')}
                      </th>
                      <th className="bg-bih-navy p-4 font-black uppercase tracking-wider text-white">
                        {t('pdp.value')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-t border-bih-gray-200">
                        <td className="p-4 font-bold text-bih-dark">{key}</td>
                        <td className="p-4 text-bih-gray-500">{value}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-bih-gray-200 bg-bih-yellow/5">
                      <td className="p-4 font-bold text-bih-dark">{t('pdp.structuralMaterial')}</td>
                      <td className="p-4 font-bold text-bih-navy">{product.material.body}</td>
                    </tr>
                    <tr className="border-t border-bih-gray-200 bg-bih-orange/5">
                      <td className="p-4 font-bold text-bih-dark">{t('pdp.wearPartMaterial')}</td>
                      <td className="p-4 font-bold text-bih-orange">{product.material.wearParts}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ===== 兼容载体 ===== */}
          <div className="mt-16">
            <h2 className="text-2xl font-black uppercase tracking-tight text-bih-navy">
              {t('pdp.compatibleCarriers')}
            </h2>
            <p className="mt-2 text-sm text-bih-gray-500">
              {t('pdp.compatibleDesc', { min: product.tonnageRange[0], max: product.tonnageRange[1] })}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {compatBrandNames.map((name) => (
                <div key={name} className="flex items-center gap-2 border border-bih-gray-200 p-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-bih-yellow-dark" />
                  <span className="text-sm font-bold text-bih-navy">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA 条 ===== */}
      <section className="bg-bih-yellow py-10">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-xl font-black uppercase tracking-tight text-bih-navy lg:text-2xl">
            {t('pdp.ctaTitle')}
          </h2>
          <p className="mt-2 text-sm text-bih-navy/70">
            {t('pdp.ctaDesc')}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/products">
              <Button variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('pdp.backToAll')}
              </Button>
            </Link>
            <Button variant="outline" className="border-bih-navy" onClick={() => setQuoteOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('pdp.requestCheck')}
            </Button>
          </div>
        </div>
      </section>

      {/* 询价模态弹窗 */}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} product={product} />
    </>
  );
}
