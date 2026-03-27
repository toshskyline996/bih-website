import { Helmet } from 'react-helmet-async';

/**
 * SEO 组件 — 每个页面独立配置 meta 标签
 * 
 * 为什么用 react-helmet-async：
 * 支持异步渲染，避免 SSR/预渲染时的 race condition
 * 每个页面通过 props 注入独立的 title / description / keywords
 * 
 * JSON-LD 和常量函数放在 json-ld.ts 中（Fast Refresh 要求）
 */

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object;
}

const SITE_NAME = 'Boreal Iron Heavy';
const SITE_URL = 'https://borealironheavy.ca';
const DEFAULT_OG_IMAGE = '/og-default.png';

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const ogImageUrl = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Geo & Language */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Oshawa" />

      {/* JSON-LD 结构化数据 */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
