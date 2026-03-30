import { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { products } from '../data/products';

const IL = { fontFamily: "'Inter', sans-serif" };

const inputStyle = (dark = true) => ({
  width: '100%',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: `1px solid ${dark ? '#3a3a3a' : '#d0d0d0'}`,
  color: dark ? '#ffffff' : '#1a1a1a',
  fontSize: '13px' as const,
  fontWeight: 300 as const,
  padding: '10px 0',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color 0.2s',
});

const labelStyle = (dark = true) => ({
  fontSize: '10px' as const,
  letterSpacing: '0.25em',
  color: dark ? 'rgba(255,255,255,0.35)' : '#aaa',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '6px',
  fontWeight: 300 as const,
});

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

export function ContactPage({ lang = 'en' }: { lang?: string }) {
  const isFr = lang === 'fr';
  usePageTitle('Request a Quote', 'Demander un Devis', lang);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', product: '', quantity: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `BIH Quote Request — ${form.name}${form.company ? ' / ' + form.company : ''}`,
        from_name: 'BIH Website',
        ...form,
      }),
    })
      .then((r) => r.json())
      .then((r) => { if (r.success) setSent(true); else throw new Error(r.message); })
      .catch(() => alert('Submission error — please email info@borealironheavy.ca directly.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div style={IL}>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0 70px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            {isFr ? 'Prendre Contact' : 'Get in Touch'}
          </p>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {isFr ? 'Demander\nun Devis' : 'Request\na Quote'}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, marginTop: '20px', maxWidth: '480px', lineHeight: 1.8 }}>
            {isFr
              ? 'Soumettez votre demande. Notre équipe d\'ingénierie répondra avec un devis personnalisé sous 48h.'
              : 'Submit your inquiry and our engineering team will respond with a custom quote and lead time within 48 hours.'}
          </p>
        </div>
      </section>

      {/* Main */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0 100px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: Info */}
            <div className="lg:col-span-1">
              <div className="flex flex-col gap-10">
                {[
                  {
                    label: isFr ? 'Siège Social' : 'Headquarters',
                    value: 'Boreal Iron Heavy Inc.',
                    sub: 'info@borealironheavy.ca',
                  },
                  {
                    label: isFr ? 'Délai de Fabrication' : 'Lead Time',
                    value: isFr ? '6–10 Semaines' : '6–10 Weeks',
                    sub: 'FOB Qingdao, Shandong',
                  },
                  {
                    label: isFr ? 'Quantité Minimale' : 'Minimum Order',
                    value: isFr ? '1 Unité' : '1 Unit',
                    sub: isFr ? 'Aucun minimum de commande' : 'No minimum order quantity',
                  },
                  {
                    label: isFr ? 'Garantie' : 'Warranty',
                    value: isFr ? '12 Mois Structurale' : '12 Months Structural',
                    sub: isFr ? 'Tous les produits' : 'All products',
                  },
                  {
                    label: isFr ? 'Certifications' : 'Certifications',
                    value: 'CE · ISO 9001 · EN 474',
                    sub: 'EN 10204-3.1 mill certs',
                  },
                ].map((item) => (
                  <div key={item.label} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#bbb', textTransform: 'uppercase', fontWeight: 300, marginBottom: '6px' }}>{item.label}</p>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.01em' }}>{item.value}</p>
                    <p style={{ fontSize: '12px', color: '#999', fontWeight: 300, marginTop: '3px' }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="flex flex-col gap-6" style={{ paddingTop: '20px' }}>
                  <div style={{ width: '40px', height: '2px', backgroundColor: '#1a1a1a' }} />
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    {isFr ? 'Demande Reçue!' : 'Inquiry Received'}
                  </h2>
                  <p style={{ fontSize: '15px', color: '#666', fontWeight: 300, lineHeight: 1.8, maxWidth: '420px' }}>
                    {isFr
                      ? "Merci! Notre équipe d'ingénierie Shandong répondra sous 48 heures avec un devis personnalisé et les spécifications techniques."
                      : "Thank you! Our Shandong engineering team will respond within 48 hours with a custom quote, lead time, and full technical specifications."}
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', company: '', email: '', phone: '', product: '', quantity: '', message: '' }); }}
                    style={{ alignSelf: 'flex-start', fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', padding: '12px 28px', border: '1.5px solid #1a1a1a', color: '#1a1a1a', backgroundColor: 'transparent', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    {isFr ? 'Nouvelle Demande' : 'New Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label style={labelStyle(false)}>{isFr ? 'Nom Complet' : 'Full Name'} *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" style={inputStyle(false)} />
                    </div>
                    <div>
                      <label style={labelStyle(false)}>{isFr ? 'Entreprise' : 'Company'}</label>
                      <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Construction Ltd." style={inputStyle(false)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label style={labelStyle(false)}>Email *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@company.ca" style={inputStyle(false)} />
                    </div>
                    <div>
                      <label style={labelStyle(false)}>{isFr ? 'Téléphone' : 'Phone'}</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (403) 555-0100" style={inputStyle(false)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label style={labelStyle(false)}>{isFr ? 'Produit d\'Intérêt' : 'Product of Interest'}</label>
                      <select
                        value={form.product}
                        onChange={e => setForm({ ...form, product: e.target.value })}
                        style={{ ...inputStyle(false), cursor: 'pointer' }}
                      >
                        <option value="">{isFr ? '— Sélectionner —' : '— Select product —'}</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{isFr ? p.nameFr : p.name} ({p.tonnageLabel})</option>
                        ))}
                        <option value="custom">{isFr ? 'Fabrication Personnalisée' : 'Custom Fabrication'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle(false)}>{isFr ? 'Quantité Estimée' : 'Estimated Quantity'}</label>
                      <input type="text" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 2 units" style={inputStyle(false)} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle(false)}>{isFr ? 'Message / Exigences' : 'Message / Requirements'}</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={isFr ? "ex: Province de livraison, délai souhaité, exigences spéciales..." : "e.g. Delivery province, desired timeline, special requirements..."}
                      style={{ ...inputStyle(false), resize: 'none' }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2em', padding: '16px 44px', backgroundColor: submitting ? '#555' : '#1a1a1a', color: '#fff', border: 'none', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => { if (!submitting) (e.target as HTMLElement).style.opacity = '0.8'; }}
                      onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
                    >
                      {submitting ? (isFr ? 'Envoi...' : 'Sending...') : (isFr ? 'Envoyer la Demande' : 'Submit Inquiry')}
                    </button>
                    <p style={{ fontSize: '11px', color: '#bbb', fontWeight: 300, marginTop: '12px', letterSpacing: '0.05em' }}>
                      {isFr ? '* Réponse garantie sous 48 heures.' : '* Response guaranteed within 48 business hours.'}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
