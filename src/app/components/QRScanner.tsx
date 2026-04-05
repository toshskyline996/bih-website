import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  active?: boolean;
}

export function QRScanner({ onScan, active = true }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string>('');
  const idRef = useRef(`qr-scanner-${Math.random().toString(36).slice(2)}`);
  const onScanRef = useRef(onScan);

  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    if (!active) return;

    const divId = idRef.current;
    const scanner = new Html5Qrcode(divId);
    scannerRef.current = scanner;
    startedRef.current = false;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 12, qrbox: { width: 240, height: 240 } },
      (text) => { onScanRef.current(text); },
      () => { /* ignore decode errors */ }
    )
      .then(() => { setStarted(true); startedRef.current = true; })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg.includes('permission') ? 'Camera permission denied' : `Camera error: ${msg}`);
      });

    return () => {
      if (startedRef.current) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      } else {
        try { scanner.clear(); } catch { /* ignore */ }
      }
      startedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
      {error && (
        <div style={{
          background: 'rgba(255,107,107,0.12)',
          border: '1px solid #FF6B6B',
          color: '#FF6B6B',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 14,
        }}>
          {error}
        </div>
      )}
      <div
        id={idRef.current}
        ref={containerRef}
        style={{
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#0d0d0d',
          border: started ? '2px solid #FFD100' : '2px solid #3a3a3a',
          minHeight: 280,
        }}
      />
      {!started && !error && (
        <div style={{ textAlign: 'center', color: '#6b6b6b', marginTop: 16, fontSize: 13 }}>
          Requesting camera access…
        </div>
      )}
    </div>
  );
}
