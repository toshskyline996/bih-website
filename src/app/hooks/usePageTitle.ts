import { useEffect } from 'react';

export function usePageTitle(en: string, fr: string, lang: string) {
  useEffect(() => {
    const t = lang === 'fr' ? fr : en;
    document.title = `${t} | BIH — Boreal Iron Heavy`;
    return () => {
      document.title = 'BIH | Boreal Iron Heavy — Northern Heavy Equipment';
    };
  }, [en, fr, lang]);
}
