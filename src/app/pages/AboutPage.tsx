import { Link } from 'react-router';
import { Factory, Shield, Wrench, CheckCircle, Award, Globe } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const IL = { fontFamily: "'Inter', sans-serif" };

const timeline = [
  { year: '2003', en: 'Manufacturing facility established in Shandong Province, China. Initial focus on standard excavator buckets.', fr: 'Création de l\'installation de fabrication dans la province du Shandong. Focus initial sur les godets standard.' },
  { year: '2008', en: 'ISO 9001 certification achieved. CNC plasma cutting lines introduced for precision fabrication.', fr: 'Certification ISO 9001 obtenue. Lignes de découpe plasma CNC introduites pour une fabrication de précision.' },
  { year: '2012', en: 'Robotic welding cell deployment. Export volume exceeds 1,000 units annually. Entry into Australian and Canadian markets.', fr: 'Déploiement de cellules de soudage robotisé. Volume d\'exportation dépasse 1 000 unités annuelles.' },
  { year: '2016', en: '450 HBW wear plate integration across all product lines. CE certification for all attachments.', fr: 'Intégration des plaques d\'usure 450 HBW dans toutes les gammes. Certification CE pour toutes les pièces jointes.' },
  { year: '2020', en: 'Production floor expanded to 60,000 m². Full ultrasonic weld inspection system operational.', fr: 'Atelier de production agrandi à 60 000 m². Système complet d\'inspection ultrasonique des soudures opérationnel.' },
  { year: '2024', en: 'Boreal Iron Heavy Inc. incorporated in Canada. Direct-to-Canada channel launched — borealironheavy.ca', fr: 'Boreal Iron Heavy Inc. incorporée au Canada. Canal direct vers le Canada lancé — borealironheavy.ca' },
];

const qualitySteps = [
  { icon: Shield, step: '01', title: 'Verified Steel Grade', titleFr: 'Grade Acier Vérifié', desc: 'Q355 HSLA structural steel per GB/T 1591 — equivalent to European S355/EN 10025. All incoming steel verified through our ISO 9001-governed material inspection process.', descFr: 'Acier structural Q355 HSLA selon GB/T 1591 — équivalent à l\'européen S355/EN 10025. Tout l\'acier entrant est vérifié selon notre processus d\'inspection ISO 9001.' },
  { icon: Wrench, step: '02', title: 'Robotic Welding', titleFr: 'Soudage Robotisé', desc: 'All structural welds performed by 6-axis robots following AWS D1.1 procedures. Zero-defect welding on critical load-bearing joints.', descFr: 'Toutes les soudures structurelles effectuées par des robots 6 axes selon les procédures AWS D1.1.' },
  { icon: CheckCircle, step: '03', title: 'Ultrasonic Inspection', titleFr: 'Inspection Ultrasonique', desc: 'Post-weld ultrasonic testing (UT) on all primary structural welds. Weld inspection conducted per ISO 9001 documented quality procedures.', descFr: 'Tests ultrasoniques post-soudage sur toutes les soudures structurelles primaires. Inspection selon les procédures qualité ISO 9001.' },
  { icon: Award, step: '04', title: 'Load & Impact Test', titleFr: 'Test de Charge et d\'Impact', desc: 'Destructive and non-destructive testing per ISO 7438. Cold impact tests at −40°C for Canadian climate certification.', descFr: 'Tests destructifs et non destructifs selon ISO 7438. Tests d\'impact à froid à −40°C.' },
];

export function AboutPage({ lang = 'en' }: { lang?: string }) {
  const isFr = lang === 'fr';
  usePageTitle('About — 20 Years of Heavy Manufacturing', 'À Propos — 20 Ans de Fabrication Lourde', lang);

  return (
    <div style={IL}>
      {/* Hero */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0 70px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Globe size={12} color="rgba(255,255,255,0.4)" />
            <p style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 300 }}>
              {isFr ? 'Centre de Fabrication Mondial' : 'Global Manufacturing Hub'}
            </p>
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5.5vw, 72px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.02, maxWidth: '700px' }}>
            {isFr ? '20 Ans de\nFabrication\nLourde' : '20 Years of\nHeavy-Duty\nManufacturing'}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, marginTop: '24px', maxWidth: '520px', lineHeight: 1.8 }}>
            {isFr
              ? "Notre installation Shandong est l'un des centres de fabrication d'équipements lourds les plus avancés en Asie — 60 000 m² de capacité de production, robots de soudage, et inspection ultrasonique."
              : 'Our Shandong facility is one of Asia\'s most advanced heavy equipment manufacturing hubs — 60,000 m² of production capacity, robotic welding lines, and ultrasonic weld inspection.'}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: '#ffc500', padding: '36px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '20+', label: isFr ? 'Années' : 'Years' },
              { val: '5,000+', label: isFr ? 'Unités Exportées' : 'Units Exported' },
              { val: '50+', label: isFr ? 'Pays Clients' : 'Countries Served' },
              { val: '60,000m²', label: isFr ? 'Atelier de Production' : 'Production Floor' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '10px', fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(26,26,26,0.55)', textTransform: 'uppercase', marginTop: '6px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory Section */}
      <section style={{ backgroundColor: '#fff', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <div style={{ position: 'relative' }}>
              <div style={{ backgroundColor: '#f0f0f0', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '60px 40px', aspectRatio: '4/3' }}>
                <Factory size={48} color="#bbb" />
                <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase', fontWeight: 300, textAlign: 'center' }}>
                  {isFr ? 'Photos de l\'atelier Shandong' : 'Shandong Facility Photos'}
                </p>
                <p style={{ fontSize: '11px', color: '#ccc', fontWeight: 300, textAlign: 'center' }}>
                  {isFr ? 'Disponible sur demande' : 'Available upon request'}
                </p>
              </div>
              <div style={{ position: 'absolute', bottom: '-12px', right: '-12px', backgroundColor: '#1a1a1a', padding: '16px 20px' }}>
                <p style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 900, color: '#ffc500', lineHeight: 1 }}>60,000 m²</p>
                <p style={{ fontSize: '9px', fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginTop: '4px' }}>
                  {isFr ? 'Atelier de Production' : 'Production Floor'}
                </p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
                {isFr ? '01 — L\'Atelier' : '01 — The Facility'}
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '24px' }}>
                {isFr ? 'Ingénierie de\nPrécision à\nl\'Échelle Mondiale' : 'Precision\nEngineering at\nGlobal Scale'}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.9, fontWeight: 300, marginBottom: '16px' }}>
                {isFr
                  ? "Notre installation Shandong emploie plus de 600 spécialistes en fabrication. Chaque pièce jointe passe par un flux de production strict : découpe CNC, formage, soudage robotisé, sablage, revêtement époxydique et contrôle qualité final."
                  : "Our Shandong facility employs 600+ manufacturing specialists. Every attachment passes through a strict production flow: CNC plasma cutting, forming, robotic welding, shot blasting, epoxy coating, and final quality control."}
              </p>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.9, fontWeight: 300, marginBottom: '28px' }}>
                {isFr
                  ? "Nous utilisons de l'acier Q355 HSLA pour les corps structuraux et des plaques d'usure 450 HBW pour les zones à forte abrasion, garantissant une durée de vie supérieure dans les conditions canadiennes difficiles."
                  : "Q355 HSLA structural steel for bodies, 450 HBW wear plate for high-abrasion zones — engineered for superior service life in demanding Canadian conditions."}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  isFr ? 'Découpe Plasma CNC' : 'CNC Plasma Cutting',
                  isFr ? 'Soudage Robotisé 6-Axes' : '6-Axis Robotic Welding',
                  isFr ? 'Alésage CNC' : 'CNC Boring / Machining',
                  isFr ? 'Traitement Thermique' : 'Heat Treatment',
                  isFr ? 'Sablage + Époxy' : 'Shot Blast + Epoxy Coat',
                  isFr ? 'Inspection Ultrasonique' : 'Ultrasonic WT Inspection',
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2">
                    <CheckCircle size={13} color="#ffc500" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#333', fontWeight: 400 }}>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
            {isFr ? '02 — Assurance Qualité' : '02 — Quality Assurance'}
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '12px' }}>
            {isFr ? '4 Étapes de Contrôle' : '4-Stage Quality Control'}
          </h2>
          <p style={{ fontSize: '14px', color: '#777', fontWeight: 300, lineHeight: 1.8, maxWidth: '520px', marginBottom: '56px' }}>
            {isFr
              ? "Chaque unité est soumise à notre processus de contrôle qualité en 4 étapes — de la réception des matières premières à l'expédition finale."
              : "Every unit goes through our 4-stage QC process — from raw material receipt to final shipment."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualitySteps.map((step) => (
              <div key={step.step} style={{ backgroundColor: '#fff', padding: '28px 24px', border: '1px solid #ebebeb' }}>
                <div className="flex items-center gap-3 mb-16">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#ffc500', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#1a1a1a' }}>{step.step}</span>
                  </div>
                  <step.icon size={18} color="#1a1a1a" />
                </div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '10px' }}>
                  {isFr ? step.titleFr : step.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#777', fontWeight: 300, lineHeight: 1.75 }}>
                  {isFr ? step.descFr : step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ backgroundColor: '#fff', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
            {isFr ? '03 — 20 Ans d\'Expérience' : '03 — 20 Years of Experience'}
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '56px' }}>
            {isFr ? 'Notre Trajectoire' : 'Our Journey'}
          </h2>
          <div className="flex flex-col gap-0">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-8 items-start" style={{ borderTop: '1px solid #ebebeb', paddingTop: '24px', paddingBottom: '24px' }}>
                <div style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 900, color: i % 2 === 0 ? '#ffc500' : '#ddd', letterSpacing: '-0.02em', minWidth: '80px', flexShrink: 0, lineHeight: 1 }}>{item.year}</div>
                <p style={{ fontSize: '14px', color: '#555', fontWeight: 300, lineHeight: 1.8, paddingTop: '2px' }}>{isFr ? item.fr : item.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '64px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {isFr ? 'Voir les Spécs de l\'Acier Q355' : 'See the Q355 Steel Specs'}
          </h2>
          <div className="flex gap-4">
            <Link to="/steel-spec" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 32px', backgroundColor: '#ffc500', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
              {isFr ? 'Spécifications Acier' : 'Steel Specifications'}
            </Link>
            <Link to="/contact" style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', padding: '14px 32px', border: '1.5px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
              {isFr ? 'Nous Contacter' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
