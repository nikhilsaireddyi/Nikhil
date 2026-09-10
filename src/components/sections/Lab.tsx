'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useCursorHover } from '@/hooks/useCursorHover';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  Cpu,
  Gauge,
  Rotate3d,
  Box,
  Zap,
  Sparkles,
  Activity,
  Wind,
  Flame,
  Sliders,
  Brain,
  Palette,
} from 'lucide-react';
import {
  playOverclockSurge,
  playSynapticPulse,
  playEngineRev,
  stopEngineSound,
  playHoverTick,
} from '@/lib/sound';
import { NeuralDigitClassifier } from '@/components/ui/NeuralDigitClassifier';

interface Point3D {
  x: number;
  y: number;
  z: number;
  layer: 'input' | 'attention' | 'dense' | 'output';
  color: string;
}

interface Edge3D {
  p1: number;
  p2: number;
  color: string;
}

type CoreColorKey = 'cyan' | 'violet' | 'lime' | 'amber';

interface CoreColorConfig {
  name: string;
  primary: string;
  secondary: string;
  glow: string;
  hex: string;
}

const CORE_COLORS: Record<CoreColorKey, CoreColorConfig> = {
  cyan: {
    name: 'QUANTUM CYAN',
    primary: '#00F0FF',
    secondary: '#0052A3',
    glow: 'rgba(0, 240, 255, 0.45)',
    hex: '#00F0FF',
  },
  violet: {
    name: 'ULTRAVIOLET SYNAPSE',
    primary: '#7928CA',
    secondary: '#FF007F',
    glow: 'rgba(121, 40, 202, 0.45)',
    hex: '#7928CA',
  },
  lime: {
    name: 'ACID INTELLIGENCE',
    primary: '#C7FF4A',
    secondary: '#00DF81',
    glow: 'rgba(199, 255, 74, 0.45)',
    hex: '#C7FF4A',
  },
  amber: {
    name: 'SOLAR TENSOR',
    primary: '#FFB703',
    secondary: '#FF5E00',
    glow: 'rgba(255, 183, 3, 0.45)',
    hex: '#FFB703',
  },
};

export function Lab() {
  const [activeTab, setActiveTab] = useState<'neural' | 'accelerator' | 'windtunnel' | 'classifier'>('neural');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<CoreColorKey>('cyan');
  const [tflops, setTflops] = useState<number>(14.2);
  const [isOverclocking, setIsOverclocking] = useState<boolean>(false);
  const [thermalTemp, setThermalTemp] = useState<number>(42);

  // Supercar Dyno & Wind Tunnel States
  const [rpm, setRpm] = useState<number>(1400);
  const [aeroMode, setAeroMode] = useState<'low_drag' | 'balanced' | 'high_downforce'>('balanced');
  const [livery, setLivery] = useState<'obsidian' | 'papaya' | 'lime' | 'chrome'>('obsidian');
  const [widebody, setWidebody] = useState<boolean>(true);
  const [splitterStrakes, setSplitterStrakes] = useState<boolean>(true);
  const [swanNeckWing, setSwanNeckWing] = useState<boolean>(true);
  const [isDynoRunning, setIsDynoRunning] = useState<boolean>(false);

  const neuralCanvasRef = useRef<HTMLCanvasElement>(null);
  const acceleratorCanvasRef = useRef<HTMLCanvasElement>(null);
  const windTunnelCanvasRef = useRef<HTMLCanvasElement>(null);
  const overclockInterval = useRef<NodeJS.Timeout | null>(null);
  const dynoInterval = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = useReducedMotion();
  const labCursor = useCursorHover('project', 'NEURAL LAB');

  // 1. Interactive 3D Neural Tensor Core (360° Orbit & Layer Exploder)
  useEffect(() => {
    if (reducedMotion || activeTab !== 'neural') return;
    const canvas = neuralCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // 4-Layer Neural Transformer Architecture in 3D:
    // Layer 0: Input Embeddings (z: -120)
    // Layer 1: Multi-Head Attention Lattice (z: -40)
    // Layer 2: Feed-Forward Dense Tensors (z: +40)
    // Layer 3: Softmax Output Projections (z: +120)
    const rawNodes: Point3D[] = [];
    const rawEdges: Edge3D[] = [];

    // Layer 0: Input Embeddings (8 nodes in circle)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      rawNodes.push({
        x: Math.cos(angle) * 75,
        y: Math.sin(angle) * 75,
        z: -120,
        layer: 'input',
        color: '#00F0FF',
      });
    }

    // Layer 1: Multi-Head Attention Lattice (12 nodes in double ring)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = i % 2 === 0 ? 110 : 70;
      rawNodes.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        z: -40,
        layer: 'attention',
        color: '#7928CA',
      });
    }

    // Layer 2: Feed-Forward Dense Tensors (10 nodes)
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      rawNodes.push({
        x: Math.cos(angle) * 95,
        y: Math.sin(angle) * 95,
        z: 40,
        layer: 'dense',
        color: '#FF007F',
      });
    }

    // Layer 3: Softmax Output Projections (6 nodes)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      rawNodes.push({
        x: Math.cos(angle) * 60,
        y: Math.sin(angle) * 60,
        z: 120,
        layer: 'output',
        color: '#C7FF4A',
      });
    }

    // Connect Layers with Synaptic Vectors
    // Input (0..7) -> Attention (8..19)
    for (let i = 0; i < 8; i++) {
      for (let j = 8; j < 20; j++) {
        if ((i + j) % 3 === 0) {
          rawEdges.push({ p1: i, p2: j, color: 'rgba(0, 240, 255, 0.25)' });
        }
      }
    }

    // Attention (8..19) -> Dense (20..29)
    for (let i = 8; i < 20; i++) {
      for (let j = 20; j < 30; j++) {
        if ((i + j) % 3 === 0) {
          rawEdges.push({ p1: i, p2: j, color: 'rgba(121, 40, 202, 0.25)' });
        }
      }
    }

    // Dense (20..29) -> Output (30..35)
    for (let i = 20; i < 30; i++) {
      for (let j = 30; j < 36; j++) {
        if ((i + j) % 2 === 0) {
          rawEdges.push({ p1: i, p2: j, color: 'rgba(255, 0, 127, 0.25)' });
        }
      }
    }

    let rotX = 0.35;
    let rotY = -0.65;
    let targetRotX = 0.35;
    let targetRotY = -0.65;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let explodeFactor = 0;
    let animId: number;
    let time = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const activeColor = CORE_COLORS[selectedColor];

    const render = () => {
      time += 0.012;
      ctx.fillStyle = 'rgba(7, 7, 11, 0.42)';
      ctx.fillRect(0, 0, width, height);

      if (!isDragging) targetRotY += 0.007;

      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;
      explodeFactor += ((isExploded ? 1 : 0) - explodeFactor) * 0.08;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const fov = 480;
      const cameraZ = 460;

      // Transform 3D Neural Nodes with Layer Exploder offsets
      const transformed: { x: number; y: number; z: number; projX: number; projY: number; scale: number; node: Point3D }[] = [];

      for (let i = 0; i < rawNodes.length; i++) {
        const item = rawNodes[i];
        const px = item.x;
        const py = item.y;
        let pz = item.z;

        // Explode 3D layers along Z axis with chromatic separation
        if (explodeFactor > 0.001) {
          const exp = explodeFactor * 90;
          if (item.layer === 'input') pz -= exp * 1.6;
          if (item.layer === 'attention') pz -= exp * 0.5;
          if (item.layer === 'dense') pz += exp * 0.5;
          if (item.layer === 'output') pz += exp * 1.6;
        }

        // 3D Matrix Rotations
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const totalZ = z2 + cameraZ;
        const scale = fov / Math.max(80, totalZ);

        transformed.push({
          x: x1,
          y: y2,
          z: totalZ,
          projX: width * 0.5 + x1 * scale,
          projY: height * 0.5 + y2 * scale,
          scale,
          node: item,
        });
      }

      // Draw Central Holographic Attention Core
      const coreGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        15,
        width * 0.5,
        height * 0.5,
        180
      );
      coreGrad.addColorStop(0, activeColor.glow);
      coreGrad.addColorStop(0.5, activeColor.glow.replace('0.45', '0.12'));
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, 180, 0, Math.PI * 2);
      ctx.fill();

      // Draw Synaptic Connection Lines
      for (let i = 0; i < rawEdges.length; i++) {
        const edge = rawEdges[i];
        const p1 = transformed[edge.p1];
        const p2 = transformed[edge.p2];

        ctx.beginPath();
        ctx.moveTo(p1.projX, p1.projY);
        ctx.lineTo(p2.projX, p2.projY);
        ctx.strokeStyle = edge.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Traveling synaptic photon pulse
        const packetProgress = (time * 1.2 + i * 0.08) % 1.0;
        const pkX = p1.projX + (p2.projX - p1.projX) * packetProgress;
        const pkY = p1.projY + (p2.projY - p1.projY) * packetProgress;

        ctx.beginPath();
        ctx.arc(pkX, pkY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = activeColor.primary;
        ctx.fill();
      }

      // Draw 3D Neural Nodes sorted by depth
      const sortedNodes = transformed.slice().sort((a, b) => b.z - a.z);

      for (const item of sortedNodes) {
        const r = (item.node.layer === 'output' ? 5 : item.node.layer === 'input' ? 4 : 3) * item.scale;

        // Glow halo
        ctx.beginPath();
        ctx.arc(item.projX, item.projY, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = activeColor.glow.replace('0.45', '0.25');
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(item.projX, item.projY, r, 0, Math.PI * 2);
        ctx.fillStyle = item.node.color;
        ctx.shadowColor = item.node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Layer Boundary Label Planes in Exploded Mode
      if (explodeFactor > 0.4) {
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('LAYER 01: INPUT EMBEDDINGS (768-D)', 24, 40);
        ctx.fillText('LAYER 02: MULTI-HEAD ATTENTION LATTICE', 24, 60);
        ctx.fillText('LAYER 03: FEED-FORWARD DENSE TENSORS', 24, 80);
        ctx.fillText('LAYER 04: SOFTMAX OUTPUT PROJECTION', 24, 100);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab, isExploded, selectedColor, reducedMotion]);

  // 2. Interactive Neural Inference Accelerator Simulator (Tab 2)
  useEffect(() => {
    if (reducedMotion || activeTab !== 'accelerator') return;
    const canvas = acceleratorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(8, 8, 12, 0.38)';
      ctx.fillRect(0, 0, width, height);

      // Temperature tracking
      setThermalTemp((prev) => {
        const targetTemp = isOverclocking ? 86 : 42;
        return prev + (targetTemp - prev) * 0.05;
      });

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Tensor Core Matrix Grid
      const matrixSize = 6;
      const cellSize = 30;
      const startX = centerX - (matrixSize * cellSize) * 0.5;
      const startY = centerY - (matrixSize * cellSize) * 0.5;

      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          const val = Math.sin(time * 3 + r * 0.6 + c * 0.6);
          const activeCell = val > 0.3;

          ctx.fillStyle = activeCell
            ? isOverclocking
              ? '#FF007F'
              : '#00F0FF'
            : '#12141C';
          ctx.strokeStyle = 'rgba(242, 240, 234, 0.1)';
          ctx.fillRect(startX + c * cellSize + 2, startY + r * cellSize + 2, cellSize - 4, cellSize - 4);
          ctx.strokeRect(startX + c * cellSize + 2, startY + r * cellSize + 2, cellSize - 4, cellSize - 4);
        }
      }

      // Real-Time Loss Optimization Curve Stream
      ctx.beginPath();
      for (let x = 20; x < width - 20; x += 10) {
        const lossY = height * 0.85 - Math.sin((x + time * 60) * 0.04) * (isOverclocking ? 25 : 12);
        if (x === 20) ctx.moveTo(x, lossY);
        else ctx.lineTo(x, lossY);
      }
      ctx.strokeStyle = isOverclocking ? '#FF007F' : '#C7FF4A';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab, isOverclocking, reducedMotion]);

  // Overclock compute acceleration
  const startOverclock = useCallback(() => {
    setIsOverclocking(true);
    playOverclockSurge();
    if (overclockInterval.current) clearInterval(overclockInterval.current);
    overclockInterval.current = setInterval(() => {
      setTflops((prev) => {
        if (prev >= 256.0) return 256.0 - Math.random() * 4.0;
        return prev + 8.4;
      });
    }, 30);
  }, []);

  const stopOverclock = useCallback(() => {
    setIsOverclocking(false);
    if (overclockInterval.current) clearInterval(overclockInterval.current);
    overclockInterval.current = setInterval(() => {
      setTflops((prev) => {
        if (prev <= 14.2) {
          if (overclockInterval.current) clearInterval(overclockInterval.current);
          return 14.2;
        }
        return Math.max(14.2, prev - 9.5);
      });
    }, 25);
  }, []);

  // Supercar Dyno Launch Acceleration Pull
  const startDynoPull = useCallback(() => {
    setIsDynoRunning(true);
    if (dynoInterval.current) clearInterval(dynoInterval.current);
    dynoInterval.current = setInterval(() => {
      setRpm((prev) => {
        const next = Math.min(9000, prev + 220);
        playEngineRev(next);
        return next;
      });
    }, 30);
  }, []);

  const stopDynoPull = useCallback(() => {
    setIsDynoRunning(false);
    if (dynoInterval.current) clearInterval(dynoInterval.current);
    dynoInterval.current = setInterval(() => {
      setRpm((prev) => {
        if (prev <= 1400) {
          if (dynoInterval.current) clearInterval(dynoInterval.current);
          stopEngineSound();
          return 1400;
        }
        const next = Math.max(1400, prev - 350);
        playEngineRev(next);
        return next;
      });
    }, 30);
  }, []);

  // 3. Interactive Aerodynamic Wind Tunnel & Supercar Dyno Simulation (Tab 3)
  useEffect(() => {
    if (reducedMotion || activeTab !== 'windtunnel') {
      stopEngineSound();
      return;
    }
    const canvas = windTunnelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle streamlines setup
    const streamlineCount = 44;
    const particles: {
      x: number;
      y: number;
      baseY: number;
      speed: number;
      alpha: number;
      size: number;
    }[] = [];

    for (let i = 0; i < streamlineCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height * 0.12 + (i / streamlineCount) * (height * 0.72),
        baseY: height * 0.12 + (i / streamlineCount) * (height * 0.72),
        speed: 2.2 + Math.random() * 1.6,
        alpha: 0.25 + Math.random() * 0.65,
        size: 1.2 + Math.random() * 1.5,
      });
    }

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(7, 8, 12, 0.44)';
      ctx.fillRect(0, 0, width, height);

      // Car position & bounding dimensions
      const carLength = Math.min(width * 0.65, 450);
      const carHeight = carLength * 0.27;
      const carX = (width - carLength) * 0.42;
      const groundY = height * 0.78;
      const carY = groundY - carHeight;

      // Draw Chamber Grid & Ground Plane
      ctx.strokeStyle = 'rgba(242, 240, 234, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 30; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ground conveyor line (rolling road)
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.strokeStyle = 'rgba(199, 255, 74, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ground ticks moving with speed
      const currentSpeed = Math.floor((rpm / 9000) * 342);
      const tickOffset = (time * currentSpeed * 2.5) % 40;
      ctx.strokeStyle = 'rgba(199, 255, 74, 0.15)';
      for (let tx = -40; tx < width + 40; tx += 40) {
        ctx.beginPath();
        ctx.moveTo(tx - tickOffset, groundY);
        ctx.lineTo(tx - tickOffset + 15, groundY + 8);
        ctx.stroke();
      }

      // Underbody ground effect suction glow
      const suctionGlow = ctx.createLinearGradient(carX, groundY, carX + carLength, groundY);
      suctionGlow.addColorStop(0, 'rgba(0, 240, 255, 0.0)');
      suctionGlow.addColorStop(0.5, `rgba(199, 255, 74, ${0.1 + (currentSpeed / 342) * 0.35})`);
      suctionGlow.addColorStop(1, 'rgba(255, 94, 0, 0.0)');
      ctx.fillStyle = suctionGlow;
      ctx.fillRect(carX, groundY - 6, carLength, 8);

      // Draw Precision Aerodynamic Supercar Silhouette (Supra / GT3 / Hypercar profile)
      ctx.save();
      // Draw Car Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.beginPath();
      ctx.ellipse(carX + carLength * 0.5, groundY + 2, carLength * 0.48, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car Body Path
      ctx.beginPath();
      ctx.moveTo(carX, groundY - 10); // Front splitter tip
      ctx.lineTo(carX + carLength * 0.06, groundY - 16); // Front bumper curve
      ctx.quadraticCurveTo(carX + carLength * 0.16, groundY - carHeight * 0.38, carX + carLength * 0.28, groundY - carHeight * 0.44); // Low hood line
      ctx.quadraticCurveTo(carX + carLength * 0.38, groundY - carHeight * 0.72, carX + carLength * 0.48, carY + 2); // Windshield to roof
      ctx.quadraticCurveTo(carX + carLength * 0.62, carY, carX + carLength * 0.68, carY + 4); // Roofline
      ctx.quadraticCurveTo(carX + carLength * 0.80, groundY - carHeight * 0.65, carX + carLength * 0.90, groundY - carHeight * 0.45); // Fastback rear glass
      ctx.lineTo(carX + carLength * 0.96, groundY - carHeight * 0.48); // Rear deck
      ctx.lineTo(carX + carLength, groundY - carHeight * 0.32); // Rear bumper edge
      ctx.lineTo(carX + carLength * 0.98, groundY - 14); // Diffuser upper
      ctx.lineTo(carX + carLength * 0.88, groundY - 8); // Venturi tunnel exit
      ctx.lineTo(carX + carLength * 0.12, groundY - 8); // Flat undertray floor
      ctx.closePath();

      // Determine livery styling
      let bodyGradStart = '#1c1f2b';
      let bodyGradMid = '#12141c';
      let bodyGradEnd = '#090a0f';
      let edgeColor = '#00F0FF';
      let wingColor = '#C7FF4A';

      if (livery === 'papaya') {
        bodyGradStart = '#FF6B00';
        bodyGradMid = '#C04500';
        bodyGradEnd = '#521900';
        edgeColor = '#FFB703';
        wingColor = '#FFB703';
      } else if (livery === 'lime') {
        bodyGradStart = '#7BAF1A';
        bodyGradMid = '#47680D';
        bodyGradEnd = '#1B2904';
        edgeColor = '#C7FF4A';
        wingColor = '#C7FF4A';
      } else if (livery === 'chrome') {
        bodyGradStart = '#E4ECF4';
        bodyGradMid = '#8D99AA';
        bodyGradEnd = '#333D4C';
        edgeColor = '#FFFFFF';
        wingColor = '#00F0FF';
      }

      // Car Body Fill
      const carGrad = ctx.createLinearGradient(carX, carY, carX, groundY);
      carGrad.addColorStop(0, bodyGradStart);
      carGrad.addColorStop(0.4, bodyGradMid);
      carGrad.addColorStop(1, bodyGradEnd);
      ctx.fillStyle = carGrad;
      ctx.fill();

      // Body Outline & Neon Aero Edge
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Splitter Canards (Strakes)
      if (splitterStrakes) {
        ctx.fillStyle = '#00F0FF';
        ctx.beginPath();
        ctx.moveTo(carX + carLength * 0.02, groundY - 14);
        ctx.lineTo(carX + carLength * 0.08, groundY - 26);
        ctx.lineTo(carX + carLength * 0.10, groundY - 22);
        ctx.lineTo(carX + carLength * 0.04, groundY - 12);
        ctx.closePath();
        ctx.fill();
      }

      // Widebody Overfenders
      if (widebody) {
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(carX + carLength * 0.20, groundY - carHeight * 0.36 + 3, carHeight * 0.44, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(carX + carLength * 0.78, groundY - carHeight * 0.36 + 3, carHeight * 0.44, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();
      }

      // Cabin Glass
      ctx.beginPath();
      ctx.moveTo(carX + carLength * 0.37, groundY - carHeight * 0.50);
      ctx.lineTo(carX + carLength * 0.48, carY + 6);
      ctx.lineTo(carX + carLength * 0.66, carY + 8);
      ctx.lineTo(carX + carLength * 0.78, groundY - carHeight * 0.48);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.stroke();

      // Active Rear Wing (tilted based on aeroMode, swan-neck support if enabled)
      const wingX = carX + carLength * 0.86;
      const wingBaseY = groundY - carHeight * 0.48;
      const wingAngle = aeroMode === 'high_downforce' ? 0.38 : aeroMode === 'low_drag' ? 0.05 : 0.20;
      const wingStalkH = carHeight * (swanNeckWing ? 0.52 : 0.45);

      // Wing uprights (Swan-neck curves over the top of the wing)
      ctx.strokeStyle = 'rgba(242, 240, 234, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (swanNeckWing) {
        ctx.moveTo(wingX + carLength * 0.04, wingBaseY);
        ctx.quadraticCurveTo(wingX + carLength * 0.02, wingBaseY - wingStalkH - 6, wingX + carLength * 0.06, wingBaseY - wingStalkH);
        ctx.moveTo(wingX + carLength * 0.09, wingBaseY);
        ctx.quadraticCurveTo(wingX + carLength * 0.07, wingBaseY - wingStalkH - 6, wingX + carLength * 0.09, wingBaseY - wingStalkH);
      } else {
        ctx.moveTo(wingX + carLength * 0.04, wingBaseY);
        ctx.lineTo(wingX + carLength * 0.05, wingBaseY - wingStalkH);
        ctx.moveTo(wingX + carLength * 0.09, wingBaseY);
        ctx.lineTo(wingX + carLength * 0.09, wingBaseY - wingStalkH);
      }
      ctx.stroke();

      // Wing Airfoil Blade
      ctx.save();
      ctx.translate(wingX + carLength * 0.06, wingBaseY - wingStalkH);
      ctx.rotate(-wingAngle);
      ctx.fillStyle = wingColor;
      ctx.shadowColor = wingColor;
      ctx.shadowBlur = 8;
      ctx.fillRect(-carLength * 0.07, -3, carLength * 0.12, 5);
      // Endplates
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-carLength * 0.07, -8, 3, 14);
      ctx.fillRect(carLength * 0.05, -8, 3, 14);
      ctx.restore();

      // Front Headlight Projector
      ctx.fillStyle = '#C7FF4A';
      ctx.shadowColor = '#C7FF4A';
      ctx.shadowBlur = 12;
      ctx.fillRect(carX + carLength * 0.04, groundY - carHeight * 0.32, carLength * 0.04, 3);

      // Rear LED Taillight Blade
      ctx.fillStyle = '#FF0055';
      ctx.shadowColor = '#FF0055';
      ctx.shadowBlur = 10;
      ctx.fillRect(carX + carLength * 0.95, groundY - carHeight * 0.38, carLength * 0.03, 4);

      // Alloy Wheels & Rotating Spokes
      const wheelRadius = carHeight * 0.36;
      const frontWheelX = carX + carLength * 0.20;
      const rearWheelX = carX + carLength * 0.78;
      const wheelY = groundY - wheelRadius + 3;

      const drawWheel = (wx: number) => {
        // Tire rubber
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a0e';
        ctx.fill();
        ctx.strokeStyle = 'rgba(242, 240, 234, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rim
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelRadius * 0.72, 0, Math.PI * 2);
        ctx.fillStyle = '#14151e';
        ctx.fill();
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Rotating Spokes
        const wheelAngle = (time * (currentSpeed + 20) * 0.1) % (Math.PI * 2);
        for (let sp = 0; sp < 5; sp++) {
          const a = wheelAngle + (sp / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(wx, wheelY);
          ctx.lineTo(wx + Math.cos(a) * wheelRadius * 0.68, wheelY + Math.sin(a) * wheelRadius * 0.68);
          ctx.strokeStyle = 'rgba(199, 255, 74, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Center hub
        ctx.beginPath();
        ctx.arc(wx, wheelY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      };

      drawWheel(frontWheelX);
      drawWheel(rearWheelX);

      ctx.restore();

      // Flow Streamlines & Smoke Particles
      const flowVel = 3.5 + (currentSpeed / 342) * 16;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += flowVel * p.speed * 0.45;

        // Reset particle when exiting right side
        if (p.x > width + 40) {
          p.x = -20 - Math.random() * 40;
          p.y = p.baseY;
        }

        // Aerodynamic deflection logic around car body
        let defY = p.baseY;
        let isTurbulent = false;

        if (p.x > carX - 30 && p.x < carX + carLength + 180) {
          const relX = (p.x - carX) / carLength;

          // If streamline is in the lower ground-effect zone
          if (p.baseY > groundY - carHeight * 0.25 && p.baseY <= groundY) {
            // Underbody venturi compression & rear expansion
            if (relX >= 0 && relX <= 1) {
              defY = groundY - 4; // Venturi squeeze
            } else if (relX > 1) {
              // Diffuser up-sweep into wake
              const wakeDist = (p.x - (carX + carLength)) / 140;
              defY = groundY - 4 - wakeDist * 28 + Math.sin(time * 12 + i) * 6;
              isTurbulent = true;
            }
          }
          // If streamline is at car body height
          else if (p.baseY > carY - 20 && p.baseY <= groundY - carHeight * 0.25) {
            if (relX < 0.25) {
              // Upward deflection over nose
              const noseFactor = Math.max(0, 1 - (carX - p.x) / 30);
              defY = p.baseY - (groundY - carHeight * 0.45 - p.baseY) * noseFactor * 0.7;
            } else if (relX >= 0.25 && relX <= 0.65) {
              // Over windshield and roof
              defY = carY - 12 - (p.baseY - carY) * 0.25;
            } else if (relX > 0.65 && relX <= 1.0) {
              // Down fastback and wing deflection
              const wingDeflect = aeroMode === 'high_downforce' ? -22 : aeroMode === 'low_drag' ? -5 : -14;
              defY = (carY + 10) + (relX - 0.65) * 35 + wingDeflect;
            } else {
              // Turbulent rear separation vortex street behind car!
              isTurbulent = true;
              const wakeProgress = Math.min(1, (p.x - (carX + carLength)) / 160);
              const vortexFreq = 8 + (currentSpeed / 342) * 14;
              const vortexAmp = (14 + (currentSpeed / 342) * 22) * wakeProgress;
              defY = carY + 30 + Math.sin(time * vortexFreq + i * 0.8) * vortexAmp;
            }
          }
        }

        // Smooth transition to deflected Y
        p.y += (defY - p.y) * 0.35;

        // Render streamline particle / smoke trail
        ctx.beginPath();
        const trailLen = 14 + (currentSpeed / 342) * 35;
        ctx.moveTo(p.x - trailLen, p.y);
        ctx.lineTo(p.x, p.y);

        if (isTurbulent) {
          ctx.strokeStyle = `rgba(255, 94, 0, ${p.alpha * 0.85})`;
          ctx.lineWidth = p.size * 1.3;
        } else if (p.x > carX - 20 && p.x < carX + carLength * 0.5) {
          ctx.strokeStyle = `rgba(199, 255, 74, ${p.alpha})`;
          ctx.lineWidth = p.size * 1.2;
        } else {
          ctx.strokeStyle = `rgba(0, 240, 255, ${p.alpha * 0.7})`;
          ctx.lineWidth = p.size;
        }
        ctx.stroke();

        // Particle head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = isTurbulent ? '#FF5E00' : '#FFFFFF';
        ctx.fill();
      }

      // Wind Velocity Meter Overlay in Canvas
      ctx.font = '11px monospace';
      ctx.fillStyle = '#C7FF4A';
      ctx.fillText(`AIRFLOW VELOCITY: ${currentSpeed} KM/H // REYNOLDS NO: Re ${(1.2 + (currentSpeed / 342) * 5.8).toFixed(2)}e6`, 20, 30);
      ctx.fillStyle = aeroMode === 'high_downforce' ? '#FF5E00' : '#00F0FF';
      ctx.fillText(`ACTIVE AERO PROFILE: ${aeroMode.toUpperCase().replace('_', ' ')}`, 20, 48);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      stopEngineSound();
    };
  }, [activeTab, rpm, aeroMode, livery, widebody, splitterStrakes, swanNeckWing, reducedMotion]);

  const activeColor = CORE_COLORS[selectedColor];

  return (
    <section
      id="lab"
      className="relative w-full py-24 sm:py-32 md:py-44 border-b border-[rgba(242,240,234,0.06)] z-10 overflow-hidden"
      aria-label="Experimental AI & Neural Simulation Lab"
    >
      {/* Dynamic Colored Glow Backdrop */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full blur-[150px] pointer-events-none opacity-25 transition-colors duration-700"
        style={{ backgroundColor: activeColor.primary }}
      />

      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-14 lg:px-16 relative z-10">
        <SectionHeader
          number="05"
          label="LAB"
          subtitle="3D NEURAL TRANSFORMER // SYSTOLIC ACCELERATOR // AERODYNAMIC DYNO SIMULATOR"
          title="3D NEURAL CORE LAB"
        />

        {/* Tab & Control Bar */}
        <div className="mb-10 border border-[rgba(242,240,234,0.12)] bg-[#0D0D12]/90 backdrop-blur-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono rounded-xl shadow-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('neural')}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                activeTab === 'neural'
                  ? 'border-transparent text-[#070707] font-bold shadow-lg'
                  : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA] bg-[#14151E]'
              }`}
              style={{
                backgroundColor: activeTab === 'neural' ? activeColor.primary : undefined,
                boxShadow: activeTab === 'neural' ? `0 0 20px ${activeColor.glow}` : undefined,
              }}
            >
              <Cpu size={15} />
              <span>3D NEURAL TENSOR CORE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('accelerator')}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                activeTab === 'accelerator'
                  ? 'border-[#FF007F] bg-[#FF007F]/15 text-[#FF007F] font-bold shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                  : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA]'
              }`}
            >
              <Zap size={15} />
              <span>INFERENCE OVERCLOCK</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playHoverTick();
                setActiveTab('windtunnel');
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                activeTab === 'windtunnel'
                  ? 'border-[#C7FF4A] bg-[#C7FF4A]/15 text-[#C7FF4A] font-bold shadow-[0_0_15px_rgba(199,255,74,0.3)]'
                  : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA] bg-[#14151E]'
              }`}
            >
              <Wind size={15} />
              <span>AERODYNAMIC WIND TUNNEL & DYNO</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playHoverTick();
                setActiveTab('classifier');
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                activeTab === 'classifier'
                  ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA] bg-[#14151E]'
              }`}
            >
              <Brain size={15} />
              <span>NEURAL DIGIT CLASSIFIER</span>
            </button>
          </div>

          {activeTab === 'neural' && (
            <div className="flex items-center gap-3">
              {/* Color Palette Selector */}
              <div className="flex items-center gap-1.5 bg-[#14151B] p-1 rounded-lg border border-[rgba(242,240,234,0.1)]">
                {(Object.keys(CORE_COLORS) as CoreColorKey[]).map((key) => {
                  const cfg = CORE_COLORS[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedColor(key)}
                      title={cfg.name}
                      className={`w-6 h-6 rounded-md transition-all border ${
                        selectedColor === key
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: cfg.hex }}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  playSynapticPulse();
                  setIsExploded(!isExploded);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 border rounded-lg transition-all font-bold ${
                  isExploded
                    ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-[rgba(242,240,234,0.2)] text-[#F2F0EA] hover:border-[#00F0FF]'
                }`}
              >
                <Box size={14} />
                <span>{isExploded ? 'COLLAPSE CORE' : 'EXPLODE NEURAL LAYERS'}</span>
              </button>
            </div>
          )}

          {activeTab === 'windtunnel' && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Livery Palette Selector */}
              <div className="flex items-center gap-1.5 bg-[#14151B] p-1 rounded-lg border border-[rgba(242,240,234,0.1)]">
                <Palette size={12} className="text-[#8E8E8E] ml-1 mr-0.5" />
                {(
                  [
                    { id: 'obsidian', name: 'OBSIDIAN BLACK', bg: '#0A0A0F', border: '#333' },
                    { id: 'papaya', name: 'PAPAYA RACING', bg: '#FF5E00', border: '#FF5E00' },
                    { id: 'lime', name: 'ACID LIME GT', bg: '#C7FF4A', border: '#C7FF4A' },
                    { id: 'chrome', name: 'LIQUID CHROME', bg: '#E2E8F0', border: '#FFF' },
                  ] as const
                ).map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    title={spec.name}
                    onClick={() => {
                      playHoverTick();
                      setLivery(spec.id);
                    }}
                    className={`w-5 h-5 rounded-md border transition-all ${
                      livery === spec.id ? 'scale-115 ring-2 ring-white/60 shadow-lg' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: spec.bg, borderColor: spec.border }}
                  />
                ))}
              </div>

              {/* Aero Spec Body Kit Toggles */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    playHoverTick();
                    setWidebody(!widebody);
                  }}
                  className={`px-2 py-1 rounded border transition-all ${
                    widebody
                      ? 'border-[#C7FF4A] bg-[#C7FF4A]/20 text-[#C7FF4A] font-bold'
                      : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E]'
                  }`}
                >
                  WIDEBODY
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playHoverTick();
                    setSplitterStrakes(!splitterStrakes);
                  }}
                  className={`px-2 py-1 rounded border transition-all ${
                    splitterStrakes
                      ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF] font-bold'
                      : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E]'
                  }`}
                >
                  CANARDS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playHoverTick();
                    setSwanNeckWing(!swanNeckWing);
                  }}
                  className={`px-2 py-1 rounded border transition-all ${
                    swanNeckWing
                      ? 'border-[#FF007F] bg-[#FF007F]/20 text-[#FF007F] font-bold'
                      : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E]'
                  }`}
                >
                  GT WING
                </button>
              </div>

              {/* Aero Modes */}
              <div className="flex items-center gap-1.5">
                {(['low_drag', 'balanced', 'high_downforce'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      playHoverTick();
                      setAeroMode(mode);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase rounded-md border transition-all ${
                      aeroMode === mode
                        ? 'border-[#C7FF4A] bg-[#C7FF4A]/20 text-[#C7FF4A] font-bold shadow-[0_0_10px_rgba(199,255,74,0.25)]'
                        : 'border-[rgba(242,240,234,0.1)] text-[#8E8E8E] hover:text-[#F2F0EA]'
                    }`}
                  >
                    {mode === 'low_drag' ? 'V-MAX' : mode === 'balanced' ? 'BALANCED' : 'ATTACK'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Display Canvas Viewport or Neural Digit Classifier */}
        {activeTab === 'classifier' ? (
          <NeuralDigitClassifier />
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 border border-[rgba(242,240,234,0.12)] bg-[#07070B] p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden rounded-2xl group">
            {/* Top Viewport Header */}
            <div className="flex items-center justify-between border-b border-[rgba(242,240,234,0.08)] pb-4 mb-4 text-xs font-mono text-[#8E8E8E]">
              <div className="flex items-center gap-2 text-[#F2F0EA]">
                <Activity
                  size={14}
                  style={{
                    color: activeTab === 'windtunnel' ? '#C7FF4A' : activeColor.primary,
                  }}
                />
                <span className="font-bold">
                  {activeTab === 'neural'
                    ? `3D NEURAL TRANSFORMER // ${activeColor.name} // 360° ORBIT`
                    : activeTab === 'accelerator'
                    ? 'SYSTOLIC TENSOR MATRIX // INFERENCE OVERCLOCK'
                    : 'AERODYNAMIC SUPERCAR WIND TUNNEL // BOUNDARY LAYER STREAMLINES'}
                </span>
              </div>
              <span
                style={{
                  color: activeTab === 'windtunnel' ? '#C7FF4A' : activeColor.primary,
                }}
                className="flex items-center gap-1 font-bold"
              >
                <Sparkles size={12} />
                <span>60 FPS HARDWARE ACCELERATED</span>
              </span>
            </div>

            {/* Canvas Viewport */}
            <div
              {...labCursor}
              className="relative h-80 sm:h-[440px] w-full bg-gradient-to-b from-[#0A0A0F] to-[#050508] border border-[rgba(242,240,234,0.06)] rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden shadow-inner"
            >
              {activeTab === 'neural' ? (
                <canvas ref={neuralCanvasRef} className="h-full w-full" />
              ) : activeTab === 'accelerator' ? (
                <canvas ref={acceleratorCanvasRef} className="h-full w-full" />
              ) : (
                <canvas ref={windTunnelCanvasRef} className="h-full w-full" />
              )}

              {/* Viewport Hint Badge */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#F2F0EA] bg-[#07070B]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[rgba(242,240,234,0.12)] flex items-center gap-2 shadow-lg">
                <Rotate3d
                  size={12}
                  style={{
                    color: activeTab === 'windtunnel' ? '#C7FF4A' : activeColor.primary,
                  }}
                />
                <span>
                  {activeTab === 'neural'
                    ? 'DRAG TO ORBIT 360° // TOGGLE EXPLODE TO INSPECT LAYERS'
                    : activeTab === 'accelerator'
                    ? 'PRESS & HOLD BUTTON TO ACCELERATE PFLOPS'
                    : 'SLIDE THROTTLE OR HOLD DYNO LAUNCH TO TEST REYNOLDS AIRFLOW'}
                </span>
              </div>
            </div>

            {/* Technical Specs Footer */}
            <div className="mt-4 pt-4 border-t border-[rgba(242,240,234,0.06)] flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-[#8E8E8E]">
              {activeTab === 'windtunnel' ? (
                <>
                  <div>GROUND-EFFECT UNDERBODY DIFFUSER // VENTURI CHANNELS</div>
                  <div className="text-[#C7FF4A] font-bold">
                    DOWNFORCE: {Math.round(0.5 * 1.225 * Math.pow(Math.floor((rpm / 9000) * 342) / 3.6, 2) * 0.95 * (aeroMode === 'low_drag' ? 0.75 : aeroMode === 'balanced' ? 1.2 : 2.1)).toLocaleString()} N // DRAG: {Math.round(0.5 * 1.225 * Math.pow(Math.floor((rpm / 9000) * 342) / 3.6, 2) * (aeroMode === 'low_drag' ? 0.26 : aeroMode === 'balanced' ? 0.31 : 0.42) * 2.15).toLocaleString()} N
                  </div>
                </>
              ) : (
                <>
                  <div>ARCHITECTURE: 768-D ATTENTION LATTICE // FP16 TENSORS</div>
                  <div style={{ color: activeColor.primary }} className="font-bold">
                    LATENCY: 0.8ms INFERENCE PIPELINE
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Telemetry & Controls */}
          {activeTab === 'windtunnel' ? (
            /* Supercar Dyno Telemetry Panel */
            <div className="lg:col-span-4 border border-[rgba(242,240,234,0.12)] bg-[#0C0D13] p-6 sm:p-8 flex flex-col justify-between rounded-2xl shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-[rgba(242,240,234,0.08)] pb-4 mb-6 text-xs font-mono text-[#8E8E8E]">
                  <div className="flex items-center gap-2 text-[#F2F0EA] font-bold">
                    <Gauge size={14} className="text-[#C7FF4A]" />
                    <span>SUPERCAR DYNO TELEMETRY</span>
                  </div>
                  <span className={rpm > 7800 ? 'text-[#FF0055] animate-pulse font-bold' : 'text-[#C7FF4A]'}>
                    {rpm > 7800 ? 'REDLINE WARNING' : 'DYNO LIVE'}
                  </span>
                </div>

                {/* Circular Tachometer Gauge */}
                <div className="relative mx-auto my-6 w-52 h-52 rounded-full border-2 border-[rgba(242,240,234,0.12)] bg-gradient-to-b from-[#10121A] to-[#07070B] flex items-center justify-center shadow-2xl">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(242, 240, 234, 0.1)"
                      strokeWidth="2"
                      strokeDasharray="2 4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={rpm > 7800 ? '#FF0055' : rpm > 5000 ? '#FFB703' : '#C7FF4A'}
                      strokeWidth="4"
                      strokeDasharray="30 200"
                      strokeDashoffset="-135"
                      className="transition-colors duration-300"
                    />
                  </svg>

                  {/* Sweeping Needle */}
                  <div
                    className="absolute w-1.5 h-22 bg-gradient-to-t from-transparent via-[#FFB703] to-[#FF0055] origin-bottom transition-transform duration-75 ease-out rounded-full shadow-[0_0_15px_#FF0055]"
                    style={{
                      bottom: '50%',
                      transform: `rotate(${-135 + (rpm / 9000) * 270}deg)`,
                    }}
                  />

                  {/* Center Speed Digital Readout */}
                  <div className="relative z-10 flex flex-col items-center justify-center w-22 h-22 rounded-full bg-[#13151D] border-2 border-[rgba(242,240,234,0.2)] shadow-xl text-center px-1">
                    <span className="text-xl font-sans font-black text-[#F2F0EA]">
                      {Math.floor((rpm / 9000) * 342)}
                    </span>
                    <span className="text-[8px] font-mono text-[#C7FF4A] -mt-1 font-bold">
                      KM/H {'//'} G{Math.floor((rpm / 9000) * 342) < 45 ? 1 : Math.floor((rpm / 9000) * 342) < 90 ? 2 : Math.floor((rpm / 9000) * 342) < 140 ? 3 : Math.floor((rpm / 9000) * 342) < 195 ? 4 : Math.floor((rpm / 9000) * 342) < 250 ? 5 : Math.floor((rpm / 9000) * 342) < 305 ? 6 : 7}
                    </span>
                  </div>
                </div>

                {/* Dyno Sub-Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-4">
                  <div className="bg-[#141620] p-2.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
                    <div className="text-[9px] text-[#8E8E8E]">DOWNFORCE</div>
                    <div className="text-[#00F0FF] font-bold text-sm">
                      {Math.round(0.5 * 1.225 * Math.pow(Math.floor((rpm / 9000) * 342) / 3.6, 2) * 0.95 * (aeroMode === 'low_drag' ? 0.75 : aeroMode === 'balanced' ? 1.2 : 2.1)).toLocaleString()} N
                    </div>
                  </div>
                  <div className="bg-[#141620] p-2.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
                    <div className="text-[9px] text-[#8E8E8E]">DRAG FORCE</div>
                    <div className="text-[#C7FF4A] font-bold text-sm">
                      {Math.round(0.5 * 1.225 * Math.pow(Math.floor((rpm / 9000) * 342) / 3.6, 2) * (aeroMode === 'low_drag' ? 0.26 : aeroMode === 'balanced' ? 0.31 : 0.42) * 2.15).toLocaleString()} N
                    </div>
                  </div>
                  <div className="bg-[#141620] p-2.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
                    <div className="text-[9px] text-[#8E8E8E]">TURBO BOOST</div>
                    <div className="text-[#FFB703] font-bold text-sm">
                      {(((rpm - 800) / 8200) * 2.2).toFixed(1)} BAR
                    </div>
                  </div>
                  <div className="bg-[#141620] p-2.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
                    <div className="text-[9px] text-[#8E8E8E]">EXHAUST TEMP</div>
                    <div className="text-[#FF5E00] font-bold text-sm">
                      {Math.round(420 + (rpm / 9000) * 520)}°C
                    </div>
                  </div>
                </div>

                {/* Interactive Throttle Slider */}
                <div className="mb-6 p-3 bg-[#10121A] rounded-xl border border-[rgba(242,240,234,0.08)]">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="flex items-center gap-1.5 text-[#8E8E8E]">
                      <Sliders size={12} className="text-[#C7FF4A]" />
                      <span>THROTTLE POSITION</span>
                    </span>
                    <span className="text-[#C7FF4A] font-bold">{rpm} RPM</span>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={9000}
                    step={50}
                    value={rpm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRpm(val);
                      playEngineRev(val);
                    }}
                    onMouseUp={() => stopEngineSound()}
                    onTouchEnd={() => stopEngineSound()}
                    className="w-full accent-[#C7FF4A] bg-[#1a1d28] h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#666666] mt-1">
                    <span>800 IDLE</span>
                    <span>5,000 MID</span>
                    <span className="text-[#FF0055]">9,000 REDLINE</span>
                  </div>
                </div>
              </div>

              {/* Dyno Launch Pull Button */}
              <button
                type="button"
                onMouseDown={startDynoPull}
                onMouseUp={stopDynoPull}
                onTouchStart={startDynoPull}
                onTouchEnd={stopDynoPull}
                className={`w-full py-4.5 rounded-xl flex items-center justify-center gap-2.5 text-xs font-mono font-bold tracking-widest border transition-all ${
                  isDynoRunning
                    ? 'bg-gradient-to-r from-[#FF0055] to-[#FF5E00] text-white border-transparent scale-[0.98] shadow-[0_0_30px_rgba(255,0,85,0.6)]'
                    : 'bg-[#181A24] text-[#C7FF4A] border-[#C7FF4A]/40 hover:bg-[#C7FF4A]/10 hover:border-[#C7FF4A] hover:shadow-[0_0_20px_rgba(199,255,74,0.25)]'
                }`}
              >
                <Flame size={18} className={isDynoRunning ? 'animate-bounce text-yellow-300' : 'text-[#C7FF4A]'} />
                <span>{isDynoRunning ? 'DYNO PULL ACTIVE (9,000 RPM REDLINE)' : 'HOLD TO LAUNCH DYNO PULL'}</span>
              </button>
            </div>
          ) : (
            /* Compute Telemetry Panel */
            <div className="lg:col-span-4 border border-[rgba(242,240,234,0.12)] bg-[#0C0D13] p-6 sm:p-8 flex flex-col justify-between rounded-2xl shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-[rgba(242,240,234,0.08)] pb-4 mb-6 text-xs font-mono text-[#8E8E8E]">
                  <div className="flex items-center gap-2 text-[#F2F0EA] font-bold">
                    <Gauge size={14} style={{ color: activeColor.primary }} />
                    <span>COMPUTE TELEMETRY</span>
                  </div>
                  <span className={tflops > 180 ? 'text-[#FF007F] animate-pulse font-bold' : 'text-[#00F0FF]'}>
                    {tflops > 180 ? 'PEAK COMPUTE' : 'INFERENCE LIVE'}
                  </span>
                </div>

                {/* Circular Gauge */}
                <div className="relative mx-auto my-6 w-52 h-52 rounded-full border-2 border-[rgba(242,240,234,0.12)] bg-gradient-to-b from-[#10121A] to-[#07070B] flex items-center justify-center shadow-2xl">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(242, 240, 234, 0.1)"
                      strokeWidth="2"
                      strokeDasharray="2 4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={tflops > 180 ? '#FF007F' : tflops > 80 ? '#FFB703' : '#00F0FF'}
                      strokeWidth="4"
                      strokeDasharray="30 200"
                      strokeDashoffset="-135"
                      className="transition-colors duration-300"
                    />
                  </svg>

                  {/* Sweeping Needle */}
                  <div
                    className="absolute w-1.5 h-22 bg-gradient-to-t from-transparent via-[#FFB703] to-[#FF007F] origin-bottom transition-transform duration-75 ease-out rounded-full shadow-[0_0_15px_#FF007F]"
                    style={{
                      bottom: '50%',
                      transform: `rotate(${-135 + (tflops / 256) * 270}deg)`,
                    }}
                  />

                  {/* Center Digital Readout */}
                  <div className="relative z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full bg-[#13151D] border-2 border-[rgba(242,240,234,0.2)] shadow-xl">
                    <span className="text-xl font-sans font-black text-[#F2F0EA]">
                      {tflops.toFixed(1)}
                    </span>
                    <span className="text-[8px] font-mono text-[#00F0FF] -mt-1 font-bold">
                      {tflops > 100 ? 'PFLOPS' : 'TFLOPS'}
                    </span>
                  </div>
                </div>

                {/* Sub Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-6">
                  <div className="bg-[#141620] p-2.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
                    <div className="text-[9px] text-[#8E8E8E]">THERMAL TEMP</div>
                    <div className="text-[#FF5E00] font-bold text-sm">
                      {Math.floor(thermalTemp)}°C
                    </div>
                  </div>
                  <div className="bg-[#141620] p-2.5 rounded-lg border border-[rgba(242,240,234,0.08)]">
                    <div className="text-[9px] text-[#8E8E8E]">SYNAPSE DENSITY</div>
                    <div className="text-[#00F0FF] font-bold text-sm">
                      {(97.2 + (tflops / 256) * 2.6).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs font-mono font-bold text-[#F2F0EA] mb-6">
                  {tflops.toFixed(1)} TFLOPS <span className="text-[#555555]">{'//'}</span>{' '}
                  <span className={tflops > 180 ? 'text-[#FF007F]' : 'text-[#00F0FF]'}>
                    {tflops > 180 ? 'WARP INFERENCE ACTIVE' : 'QUANTUM SYNAPSE STEADY'}
                  </span>
                </div>
              </div>

              {/* Overclock Compute Button */}
              <button
                type="button"
                onMouseDown={startOverclock}
                onMouseUp={stopOverclock}
                onTouchStart={startOverclock}
                onTouchEnd={stopOverclock}
                className={`w-full py-4.5 rounded-xl flex items-center justify-center gap-2.5 text-xs font-mono font-bold tracking-widest border transition-all ${
                  isOverclocking
                    ? 'bg-gradient-to-r from-[#FF007F] to-[#FF5E00] text-white border-transparent scale-[0.98] shadow-[0_0_30px_rgba(255,0,127,0.6)]'
                    : 'bg-[#181A24] text-[#F2F0EA] border-[rgba(242,240,234,0.15)] hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                }`}
              >
                <Zap size={18} className={isOverclocking ? 'animate-bounce text-yellow-300' : 'text-[#00F0FF]'} />
                <span>{isOverclocking ? 'OVERCLOCK ACTIVE (MAX COMPUTE)' : 'HOLD TO OVERCLOCK COMPUTE'}</span>
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </section>
  );
}
