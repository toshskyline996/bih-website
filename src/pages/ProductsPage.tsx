import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { carriers, tonnageClasses } from '@/data/carriers';
import { categoryLabels, categoryLabelsFr, filterProducts, getLocalizedProduct } from '@/data/products';
import type { ProductCategory } from '@/data/products';
import type { TonnageClass } from '@/data/carriers';
import { SEO } from '@/components/seo/SEO';

/**
 * 产品列表页 + 兼容性筛选器
 * 
 * 3步引导流程：
 * Step 1 — 选载体品牌（CAT/JD/Komatsu/Kubota/Volvo/Hitachi/Bobcat）
 * Step 2 — 选吨位区间（Mini/Small/Medium/Large/Heavy）
 * Step 3 — 自动过滤显示适配属具
 */
export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const localizedCategoryLabels = i18n.language === 'fr' ? categoryLabelsFr : categoryLabels;
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
  const [selectedTonnage, setSelectedTonnage] = useState<TonnageClass | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>();

  /* 根据筛选条件过滤产品 */
  const filtered = filterProducts({
    category: selectedCategory,
    brandId: selectedBrand,
    tonnageClass: selectedTonnage,
  });

  /* 重置筛选 */
  const resetFilters = () => {
    setSelectedBrand(undefined);
    setSelectedTonnage(undefined);
    setSelectedCategory(undefined);
  };

  /* 当前选中品牌的型号列表（用于显示匹配的载体） */
  const selectedBrandData = carriers.find((c) => c.id === selectedBrand);
  const matchedModels = selectedBrandData?.models.filter(
    (m) => !selectedTonnage || m.tonnageClass === selectedTonnage
  );

  return (
    <>
      <SEO
        title="Heavy Equipment Attachments — Product Catalog"
        description="Browse factory-direct excavator buckets, hydraulic breakers, quick couplers, thumbs, rippers & earth augers. Filter by carrier brand and tonnage class. Q355 HSLA steel with Hardox 450 wear parts."
        keywords="excavator attachments Canada, Q355 HSLA steel excavator bucket, heavy duty excavator thumbs Canada, quick attach buckets Toronto, hydraulic breaker Canada, earth auger excavator"
        canonical="/products"
      />

      {/* ===== 页面 Hero ===== */}
      <section className="bg-bih-navy py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white lg:text-5xl">
            {t('nav.products')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            {t('products.subtitle')}
          </p>
        </div>
      </section>

      <section className="bg-bih-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

            {/* ===== 左侧筛选面板 ===== */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-bih-navy">
                  <Filter className="h-4 w-4" />
                  {t('products.filter')}
                </h2>
                {(selectedBrand || selectedTonnage || selectedCategory) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold uppercase text-bih-orange hover:underline"
                  >
                    {t('products.resetAll')}
                  </button>
                )}
              </div>

              {/* Step 1: 选择品牌 */}
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-bih-gray-500">
                    {t('products.step1')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {carriers.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(selectedBrand === brand.id ? undefined : brand.id)}
                        className={`border px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                          selectedBrand === brand.id
                            ? 'border-bih-yellow bg-bih-yellow/10 text-bih-navy'
                            : 'border-bih-gray-200 text-bih-gray-500 hover:border-bih-navy hover:text-bih-navy'
                        }`}
                      >
                        {brand.id === 'cat' ? 'CAT' : brand.name}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: 选择吨位 */}
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-bih-gray-500">
                    {t('products.step2')}
                  </p>
                  <div className="flex flex-col gap-2">
                    {(Object.entries(tonnageClasses) as [TonnageClass, typeof tonnageClasses[TonnageClass]][]).map(
                      ([key, val]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedTonnage(selectedTonnage === key ? undefined : key)}
                          className={`flex items-center justify-between border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                            selectedTonnage === key
                              ? 'border-bih-yellow bg-bih-yellow/10 text-bih-navy'
                              : 'border-bih-gray-200 text-bih-gray-500 hover:border-bih-navy hover:text-bih-navy'
                          }`}
                        >
                          <span>{val.label}</span>
                          <span className="text-bih-gray-300">{val.range}</span>
                        </button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: 产品类别（可选） */}
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-bih-gray-500">
                    {t('products.step3')}
                  </p>
                  <div className="flex flex-col gap-2">
                    {(Object.entries(localizedCategoryLabels) as [ProductCategory, string][]).map(
                      ([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedCategory(selectedCategory === key ? undefined : key)}
                          className={`border px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                            selectedCategory === key
                              ? 'border-bih-yellow bg-bih-yellow/10 text-bih-navy'
                              : 'border-bih-gray-200 text-bih-gray-500 hover:border-bih-navy hover:text-bih-navy'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 匹配的载体型号列表 */}
              {selectedBrandData && matchedModels && matchedModels.length > 0 && (
                <Card className="border-bih-yellow/50">
                  <CardContent className="p-4">
                    <p className="mb-3 text-xs font-black uppercase tracking-wider text-bih-navy">
                      {t('products.yourModels', { brand: selectedBrandData.name.split('(')[0].trim() })}
                    </p>
                    <div className="flex flex-col gap-1">
                      {matchedModels.map((m) => (
                        <div key={m.model} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-bih-dark">{m.model}</span>
                          <span className="text-bih-gray-500">{m.operatingWeight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ===== 右侧产品网格 ===== */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-bih-gray-500">
                  {t('products.found', { count: filtered.length })}
                  {selectedBrand && (
                    <> {t('products.forBrand')} <span className="font-bold text-bih-navy">{selectedBrandData?.name}</span></>
                  )}
                  {selectedTonnage && (
                    <> {t('products.inClass')} <span className="font-bold text-bih-navy">{tonnageClasses[selectedTonnage].label} ({tonnageClasses[selectedTonnage].range})</span></>
                  )}
                </p>
              </div>

              {filtered.length === 0 ? (
                <Card className="py-16 text-center">
                  <Search className="mx-auto h-12 w-12 text-bih-gray-300" />
                  <p className="mt-4 text-sm font-bold text-bih-gray-500">
                    {t('products.noResults')}
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 text-sm font-bold text-bih-navy underline"
                  >
                    {t('products.clearFilters')}
                  </button>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((rawProduct) => {
                    const product = getLocalizedProduct(rawProduct, i18n.language);
                    return (
                    <Card key={product.id} className="group flex flex-col overflow-hidden">
                      {/* 产品图占位 */}
                      <div className="aspect-4/3 bg-bih-gray-100 flex items-center justify-center">
                        <Package className="h-12 w-12 text-bih-gray-300" />
                      </div>
                      <CardContent className="flex flex-1 flex-col p-5">
                        <Badge variant="muted" className="mb-2 self-start">
                          {product.categoryLabel}
                        </Badge>
                        <h3 className="text-base font-black uppercase tracking-tight text-bih-navy">
                          {product.name}
                        </h3>
                        <p className="mt-2 flex-1 text-xs text-bih-gray-500 line-clamp-2">
                          {product.description}
                        </p>

                        {/* 适配吨位 + 材质标签 */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <Badge variant="yellow" className="text-[10px]">
                            {product.tonnageRange[0]}–{product.tonnageRange[1]}T
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {product.material.body}
                          </Badge>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 flex gap-2">
                          <Link to={`/products/${product.slug}`} className="flex-1">
                            <Button variant="secondary" size="sm" className="w-full text-xs">
                              {t('products.viewDetails')}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
