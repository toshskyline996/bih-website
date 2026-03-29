import { Link } from 'react-router';

const IL = { fontFamily: "'Inter', sans-serif" };

const mainSpecs = [
  { property: 'Yield Strength', propertyFr: 'Limite d\'élasticité', bih: '≥ 355 MPa', astm: '≥ 345 MPa (50 ksi)', edge: 'BIH' },
  { property: 'Tensile Strength', propertyFr: 'Résistance à la traction', bih: '470–630 MPa', astm: '450–620 MPa', edge: 'BIH' },
  { property: 'Elongation', propertyFr: 'Allongement', bih: '≥ 20%', astm: '≥ 18%', edge: 'BIH' },
  { property: 'Impact Toughness', propertyFr: 'Résistance aux chocs', bih: '34J @ −20°C', astm: '27J @ −18°C', edge: 'BIH' },
  { property: 'Plate Thickness', propertyFr: 'Épaisseur de plaque', bih: 'Up to 150mm', astm: 'Up to 100mm', edge: 'BIH' },
  { property: 'Mill Certification', propertyFr: 'Certification d\'usine', bih: 'EN 10204-3.1', astm: 'ASTM A6', edge: 'Equal' },
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
        </div>
      </section>

      {/* Hardox 450 */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '32px' }}>
            {isFr ? '02 — Pièces d\'Usure: Hardox 450' : '02 — Wear Parts: Hardox 450'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '20px' }}>
                Hardox 450<br />{isFr ? 'Plaques d\'Usure' : 'Wear Plates'}
              </h2>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9, marginBottom: '16px' }}>
                {isFr
                  ? "Hardox 450 est l'acier résistant à l'usure de référence de SSAB. Toutes les arêtes de coupe, plaques de fond, couteaux latéraux et dents BIH sont fabriqués en Hardox 450."
                  : "Hardox 450 is SSAB's benchmark wear-resistant steel. All BIH cutting edges, floor plates, side cutters, tines, and wear bars are manufactured from Hardox 450."}
              </p>
              <p style={{ fontSize: '14px', color: '#666', fontWeight: 300, lineHeight: 1.9 }}>
                {isFr
                  ? "À 425–475 HBW, Hardox 450 offre 2 à 3 fois la résistance à l'usure de l'acier structural ordinaire, avec une ténacité suffisante pour résister aux chocs à −40°C."
                  : "At 425–475 HBW, Hardox 450 delivers 2–3× the abrasion resistance of ordinary structural steel, with sufficient toughness to withstand impacts at −40°C."}
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

      {/* Canadian Climate Section */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
                {isFr ? '03 — Certification Canadienne' : '03 — Canadian Climate Certification'}
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '20px' }}>
                {isFr ? 'Conçu pour\nles Hivers\nCanadiens' : 'Engineered for\nCanadian\nWinters'}
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.9, maxWidth: '500px' }}>
                {isFr
                  ? "Le corps Q355 et les pièces d'usure Hardox 450 sont tous deux testés à l'impact à froid à −40°C. Cela garantit que nos accessoires restent ductiles et résistants aux fissures même lors de conditions hivernales extrêmes en Alberta, en Saskatchewan et dans le nord de l'Ontario."
                  : "Both Q355 body and Hardox 450 wear parts are cold impact tested at −40°C. This ensures our attachments remain ductile and crack-resistant even during extreme winter conditions across Alberta, Saskatchewan, and Northern Ontario."}
              </p>
            </div>
            <div className="flex flex-col gap-5 justify-center">
              {[
                { temp: '−20°C', label: isFr ? 'Test Impact Q355' : 'Q355 Impact Test', val: '34J' },
                { temp: '−40°C', label: isFr ? 'Test Impact Hardox' : 'Hardox Impact Test', val: '30J' },
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