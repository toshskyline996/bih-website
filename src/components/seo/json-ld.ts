/**
 * JSON-LD 结构化数据工具函数
 * 
 * 为什么独立文件：React Fast Refresh 要求组件文件只导出组件
 * 常量和工具函数需要放在单独文件中
 */

/**
 * Organization JSON-LD — 全站级结构化数据
 * 放在首页，帮助 Google 识别 BIH 的企业信息
 */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Boreal Iron Heavy',
  url: 'https://borealironheavy.ca',
  logo: 'https://borealironheavy.ca/logo.svg',
  description:
    'Factory-direct heavy equipment attachments for excavators. Q355 HSLA steel bodies with Hardox 450 wear parts. Serving all Canadian provinces.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '',
    addressLocality: 'Oshawa',
    addressRegion: 'ON',
    postalCode: 'L1H 4L3',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-905-000-0000',
    contactType: 'sales',
    areaServed: 'CA',
    availableLanguage: ['English', 'French'],
  },
  sameAs: [],
};

/**
 * 生成 Product JSON-LD — 每个产品详情页使用
 */
export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  category: string;
  material: { body: string; wearParts: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `https://borealironheavy.ca/products/${product.slug}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Boreal Iron Heavy',
    },
    material: `${product.material.body} body, ${product.material.wearParts} wear parts`,
    manufacturer: {
      '@type': 'Organization',
      name: 'Boreal Iron Heavy',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CAD',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      url: `https://borealironheavy.ca/products/${product.slug}`,
    },
  };
}
