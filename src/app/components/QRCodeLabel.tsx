import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export interface LabelUnit {
  id: string;
  label_id: string;
  sku_name: string;
  sku_model?: string;
}

interface QRCodeLabelProps {
  units: LabelUnit[];
}

function SingleLabel({ unit }: { unit: LabelUnit }) {
  const [qrSvg, setQrSvg] = useState<string>('');

  useEffect(() => {
    QRCode.toString(unit.id, { type: 'svg', width: 120, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then(setQrSvg)
      .catch(console.error);
  }, [unit.id]);

  return (
    <div className="label-item">
      <div className="label-qr" dangerouslySetInnerHTML={{ __html: qrSvg }} />
      <div className="label-text">
        <div className="label-id">{unit.label_id}</div>
        <div className="label-sku">{unit.sku_name}</div>
        {unit.sku_model && <div className="label-model">{unit.sku_model}</div>}
      </div>
    </div>
  );
}

export function QRCodeLabel({ units }: QRCodeLabelProps) {
  if (units.length === 0) return null;

  return (
    <div>
      <style>{`
        .label-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 200px);
          gap: 16px;
          padding: 16px;
        }
        .label-item {
          background: #ffffff;
          border: 1px solid #cccccc;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 200px;
          box-sizing: border-box;
        }
        .label-qr svg {
          width: 120px;
          height: 120px;
          display: block;
        }
        .label-text {
          text-align: center;
          width: 100%;
        }
        .label-id {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #000000;
          letter-spacing: 1px;
        }
        .label-sku {
          font-size: 11px;
          color: #333333;
          margin-top: 2px;
          word-break: break-word;
        }
        .label-model {
          font-size: 10px;
          color: #666666;
        }
        @media print {
          * { margin: 0; padding: 0; }
          body > *:not(.print-area) { display: none !important; }
          .print-area { display: block !important; }
          .no-print { display: none !important; }
          .label-grid {
            padding: 0;
            gap: 8px;
          }
          .label-item {
            border: 1px solid #aaa;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div style={{ marginBottom: 16 }} className="no-print">
        <button
          onClick={() => window.print()}
          style={{
            background: '#FFD100',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🖨 Print {units.length} Label{units.length > 1 ? 's' : ''}
        </button>
        <span style={{ marginLeft: 12, fontSize: 13, color: '#a8a8a8' }}>
          Scan result: unit UUID encoded in QR code
        </span>
      </div>

      <div className="label-grid print-area">
        {units.map(u => <SingleLabel key={u.id} unit={u} />)}
      </div>
    </div>
  );
}
