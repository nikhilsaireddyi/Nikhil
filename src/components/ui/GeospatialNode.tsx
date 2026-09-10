'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, Compass, Wifi, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { playHoverTick } from '@/lib/sound';

interface TechHub {
  name: string;
  code: string;
  lat: number;
  lng: number;
  region: string;
  ping: number;
}

const ORIGIN = {
  name: 'Visakhapatnam (Vizag)',
  code: 'VTZ',
  lat: 17.6868,
  lng: 83.2185,
  country: 'India',
  coordsText: '17.6868° N, 83.2185° E',
};

const TECH_HUBS: TechHub[] = [
  { name: 'Bengaluru Tech Capital', code: 'BLR', lat: 12.9716, lng: 77.5946, region: 'India South', ping: 14 },
  { name: 'Singapore Cyber Gateway', code: 'SIN', lat: 1.3521, lng: 103.8198, region: 'Asia-Pacific', ping: 38 },
  { name: 'Tokyo Neural Network', code: 'HND', lat: 35.6762, lng: 139.6503, region: 'East Asia', ping: 72 },
  { name: 'London AI Exchange', code: 'LHR', lat: 51.5074, lng: -0.1278, region: 'Europe West', ping: 112 },
  { name: 'Silicon Valley Innovation Hub', code: 'SFO', lat: 37.7749, lng: -122.4194, region: 'US West', ping: 178 },
];

// Helper: Convert spherical coords (lat/lng in deg) to 3D Cartesian coords on a sphere of radius R
function latLngToVector3D(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

// Helper: Rotate 3D vector around Y axis (yaw) and X axis (pitch)
function rotate3D(v: [number, number, number], rotY: number, rotX: number): [number, number, number] {
  // Rotate around Y
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = v[0] * cosY - v[2] * sinY;
  const z1 = v[0] * sinY + v[2] * cosY;
  const y1 = v[1];

  // Rotate around X
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = y1 * cosX - z1 * sinX;
  const z2 = y1 * sinX + z1 * cosX;
  const x2 = x1;

  return [x2, y2, z2];
}

export function GeospatialNode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedHub, setSelectedHub] = useState<TechHub>(TECH_HUBS[0]);
  const [istTime, setIstTime] = useState<string>('');
  const [currentPing, setCurrentPing] = useState<number>(16);

  // Rotation state: initial center faces India (~ -83 deg yaw)
  const rotYRef = useRef<number>(-1.45);
  const rotXRef = useRef<number>(0.28);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotYRef = useRef<number>(-1.45);
  const targetRotXRef = useRef<number>(0.28);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);
        setIstTime(formatted);
      } catch {
        setIstTime(now.toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulating subtle live ping fluctuation
  useEffect(() => {
    const pingInterval = setInterval(() => {
      const variance = Math.floor(Math.random() * 5) - 2;
      setCurrentPing(Math.max(12, selectedHub.ping + variance));
    }, 2000);
    return () => clearInterval(pingInterval);
  }, [selectedHub]);

  // Focus globe rotation on selected hub
  const focusOnHub = (hub: TechHub) => {
    setSelectedHub(hub);
    playHoverTick();
    // Center roughly halfway between Vizag and the target hub
    const midLng = (ORIGIN.lng + hub.lng) / 2;
    const midLat = (ORIGIN.lat + hub.lat) / 2;
    targetRotYRef.current = -(midLng * (Math.PI / 180)) - Math.PI / 2;
    targetRotXRef.current = (midLat * (Math.PI / 180)) * 0.5;
  };

  // 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let packetProgress = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // Smooth dampening towards target rotation if not dragging
      if (!isDraggingRef.current) {
        // Subtle auto-drift
        targetRotYRef.current -= 0.0012;
        rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.05;
        rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.05;
      }

      const rotY = rotYRef.current;
      const rotX = rotXRef.current;

      // 1. Atmosphere Radial Glow
      const atmosGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.8, cx, cy, globeRadius * 1.3);
      atmosGrad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      atmosGrad.addColorStop(0.7, 'rgba(199, 255, 74, 0.03)');
      atmosGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Sphere Fill
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#06080E';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Latitude Rings
      const latSteps = [-60, -30, 0, 30, 60];
      for (const lat of latSteps) {
        ctx.beginPath();
        let firstPoint = true;
        for (let lng = -180; lng <= 180; lng += 6) {
          const v = latLngToVector3D(lat, lng, globeRadius);
          const [rx, ry, rz] = rotate3D(v, rotY, rotX);
          if (rz > -globeRadius * 0.2) {
            const px = cx + rx;
            const py = cy - ry;
            if (firstPoint) {
              ctx.moveTo(px, py);
              firstPoint = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            firstPoint = true;
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(0, 240, 255, 0.35)' : 'rgba(242, 240, 234, 0.08)';
        ctx.lineWidth = lat === 0 ? 1.2 : 0.6;
        ctx.stroke();
      }

      // 4. Longitude Meridians
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let firstPoint = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const v = latLngToVector3D(lat, lng, globeRadius);
          const [rx, ry, rz] = rotate3D(v, rotY, rotX);
          if (rz > -globeRadius * 0.2) {
            const px = cx + rx;
            const py = cy - ry;
            if (firstPoint) {
              ctx.moveTo(px, py);
              firstPoint = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            firstPoint = true;
          }
        }
        ctx.strokeStyle = lng === 0 ? 'rgba(199, 255, 74, 0.3)' : 'rgba(242, 240, 234, 0.08)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // 5. Compute Vizag 3D position
      const vOrigin = latLngToVector3D(ORIGIN.lat, ORIGIN.lng, globeRadius);
      const [ox, oy, oz] = rotate3D(vOrigin, rotY, rotX);
      const isOriginVisible = oz > -globeRadius * 0.1;

      // 6. Draw Orbital Arcs & Hubs
      packetProgress = (packetProgress + 0.012) % 1;

      TECH_HUBS.forEach((hub) => {
        const vHub = latLngToVector3D(hub.lat, hub.lng, globeRadius);
        const [hx, hy, hz] = rotate3D(vHub, rotY, rotX);
        const isHubVisible = hz > -globeRadius * 0.1;
        const isSelected = selectedHub.code === hub.code;

        // Draw Arc between Vizag and Hub
        if (isOriginVisible || isHubVisible) {
          const arcPoints: { x: number; y: number; z: number }[] = [];
          const numSamples = 24;

          for (let i = 0; i <= numSamples; i++) {
            const t = i / numSamples;
            // Interpolate spherical angles
            const curLat = ORIGIN.lat + (hub.lat - ORIGIN.lat) * t;
            const curLng = ORIGIN.lng + (hub.lng - ORIGIN.lng) * t;
            // Loft arc into orbit
            const loft = Math.sin(t * Math.PI) * (globeRadius * 0.22);
            const vec = latLngToVector3D(curLat, curLng, globeRadius + loft);
            const [rx, ry, rz] = rotate3D(vec, rotY, rotX);
            arcPoints.push({ x: cx + rx, y: cy - ry, z: rz });
          }

          // Draw Arc Line
          ctx.beginPath();
          let started = false;
          arcPoints.forEach((pt) => {
            if (pt.z > -globeRadius * 0.3) {
              if (!started) {
                ctx.moveTo(pt.x, pt.y);
                started = true;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
          });
          ctx.strokeStyle = isSelected ? 'rgba(0, 240, 255, 0.8)' : 'rgba(199, 255, 74, 0.25)';
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.setLineDash(isSelected ? [] : [3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Travelling Data Packet
          if (isSelected) {
            const packetIndex = Math.floor(packetProgress * (arcPoints.length - 1));
            const p1 = arcPoints[packetIndex];
            const p2 = arcPoints[Math.min(packetIndex + 1, arcPoints.length - 1)];
            const subT = (packetProgress * (arcPoints.length - 1)) % 1;
            const px = p1.x + (p2.x - p1.x) * subT;
            const py = p1.y + (p2.y - p1.y) * subT;
            const pz = p1.z + (p2.z - p1.z) * subT;

            if (pz > -globeRadius * 0.2) {
              ctx.beginPath();
              ctx.arc(px, py, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#00F0FF';
              ctx.shadowColor = '#00F0FF';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }

        // Draw Hub Marker Node
        if (isHubVisible) {
          const hpx = cx + hx;
          const hpy = cy - hy;

          ctx.beginPath();
          ctx.arc(hpx, hpy, isSelected ? 4 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#00F0FF' : 'rgba(242, 240, 234, 0.7)';
          ctx.fill();

          if (isSelected) {
            ctx.beginPath();
            ctx.arc(hpx, hpy, 8 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label
            ctx.font = '10px monospace';
            ctx.fillStyle = '#00F0FF';
            ctx.fillText(`${hub.code} (${hub.name.split(' ')[0]})`, hpx + 10, hpy + 3);
          }
        }
      });

      // 7. Render Primary Base Node (Visakhapatnam)
      if (isOriginVisible) {
        const vpx = cx + ox;
        const vpy = cy - oy;

        // Radiating Pulse Ring
        const pulse = (Date.now() * 0.003) % (Math.PI * 2);
        const pulseRadius = 6 + Math.sin(pulse) * 6;

        ctx.beginPath();
        ctx.arc(vpx, vpy, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(199, 255, 74, ${Math.max(0, 1 - pulseRadius / 12)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Core Solid Dot
        ctx.beginPath();
        ctx.arc(vpx, vpy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#C7FF4A';
        ctx.shadowColor = '#C7FF4A';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label Badge
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#C7FF4A';
        ctx.fillText('VTZ // NIKHIL BASE', vpx + 12, vpy - 4);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#8E8E8E';
        ctx.fillText(ORIGIN.coordsText, vpx + 12, vpy + 8);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedHub]);

  // Mouse / Touch Drag handlers for 360° Globe Inspection
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - lastMousePosRef.current.x;
    const dy = clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: clientX, y: clientY };

    rotYRef.current += dx * 0.008;
    targetRotYRef.current = rotYRef.current;

    rotXRef.current = Math.max(-0.9, Math.min(0.9, rotXRef.current + dy * 0.008));
    targetRotXRef.current = rotXRef.current;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="mt-16 sm:mt-24 border border-[rgba(242,240,234,0.12)] bg-[#07080D] p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
      {/* Decorative Cyber Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(242,240,234,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(242,240,234,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Header Telemetry */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[rgba(242,240,234,0.08)] gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#C7FF4A] uppercase mb-1">
            <Radio size={14} className="animate-pulse text-[#C7FF4A]" />
            <span>GLOBAL ORBITAL RELAY // REAL-TIME GEOSPATIAL NODE</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-sans font-bold text-[#F2F0EA] flex items-center gap-3">
            <span>ORIGIN: VISAKHAPATNAM, INDIA</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#C7FF4A]/10 border border-[#C7FF4A]/30 text-[#C7FF4A]">
              AP-SOUTH-1 NODE
            </span>
          </h4>
        </div>

        {/* Live IST Clock & Latency Badge */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E1017] border border-[rgba(242,240,234,0.08)] text-[#F2F0EA]">
            <Clock size={13} className="text-[#00F0FF]" />
            <span>{istTime || '12:00:00'} IST (UTC+5:30)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E1017] border border-[rgba(242,240,234,0.08)] text-[#C7FF4A]">
            <Wifi size={13} className="animate-pulse" />
            <span>{currentPing}ms LATENCY</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
        {/* 3D Rotating Globe Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            className="relative w-full h-80 sm:h-[420px] bg-gradient-to-b from-[#0A0C14] to-[#040508] border border-[rgba(242,240,234,0.08)] rounded-xl cursor-grab active:cursor-grabbing overflow-hidden shadow-inner flex items-center justify-center select-none touch-none"
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handlePointerUp}
          >
            <canvas ref={canvasRef} className="w-full h-full touch-none" />

            {/* Orbit Instructions Overlay */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#8E8E8E] bg-[#07080D]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[rgba(242,240,234,0.1)] flex items-center gap-2">
              <Compass size={12} className="text-[#00F0FF]" />
              <span>DRAG TO ORBIT 360° // SELECT HUBS TO ROUTE HIGH-SPEED RELAY</span>
            </div>
          </div>
        </div>

        {/* Tactical Telemetry & Tech Hub Relays */}
        <div className="lg:col-span-5 space-y-5">
          <div className="border border-[rgba(242,240,234,0.08)] bg-[#0C0E17] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E8E] border-b border-[rgba(242,240,234,0.06)] pb-3">
              <span className="flex items-center gap-1.5 text-[#F2F0EA]">
                <MapPin size={13} className="text-[#C7FF4A]" />
                <span>GEODETIC TELEMETRY</span>
              </span>
              <span className="text-[#C7FF4A] flex items-center gap-1">
                <ShieldCheck size={13} />
                <span>OPERATIONAL</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#121522] p-3 rounded-lg border border-[rgba(242,240,234,0.04)]">
                <div className="text-[9px] text-[#8E8E8E] uppercase">COORDINATES</div>
                <div className="text-[#F2F0EA] font-bold text-[11px] mt-0.5">{ORIGIN.coordsText}</div>
              </div>
              <div className="bg-[#121522] p-3 rounded-lg border border-[rgba(242,240,234,0.04)]">
                <div className="text-[9px] text-[#8E8E8E] uppercase">ACADEMIC BASE</div>
                <div className="text-[#00F0FF] font-bold text-[11px] mt-0.5">NXT WAVE / VIZAG</div>
              </div>
              <div className="bg-[#121522] p-3 rounded-lg border border-[rgba(242,240,234,0.04)]">
                <div className="text-[9px] text-[#8E8E8E] uppercase">BACKBONE FIBER</div>
                <div className="text-[#C7FF4A] font-bold text-[11px] mt-0.5">10 Gbps LOW JITTER</div>
              </div>
              <div className="bg-[#121522] p-3 rounded-lg border border-[rgba(242,240,234,0.04)]">
                <div className="text-[9px] text-[#8E8E8E] uppercase">TIMEZONE OFFSET</div>
                <div className="text-[#F2F0EA] font-bold text-[11px] mt-0.5">UTC +05:30 (IST)</div>
              </div>
            </div>
          </div>

          {/* Global Orbital Signal Links */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono tracking-widest text-[#8E8E8E] uppercase flex items-center justify-between px-1">
              <span>TARGET ORBITAL SIGNAL ROUTING</span>
              <span className="text-[#00F0FF]">{selectedHub.code} LINK ACTIVE</span>
            </div>

            <div className="space-y-1.5">
              {TECH_HUBS.map((hub) => {
                const isSelected = selectedHub.code === hub.code;
                return (
                  <button
                    key={hub.code}
                    type="button"
                    onClick={() => focusOnHub(hub)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                      isSelected
                        ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-[#F2F0EA] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'border-[rgba(242,240,234,0.08)] bg-[#0C0E17]/60 text-[#8E8E8E] hover:border-[rgba(242,240,234,0.2)] hover:text-[#F2F0EA]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-[#555]'
                        }`}
                      />
                      <span className="font-bold">{hub.code}</span>
                      <span className="text-[11px] text-[#8E8E8E] hidden sm:inline">— {hub.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#666] hidden md:inline">{hub.region}</span>
                      <span
                        className={`font-bold ${
                          isSelected ? 'text-[#00F0FF]' : 'text-[#8E8E8E]'
                        }`}
                      >
                        ~{hub.ping}ms
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
