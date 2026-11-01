/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

type MathMode = 'rose' | 'spiral' | 'bloom' | 'hyperbolic';
type Palette = 'aurora' | 'sunset' | 'deep' | 'matrix';

export const Room5AlgoStudio: React.FC<Props> = ({ onComplete, onClose }) => {
  const [mode, setMode] = useState<MathMode>('rose');
  const [palette, setPalette] = useState<Palette>('aurora');
  const [complexity, setComplexity] = useState<number>(7);
  const [speed, setSpeed] = useState<number>(2);
  const [seed, setSeed] = useState<number>(42);
  const [minted, setMinted] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.015 * speed;
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      const totalPoints = 400;
      ctx.lineWidth = 1.5;

      for (let i = 0; i < totalPoints; i++) {
        const theta = (i / totalPoints) * Math.PI * 2 * complexity;
        let r = 0;

        if (mode === 'rose') {
          r = Math.cos((complexity / 2) * theta + time) * 110 + 30;
        } else if (mode === 'spiral') {
          r = ((i % 120) * 1.2) + Math.sin(time + theta) * 20;
        } else if (mode === 'bloom') {
          r = (Math.sin(theta * 4) + Math.cos(time * 2 + theta * 3)) * 60 + 80;
        } else {
          r = (Math.tan(theta % (Math.PI / 4)) * 30 + 70) * (Math.sin(time) * 0.3 + 0.8);
        }

        const x = r * Math.cos(theta + time * 0.2);
        const y = r * Math.sin(theta + time * 0.2);

        // Color based on palette
        let stroke = '#8B5CF6';
        if (palette === 'aurora') {
          const hue = (i * 2 + time * 50 + seed) % 360;
          stroke = `hsl(${hue}, 85%, 60%)`;
        } else if (palette === 'sunset') {
          const hue = 15 + ((i + seed) % 50);
          stroke = `hsl(${hue}, 95%, 55%)`;
        } else if (palette === 'deep') {
          const hue = 200 + ((i * 3) % 60);
          stroke = `hsl(${hue}, 90%, 65%)`;
        } else {
          stroke = `rgb(34, 197, 94)`;
        }

        ctx.strokeStyle = stroke;
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.stroke();

        if (i % 6 === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x * 0.7, y * 0.7);
          ctx.stroke();
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [mode, palette, complexity, speed, seed]);

  const handleRandomize = () => {
    soundFx.playTalkBoop('owl');
    setSeed(Math.floor(Math.random() * 9999));
    setComplexity(Math.floor(Math.random() * 9) + 3);
  };

  const handleMint = () => {
    soundFx.playBadgeFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setMinted(true);
  };

  return (
    <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-purple-400 font-mono">Room 5 Studio</span>
          <h2 className="text-2xl font-serif font-bold text-purple-100">The Algorithmic Art Synthesizer</h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white px-3 py-1 rounded text-sm bg-stone-800 hover:bg-stone-700 transition"
        >
          ✕ Close
        </button>
      </div>

      <p className="text-sm text-stone-300 mt-4 leading-relaxed">
        In Algorithmic Narrative, you don’t draw pixels by hand—you write rules and mathematical equations! Tweak the sliders below to see the computer generate autonomous visual beauty!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Live Canvas */}
        <div className="bg-stone-950 rounded-xl border border-purple-900/40 p-2 flex flex-col items-center justify-center">
          <canvas ref={canvasRef} width={280} height={280} className="rounded-lg shadow-inner w-full max-w-[280px]" />
          <div className="text-[11px] font-mono text-purple-300 mt-2 flex justify-between w-full px-2">
            <span>Algorithm: {mode.toUpperCase()}</span>
            <span>Seed: #{seed}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3 bg-stone-800/60 p-4 rounded-xl border border-stone-700/70">
          <div>
            <label className="text-xs text-stone-300 font-medium block mb-1">Mathematical Function:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['rose', 'spiral', 'bloom', 'hyperbolic'] as MathMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    soundFx.playTalkBoop('owl');
                    setMode(m);
                  }}
                  className={`py-1.5 text-xs rounded border capitalize transition ${
                    mode === m
                      ? 'bg-purple-900/60 border-purple-400 text-purple-200 font-bold'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-300 font-medium block mb-1">Color Harmony:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['aurora', 'sunset', 'deep', 'matrix'] as Palette[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    soundFx.playTalkBoop('owl');
                    setPalette(p);
                  }}
                  className={`py-1.5 text-xs rounded border capitalize transition ${
                    palette === p
                      ? 'bg-purple-900/60 border-purple-400 text-purple-200 font-bold'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>Symmetry Petals:</span>
              <span className="font-mono text-purple-300">{complexity}</span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={handleRandomize}
              className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-xs rounded-lg flex-1 text-center font-semibold"
            >
              🎲 Roll Seed
            </button>
            <button
              onClick={handleMint}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg flex-1 text-center font-bold shadow"
            >
              ✨ Mint Artwork!
            </button>
          </div>
        </div>
      </div>

      {minted && (
        <div className="mt-5 text-center p-4 bg-purple-950/40 border border-purple-600/40 rounded-xl space-y-3">
          <h3 className="text-xl font-serif font-bold text-purple-300">Code Painter Badge Earned!</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Your unique procedural seed #{seed} is now immortalized in the collection! You understand Room 5: computer code is not cold math—it is a paint brush made of light and logic!
          </p>
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Collect Stamp & Return to Museum
          </button>
        </div>
      )}
    </div>
  );
};
