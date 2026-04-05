import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';

const IL = { fontFamily: "'Inter', sans-serif" };

const mainSpecs = [
  { property: 'Yield Strength', propertyFr: 'Limite d\'élasticité', bih: '≥ 355 MPa', astm: '≥ 345 MPa (50 ksi)', edge: 'BIH' },
  { property: 'Tensile Strength', propertyFr: 'Résistance à la traction', bih: '470–630 MPa', astm: '450–620 MPa', edge: 'BIH' },
  { property: 'Elongation', propertyFr: 'Allongement', bih: '≥ 20%', astm: '≥ 18%', edge: 'BIH' },
  { property: 'Impact Toughness', propertyFr: 'Résistance aux chocs', bih: '34J @ −20°C', astm: '27J @ −18°C', edge: 'BIH' },
  { property: 'Plate Thickness', propertyFr: 'Épaisseur de plaque', bih: 'Up to 150mm', astm: 'Up to 100mm', edge: 'BIH' },
  { property: 'Quality System', propertyFr: 'Système Qualité', bih: 'ISO 9001 Certified Facility', astm: 'Varies by supplier', edge: 'BIH' },
  { property: 'Carbon Equivalent', propertyFr: 'Équivalent carbone', bih: '≤ 0.43', astm: '≤ 0.45', edge: 'BIH' },
  { property: 'Weldability', propertyFr: 'Soudabilité', bih: 'Excellent (PWHT not required)', astm: 'Good', edge: 'BIH' },
];

const hardoxSpecs = [
  { property: 'Hardness (HBW)', propertyFr: 'Dureté (HBW)', value: '425–475 HBW' },
  { property: 'Yield Strength', propertyFr: 'Limite d\'élasticité', value: '≥ 1,250 MPa' },
  { property: 'Tensile Strength', propertyFr: 'Résistance à la traction', value: '1,400–1,600 MPa' },
  { property: 'Elongation A5', propertyFr: 'Allongement A5', value: '≥ 10%' },
  { property: 'Charpy Impact', propertyFr: 'Résilience Charpy', value: '30J @ −40°C' },
  { property: 'Thickness Range', propertyFr: 'Gamme d\'épaisseur', value: '4–130 mm' },
  { property: 'Application', propertyFr: 'Application', value: 'Cutting edges, floor plates, wear bars, tines' },
];

export function SteelSpecPage({ lang = 'en' }: { lang?: string }) {
  const isFr = lang === 'fr';
  usePageTitle('Steel Specifications — Q355 HSLA + 450 HBW Wear Plate', 'Spécifications Acier — Q355 HSLA + 450 HBW', lang);

  return (
    <div style={IL}>
      {/* Hero */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0 70px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            {isFr ? 'Spécifications Techniques' : 'Technical Specifications'}
          </p>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '20px' }}>
            {isFr ? 'Standard Acier\nQ355 vs.\nASTM A572 Gr.50' : 'Q355 Steel\nStandard vs.\nASTM A572 Gr.50'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.8, maxWidth: '520px' }}>
            {isFr
              ? "BIH utilise l'acier structural Q355 HSLA (GB/T 1591-2018) — qui égale ou dépasse l'ASTM A572 Grade 50 sur chaque paramètre critique."
              : "BIH uses Q355 HSLA structural steel (GB/T 1591-2018) — which meets or exceeds ASTM A572 Grade 50 on every critical performance metric."}
          </p>
        </div>
      </section>

      {/* Q355 Table */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '32px' }}>
            {isFr ? '01 — Comparaison Q355 vs ASTM A572' : '01 — Q355 vs ASTM A572 Comparison'}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '560px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1a1a1a' }}>
                  <th style={{ fontSize: '10px', fontWeight: 300, letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', textAlign: 'left', padding: '0 0 16px 0', width: '32%' }}>
                    {isFr ? 'Propriété' : 'Property'}
                  </th>
                  <th style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', color: '#1a1a1a', textTransform: 'uppercase', textAlign: 'left', padding: '0 0 16px 20px', width: '26%' }}>
                    BIH Q355
                  </th>
                  <th style={{ fontSize: '10px', fontWeight: 300, letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', textAlign: 'left', padding: '0 0 16px 20px', width: '28%' }}>
                    ASTM A572 Gr.50
                  </th>
                  <th style={{ fontSize: '10px', fontWeight: 300, letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', textAlign: 'right', padding: '0 0 16px 0', width: '14%' }}>
                    {isFr ? 'Avantage' : 'Edge'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {mainSpecs.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ebebeb', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td style={{ fontSize: '13px', color: '#555', fontWeight: 300, padding: '18px 0', letterSpacing: '0.02em' }}>
                      {isFr ? row.propertyFr : row.property}
                    </td>
                    <td style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 600, padding: '18px 20px', letterSpacing: '0.02em' }}>{row.bih}</td>
                    <td style={{ fontSize: '13px', color: '#777', fontWeight: 300, padding: '18px 20px', letterSpacing: '0.02em' }}>{row.astm}</td>
                    <td style={{ textAlign: 'right', padding: '18px 0' }}>
                      <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', padding: '3px 8px', textTransform: 'uppercase', backgroundColor: row.edge === 'BIH' ? '#1a1a1a' : '#eeeeee', color: row.edge === 'BIH' ? '#fff' : '#888' }}>
                        {row.edge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.05em', fontWeight: 300, marginTop: '16px' }}>
            {isFr
              ? '* Données provenant de GB/T 1591-2018 et ASTM A572-21. Certification d\'usine EN 10204-3.1 disponible sur demande.'
              : '* Data sourced from GB/T 1591-2018 and ASTM A572-21 standards. Third-party mill certification EN 10204-3.1 available upon request.'}
          </p>

          {/* Visual Performance Bars */}
          <div style={{ marginTop: '64px', paddingTop: '56px', borderTop: '1px solid #ebebeb' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '36px' }}>
              {isFr ? 'Avantage Visuel — Écart de Performance' : 'Visual Edge — Performance Gap'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {[
                { labelEn: 'Yield Strength', labelFr: 'Limite d\'élasticité', bih: 355, astm: 345, unit: 'MPa', max: 400 },
                { labelEn: 'Tensile Strength', labelFr: 'Résistance à la traction', bih: 630, astm: 620, unit: 'MPa', max: 700 },
                { labelEn: 'Elongation', labelFr: 'Allongement', bih: 20, astm: 18, unit: '%', max: 24 },
                { labelEn: 'Max Plate Thickness', labelFr: 'Épaisseur max', bih: 150, astm: 100, unit: 'mm', max: 180 },
              ].map((row) => (
                <div key={row.labelEn}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.02em' }}>
                      {isFr ? row.labelFr : row.labelEn}
                    </span>
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 300 }}>
                      BIH <strong style={{ color: '#1a1a1a' }}>{row.bih}</strong> vs ASTM <strong style={{ color: '#aaa' }}>{row.astm}</strong> {row.unit}
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: '8px', backgroundColor: '#f0f0f0' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(row.astm / row.max) * 100}%`, backgroundColor: '#d0d0d0' }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(row.bih / row.max) * 100}%`, backgroundColor: '#1a1a1a' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span style={{ fontSize: '9px', letterSpacing: '0.12em', color: '#1a1a1a', fontWeight: 600, textTransform: 'uppercase' }}>
                      BIH Q355
                    </span>
                    <span style={{ fontSize: '9px', letterSpacing: '0.12em', color: '#bbb', fontWeight: 300, textTransform: 'uppercase' }}>
                      ASTM A572
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hardox 450 */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '32px' }}>
            {isFr ? '02 — Pièces d\'Usure: 450 HBW' : '02 — Wear Parts: 450 HBW'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '20px' }}>
                450 HBW<br />{isFr ? 'Plaques d\'Usure' : 'Wear Plate'}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9, marginBottom: '16px' }}>
                {isFr
                  ? "Acier anti-usure de classe 450 HBW pour toutes les arêtes de coupe, plaques de fond, couteaux latéraux, dents et barres d'usure BIH. Performance équivalente à la classe Hardox 450."
                  : "450 HBW class wear-resistant steel for all BIH cutting edges, floor plates, side cutters, tines, and wear bars. Equivalent performance class to Hardox 450."}
              </p>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9 }}>
                {isFr
                  ? "À 425–475 HBW, notre plaque d'usure de classe 450 offre 2 à 3 fois la résistance à l'abrasion de l'acier structural ordinaire, avec une ténacité suffisante pour résister aux chocs à −40°C."
                  : "At 425–475 HBW, our 450-class wear plate delivers 2–3× the abrasion resistance of ordinary structural steel, with sufficient toughness to withstand impacts at −40°C."}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {hardoxSpecs.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: i % 2 === 0 ? '#fff' : 'transparent' }}>
                      <td style={{ fontSize: '12px', color: '#666', fontWeight: 300, padding: '14px 0', letterSpacing: '0.02em' }}>
                        {isFr ? row.propertyFr : row.property}
                      </td>
                      <td style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600, padding: '14px 16px', letterSpacing: '0.02em' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Microalloying Advantage */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '32px' }}>
            {isFr ? '03 — L\'Avantage Microallié' : '03 — The Microalloying Advantage'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '20px' }}>
                {isFr ? 'Pourquoi Q355\nSoude Mieux' : 'Why Q355\nWelds Better'}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9, marginBottom: '16px' }}>
                {isFr
                  ? "Q355 intègre du vanadium, niobium et titane comme microéléments d'alliage. Ces ajouts affinent la structure granulaire de l'acier, augmentant la résistance aux fissures et permettant un soudage sans préchauffage (PWHT non requis)."
                  : "Q355 incorporates vanadium, niobium, and titanium as microalloying elements. These additions refine grain structure, increase crack resistance, and allow welding without pre-heat treatment (PWHT not required) — reducing fabrication time and heat distortion versus A572."}
              </p>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9 }}>
                {isFr
                  ? "Le carbone équivalent ≤ 0.43 (vs ≤ 0.45 pour A572) signifie une meilleure résistance à la fissuration à froid, critique pour les environnements canadiens."
                  : "Carbon equivalent ≤ 0.43 (vs ≤ 0.45 for A572) means superior cold-cracking resistance — critical for Canadian field environments where re-welding on-site must remain reliable at sub-zero temperatures."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  element: 'V', name: isFr ? 'Vanadium' : 'Vanadium',
                  effect: isFr ? 'Affinage des grains. Augmente la résistance à la traction sans réduire la ductilité.' : 'Grain refinement. Increases tensile strength without sacrificing ductility.',
                  pct: '0.02–0.15%',
                },
                {
                  element: 'Nb', name: isFr ? 'Niobium' : 'Niobium',
                  effect: isFr ? 'Améliore la ténacité aux chocs à basse température. Réduit la fragilisation à froid.' : 'Improves low-temperature impact toughness. Reduces cold-embrittlement risk.',
                  pct: '0.01–0.06%',
                },
                {
                  element: 'Ti', name: isFr ? 'Titane' : 'Titanium',
                  effect: isFr ? 'Contrôle la taille des grains d\'austénite. Améliore la soudabilité et la résistance à la fatigue.' : 'Controls austenite grain size. Improves weldability and fatigue resistance under cyclic loading.',
                  pct: '0.006–0.05%',
                },
              ].map((el) => (
                <div key={el.element} style={{ backgroundColor: '#f9f9f9', border: '1px solid #ebebeb', padding: '24px 20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '4px' }}>{el.element}</div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>{el.name} · {el.pct}</div>
                  <p style={{ fontSize: '12px', color: '#555', fontWeight: 300, lineHeight: 1.7 }}>{el.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Welding Process Standard */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '32px' }}>
            {isFr ? '04 — Processus de Fabrication' : '04 — Manufacturing Process'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '20px' }}>
                {isFr ? 'Standard de\nSoudage Zéro-Défaut' : 'Zero-Defect\nWeld Standard'}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9 }}>
                {isFr
                  ? "Chaque soudure structurelle BIH est réalisée par des robots à 6 axes selon les procédures AWS D1.1, puis soumise à une inspection ultrasonique (UT) post-soudage. Les enregistrements d'inspection sont fournis avec chaque unité."
                  : "Every BIH structural weld is performed by 6-axis robotic arms following AWS D1.1 welding procedures, then subjected to post-weld ultrasonic testing (UT). Weld inspection records are issued with each unit."}
              </p>
            </div>
            <div className="flex flex-col gap-0">
              {[
                {
                  step: '01', icon: '⬡',
                  en: 'Material Traceability', enDesc: 'Every plate and pin arrives with EN 10204-3.1 mill certificate. Chemistry and mechanical properties verified before production begins.',
                  fr: 'Traçabilité Matière', frDesc: 'Chaque plaque et axe arrive avec un certificat d\'usine EN 10204-3.1. Chimie et propriétés mécaniques vérifiées avant production.',
                },
                {
                  step: '02', icon: '⬡',
                  en: '6-Axis Robotic Welding', enDesc: 'CNC plasma cutting followed by 6-axis robotic welding per AWS D1.1. Zero-defect procedures on all structural load-bearing joints.',
                  fr: 'Soudage Robotisé 6 Axes', frDesc: 'Découpe plasma CNC puis soudage robotisé 6 axes selon AWS D1.1. Procédures zéro-défaut sur toutes les soudures porteuses.',
                },
                {
                  step: '03', icon: '⬡',
                  en: 'Ultrasonic Weld Inspection', enDesc: 'Post-weld UT inspection on all primary welds. Full inspection records issued with each attachment unit.',
                  fr: 'Inspection Ultrasonique', frDesc: 'Inspection UT post-soudage sur toutes les soudures primaires. Enregistrements complets fournis avec chaque unité.',
                },
                {
                  step: '04', icon: '⬡',
                  en: 'Cold Impact Load Test', enDesc: 'Destructive and non-destructive testing per ISO 7438. Cold impact at −40°C for Canadian climate certification.',
                  fr: 'Test Charge + Froid', frDesc: 'Tests destructifs et non-destructifs selon ISO 7438. Impact froid à −40°C pour certification climatique canadienne.',
                },
              ].map((s, i, arr) => (
                <div key={s.step} style={{ display: 'flex', gap: '20px', paddingBottom: i < arr.length - 1 ? '28px' : 0, borderBottom: i < arr.length - 1 ? '1px solid #e8e8e8' : 'none', paddingTop: i > 0 ? '28px' : 0 }}>
                  <div style={{ flexShrink: 0, width: '36px', height: '36px', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#ffc500', letterSpacing: '0.1em' }}>{s.step}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px', letterSpacing: '0.02em' }}>
                      {isFr ? s.fr : s.en}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666', fontWeight: 300, lineHeight: 1.7 }}>
                      {isFr ? s.frDesc : s.enDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Canadian Climate Section */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
                {isFr ? '05 — Certification Canadienne' : '05 — Canadian Climate Certification'}
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '20px' }}>
                {isFr ? 'Conçu pour\nles Hivers\nCanadiens' : 'Engineered for\nCanadian\nWinters'}
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.9, maxWidth: '500px' }}>
                {isFr
                  ? "Le corps Q355 et les pièces d'usure 450 HBW sont tous deux testés à l'impact à froid à −40°C. Cela garantit que nos accessoires restent ductiles et résistants aux fissures même lors de conditions hivernales extrêmes en Alberta, en Saskatchewan et dans le nord de l'Ontario."
                  : "Both Q355 body and 450 HBW wear parts are cold impact tested at −40°C. This ensures our attachments remain ductile and crack-resistant even during extreme winter conditions across Alberta, Saskatchewan, and Northern Ontario."}
              </p>
            </div>
            <div className="flex flex-col gap-5 justify-center">
              {[
                { temp: '−20°C', label: isFr ? 'Test Impact Q355' : 'Q355 Impact Test', val: '34J' },
                { temp: '−40°C', label: isFr ? 'Test Impact 450 HBW' : '450 HBW Impact Test', val: '30J' },
                { temp: '−40°C', label: isFr ? 'Température Min d\'Utilisation' : 'Min Operating Temp', val: 'Rated' },
              ].map((item, i) => (
                <div key={`${item.temp}-${i}`} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300 }}>{item.label}</p>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginTop: '4px' }}>{item.temp}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '22px', fontWeight: 900, color: '#ffc500', letterSpacing: '-0.01em' }}>{item.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#ffc500', padding: '56px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {isFr ? 'Demander une Certification Complète' : 'Request Full Mill Certification'}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', fontWeight: 300, marginTop: '6px' }}>
              {isFr ? 'EN 10204-3.1 · ISO 9001 · CE · EN 474 disponibles sur demande' : 'EN 10204-3.1 · ISO 9001 · CE · EN 474 available on request'}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 32px', backgroundColor: '#1a1a1a', color: '#fff', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
              {isFr ? 'Nous Contacter' : 'Contact Us'}
            </Link>
            <Link to="/products" style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', padding: '14px 32px', border: '1.5px solid rgba(26,26,26,0.35)', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
              {isFr ? 'Voir les Produits' : 'Browse Products'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}