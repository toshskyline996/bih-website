import { Link } from 'react-router';
import { BIHLogoMark } from './BIHLogo';

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const isFr = lang === 'fr';
  const links = [
    { href: '/products', label: isFr ? 'Produits' : 'Products' },
    { href: '/steel-spec', label: isFr ? 'Spécs Acier' : 'Steel Spec' },
    { href: '/factory', label: isFr ? 'Notre Usine' : 'Factory' },
    { href: '/about', label: isFr ? 'Notre Histoire' : 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="w-full bg-[#111111]" style={{ padding: '48px 0 32px', fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10 pb-10"
          style={{ borderBottom: '1px solid #2a2a2a' }}
        >
          <Link to="/">
            <BIHLogoMark color="rgba(255,255,255,0.65)" width={60} />
          </Link>
          <nav className="flex flex-wrap gap-6 md:gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{ fontWeight: 300, fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.38)')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p style={{ fontWeight: 300, fontSize: '11px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>
              © 2026 Boreal Iron Heavy Inc. — borealironheavy.ca
            </p>
            <a
              href="mailto:info@borealironheavy.ca"
              style={{ fontWeight: 300, fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
            >
              info@borealironheavy.ca
            </a>
          </div>
          <p style={{ fontWeight: 300, fontSize: '11px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
            Shandong Manufacturing · ISO 9001 · CE · EN 474
          </p>
        </div>
      </div>
    </footer>
  );
}
