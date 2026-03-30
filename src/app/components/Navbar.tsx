import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { BIHLogoMark } from './BIHLogo';
import { useCartStore, selectTotalItems } from '../store/cartStore';

interface NavbarProps {
  lang: string;
  setLang: (l: string) => void;
}

export function Navbar({ lang, setLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isFr = lang === 'fr';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/products', label: isFr ? 'Produits' : 'Products' },
    { href: '/steel-spec', label: isFr ? 'Spécs Acier' : 'Steel Spec' },
    { href: '/about', label: isFr ? 'Notre Histoire' : 'About' },
    { href: '/contact', label: isFr ? 'Contact' : 'Contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled || !isHome ? 'rgba(255,255,255,0.95)' : 'rgba(15,15,15,0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled || !isHome ? '1px solid #eeeeee' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <BIHLogoMark color={isHome && !scrolled ? '#ffffff' : '#1a1a1a'} width={70} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.14em',
                color: isHome && !scrolled ? '#ffffff' : '#111111',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'opacity 0.2s',
                borderBottom: location.pathname === link.href ? `1.5px solid ${isHome && !scrolled ? '#ffffff' : '#111111'}` : 'none',
                paddingBottom: '2px',
              }}
              onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.5')}
              onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <CartBadge isLight={isHome && !scrolled} />

          {/* Lang Toggle */}
          <button
            onClick={() => setLang(isFr ? 'en' : 'fr')}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: isHome && !scrolled ? '#ffffff' : '#555555',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'opacity 0.2s',
              padding: 0,
            }}
          >
            {isFr ? 'EN' : 'FR'}
          </button>

          {/* CTA */}
          <Link
            to="/contact"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '11px',
              letterSpacing: '0.16em',
              padding: '9px 22px',
              border: `1.5px solid ${isHome && !scrolled ? '#ffffff' : '#333'}`,
              color: isHome && !scrolled ? '#ffffff' : '#333',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.25s',
              display: 'inline-block',
            }}
          >
            {isFr ? 'Devis' : 'Get Quote'}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <CartBadge isLight={isHome && !scrolled} />
          <button
            onClick={() => setLang(isFr ? 'en' : 'fr')}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.15em', color: isHome && !scrolled ? '#ffffff' : '#555555', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {isFr ? 'EN' : 'FR'}
          </button>
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isHome && !scrolled ? 'bg-white' : 'bg-[#111111]'} ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isHome && !scrolled ? 'bg-white' : 'bg-[#111111]'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isHome && !scrolled ? 'bg-white' : 'bg-[#111111]'} ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500 bg-white"
        style={{ maxHeight: menuOpen ? '400px' : '0' }}
      >
        <div className="px-8 py-6 flex flex-col gap-5 border-t border-[#eeeeee]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: '14px', letterSpacing: '0.12em', color: '#1a1a1a', textDecoration: 'none', textTransform: 'uppercase' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '12px', letterSpacing: '0.15em', padding: '12px 24px', border: '1.5px solid #333', color: '#333', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', display: 'block' }}
          >
            {isFr ? 'Demander un Devis' : 'Get Quote'}
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Cart badge component ─────────────────────────────────────────────────────
function CartBadge({ isLight }: { isLight: boolean }) {
  const totalItems = useCartStore(selectTotalItems);
  const color = isLight ? '#ffffff' : '#111111';
  return (
    <Link to="/cart" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', color }}>
      <ShoppingCart size={20} strokeWidth={1.5} />
      {totalItems > 0 && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-8px',
          minWidth: '16px', height: '16px', borderRadius: '8px',
          backgroundColor: '#FFC500', color: '#003366',
          fontSize: '9px', fontWeight: 700, display: 'flex',
          alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          padding: '0 3px',
        }}>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}