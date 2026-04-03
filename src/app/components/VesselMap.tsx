import { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const INTEL_API = 'https://intel-api.freightracing.ca';

// ── Vessel type colour map (AIS ship type numeric → colour) ──────────────────
function vesselColor(shipType: number | null): string {
  if (shipType == null) return '#888888';
  if (shipType >= 70 && shipType <= 79) return '#00CED1'; // Cargo → teal
  if (shipType >= 80 && shipType <= 89) return '#FF6B35'; // Tanker → orange
  if (shipType >= 60 && shipType <= 69) return '#7EC8E3'; // Passenger → light blue
  if (shipType >= 30 && shipType <= 39) return '#FFD700'; // Fishing → gold
  return '#90EE90';                                        // Other → green
}

// ── Kpler-style directional triangle SVG (8×14 px, rotated by heading) ──────
function makeVesselIcon(heading: number | null, shipType: number | null, size = 8): L.DivIcon {
  const color = vesselColor(shipType);
  const deg = heading ?? 0;
  const h = size;
  const w = Math.round(size * 0.6);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polygon points="${w / 2},0 ${w},${h} ${w / 2},${h * 0.75} 0,${h}" fill="${color}" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: `<div style="transform:rotate(${deg}deg);transform-origin:center center;line-height:0">${svg}</div>`,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h / 2],
  });
}

// ── Smaller grey triangle for flights ────────────────────────────────────────
function makeFlightIcon(heading: number | null): L.DivIcon {
  const deg = heading ?? 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10">
    <polygon points="3,0 6,10 3,7.5 0,10" fill="#AAAAAA" opacity="0.75"/>
  </svg>`;
  return L.divIcon({
    html: `<div style="transform:rotate(${deg}deg);transform-origin:center center;line-height:0">${svg}</div>`,
    className: '',
    iconSize: [6, 10],
    iconAnchor: [3, 5],
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface VesselRow {
  mmsi: string;
  ship_name: string | null;
  lat: number;
  lon: number;
  heading: number | null;
  speed: number | null;
  ship_type: number | null;
  nav_status: number | null;
  destination: string | null;
  updated_at: string;
}

interface FlightState {
  icao24: string;
  callsign: string | null;
  lat: number;
  lon: number;
  heading: number | null;
  velocity: number | null;
  on_ground: boolean;
}

interface SelectedItem {
  type: 'vessel' | 'flight';
  name: string;
  details: string[];
}

// ── Main component ────────────────────────────────────────────────────────────
export function VesselMap({ apiKey }: { apiKey: string }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const vesselLayerRef = useRef<L.LayerGroup | null>(null);
  const flightLayerRef = useRef<L.LayerGroup | null>(null);

  const [vesselCount, setVesselCount] = useState(0);
  const [flightCount, setFlightCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [showFlights, setShowFlights] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch vessels from bih-intel-api ─────────────────────────────────────
  const fetchVessels = useCallback(async () => {
    try {
      const res = await fetch(`${INTEL_API}/query/vessels`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) { setError(`Vessels: ${res.status}`); return; }
      const { data } = await res.json() as { data: VesselRow[] };
      if (!vesselLayerRef.current) return;
      vesselLayerRef.current.clearLayers();
      data.forEach(v => {
        if (v.lat == null || v.lon == null) return;
        const icon = makeVesselIcon(v.heading, v.ship_type);
        const marker = L.marker([v.lat, v.lon], { icon });
        marker.on('click', () => setSelected({
          type: 'vessel',
          name: v.ship_name ?? v.mmsi,
          details: [
            `MMSI: ${v.mmsi}`,
            `Speed: ${v.speed != null ? `${v.speed.toFixed(1)} kn` : '—'}`,
            `Heading: ${v.heading != null ? `${v.heading}°` : '—'}`,
            `Destination: ${v.destination ?? '—'}`,
            `Updated: ${v.updated_at.slice(11, 16)} UTC`,
          ],
        }));
        vesselLayerRef.current!.addLayer(marker);
      });
      setVesselCount(data.length);
      setLastUpdate(new Date().toISOString().slice(11, 19) + ' UTC');
      setError(null);
    } catch (e) {
      setError(`Vessel fetch failed: ${String(e)}`);
    }
  }, [apiKey]);

  // ── Fetch flights from bih-website Worker proxy ───────────────────────────
  const fetchFlights = useCallback(async () => {
    if (!showFlights) return;
    try {
      const res = await fetch('/api/flights');
      if (!res.ok) return;
      const { states } = await res.json() as { states: FlightState[] };
      if (!flightLayerRef.current) return;
      flightLayerRef.current.clearLayers();
      (states ?? []).forEach(f => {
        if (f.on_ground) return; // skip grounded
        const icon = makeFlightIcon(f.heading);
        const marker = L.marker([f.lat, f.lon], { icon });
        marker.on('click', () => setSelected({
          type: 'flight',
          name: f.callsign ?? f.icao24,
          details: [
            `ICAO24: ${f.icao24}`,
            `Speed: ${f.velocity != null ? `${Math.round(f.velocity * 1.944)} kn` : '—'}`,
            `Heading: ${f.heading != null ? `${f.heading}°` : '—'}`,
          ],
        }));
        flightLayerRef.current!.addLayer(marker);
      });
      setFlightCount((states ?? []).filter(f => !f.on_ground).length);
    } catch {
      // Flights are optional — fail silently
    }
  }, [showFlights]);

  // ── Initialise Leaflet map (once) ─────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [45, -160],  // Mid-Pacific, shows full China→Canada route
      zoom: 3,
      zoomControl: true,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    vesselLayerRef.current = L.layerGroup().addTo(map);
    flightLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Toggle flight layer visibility ───────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !flightLayerRef.current) return;
    if (showFlights) {
      flightLayerRef.current.addTo(mapRef.current);
    } else {
      flightLayerRef.current.remove();
      setFlightCount(0);
    }
  }, [showFlights]);

  // ── Initial + polling fetches ─────────────────────────────────────────────
  useEffect(() => {
    fetchVessels();
    fetchFlights();
    const vi = setInterval(fetchVessels, 60_000);   // vessels: every 60s
    const fi = setInterval(fetchFlights, 90_000);   // flights: every 90s
    return () => { clearInterval(vi); clearInterval(fi); };
  }, [fetchVessels, fetchFlights]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-zinc-800" style={{ height: '560px' }}>
      {/* Map container */}
      <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />

      {/* Status bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-sm text-xs text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 flex gap-3">
          <span><span className="text-teal-400 font-bold">{vesselCount}</span> vessels</span>
          {showFlights && <span><span className="text-zinc-400 font-bold">{flightCount}</span> flights</span>}
          {lastUpdate && <span className="text-zinc-600">↺ {lastUpdate}</span>}
        </div>
        {error && (
          <div className="bg-red-900/80 text-red-300 text-xs px-3 py-1.5 rounded-lg border border-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => setShowFlights(f => !f)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition ${showFlights ? 'bg-zinc-700 border-zinc-600 text-zinc-200' : 'bg-zinc-900/80 border-zinc-700 text-zinc-500'}`}
        >
          ✈ Flights
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-zinc-900/90 backdrop-blur-sm text-xs px-3 py-2 rounded-lg border border-zinc-700 space-y-1">
        {[
          { color: '#00CED1', label: 'Cargo' },
          { color: '#FF6B35', label: 'Tanker' },
          { color: '#7EC8E3', label: 'Passenger' },
          { color: '#90EE90', label: 'Other' },
          { color: '#AAAAAA', label: 'Aircraft' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, backgroundColor: color, clipPath: 'polygon(50% 0%, 100% 100%, 50% 75%, 0% 100%)' }} />
            <span className="text-zinc-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Selected vessel/flight panel */}
      {selected && (
        <div className="absolute bottom-3 right-3 z-[1000] bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-xl px-4 py-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-sm font-bold truncate max-w-[160px]">{selected.name}</p>
            <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-zinc-300 ml-2 text-xs">✕</button>
          </div>
          {selected.details.map(d => (
            <p key={d} className="text-zinc-400 text-xs">{d}</p>
          ))}
        </div>
      )}
    </div>
  );
}
