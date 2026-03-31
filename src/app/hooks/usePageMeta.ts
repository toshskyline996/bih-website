import { useEffect } from 'react';

interface PageMetaOpts {
  title: string;
  description: string;
  url?: string;
}

function setMetaContent(selector: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', value);
}

export function usePageMeta({ title, description, url }: PageMetaOpts) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    const prevOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '';
    const prevOgDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '';
    const prevCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    const prevOgUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '';

    const fullTitle = `${title} | BIH`;
    document.title = fullTitle;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', description);

    if (url) {
      setMetaContent('meta[property="og:url"]', url);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', url);
    }

    return () => {
      document.title = prevTitle;
      setMetaContent('meta[name="description"]', prevDesc);
      setMetaContent('meta[property="og:title"]', prevOgTitle);
      setMetaContent('meta[property="og:description"]', prevOgDesc);
      if (url) {
        setMetaContent('meta[property="og:url"]', prevOgUrl);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', prevCanonical);
      }
    };
  }, [title, description, url]);
}
