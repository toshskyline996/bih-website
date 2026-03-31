import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { Product } from '../data/products';

interface NameplateBadgeProps {
  product: Product;
  lang?: string;
}

const STEEL_LABEL: Record<string, string> = {
  'Q355 HSLA Steel': 'Q355D HSLA',
  'High-tensile alloy steel housing': 'Alloy Steel HT',
  'Ductile iron gearbox housing': 'Ductile Iron',
};

function normalizeSteel(raw: string): string {
  return STEEL_LABEL[raw] ?? raw;
}

function getTempRating(product: Product): string {
  const hasCold =
    product.material.body.includes('Q355') ||
    product.features.some((f) => f.includes('−40') || f.includes('-40'));
  return hasCold ? '−40°C Rated' : 'N/A';
}

const IL: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

export function NameplateBadge({ product, lang = 'en' }: NameplateBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isFr = lang === 'fr';

  useEffect(() => {
    if (!canvasRef.current) return;
    const url = `https://borealironheavy.ca/products/${product.slug}`;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 72,
      margin: 1,
      color: { dark: '#E8E8E8', light: '#1A2E3F' },
    }).catch(() => {});
  }, [product.slug]);

  const steel = normalizeSteel(product.material.body);
  const wear = product.material.wearParts;
  const certs = product.certificates.join(' · ');
  const temp = getTempRating(product);

  const rows = [
    {
      labelEn: 'MODEL',
      labelFr: 'MODÈLE',
      val: product.modelNumber,
      accent: true,
    },
    {
      labelEn: 'CLASS',
      labelFr: 'CLASSE',
      val: product.tonnageLabel,
      accent: false,
    },
    {
      labelEn: 'STEEL',
      labelFr: 'ACIER',
      val: steel,
      accent: false,
    },
    {
      labelEn: 'WEAR',
      labelFr: 'USURE',
      val: wear,
      accent: false,
    },
    {
      labelEn: 'CERT',
      labelFr: 'CERT',
      val: certs,
      accent: false,
    },
    {
      labelEn: 'TEMP',
      labelFr: 'TEMP',
      val: temp,
      accent: false,
    },
  ];

  return (
    <div
      style={{
        ...IL,
        backgroundColor: '#1A2E3F',
        border: '1px solid rgba(255,255,255,0.12)',
        padding: '24px 28px',
        marginTop: '0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '8px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              fontWeight: 300,
              marginBottom: '4px',
            }}
          >
            {isFr ? 'PLAQUE D\'USINE' : 'FACTORY NAMEPLATE'}
          </p>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 900,
              color: '#FFC500',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {product.modelNumber}
          </p>
        </div>
        <div
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
          }}
        >
          BIH ▶
        </div>
      </div>

      {/* Grid + QR */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Spec grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px 24px',
            flex: 1,
          }}
        >
          {rows.map((r) => (
            <div key={r.labelEn}>
              <p
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.22em',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  marginBottom: '2px',
                }}
              >
                {isFr ? r.labelFr : r.labelEn}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: r.accent ? 700 : 500,
                  color: r.accent ? '#FFC500' : '#E8E8E8',
                  letterSpacing: r.accent ? '0.04em' : '0.01em',
                  lineHeight: 1.3,
                }}
              >
                {r.val}
              </p>
            </div>
          ))}
        </div>

        {/* QR code */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <canvas
            ref={canvasRef}
            style={{ display: 'block', imageRendering: 'pixelated' }}
          />
          <p
            style={{
              fontSize: '7px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.08em',
              marginTop: '4px',
              textTransform: 'uppercase',
            }}
          >
            {isFr ? 'Scanner les specs' : 'Scan to verify'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontSize: '8px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
            fontWeight: 300,
          }}
        >
          borealironheavy.ca
        </p>
        <p
          style={{
            fontSize: '8px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
            fontWeight: 300,
          }}
        >
          ISO 9001 · CE · {isFr ? 'Fabriqué en Chine' : 'Mfg. Shandong, CN'}
        </p>
      </div>
    </div>
  );
}
