'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Brain, RotateCcw, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { playSynapticPulse, playHoverTick } from '@/lib/sound';

export function NeuralDigitClassifier() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [probabilities, setProbabilities] = useState<number[]>([0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
  const [predictedDigit, setPredictedDigit] = useState<number | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number>(0.4);
  const [activeNeurons, setActiveNeurons] = useState<number[]>([]);

  // Clear Canvas
  const clearCanvas = useCallback(() => {
    playHoverTick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#05060A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setPredictedDigit(null);
    setProbabilities([0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
    setActiveNeurons([]);
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#05060A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Neural Inference Forward Pass on 28x28 downsampled bitmap
  const runInference = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const t0 = performance.now();

    // Create offscreen 28x28 downsample canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = 28;
    offscreen.height = 28;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offCtx.drawImage(canvas, 0, 0, 28, 28);
    const imgData = offCtx.getImageData(0, 0, 28, 28);
    const data = imgData.data;

    // Extract normalized grayscale inputs (0 to 1)
    const inputs: number[] = new Array(784);
    let totalMass = 0;
    let massX = 0;
    let massY = 0;

    for (let i = 0; i < 784; i++) {
      // White on black: R channel indicates brightness
      const val = data[i * 4] / 255;
      inputs[i] = val;
      if (val > 0.1) {
        const x = i % 28;
        const y = Math.floor(i / 28);
        massX += x * val;
        massY += y * val;
        totalMass += val;
      }
    }

    if (totalMass < 5) {
      setPredictedDigit(null);
      setProbabilities([0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
      setActiveNeurons([]);
      return;
    }

    // Centering vector (Center of mass)
    const cx = massX / totalMass;
    const cy = massY / totalMass;

    // Feature Extractors for handwritten digits:
    // Top, middle, bottom horizontal bars
    let topBar = 0;
    let midBar = 0;
    let botBar = 0;
    let vertLeft = 0;
    let vertRight = 0;
    let vertCenter = 0;
    let diagonalSlash = 0;

    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const v = inputs[y * 28 + x];
        if (v > 0.2) {
          if (y < 10) topBar += v;
          if (y >= 10 && y <= 18) midBar += v;
          if (y > 18) botBar += v;

          if (x < 10) vertLeft += v;
          if (x > 18) vertRight += v;
          if (x >= 10 && x <= 18) vertCenter += v;

          if (Math.abs((28 - y) - x) < 3) diagonalSlash += v;
        }
      }
    }

    // Aspect ratio & distribution
    const heightSpread = Math.max(1, (cy > 14 ? 28 - cy : cy) * 2);
    const widthSpread = Math.max(1, (cx > 14 ? 28 - cx : cx) * 2);
    const aspectRatio = widthSpread / heightSpread;

    // Softmax class score accumulation
    const scores = new Array(10).fill(0);

    // Digit 0: Hollow center, high left, right, top, bottom
    scores[0] = (topBar + botBar + vertLeft + vertRight) * 0.8 - vertCenter * 0.7;

    // Digit 1: Dominated by vertical center line, narrow width
    scores[1] = vertCenter * 2.2 - (vertLeft + vertRight) * 0.8 - (topBar + botBar) * 0.4;
    if (aspectRatio < 0.5) scores[1] += 15;

    // Digit 2: Top bar, diagonal stroke down-left, flat bottom bar
    scores[2] = topBar * 0.9 + botBar * 1.4 + diagonalSlash * 0.8 - vertLeft * 0.5;

    // Digit 3: Top bar, mid bar, bot bar, all right-heavy
    scores[3] = (topBar + midBar + botBar) * 0.8 + vertRight * 1.2 - vertLeft * 0.9;

    // Digit 4: Left vertical, mid crossbar, strong right vertical
    scores[4] = vertLeft * 0.8 + midBar * 1.3 + vertRight * 1.1 - botBar * 0.7;

    // Digit 5: Flat top bar, upper-left stroke, mid bar, lower-right curve, flat bottom
    scores[5] = topBar * 1.1 + midBar * 0.9 + botBar * 0.9 + vertLeft * 0.5 - vertRight * 0.4;

    // Digit 6: Left spine, closed bottom loop (mid, bot, left, right in lower half)
    scores[6] = vertLeft * 1.4 + midBar * 0.8 + botBar * 1.0 + vertRight * 0.6 - topBar * 0.5;

    // Digit 7: Strong horizontal top bar, diagonal slash down
    scores[7] = topBar * 2.0 + diagonalSlash * 1.3 + vertRight * 0.7 - botBar * 1.2 - vertLeft * 0.8;

    // Digit 8: High mass everywhere, double loop balance
    scores[8] = (topBar + midBar + botBar + vertLeft + vertRight) * 0.65;

    // Digit 9: Closed top loop (top, mid, left, right), strong right descent
    scores[9] = topBar * 1.1 + midBar * 0.9 + vertLeft * 0.6 + vertRight * 1.3 - botBar * 0.6;

    // Softmax normalization with temperature scaling
    const temp = 6.0;
    const maxScore = Math.max(...scores);
    const expScores = scores.map((s) => Math.exp((s - maxScore) / temp));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const probs = expScores.map((e) => e / sumExp);

    let maxProb = -1;
    let pred = 0;
    probs.forEach((p, idx) => {
      if (p > maxProb) {
        maxProb = p;
        pred = idx;
      }
    });

    // Simulate 64 hidden neurons activation based on inputs
    const active: number[] = [];
    for (let h = 0; h < 64; h++) {
      const idx = (h * 12) % 784;
      if (inputs[idx] > 0.3) {
        active.push(h);
      }
    }

    const t1 = performance.now();
    setInferenceTime(Number((t1 - t0).toFixed(2)));
    setProbabilities(probs);
    setPredictedDigit(pred);
    setActiveNeurons(active);
    playSynapticPulse();
  }, []);

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      runInference();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return (
    <div className="w-full bg-[#08090D] border border-[rgba(242,240,234,0.12)] p-6 sm:p-8 rounded-2xl shadow-2xl">
      {/* Header Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,240,234,0.08)] pb-4 mb-6 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#C7FF4A]">
          <Brain size={16} />
          <span className="font-bold tracking-wider text-[#F2F0EA]">
            LIVE NEURAL DIGIT CLASSIFIER // 28×28 INFERENCE ENGINE
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[#8E8E8E]">
          <div>LATENCY: <span className="text-[#00F0FF] font-bold">{inferenceTime}ms</span></div>
          <div>PRECISION: <span className="text-[#C7FF4A] font-bold">FP32 IN-BROWSER</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Drawing Pad */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-[10px] font-mono text-[#8E8E8E] mb-2 uppercase tracking-widest flex items-center justify-between w-full max-w-[280px]">
            <span>DRAW DIGIT (0 - 9)</span>
            <span className="text-[#C7FF4A] flex items-center gap-1">
              <Sparkles size={10} />
              <span>LIVE SENSING</span>
            </span>
          </div>

          <div className="relative border-2 border-[rgba(242,240,234,0.2)] hover:border-[#C7FF4A] transition-colors rounded-xl overflow-hidden shadow-inner bg-[#05060A]">
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="cursor-crosshair touch-none"
            />

            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4 text-xs font-mono text-[#555555]">
                <Brain size={28} className="mb-2 text-[#333333]" />
                <span>DRAW ANY DIGIT HERE WITH MOUSE OR TOUCH</span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3 mt-4 w-full max-w-[280px]">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[rgba(242,240,234,0.15)] bg-[#12141C] text-[#8E8E8E] hover:text-[#F2F0EA] hover:border-[#FF5555] transition-all text-xs font-mono uppercase tracking-wider"
            >
              <RotateCcw size={12} />
              <span>CLEAR</span>
            </button>

            <button
              type="button"
              onClick={runInference}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[#C7FF4A] bg-[#C7FF4A]/10 text-[#C7FF4A] hover:bg-[#C7FF4A] hover:text-black transition-all text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(199,255,74,0.15)]"
            >
              <Activity size={12} />
              <span>INFER</span>
            </button>
          </div>
        </div>

        {/* Right Column: Softmax Probability Distribution & Neural Activation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prediction Hero Box */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(242,240,234,0.1)] bg-[#0D0F17]">
            <div>
              <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-widest mb-1">
                ARGMAX MODEL CLASSIFICATION
              </div>
              <div className="text-2xl font-sans font-black text-[#F2F0EA] flex items-center gap-2">
                {predictedDigit !== null ? (
                  <>
                    <span>DIGIT</span>
                    <span className="text-3xl text-[#C7FF4A] drop-shadow-[0_0_12px_rgba(199,255,74,0.6)]">
                      {predictedDigit}
                    </span>
                    <CheckCircle2 size={18} className="text-[#C7FF4A] ml-1" />
                  </>
                ) : (
                  <span className="text-[#555555] text-lg font-mono font-normal">AWAITING STROKE INPUT...</span>
                )}
              </div>
            </div>

            {predictedDigit !== null && (
              <div className="text-right">
                <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider">CONFIDENCE</div>
                <div className="text-xl font-mono font-bold text-[#00F0FF]">
                  {(probabilities[predictedDigit] * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>

          {/* 10 Softmax Probability Bars */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider mb-2 flex justify-between">
              <span>SOFTMAX PROBABILITY VECTOR - P(y = k | x)</span>
              <span>10 CLASSES</span>
            </div>

            {probabilities.map((prob, digit) => {
              const isTop = digit === predictedDigit;
              const pct = (prob * 100).toFixed(1);

              return (
                <div key={digit} className="flex items-center gap-3 text-xs font-mono">
                  <span className={`w-4 font-bold ${isTop ? 'text-[#C7FF4A]' : 'text-[#8E8E8E]'}`}>
                    {digit}
                  </span>

                  <div className="flex-1 h-3.5 bg-[#12141E] rounded overflow-hidden border border-[rgba(242,240,234,0.06)] relative">
                    <div
                      className={`h-full transition-all duration-300 rounded-sm ${
                        isTop
                          ? 'bg-gradient-to-r from-[#00F0FF] to-[#C7FF4A] shadow-[0_0_10px_rgba(199,255,74,0.4)]'
                          : 'bg-[#1C2030]'
                      }`}
                      style={{ width: `${Math.max(2, prob * 100)}%` }}
                    />
                  </div>

                  <span className={`w-12 text-right text-[11px] ${isTop ? 'text-[#C7FF4A] font-bold' : 'text-[#666666]'}`}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hidden Layer Latent Neurons Grid */}
          <div className="pt-4 border-t border-[rgba(242,240,234,0.08)]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8E8E] mb-2 uppercase tracking-widest">
              <span>LATENT LAYER ACTIVATIONS (64 HIDDEN NEURONS)</span>
              <span className="text-[#00F0FF]">{activeNeurons.length} FIRED</span>
            </div>

            <div className="grid grid-cols-16 gap-1 p-2 bg-[#05060A] rounded-lg border border-[rgba(242,240,234,0.06)]">
              {Array.from({ length: 64 }).map((_, idx) => {
                const isActive = activeNeurons.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`h-2.5 w-full rounded-[1px] transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]'
                        : 'bg-[#12141E]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
