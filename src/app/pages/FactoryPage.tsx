import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import { Ship, Factory, Award, Anchor, ArrowRight } from 'lucide-react';

const IL = { fontFamily: "'Inter', sans-serif" };

const milestones = [
  {
    year: '2003',
    en: 'Shandong facility founded — 12,000 m² initial production floor, focused on standard structural steel fabrication.',
    fr: 'Fondation de l\'installation du Shandong — 12 000 m² de surface initiale, fabrication acier structural standard.',
  },
  {
    year: '2008',
    en: 'ISO 9001 certification achieved. CNC plasma cutting lines commissioned — tolerances within ±0.5 mm.',
    fr: 'Certification ISO 9001 obtenue. Lignes de découpe plasma CNC installées — tolérances à ±0.5 mm.',
  },
  {
    year: '2012',
    en: '6-axis robotic welding cells deployed. Annual export volume exceeds 1,000 units. Entry into Canadian and Australian markets.',
    fr: 'Cellules de soudage robotisé 6 axes déployées. Volume d\'exportation dépasse 1 000 unités. Entrée sur les marchés canadiens et australiens.',
  },
  {
    year: '2016',
    en: '450 HBW wear plate integration across all product lines. CE certification achieved for full attachment range.',
    fr: 'Intégration plaques d\'usure 450 HBW sur toutes les gammes. Certification CE obtenue pour la gamme complète.',
  },
  {
    year: '2020',
    en: 'Production floor expanded to 60,000 m². Ultrasonic weld inspection system fully operational across all structural lines.',
    fr: 'Atelier agrandi à 60 000 m². Système d\'inspection ultrasonique des soudures opérationnel sur toutes les lignes structurelles.',
  },
  {
    year: '2024',
    en: 'Boreal Iron Heavy Inc. incorporated in Canada. Direct B2B channel launched — borealironheavy.ca. FOB Qingdao/Yantai to Canadian ports.',
    fr: 'Boreal Iron Heavy Inc. incorporée au Canada. Canal B2B direct lancé. FOB Qingdao/Yantai vers les ports canadiens.',
  },
];

const capabilities = [
  {
    icon: Factory,
    en: '60,000 m² Production Floor',
    fr: '60 000 m² Atelier',
    descEn: 'One of Shandong\'s largest dedicated heavy attachment manufacturing facilities. Robotic welding, CNC plasma, and ultrasonic inspection under one roof.',
    descFr: 'L\'un des plus grands ateliers de fabrication d\'accessoires lourds du Shandong. Soudage robotisé, plasma CNC et inspection ultrasonique sous un même toit.',
  },
  {
    icon: Award,
    en: 'ISO 9001 · CE · EN 474',
    fr: 'ISO 9001 · CE · EN 474',
    descEn: 'ISO 9001 certified quality system with documented incoming material inspection. CE Declaration of Conformity available upon request for all attachment product lines.',
    descFr: 'Système qualité ISO 9001 avec inspection des matières entrantes documentée. Déclaration de conformité CE disponible sur demande pour toutes les gammes de produits.',
  },
  {
    icon: Ship,
    en: '6–10 Week FOB Lead Time',
    fr: 'Délai FOB 6–10 Semaines',
    descEn: 'Direct factory-to-port logistics via Yantai / Qingdao ports on the "Belt and Road" network. 23 direct breakbulk lines to North America, Europe, and Africa.',
    descFr: 'Logistique directe usine-port via Yantai/Qingdao. 23 lignes directes breakbulk vers l\'Amérique du Nord, l\'Europe et l\'Afrique.',
  },
  {
    icon: Anchor,
    en: 'Yantai Port — Key Export Node',
    fr: 'Port de Yantai — Nœud d\'Export',
    descEn: 'Yantai Port: 35 specialized breakbulk berths, 9.72M m² warehouse area, 200,000-ton ship capacity. Designated "China-Africa Logistics Golden Channel" port.',
    descFr: 'Port de Yantai : 35 postes spécialisés breakbulk, 9,72 M m² d\'entrepôt, capacité 200 000 tonnes. Port désigné "Canal Logistique Doré Chine-Afrique".',
  },
];

const exportRoute = [
  { step: '01', en: 'Shandong Factory', fr: 'Usine Shandong', sub: 'Q355 + 450 HBW fabrication' },
  { step: '02', en: 'Yantai / Qingdao Port', fr: 'Port Yantai / Qingdao', sub: 'FOB loading · Belt & Road hub' },
  { step: '03', en: 'Trans-Pacific Shipping', fr: 'Transport Transpacifique', sub: '~18–22 days · breakbulk or FCL' },
  { step: '04', en: 'Vancouver / Prince Rupert', fr: 'Vancouver / Prince Rupert', sub: 'Canadian port clearance' },
  { step: '05', en: 'Your Job Site', fr: 'Votre Chantier', sub: 'Alberta · BC · Saskatchewan · ON' },
];

export function FactoryPage({ lang = 'en' }: { lang?: string }) {
  const isFr = lang === 'fr';
  usePageTitle(
    'Shandong Manufacturing Hub — Direct to Canada',
    'Centre de Fabrication Shandong — Direct au Canada',
    lang,
  );

  return (
    <div style={IL}>
      {/* ── Hero ── */}
      <section style={{ backgroundColor: '#111', padding: '80px 0 72px', position: 'relative', overflow: 'hidden' }}>
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-end justify-end pr-8 pb-4 select-none pointer-events-none"
          style={{
            fontSize: 'clamp(120px, 25vw, 360px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
            lineHeight: 1,
          }}
        >
          山东
        </div>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 relative z-10">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
            {isFr ? 'Source de Fabrication · Province du Shandong, CN' : 'Manufacturing Source · Shandong Province, CN'}
          </p>
          <h1 style={{ fontSize: 'clamp(30px, 5.5vw, 72px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.0, maxWidth: '780px', marginBottom: '24px' }}>
            {isFr
              ? 'De l\'Usine\nShandong à\nVotre Chantier'
              : 'From Shandong\nFactory to\nYour Job Site'}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, maxWidth: '520px', lineHeight: 1.85 }}>
            {isFr
              ? "BIH opère depuis l'une des zones de fabrication d'équipements lourds les plus avancées au monde — la province du Shandong, CN. 60 000 m² d'atelier, soudage robotisé, et accès direct aux corridors logistiques mondiaux de Yantai."
              : "BIH operates from one of the world's most advanced heavy equipment manufacturing regions — Shandong Province, CN. 60,000 m² facility, robotic welding lines, and direct access to global logistics corridors through Yantai Port."}
          </p>
          <div className="flex gap-4 flex-wrap mt-10">
            <Link to="/products" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 32px', backgroundColor: '#fff', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
              {isFr ? 'Voir les Produits' : 'Browse Products'}
            </Link>
            <Link to="/contact" style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.18em', padding: '14px 32px', border: '1.5px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
              {isFr ? 'Demander un Devis' : 'Request Quote'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Capacity Stats ── */}
      <section style={{ backgroundColor: '#ffc500', padding: '40px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '60,000 m²', label: isFr ? 'Surface d\'Atelier' : 'Production Floor' },
              { val: '35', label: isFr ? 'Postes Port Yantai' : 'Yantai Berths' },
              { val: '23', label: isFr ? 'Lignes Export Directes' : 'Direct Shipping Lines' },
              { val: '1.8M T', label: isFr ? 'Équip. Exporté / An' : 'Equipment Exported / Yr' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '10px', fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(26,26,26,0.55)', textTransform: 'uppercase', marginTop: '8px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section style={{ backgroundColor: '#fff', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '10px' }}>
            {isFr ? '01 — Capacités de Fabrication' : '01 — Manufacturing Capabilities'}
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '56px', maxWidth: '600px' }}>
            {isFr ? 'Infrastructure\nde Classe Mondiale' : 'World-Class\nInfrastructure'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.en} className="flex flex-col">
                <div style={{ width: '44px', height: '44px', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', flexShrink: 0 }}>
                  <cap.icon size={20} color="#ffc500" />
                </div>
                <h3 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.04em', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {isFr ? cap.fr : cap.en}
                </h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8, fontWeight: 300, flexGrow: 1 }}>
                  {isFr ? cap.descFr : cap.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Export Route ── */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '10px' }}>
            {isFr ? '02 — Chaîne Logistique' : '02 — Supply Chain'}
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '56px', maxWidth: '600px' }}>
            {isFr ? 'Shandong vers\nle Canada —\nZéro Intermédiaire' : 'Shandong to\nCanada —\nZero Middlemen'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {exportRoute.map((node, i) => (
              <div key={node.step} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0" style={{ position: 'relative' }}>
                {/* Connector line for desktop */}
                {i < exportRoute.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-0 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                )}
                <div style={{ width: '40px', height: '40px', backgroundColor: i === exportRoute.length - 1 ? '#ffc500' : 'rgba(255,255,255,0.08)', border: `1px solid ${i === exportRoute.length - 1 ? '#ffc500' : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: i === exportRoute.length - 1 ? '#1a1a1a' : 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{node.step}</span>
                </div>
                <div className="md:mt-4 md:text-center">
                  <p style={{ fontSize: '12px', fontWeight: 700, color: i === exportRoute.length - 1 ? '#ffc500' : '#fff', letterSpacing: '0.04em', lineHeight: 1.3, marginBottom: '4px' }}>
                    {isFr ? node.fr : node.en}
                  </p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 300, letterSpacing: '0.06em' }}>{node.sub}</p>
                </div>
                {/* Connector for mobile */}
                {i < exportRoute.length - 1 && (
                  <div className="md:hidden" style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.12)', marginLeft: '19px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-16 pt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: isFr ? 'Délai FOB Qingdao/Yantai' : 'FOB Qingdao / Yantai', val: '6–10 Weeks' },
                { label: isFr ? 'Transit Transpacifique' : 'Trans-Pacific Transit', val: '~18–22 Days' },
                { label: isFr ? 'Destinations Canadiennes' : 'Canadian Destinations', val: 'Vancouver · Prince Rupert · Halifax' },
              ].map((item) => (
                <div key={item.label} style={{ borderLeft: '2px solid rgba(255,255,255,0.12)', paddingLeft: '20px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '6px' }}>{item.label}</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Yantai Port Story ── */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
                {isFr ? '03 — Port de Yantai' : '03 — Yantai Port'}
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '20px' }}>
                {isFr ? 'La Porte\nd\'Export de\nl\'Équipement Lourd' : 'China\'s Premier\nHeavy Equipment\nExport Gateway'}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9, marginBottom: '16px' }}>
                {isFr
                  ? "Le port de Yantai est l'un des 15 ports clés du programme national \"Ceinture et Route\" de la Chine et le premier port commercial avec l'Afrique. Il traite plus de 1,8 million de tonnes d'équipements de haute technologie par an, avec une croissance de 70% en glissement annuel."
                  : "Yantai Port is one of China's 15 key ports under the national Belt and Road initiative and China's first port for trade with Africa. It handles over 1.8 million tonnes of high-end equipment annually — with 70% year-on-year growth in breakbulk equipment exports."}
              </p>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9 }}>
                {isFr
                  ? "Avec son système \"smart tally + smart stowage\" propriétaire, Yantai traite les équipements lourds jusqu'à 500 tonnes pièce, avec des berths d'eau profonde capables d'accueillir des navires de 200 000 tonnes."
                  : "With its proprietary \"smart tally + smart stowage\" system, Yantai handles single pieces up to 500 tonnes, with deep-water berths capable of receiving 200,000-tonne vessels — ensuring your attachments ship efficiently and arrive on schedule."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '35', label: isFr ? 'Postes Breakbulk' : 'Breakbulk Berths', sub: isFr ? 'Dont 34 x 10 000+ tonnes' : 'incl. 34 × 10,000T+' },
                { val: '9.72M m²', label: isFr ? 'Zone Entrepôt' : 'Warehouse Area', sub: isFr ? 'Stockage couvert et découvert' : 'Covered + open storage' },
                { val: '23', label: isFr ? 'Lignes Directes' : 'Direct Routes', sub: isFr ? 'Afrique, Amér. N., Europe, Asie' : 'Africa, N.America, Europe, SE Asia' },
                { val: '500T', label: isFr ? 'Pièce Max' : 'Max Single Piece', sub: isFr ? 'Levage indépendant' : 'Independent hoisting' },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: '#fff', border: '1px solid #ebebeb', padding: '24px 20px' }}>
                  <p style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '6px' }}>{s.val}</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '10px', color: '#aaa', fontWeight: 300, letterSpacing: '0.05em' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Factory Timeline ── */}
      <section style={{ backgroundColor: '#fff', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '10px' }}>
            {isFr ? '04 — Chronologie de l\'Usine' : '04 — Facility Timeline'}
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '56px' }}>
            {isFr ? '20 Ans de\nFabrication Continue' : '20 Years of\nContinuous Manufacturing'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                style={{
                  padding: '32px 28px',
                  borderBottom: '1px solid #ebebeb',
                  borderRight: i % 3 < 2 ? '1px solid #ebebeb' : 'none',
                  backgroundColor: i === milestones.length - 1 ? '#f9f9f9' : 'transparent',
                }}
              >
                <p style={{ fontSize: '28px', fontWeight: 900, color: '#ffc500', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '10px' }}>{m.year}</p>
                <p style={{ fontSize: '13px', color: '#444', fontWeight: 300, lineHeight: 1.75 }}>{isFr ? m.fr : m.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
                {isFr ? 'Accès Direct Usine' : 'Factory Direct Access'}
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '16px' }}>
                {isFr ? 'Achetez Directement\nde la Source' : 'Buy Direct\nFrom the Source'}
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.85, maxWidth: '420px' }}>
                {isFr
                  ? "Aucun distributeur, aucun intermédiaire. Commandez directement depuis notre usine Shandong avec expédition FOB Qingdao/Yantai et livraison à votre site canadien."
                  : "No distributors, no middlemen. Order directly from our Shandong facility with FOB Qingdao/Yantai shipping and delivery tracked to your Canadian job site."}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="/products"
                className="flex items-center justify-between"
                style={{ padding: '20px 24px', backgroundColor: '#fff', color: '#1a1a1a', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.9')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{isFr ? 'Parcourir les Produits' : 'Browse Products'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/steel-spec"
                className="flex items-center justify-between"
                style={{ padding: '20px 24px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              >
                <span style={{ fontSize: '13px', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{isFr ? 'Spécifications Acier' : 'Steel Specifications'}</span>
                <ArrowRight size={16} color="rgba(255,255,255,0.4)" />
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between"
                style={{ padding: '20px 24px', backgroundColor: 'rgba(255,197,0,0.08)', border: '1px solid rgba(255,197,0,0.25)', color: '#ffc500', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,197,0,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,197,0,0.08)'; }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{isFr ? 'Demander un Devis' : 'Request a Quote'}</span>
                <ArrowRight size={16} color="#ffc500" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
