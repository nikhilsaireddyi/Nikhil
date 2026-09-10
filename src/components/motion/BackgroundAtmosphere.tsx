'use client';

import { useEffect, useRef, useState } from 'react';
import { centralScroll } from '@/motion/scroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { playShockwaveBoom, playLaserFire, getAudioAnalyser, isSoundEnabled } from '@/lib/sound';

export type BgVehicleMode = 'spaceship' | 'supra' | 'escort';

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  layer: number;
  color: string;
  glow: string;
  radius: number;
}

interface SynapseEdge {
  from: number;
  to: number;
  speed: number;
  progress: number;
  color: string;
}

interface BokehParticle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  baseAlpha: number;
}

interface AccretionParticle {
  angle: number;
  dist: number;
  speed: number;
  size: number;
  verticalJitter: number;
}

interface GravitationalShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  isSupernova?: boolean;
}

interface LightningArc {
  fromIndex: number;
  toIndex: number;
  segments: { x: number; y: number }[];
  life: number;
  maxLife: number;
  color: string;
}

interface ThrusterParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface LaserBolt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  life: number;
  color: string;
}

interface LaserSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

const PALETTE = [
  { primary: '#00F0FF', glow: 'rgba(0, 240, 255, 0.8)' },
  { primary: '#7928CA', glow: 'rgba(121, 40, 202, 0.8)' },
  { primary: '#FF007F', glow: 'rgba(255, 0, 127, 0.8)' },
  { primary: '#C7FF4A', glow: 'rgba(199, 255, 74, 0.8)' },
  { primary: '#FFB703', glow: 'rgba(255, 183, 3, 0.8)' },
];

export function BackgroundAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const [vehicleMode, setVehicleMode] = useState<BgVehicleMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-bg-vehicle') as BgVehicleMode | null;
      if (saved && (saved === 'spaceship' || saved === 'supra' || saved === 'escort')) {
        return saved;
      }
    }
    return 'escort';
  });

  // Listen for global vehicle mode changes
  useEffect(() => {
    const handleVehicleChange = (e: Event) => {
      const customEvent = e as CustomEvent<BgVehicleMode>;
      if (customEvent.detail) {
        setVehicleMode(customEvent.detail);
      }
    };
    window.addEventListener('set-bg-vehicle', handleVehicleChange);
    return () => window.removeEventListener('set-bg-vehicle', handleVehicleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const dustCount = isMobile ? 65 : 130;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      rawX: width * 0.5,
      rawY: height * 0.5,
      active: false,
    };

    let isHolding = false;
    let holdDuration = 0;

    let targetScrollProgress = 0;
    let smoothScrollProgress = 0;
    let scrollVelocity = 0;
    let time = 0;
    let wheelRotation = 0;

    // 1. Initialize Volumetric 3D Deep Space Bokeh Dust
    const dustParticles: BokehParticle3D[] = [];
    for (let i = 0; i < dustCount; i++) {
      const p = PALETTE[i % PALETTE.length];
      dustParticles.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * 900 + 50,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3.5 + 1.0,
        color: p.primary,
        baseAlpha: Math.random() * 0.45 + 0.15,
      });
    }

    // 2. Initialize Relativistic Accretion Disk (Interstellar-style Doppler matter)
    const accretionParticles: AccretionParticle[] = [];
    const accretionCount = isMobile ? 40 : 80;
    for (let i = 0; i < accretionCount; i++) {
      accretionParticles.push({
        angle: Math.random() * Math.PI * 2,
        dist: 45 + Math.random() * 125,
        speed: 0.015 + Math.random() * 0.025,
        size: Math.random() * 2.2 + 0.8,
        verticalJitter: (Math.random() - 0.5) * 12,
      });
    }

    // 3. Spacetime Gravitational Shockwaves, Lightning Arcs & Particles
    const shockwaves: GravitationalShockwave[] = [];
    const lightningArcs: LightningArc[] = [];
    const thrusterParticles: ThrusterParticle[] = [];
    const laserBolts: LaserBolt[] = [];
    const laserSparks: LaserSpark[] = [];

    const spawnShockwave = (x: number, y: number, isSupernova = false) => {
      if (reducedMotion) return;
      playShockwaveBoom();
      shockwaves.push({
        x,
        y,
        radius: 10,
        maxRadius: Math.max(width, height) * (isSupernova ? 0.95 : 0.75),
        alpha: isSupernova ? 1.0 : 0.85,
        speed: isSupernova ? 22 + scrollVelocity * 6 : 12 + scrollVelocity * 4,
        isSupernova,
      });
    };

    // 4. Generate 3D Neural Nodes in concentric mathematical shells
    const nodes: Node3D[] = [];
    const nodeCount = isMobile ? 36 : 56;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      let shellRadius = 140;
      let layer = 1;
      if (i < 8) {
        shellRadius = 55;
        layer = 0;
      } else if (i < 24) {
        shellRadius = 110;
        layer = 1;
      } else if (i < 42) {
        shellRadius = 165;
        layer = 2;
      } else {
        shellRadius = 215;
        layer = 3;
      }

      const bx = Math.cos(theta) * radiusAtY * shellRadius;
      const by = y * shellRadius;
      const bz = Math.sin(theta) * radiusAtY * shellRadius;
      const p = PALETTE[i % PALETTE.length];

      nodes.push({
        x: bx,
        y: by,
        z: bz,
        baseX: bx,
        baseY: by,
        baseZ: bz,
        layer,
        color: p.primary,
        glow: p.glow,
        radius: layer === 0 ? 4.5 : layer === 1 ? 3.5 : 2.5,
      });
    }

    // 5. Construct 3D Synaptic Connections
    const synapses: SynapseEdge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        const dz = nodes[i].baseZ - nodes[j].baseZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 95 && Math.random() > 0.35) {
          synapses.push({
            from: i,
            to: j,
            speed: 0.008 + Math.random() * 0.015,
            progress: Math.random(),
            color: nodes[i].color,
          });
        }
      }
    }

    // Window Listeners
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.rawX = e.clientX;
      mouse.rawY = e.clientY;
      mouse.targetX = (e.clientX - width * 0.5) * 0.35;
      mouse.targetY = (e.clientY - height * 0.5) * 0.35;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.active = false;
      isHolding = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouse.rawX = e.clientX;
      mouse.rawY = e.clientY;
      isHolding = true;
      holdDuration = 0;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isHolding && holdDuration > 0.35) {
        // Supernova Burst release
        spawnShockwave(e.clientX, e.clientY, true);
        // Blast dust radially
        for (const d of dustParticles) {
          const dx = d.x - (e.clientX - width * 0.5);
          const dy = d.y - (e.clientY - height * 0.5);
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 400) {
            const blast = (1 - dist / 400) * 18;
            d.vx += (dx / dist) * blast;
            d.vy += (dy / dist) * blast;
          }
        }
      } else {
        // Normal click shockwave & laser fire
        spawnShockwave(e.clientX, e.clientY, false);
        fireLasers(e.clientX, e.clientY);
      }
      isHolding = false;
      holdDuration = 0;
    };

    const fireLasers = (targetX: number, targetY: number) => {
      if (reducedMotion) return;
      playLaserFire();

      // Determine muzzle origins based on active vehicle
      if (vehicleMode === 'spaceship' || vehicleMode === 'escort') {
        const wingL = { x: lastShipPos.x - 30, y: lastShipPos.y + 6 };
        const wingR = { x: lastShipPos.x + 30, y: lastShipPos.y + 6 };
        [wingL, wingR].forEach((wing) => {
          const angle = Math.atan2(targetY - wing.y, targetX - wing.x);
          const speed = 26;
          laserBolts.push({
            x: wing.x,
            y: wing.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            targetX,
            targetY,
            life: 1.0,
            color: '#00F0FF',
          });
        });
      }

      if (vehicleMode === 'supra' || vehicleMode === 'escort') {
        const headL = { x: lastCarPos.x - 18, y: lastCarPos.y };
        const headR = { x: lastCarPos.x + 18, y: lastCarPos.y };
        [headL, headR].forEach((head) => {
          const angle = Math.atan2(targetY - head.y, targetX - head.x);
          const speed = 28;
          laserBolts.push({
            x: head.x,
            y: head.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            targetX,
            targetY,
            life: 1.0,
            color: '#C7FF4A',
          });
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    const unsubscribeScroll = centralScroll.subscribe((payload) => {
      targetScrollProgress = payload.progress;
      scrollVelocity = Math.abs(payload.velocity);
    });

    let animationFrameId: number;
    const lastShipPos = { x: width * 0.5, y: height * 0.5 };
    const lastCarPos = { x: width * 0.5, y: height * 0.65 };

    // --- MAIN RENDER LOOP ---
    const render = () => {
      time += 0.016;
      smoothScrollProgress += (targetScrollProgress - smoothScrollProgress) * 0.06;
      scrollVelocity *= 0.94;
      const t = smoothScrollProgress;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Real-Time Audio Frequency FFT Spectrum Query
      let bassBoost = 0;
      let midBoost = 0;
      let trebleBoost = 0;
      const analyser = getAudioAnalyser();
      if (analyser && isSoundEnabled()) {
        const freqBins = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqBins);
        // Bass (0..3)
        bassBoost = (freqBins[0] + freqBins[1] + freqBins[2] + freqBins[3]) / (4 * 255);
        // Mids (4..12)
        let midSum = 0;
        for (let b = 4; b <= 12; b++) midSum += freqBins[b];
        midBoost = midSum / (9 * 255);
        // Treble (13..24)
        let trSum = 0;
        for (let b = 13; b <= 24; b++) trSum += freqBins[b];
        trebleBoost = trSum / (12 * 255);
      }

      // Tractor Beam Charge Dynamics
      if (isHolding) {
        holdDuration = Math.min(3.0, holdDuration + 0.035);
      }

      // 1. Clear Screen
      ctx.clearRect(0, 0, width, height);

      // --- MULTI-BIOME ALTITUDE SHIFT ---
      // Biome 1: Deep Space Singularity (0.0 to 0.25)
      // Biome 2: Orbital Earth Exosphere (0.25 to 0.50)
      // Biome 3: Cyberspace Data Highway (0.50 to 0.75)
      // Biome 4: Quantum Synchrotron Core (0.75 to 1.0)
      const auroraX1 = width * 0.25 + Math.sin(time * 0.4) * 80 + mouse.x * 0.15;
      const auroraY1 = height * 0.35 + Math.cos(time * 0.3) * 70 + mouse.y * 0.15;
      const auroraGrad1 = ctx.createRadialGradient(auroraX1, auroraY1, 20, auroraX1, auroraY1, width * 0.55);

      if (t < 0.25) {
        // Deep Nebula Violet / Cyan
        auroraGrad1.addColorStop(0, `rgba(0, 240, 255, ${0.12 + bassBoost * 0.15})`);
        auroraGrad1.addColorStop(0.5, 'rgba(121, 40, 202, 0.08)');
        auroraGrad1.addColorStop(1, 'transparent');
      } else if (t < 0.50) {
        // Orbital Stratosphere Blue / Cyan
        auroraGrad1.addColorStop(0, `rgba(0, 160, 255, ${0.16 + bassBoost * 0.12})`);
        auroraGrad1.addColorStop(0.6, 'rgba(0, 240, 255, 0.06)');
        auroraGrad1.addColorStop(1, 'transparent');
      } else if (t < 0.75) {
        // Cyberspace Highway Neon Lime / Cyan
        auroraGrad1.addColorStop(0, `rgba(199, 255, 74, ${0.12 + midBoost * 0.15})`);
        auroraGrad1.addColorStop(0.55, 'rgba(0, 240, 255, 0.07)');
        auroraGrad1.addColorStop(1, 'transparent');
      } else {
        // Quantum Accelerator Solar Amber / Magenta
        auroraGrad1.addColorStop(0, `rgba(255, 183, 3, ${0.14 + bassBoost * 0.16})`);
        auroraGrad1.addColorStop(0.55, 'rgba(255, 0, 127, 0.09)');
        auroraGrad1.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = auroraGrad1;
      ctx.fillRect(0, 0, width, height);

      // Biome 2: Orbital Earth Horizon Arc (About Section: 0.25 to 0.50)
      if (t > 0.20 && t < 0.55) {
        const horizonBlend = Math.sin(((t - 0.20) / 0.35) * Math.PI);
        const arcY = height * 1.5;
        const arcR = height * 0.95;

        ctx.save();
        ctx.beginPath();
        ctx.arc(width * 0.5, arcY, arcR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.28 * horizonBlend})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Atmospheric Rayleigh Scattering Glow
        const earthGlow = ctx.createRadialGradient(width * 0.5, arcY, arcR * 0.9, width * 0.5, arcY, arcR * 1.08);
        earthGlow.addColorStop(0, `rgba(0, 100, 255, ${0.25 * horizonBlend})`);
        earthGlow.addColorStop(0.4, `rgba(0, 240, 255, ${0.12 * horizonBlend})`);
        earthGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = earthGlow;
        ctx.fill();
        ctx.restore();
      }

      // Biome 3: Cyberspace Data Matrix Floor (Projects Section: 0.50 to 0.75)
      if (t > 0.45 && t < 0.80) {
        const matrixBlend = Math.sin(((t - 0.45) / 0.35) * Math.PI);
        const gridHorizonY = height * 0.62;
        ctx.save();
        ctx.strokeStyle = `rgba(199, 255, 74, ${0.15 * matrixBlend})`;
        ctx.lineWidth = 1;

        // Perspective grid lines
        const numLines = 14;
        for (let i = 0; i <= numLines; i++) {
          const ratio = (i / numLines - 0.5) * 2;
          ctx.beginPath();
          ctx.moveTo(width * 0.5 + ratio * 80, gridHorizonY);
          ctx.lineTo(width * 0.5 + ratio * width * 0.9, height);
          ctx.stroke();
        }

        // Horizontal scrolling grid lines
        const gridOffset = (time * 120 * (1 + scrollVelocity * 2)) % 30;
        for (let y = gridHorizonY; y <= height; y += (y - gridHorizonY) * 0.35 + 8) {
          ctx.beginPath();
          ctx.moveTo(0, y + gridOffset * 0.2);
          ctx.lineTo(width, y + gridOffset * 0.2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Biome 4: Quantum Particle Synchrotron Rings (Lab & Contact: 0.75 to 1.0)
      if (t > 0.70) {
        const ringBlend = Math.min(1.0, (t - 0.70) / 0.25);
        ctx.save();
        const syncRadius = 140 + Math.sin(time * 3) * 10;
        for (let sr = 1; sr <= 3; sr++) {
          ctx.beginPath();
          ctx.arc(width * 0.65, height * 0.5, syncRadius * sr * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = sr % 2 === 0 ? `rgba(255, 183, 3, ${0.25 * ringBlend})` : `rgba(199, 255, 74, ${0.2 * ringBlend})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([8, 12]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
      }

      // 2. Volumetric 3D Deep Space Dust + HYPERDRIVE WARP STREAKS
      if (!reducedMotion) {
        const warpFactor = Math.min(1.0, scrollVelocity * 1.8);
        const dustSpeedFactor = 1.0 + Math.min(scrollVelocity * 2.5, 14);
        const fovDust = 380;
        const dustCX = width * 0.5 + mouse.x * 0.3;
        const dustCY = height * 0.5 + mouse.y * 0.3;

        for (let i = 0; i < dustParticles.length; i++) {
          const d = dustParticles[i];
          d.x += d.vx * dustSpeedFactor;
          d.y += d.vy * dustSpeedFactor;
          d.z -= d.vz * dustSpeedFactor + 0.6 + warpFactor * 3;

          // Gravitational Tractor Beam Inward Spiral Pull
          if (isHolding) {
            const dxM = (mouse.rawX - dustCX) - d.x * (fovDust / d.z);
            const dyM = (mouse.rawY - dustCY) - d.y * (fovDust / d.z);
            const distM = Math.hypot(dxM, dyM);
            if (distM < 350 && distM > 10) {
              const pull = (1 - distM / 350) * (6 + holdDuration * 6);
              d.vx += (dxM / distM) * pull * 0.05;
              d.vy += (dyM / distM) * pull * 0.05;
              // Add rotational swirl
              d.vx += (-dyM / distM) * pull * 0.04;
              d.vy += (dxM / distM) * pull * 0.04;
            }
          }

          // Wrap bounds
          if (d.z <= 40) d.z = 900;
          if (d.z > 900) d.z = 45;
          if (d.x < -width) d.x = width;
          if (d.x > width) d.x = -width;
          if (d.y < -height) d.y = height;
          if (d.y > height) d.y = -height;

          const scale = fovDust / d.z;
          const px = dustCX + d.x * scale;
          const py = dustCY + d.y * scale;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const depthRatio = 1 - d.z / 900;
            const isClose = d.z < 280;
            const r = isClose ? d.size * scale * 2.2 : Math.max(0.7, d.size * scale);
            const alpha = (isClose ? d.baseAlpha * 0.4 : d.baseAlpha * depthRatio) * (1 + trebleBoost * 0.5);

            ctx.save();
            if (warpFactor > 0.06) {
              // RELATIVISTIC WARP SPEED STREAK
              const dx = px - dustCX;
              const dy = py - dustCY;
              const distCenter = Math.hypot(dx, dy) || 1;
              const dirX = dx / distCenter;
              const dirY = dy / distCenter;
              const streakLen = warpFactor * (distCenter * 0.22 + 18);

              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px + dirX * streakLen, py + dirY * streakLen);
              ctx.strokeStyle = warpFactor > 0.4 ? '#FFFFFF' : d.color;
              ctx.lineWidth = Math.max(1.2, r * (1 + warpFactor * 0.6));
              ctx.globalAlpha = Math.min(0.9, alpha * 1.5);
              ctx.shadowColor = d.color;
              ctx.shadowBlur = 8;
              ctx.stroke();
            } else {
              // Normal Bokeh Particle
              ctx.beginPath();
              ctx.arc(px, py, r, 0, Math.PI * 2);
              ctx.fillStyle = d.color;
              ctx.globalAlpha = Math.min(0.75, alpha);
              if (isClose) {
                ctx.shadowColor = d.color;
                ctx.shadowBlur = 12;
              }
              ctx.fill();
            }
            ctx.restore();
          }
        }
      }

      // Interactive Gravitational Tractor Beam Singularity Vortex Visualizer
      if (isHolding) {
        ctx.save();
        const vortexRadius = 35 + holdDuration * 45;
        const vortexGrad = ctx.createRadialGradient(
          mouse.rawX,
          mouse.rawY,
          5,
          mouse.rawX,
          mouse.rawY,
          vortexRadius * 1.5
        );
        vortexGrad.addColorStop(0, '#FFFFFF');
        vortexGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
        vortexGrad.addColorStop(0.7, 'rgba(121, 40, 202, 0.4)');
        vortexGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = vortexGrad;
        ctx.beginPath();
        ctx.arc(mouse.rawX, mouse.rawY, vortexRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Gravitational Inward Lensing Rings
        for (let ring = 1; ring <= 3; ring++) {
          const rRing = (vortexRadius * (ring / 3) + (time * 60) % (vortexRadius / 3));
          ctx.beginPath();
          ctx.arc(mouse.rawX, mouse.rawY, rRing, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - rRing / (vortexRadius * 1.5))})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Spacetime Gravitational Shockwaves
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwaves[sIdx];
        sw.radius += sw.speed;
        sw.alpha -= sw.isSupernova ? 0.012 : 0.018;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(sIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.isSupernova
          ? `rgba(255, 255, 255, ${sw.alpha * 0.9})`
          : `rgba(0, 240, 255, ${sw.alpha * 0.5})`;
        ctx.lineWidth = sw.isSupernova ? 4.0 : 2.5;
        ctx.shadowColor = sw.isSupernova ? '#00F0FF' : '#7928CA';
        ctx.shadowBlur = sw.isSupernova ? 25 : 15;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 28), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 0, 127, ${sw.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Laser Bolts & Spark Impacts
      for (let bIdx = laserBolts.length - 1; bIdx >= 0; bIdx--) {
        const bolt = laserBolts[bIdx];
        bolt.x += bolt.vx;
        bolt.y += bolt.vy;

        const distTarget = Math.hypot(bolt.targetX - bolt.x, bolt.targetY - bolt.y);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bolt.x - bolt.vx * 0.5, bolt.y - bolt.vy * 0.5);
        ctx.lineTo(bolt.x, bolt.y);
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = 3.0;
        ctx.shadowColor = bolt.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // Reached target or off screen -> Spawn spark burst
        if (distTarget < 30 || bolt.x < 0 || bolt.x > width || bolt.y < 0 || bolt.y > height) {
          for (let sp = 0; sp < 10; sp++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 6 + 2;
            laserSparks.push({
              x: bolt.x,
              y: bolt.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: bolt.color,
              life: 1.0,
            });
          }
          laserBolts.splice(bIdx, 1);
        }
      }

      // Render Laser Sparks
      for (let spIdx = laserSparks.length - 1; spIdx >= 0; spIdx--) {
        const spk = laserSparks[spIdx];
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.vy += 0.15; // subtle gravity
        spk.life -= 0.04;

        if (spk.life <= 0) {
          laserSparks.splice(spIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(spk.x, spk.y, 2 * spk.life, 0, Math.PI * 2);
        ctx.fillStyle = spk.color;
        ctx.globalAlpha = spk.life;
        ctx.shadowColor = spk.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // 5. THE 3D QUANTUM AI NEURAL SINGULARITY CORE
      const rotY = time * 0.25 + t * Math.PI * 1.2 + mouse.x * 0.002;
      const rotX = Math.sin(time * 0.18) * 0.35 + (t - 0.5) * 0.6 - mouse.y * 0.002;
      const rotZ = Math.cos(time * 0.2) * 0.2 + t * 0.4;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const fov = isMobile ? 420 : 540;
      const cameraZ = isMobile ? 620 : 520;
      const coreCenterX = width * (isMobile ? 0.5 : 0.65) + mouse.x * 0.2;
      const coreCenterY = height * 0.5 + mouse.y * 0.2;

      const dispersion = (1 - t) * 1.4;

      // Transform 3D Neural Nodes
      const projectedNodes: { x: number; y: number; z: number; projX: number; projY: number; scale: number; alpha: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        let nx = node.baseX * (1 + dispersion * (node.layer === 0 ? 0.5 : 1.2));
        let ny = node.baseY * (1 + dispersion * (node.layer === 0 ? 0.5 : 1.2));
        let nz = node.baseZ * (1 + dispersion * (node.layer === 0 ? 0.5 : 1.2));

        const breathe = 1 + Math.sin(time * 2 + i * 0.3) * 0.04 + bassBoost * 0.12;
        nx *= breathe;
        ny *= breathe;
        nz *= breathe;

        const x1 = nx * cosY + nz * sinY;
        const z1 = -nx * sinY + nz * cosY;
        const y2 = ny * cosX - z1 * sinX;
        const z2 = ny * sinX + z1 * cosX;
        const x3 = x1 * cosZ - y2 * sinZ;
        const y3 = x1 * sinZ + y2 * cosZ;

        const totalZ = z2 + cameraZ;
        const scale = fov / Math.max(100, totalZ);

        let projX = coreCenterX + x3 * scale;
        let projY = coreCenterY + y3 * scale;

        // Shockwave displacement
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const distSw = Math.hypot(projX - sw.x, projY - sw.y);
          const diff = Math.abs(distSw - sw.radius);
          if (diff < 45) {
            const waveForce = Math.sin((1 - diff / 45) * Math.PI) * sw.alpha * 16;
            const angle = Math.atan2(projY - sw.y, projX - sw.x);
            projX += Math.cos(angle) * waveForce;
            projY += Math.sin(angle) * waveForce;
          }
        }

        const depthRatio = Math.max(0.15, Math.min(1.0, (1 - z2 / 400)));
        const alpha = Math.min(1.0, depthRatio * (0.4 + t * 0.6));

        projectedNodes.push({
          x: x3,
          y: y3,
          z: totalZ,
          projX,
          projY,
          scale,
          alpha,
        });
      }

      // 6. Draw Relativistic Accretion Disk (Interstellar Doppler Beaming)
      if (t > 0.15) {
        ctx.save();
        const diskTilt = 1.15;
        for (let i = 0; i < accretionParticles.length; i++) {
          const ap = accretionParticles[i];
          ap.angle += ap.speed * (1 + scrollVelocity * 0.8 + bassBoost * 0.6);

          const rawX = Math.cos(ap.angle) * ap.dist;
          const rawZ = Math.sin(ap.angle) * ap.dist;
          const rawY = Math.sin(ap.angle * 2 + time) * ap.verticalJitter;

          const adX = rawX;
          const adY = rawY * Math.cos(diskTilt) - rawZ * Math.sin(diskTilt);
          const adZ = rawY * Math.sin(diskTilt) + rawZ * Math.cos(diskTilt);

          const x1 = adX * cosY + adZ * sinY;
          const z1 = -adX * sinY + adZ * cosY;
          const y2 = adY * cosX - z1 * sinX;
          const z2 = adY * sinX + z1 * cosX;

          const totalZ = z2 + cameraZ;
          const scale = fov / Math.max(100, totalZ);
          const px = coreCenterX + x1 * scale;
          const py = coreCenterY + y2 * scale;

          const dopplerFactor = (x1 / (ap.dist + 1));
          const isApproaching = dopplerFactor < 0;
          const particleColor = isApproaching ? '#00F0FF' : '#FF007F';
          const particleAlpha = isApproaching
            ? Math.min(0.9, 0.45 + Math.abs(dopplerFactor) * 0.45)
            : Math.max(0.2, 0.4 - dopplerFactor * 0.2);

          ctx.beginPath();
          ctx.arc(px, py, ap.size * scale * (isApproaching ? 1.3 : 0.9), 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.globalAlpha = particleAlpha * Math.min(1.0, t * 1.5) * (1 + bassBoost * 0.3);
          ctx.shadowColor = particleColor;
          ctx.shadowBlur = isApproaching ? 10 : 4;
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. Draw 3D Synaptic Connections & Photons
      const synapseAlphaMultiplier = Math.min(1.0, 0.1 + t * 0.9);
      for (let i = 0; i < synapses.length; i++) {
        const edge = synapses[i];
        const p1 = projectedNodes[edge.from];
        const p2 = projectedNodes[edge.to];
        if (!p1 || !p2) continue;

        const avgAlpha = (p1.alpha + p2.alpha) * 0.5 * synapseAlphaMultiplier;
        ctx.beginPath();
        ctx.moveTo(p1.projX, p1.projY);
        ctx.lineTo(p2.projX, p2.projY);
        ctx.strokeStyle = `rgba(0, 240, 255, ${avgAlpha * 0.28})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        edge.progress += edge.speed * (1 + scrollVelocity * 0.5);
        if (edge.progress >= 1.0) edge.progress = 0;

        const packetX = p1.projX + (p2.projX - p1.projX) * edge.progress;
        const packetY = p1.projY + (p2.projY - p1.projY) * edge.progress;

        ctx.beginPath();
        ctx.arc(packetX, packetY, 1.8 * (p1.scale / 1.5), 0, Math.PI * 2);
        ctx.fillStyle = edge.color;
        ctx.shadowColor = edge.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 8. Branching Synaptic Lightning Arcs
      const lightningTriggerRate = 0.08 + midBoost * 0.2;
      if (Math.random() < lightningTriggerRate && projectedNodes.length > 10) {
        const fromIdx = Math.floor(Math.random() * projectedNodes.length);
        const toIdx = (fromIdx + 1 + Math.floor(Math.random() * 4)) % projectedNodes.length;
        const p1 = projectedNodes[fromIdx];
        const p2 = projectedNodes[toIdx];

        if (p1 && p2) {
          const dist = Math.hypot(p1.projX - p2.projX, p1.projY - p2.projY);
          if (dist < 180 && dist > 20) {
            const segments: { x: number; y: number }[] = [{ x: p1.projX, y: p1.projY }];
            const count = 5;
            for (let s = 1; s < count; s++) {
              const ratio = s / count;
              const midX = p1.projX + (p2.projX - p1.projX) * ratio;
              const midY = p1.projY + (p2.projY - p1.projY) * ratio;
              const perpX = -(p2.projY - p1.projY) / dist;
              const perpY = (p2.projX - p1.projX) / dist;
              const jitter = (Math.random() - 0.5) * 22;
              segments.push({ x: midX + perpX * jitter, y: midY + perpY * jitter });
            }
            segments.push({ x: p2.projX, y: p2.projY });

            lightningArcs.push({
              fromIndex: fromIdx,
              toIndex: toIdx,
              segments,
              life: 1.0,
              maxLife: 6,
              color: '#00F0FF',
            });
          }
        }
      }

      for (let l = lightningArcs.length - 1; l >= 0; l--) {
        const arc = lightningArcs[l];
        arc.life -= 1 / arc.maxLife;
        if (arc.life <= 0) {
          lightningArcs.splice(l, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        for (let s = 0; s < arc.segments.length; s++) {
          if (s === 0) ctx.moveTo(arc.segments[s].x, arc.segments[s].y);
          else ctx.lineTo(arc.segments[s].x, arc.segments[s].y);
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.8 * arc.life;
        ctx.shadowColor = arc.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = arc.life;
        ctx.stroke();
        ctx.restore();
      }

      // 9. Central Superintelligent Singularity Core (Audio-Reactive Scale)
      const singularityRadius =
        (26 + Math.sin(time * 3) * 5 + t * 24 + bassBoost * 22) * (isMobile ? 0.7 : 1.0);
      const singularityGrad = ctx.createRadialGradient(
        coreCenterX,
        coreCenterY,
        singularityRadius * 0.1,
        coreCenterX,
        coreCenterY,
        singularityRadius * 2.8
      );
      singularityGrad.addColorStop(0, '#FFFFFF');
      singularityGrad.addColorStop(0.25, '#00F0FF');
      singularityGrad.addColorStop(0.55, '#7928CA');
      singularityGrad.addColorStop(0.85, 'rgba(255, 0, 127, 0.4)');
      singularityGrad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.beginPath();
      ctx.arc(coreCenterX, coreCenterY, singularityRadius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = singularityGrad;
      ctx.fill();

      // Pulsing Event Horizon Rings
      if (t > 0.4) {
        for (let eh = 1; eh <= 3; eh++) {
          const ehRadius = singularityRadius * (1.2 + eh * 0.4) + Math.sin(time * 2 + eh) * 4 + bassBoost * 14;
          ctx.beginPath();
          ctx.arc(coreCenterX, coreCenterY, ehRadius, 0, Math.PI * 2);
          ctx.strokeStyle = eh % 2 === 0 ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 0, 127, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      ctx.restore();

      // ====================================================================
      // 10. 3D QUANTUM SPACESHIP (NSR-01)
      // ====================================================================
      if (!reducedMotion && (vehicleMode === 'spaceship' || vehicleMode === 'escort')) {
        const shipPathAngle = t * Math.PI * 1.8 + 0.35;
        const pathRadiusX = width * (isMobile ? 0.38 : 0.34);
        const pathRadiusY = height * 0.26;

        // In escort mode, fly high-cover diagonal formation
        const escortOffsetX = vehicleMode === 'escort' ? 80 : 0;
        const escortOffsetY = vehicleMode === 'escort' ? -65 : 0;

        const shipCX = width * 0.52 + Math.cos(shipPathAngle) * pathRadiusX + mouse.x * 0.15 + escortOffsetX;
        const shipCY = height * 0.46 + Math.sin(shipPathAngle * 1.1) * pathRadiusY + (t - 0.5) * 80 + mouse.y * 0.15 + escortOffsetY;
        const shipCZ = 220 + Math.sin(t * Math.PI * 2) * 85;

        lastShipPos.x = shipCX;
        lastShipPos.y = shipCY;

        const deltaT = 0.015;
        const nextAngle = (t + deltaT) * Math.PI * 1.8 + 0.35;
        const nextX = width * 0.52 + Math.cos(nextAngle) * pathRadiusX + escortOffsetX;
        const nextY = height * 0.46 + Math.sin(nextAngle * 1.1) * pathRadiusY + (t + deltaT - 0.5) * 80 + escortOffsetY;
        const nextZ = 220 + Math.sin((t + deltaT) * Math.PI * 2) * 85;

        const dirX = nextX - shipCX;
        const dirY = nextY - shipCY;
        const dirZ = nextZ - shipCZ;

        const shipYaw = Math.atan2(dirX, Math.max(1, dirZ));
        const shipPitch = -Math.atan2(dirY, Math.hypot(dirX, dirZ));
        const shipRoll = -(dirX / (pathRadiusX * 0.4)) * 0.65 + Math.sin(time * 2.5) * 0.08;

        const cosYaw = Math.cos(shipYaw);
        const sinYaw = Math.sin(shipYaw);
        const cosPitch = Math.cos(shipPitch);
        const sinPitch = Math.sin(shipPitch);
        const cosRoll = Math.cos(shipRoll);
        const sinRoll = Math.sin(shipRoll);

        const rawShipVerts = [
          { x: 0, y: -2, z: 38 },
          { x: 0, y: -9, z: 16 },
          { x: 0, y: -5, z: -16 },
          { x: -10, y: 0, z: 2 },
          { x: 10, y: 0, z: 2 },
          { x: -38, y: 2, z: -24 },
          { x: 38, y: 2, z: -24 },
          { x: -11, y: -16, z: -22 },
          { x: 11, y: -16, z: -22 },
          { x: 0, y: 6, z: -4 },
          { x: -7, y: 1, z: -28 },
          { x: 7, y: 1, z: -28 },
        ];

        const fovShip = 500;
        const projShipVerts = rawShipVerts.map((v) => {
          const rx1 = v.x * cosRoll - v.y * sinRoll;
          const ry1 = v.x * sinRoll + v.y * cosRoll;
          const rz1 = v.z;

          const rx2 = rx1;
          const ry2 = ry1 * cosPitch - rz1 * sinPitch;
          const rz2 = ry1 * sinPitch + rz1 * cosPitch;

          const rx3 = rx2 * cosYaw + rz2 * sinYaw;
          const ry3 = ry2;
          const rz3 = -rx2 * sinYaw + rz2 * cosYaw;

          const totalZ = rz3 + shipCZ;
          const scale = fovShip / Math.max(80, totalZ);
          const px = shipCX + rx3 * scale;
          const py = shipCY + ry3 * scale;

          return { px, py, z: totalZ, scale };
        });

        // Ion Plasma Thrusters
        const thrusterIndices = [10, 11];
        const thrusterSpeed = 3.0 + Math.min(scrollVelocity * 6, 20);

        for (const idx of thrusterIndices) {
          const nozzle = projShipVerts[idx];
          if (nozzle) {
            for (let p = 0; p < 2; p++) {
              thrusterParticles.push({
                x: nozzle.px + (Math.random() - 0.5) * 3,
                y: nozzle.py + (Math.random() - 0.5) * 3,
                z: nozzle.z,
                vx: -Math.sin(shipYaw) * thrusterSpeed + (Math.random() - 0.5) * 1.5,
                vy: Math.sin(shipPitch) * thrusterSpeed + (Math.random() - 0.5) * 1.5,
                vz: -thrusterSpeed,
                size: Math.random() * 3.5 + 1.5,
                color: Math.random() > 0.3 ? '#00F0FF' : '#7928CA',
                life: 1.0,
                maxLife: Math.random() * 18 + 14,
              });
            }
          }
        }

        // Draw Thruster particles
        for (let tpIdx = thrusterParticles.length - 1; tpIdx >= 0; tpIdx--) {
          const tp = thrusterParticles[tpIdx];
          tp.x += tp.vx;
          tp.y += tp.vy;
          tp.vx *= 0.94;
          tp.vy *= 0.94;
          tp.life -= 1 / tp.maxLife;

          if (tp.life <= 0) {
            thrusterParticles.splice(tpIdx, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.size * tp.life, 0, Math.PI * 2);
          ctx.fillStyle = tp.color;
          ctx.globalAlpha = tp.life * 0.75;
          ctx.shadowColor = tp.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }

        const drawPoly = (indices: number[], fill: string, stroke = 'rgba(0, 240, 255, 0.45)', lineWidth = 1) => {
          ctx.save();
          ctx.beginPath();
          for (let i = 0; i < indices.length; i++) {
            const p = projShipVerts[indices[i]];
            if (i === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
          ctx.restore();
        };

        // Render spaceship hull faces
        drawPoly([3, 5, 10], '#0B0D16', 'rgba(0, 240, 255, 0.5)', 1.2);
        drawPoly([4, 6, 11], '#0B0D16', 'rgba(0, 240, 255, 0.5)', 1.2);
        drawPoly([0, 3, 9], '#080A10', 'rgba(121, 40, 202, 0.35)', 1);
        drawPoly([0, 4, 9], '#080A10', 'rgba(121, 40, 202, 0.35)', 1);
        drawPoly([0, 1, 3], '#121522', 'rgba(0, 240, 255, 0.6)', 1.2);
        drawPoly([0, 1, 4], '#161A2A', 'rgba(0, 240, 255, 0.6)', 1.2);
        drawPoly([1, 2, 3], '#0D0F1A', 'rgba(0, 240, 255, 0.4)', 1);
        drawPoly([1, 2, 4], '#111422', 'rgba(0, 240, 255, 0.4)', 1);
        drawPoly([2, 7, 10], '#090B14', 'rgba(255, 0, 127, 0.5)', 1);
        drawPoly([2, 8, 11], '#090B14', 'rgba(255, 0, 127, 0.5)', 1);
        drawPoly([0, 1, 4, 3], 'rgba(0, 240, 255, 0.65)', '#00F0FF', 1.5);

        // Vessel Telemetry Label
        const nose = projShipVerts[0];
        if (nose) {
          ctx.save();
          ctx.font = '8px monospace';
          ctx.fillStyle = 'rgba(0, 240, 255, 0.75)';
          ctx.fillText('NSR-01 // QUANTUM SCOUT', nose.px + 16, nose.py - 10);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nose.px + 4, nose.py - 4);
          ctx.lineTo(nose.px + 14, nose.py - 12);
          ctx.lineTo(nose.px + 90, nose.py - 12);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ====================================================================
      // 11. 3D CYBER SUPRA 911 AERODYNAMIC WIREFRAME
      // ====================================================================
      if (!reducedMotion && (vehicleMode === 'supra' || vehicleMode === 'escort')) {
        wheelRotation += 0.08 * (1 + scrollVelocity * 3.5);

        // Car position along horizon path
        const carPathAngle = t * Math.PI * 1.5 + 0.2;
        const carX = width * 0.48 + Math.cos(carPathAngle) * (width * 0.28) + mouse.x * 0.12;
        const carY = height * 0.62 + Math.sin(carPathAngle * 0.8) * (height * 0.15) + mouse.y * 0.1;
        const carZ = 200 + Math.sin(t * Math.PI * 2) * 60;

        lastCarPos.x = carX;
        lastCarPos.y = carY;

        // Orientation
        const carYaw = Math.sin(time * 0.6) * 0.15 + (mouse.x / width) * 0.25;
        const carPitch = -0.12 + Math.min(0.2, scrollVelocity * 0.08); // squat under acceleration
        const carRoll = -carYaw * 0.35;

        const cY = Math.cos(carYaw);
        const sY = Math.sin(carYaw);
        const cP = Math.cos(carPitch);
        const sP = Math.sin(carPitch);
        const cR = Math.cos(carRoll);
        const sR = Math.sin(carRoll);

        // 3D Supra 911 Vector Mesh Vertices
        const rawCarVerts = [
          { x: 0, y: 5, z: 36 },      // 0: Nose / front splitter center
          { x: -16, y: 5, z: 34 },    // 1: Left front splitter canard
          { x: 16, y: 5, z: 34 },     // 2: Right front splitter canard
          { x: -14, y: 1, z: 28 },    // 3: Left headlight
          { x: 14, y: 1, z: 28 },     // 4: Right headlight
          { x: 0, y: 0, z: 18 },      // 5: Hood center
          { x: -12, y: -3, z: 12 },   // 6: Left A-pillar base
          { x: 12, y: -3, z: 12 },    // 7: Right A-pillar base
          { x: 0, y: -11, z: -2 },    // 8: Roof apex
          { x: -10, y: -10, z: -2 },  // 9: Left roof edge
          { x: 10, y: -10, z: -2 },   // 10: Right roof edge
          { x: -16, y: 2, z: -22 },   // 11: Left rear widebody haunch
          { x: 16, y: 2, z: -22 },    // 12: Right rear widebody haunch
          { x: 0, y: -4, z: -32 },    // 13: Rear ducktail deck
          { x: -16, y: 0, z: -34 },   // 14: Left taillight
          { x: 16, y: 0, z: -34 },    // 15: Right taillight
          { x: -14, y: 6, z: -34 },   // 16: Left rear diffuser tunnel
          { x: 14, y: 6, z: -34 },    // 17: Right rear diffuser tunnel
          { x: -20, y: -13, z: -32 }, // 18: Left GT Wing blade tip
          { x: 20, y: -13, z: -32 },  // 19: Right GT Wing blade tip
          { x: -7, y: 4, z: -36 },    // 20: Left exhaust tip
          { x: 7, y: 4, z: -36 },     // 21: Right exhaust tip
        ];

        const fovCar = 520;
        const projCarVerts = rawCarVerts.map((v) => {
          const rx1 = v.x * cR - v.y * sR;
          const ry1 = v.x * sR + v.y * cR;
          const rz1 = v.z;

          const rx2 = rx1;
          const ry2 = ry1 * cP - rz1 * sP;
          const rz2 = ry1 * sP + rz1 * cP;

          const rx3 = rx2 * cY + rz2 * sY;
          const ry3 = ry2;
          const rz3 = -rx2 * sY + rz2 * cY;

          const totalZ = rz3 + carZ;
          const scale = fovCar / Math.max(80, totalZ);
          const px = carX + rx3 * scale;
          const py = carY + ry3 * scale;

          return { px, py, z: totalZ, scale };
        });

        // 1. Underglow Neon Ground Plane
        ctx.save();
        const underglowGrad = ctx.createRadialGradient(carX, carY + 12, 10, carX, carY + 12, 60);
        underglowGrad.addColorStop(0, 'rgba(199, 255, 74, 0.55)');
        underglowGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.25)');
        underglowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = underglowGrad;
        ctx.beginPath();
        ctx.ellipse(carX, carY + 14, 55, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Draw Car Polygonal Faces
        const drawCarPoly = (indices: number[], fill: string, stroke = '#C7FF4A', lineWidth = 1) => {
          ctx.save();
          ctx.beginPath();
          for (let i = 0; i < indices.length; i++) {
            const p = projCarVerts[indices[i]];
            if (i === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
          ctx.restore();
        };

        // Sculpted Hood & Canopy
        drawCarPoly([0, 1, 3, 5], '#0F121C', 'rgba(199, 255, 74, 0.6)', 1.2);
        drawCarPoly([0, 2, 4, 5], '#141824', 'rgba(199, 255, 74, 0.6)', 1.2);
        drawCarPoly([5, 6, 8, 7], 'rgba(0, 240, 255, 0.45)', '#00F0FF', 1.4); // Windshield
        drawCarPoly([8, 9, 11, 13], '#0D1018', 'rgba(199, 255, 74, 0.5)', 1);
        drawCarPoly([8, 10, 12, 13], '#111520', 'rgba(199, 255, 74, 0.5)', 1);

        // Rear Haunches & LED Taillight Bar
        drawCarPoly([13, 14, 16, 17, 15], '#080A10', 'rgba(255, 0, 127, 0.85)', 1.5);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(projCarVerts[14].px, projCarVerts[14].py);
        ctx.lineTo(projCarVerts[15].px, projCarVerts[15].py);
        ctx.strokeStyle = '#FF007F';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#FF007F';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();

        // Swan-Neck GT Wing Blade
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(projCarVerts[18].px, projCarVerts[18].py);
        ctx.lineTo(projCarVerts[19].px, projCarVerts[19].py);
        ctx.strokeStyle = '#C7FF4A';
        ctx.lineWidth = 3.0;
        ctx.shadowColor = '#C7FF4A';
        ctx.shadowBlur = 12;
        ctx.stroke();
        // Wing pylons
        ctx.beginPath();
        ctx.moveTo(projCarVerts[13].px - 6, projCarVerts[13].py);
        ctx.lineTo(projCarVerts[18].px + 8, projCarVerts[18].py);
        ctx.moveTo(projCarVerts[13].px + 6, projCarVerts[13].py);
        ctx.lineTo(projCarVerts[19].px - 8, projCarVerts[19].py);
        ctx.strokeStyle = 'rgba(242, 240, 234, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        // 4 Rotating Spoke Wheels
        const wheelPositions = [
          projCarVerts[1], // Front left
          projCarVerts[2], // Front right
          projCarVerts[11], // Rear left
          projCarVerts[12], // Rear right
        ];

        for (const wp of wheelPositions) {
          ctx.save();
          ctx.beginPath();
          const wRadius = 6.5 * wp.scale;
          ctx.arc(wp.px, wp.py + 4, wRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#06080E';
          ctx.fill();
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Rotating 5-Spoke Neon Rims
          for (let spk = 0; spk < 5; spk++) {
            const spkAngle = wheelRotation + (spk / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(wp.px, wp.py + 4);
            ctx.lineTo(wp.px + Math.cos(spkAngle) * wRadius * 0.85, wp.py + 4 + Math.sin(spkAngle) * wRadius * 0.85);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }

        // Exhaust Flame Pops on High Scroll Velocity
        if (scrollVelocity > 1.4 || Math.random() < 0.1) {
          const exhaustNodes = [projCarVerts[20], projCarVerts[21]];
          for (const ex of exhaustNodes) {
            ctx.save();
            ctx.beginPath();
            const flameLen = (Math.random() * 12 + 8) * (1 + scrollVelocity);
            ctx.arc(ex.px, ex.py + flameLen * 0.4, 3 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() > 0.4 ? '#FF5E00' : '#FF007F';
            ctx.shadowColor = '#FF5E00';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
          }
        }

        // Monospace Supra 911 Telemetry Label
        const carNose = projCarVerts[0];
        if (carNose) {
          ctx.save();
          ctx.font = '8px monospace';
          ctx.fillStyle = 'rgba(199, 255, 74, 0.85)';
          ctx.fillText('SUPRA 911 // GT VECTOR CORE', carNose.px - 60, carNose.py + 18);
          ctx.strokeStyle = 'rgba(199, 255, 74, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(carNose.px - 8, carNose.py + 8);
          ctx.lineTo(carNose.px - 20, carNose.py + 16);
          ctx.lineTo(carNose.px - 65, carNose.py + 16);
          ctx.stroke();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      unsubscribeScroll();
    };
  }, [reducedMotion, vehicleMode]);

  return (
    <div
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* Cyberpunk Architectural Grid Lines with Subtle Color Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,127,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_65%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Subtle Readability Vignette overlay ensuring text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070B]/85 via-transparent to-[#07070B]/40 pointer-events-none" />
    </div>
  );
}
