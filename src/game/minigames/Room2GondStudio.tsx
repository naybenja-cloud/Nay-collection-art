/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

type PatternType = 'dots' | 'scales' | 'seeds' | 'lines';
type ColorScheme = 'turquoise' | 'saffron' | 'emerald' | 'coral';

export const Room2GondStudio: React.FC<Props> = ({ onComplete, onClose }) => {
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('dots');
  const [selectedColor, setSelectedColor] = useState<ColorScheme>('turquoise');
  const [sections, setSections] = useState<{ [key: string]: { pattern: PatternType; color: ColorScheme } }>({
    crown: { pattern: 'dots', color: 'turquoise' },
  });
  const [isFinished, setIsFinished] = useState(false);

  const PATTERNS: { id: PatternType; name: string; desc: string; sample: string }[] = [
    { id: 'dots', name: 'Bindiya (Dots)', desc: 'Used by Bhajju Shyam to show inner energy', sample: '● ● ●' },
    { id: 'scales', name: 'Machhli (Fish Scales)', desc: 'Ancient symbol of water and abundance', sample: '⌒⌒⌒' },
    { id: 'seeds', name: 'Dhaana (Rice Seeds)', desc: 'Used by Bhuri Bai to symbolize growth', sample: '/// \\\\\\' },
    { id: 'lines', name: 'Leher (River Waves)', desc: 'Flowing rhythms of the Narmada River', sample: '≈ ≈ ≈' }
  ];

  const COLORS: { id: ColorScheme; name: string; hex: string }[] = [
    { id: 'turquoise', name: 'Sacred Sky', hex: '#06B6D4' },
    { id: 'saffron', name: 'Temple Saffron', hex: '#F59E0B' },
    { id: 'emerald', name: 'Jungle Emerald', hex: '#10B981' },
    { id: 'coral', name: 'Terracotta Coral', hex: '#F43F5E' }
  ];

  const handleApplySection = (part: string) => {
    soundFx.playTalkBoop('peacock');
    const updated = {
      ...sections,
      [part]: { pattern: selectedPattern, color: selectedColor }
    };
    setSections(updated);

    const requiredParts = ['body', 'wing1', 'wing2', 'tail', 'crown'];
    const filledCount = requiredParts.filter((p) => updated[p]).length;

    if (filledCount === requiredParts.length && !isFinished) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setIsFinished(true);
    }
  };

  const getColorHex = (c: ColorScheme) => {
    switch (c) {
      case 'turquoise': return '#06B6D4';
      case 'saffron': return '#F59E0B';
      case 'emerald': return '#10B981';
      case 'coral': return '#F43F5E';
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Room 2 Studio</span>
          <h2 className="text-2xl font-serif font-bold text-emerald-100">Gond Dot Master Studio</h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white px-3 py-1 rounded text-sm bg-stone-800 hover:bg-stone-700 transition"
        >
          ✕ Close
        </button>
      </div>

      <p className="text-sm text-stone-300 mt-4 leading-relaxed">
        In traditional Gond and Bhil art, artists don’t just color in lines—they invent their own signature micro-patterns (dots, scales, seeds) to give every animal a living soul! Pick a pattern and color, then tap the peacock parts to bring it to life!
      </p>

      {/* Palette Selector */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-800/60 p-3.5 rounded-xl border border-stone-700/70">
        <div>
          <span className="text-xs text-stone-400 uppercase font-mono block mb-2">1. Choose Signature Pattern:</span>
          <div className="grid grid-cols-2 gap-2">
            {PATTERNS.map((pat) => (
              <button
                key={pat.id}
                onClick={() => {
                  soundFx.playTalkBoop('peacock');
                  setSelectedPattern(pat.id);
                }}
                className={`p-2 rounded-lg border text-left transition ${
                  selectedPattern === pat.id
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                    : 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div className="font-semibold text-xs">{pat.name}</div>
                <div className="text-xs font-mono opacity-80">{pat.sample}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs text-stone-400 uppercase font-mono block mb-2">2. Choose Mineral Pigment:</span>
          <div className="grid grid-cols-2 gap-2">
            {COLORS.map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  soundFx.playTalkBoop('peacock');
                  setSelectedColor(col.id);
                }}
                className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                  selectedColor === col.id
                    ? 'border-emerald-400 bg-emerald-950/40 text-white'
                    : 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-600'
                }`}
              >
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: col.hex }} />
                <span className="text-xs font-semibold">{col.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Gond Peacock SVG Canvas */}
      <div className="mt-5 p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-col items-center justify-center">
        <svg viewBox="0 0 500 320" className="w-full max-w-lg h-auto select-none">
          <defs>
            <radialGradient id="gondGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="500" height="320" fill="#1C1917" rx="12" />
          <circle cx="250" cy="160" r="140" fill="url(#gondGlow)" />

          {/* Tree branch */}
          <path d="M 40 260 Q 180 230 320 250 T 480 230" stroke="#78350F" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 220 240 Q 300 200 360 210" stroke="#78350F" strokeWidth="6" fill="none" />

          {/* Tail Section */}
          <g onClick={() => handleApplySection('tail')} className="cursor-pointer group">
            <path
              d="M 120 220 C 60 160, 40 80, 110 50 C 180 80, 160 180, 210 210 Z"
              fill={sections['tail'] ? getColorHex(sections['tail'].color) : '#292524'}
              stroke="#E7E5E4"
              strokeWidth="2"
              className="transition duration-300 group-hover:opacity-90"
            />
            <text x="110" y="140" fill="#E7E5E4" fontSize="12" textAnchor="middle" className="pointer-events-none font-mono">
              {sections['tail'] ? '✓ Tail Feather' : '+ Tap Tail'}
            </text>
          </g>

          {/* Wing 2 (Behind) */}
          <g onClick={() => handleApplySection('wing2')} className="cursor-pointer group">
            <path
              d="M 240 160 C 230 110, 270 90, 310 110 C 320 150, 280 180, 240 160 Z"
              fill={sections['wing2'] ? getColorHex(sections['wing2'].color) : '#292524'}
              stroke="#E7E5E4"
              strokeWidth="2"
            />
            <text x="280" y="130" fill="#E7E5E4" fontSize="11" textAnchor="middle" className="pointer-events-none font-mono">
              {sections['wing2'] ? '✓ Wing' : '+ Wing'}
            </text>
          </g>

          {/* Peacock Body */}
          <g onClick={() => handleApplySection('body')} className="cursor-pointer group">
            <path
              d="M 210 220 C 190 170, 220 130, 260 140 C 300 150, 310 200, 280 240 C 250 250, 220 245, 210 220 Z"
              fill={sections['body'] ? getColorHex(sections['body'].color) : '#292524'}
              stroke="#E7E5E4"
              strokeWidth="2.5"
            />
            <text x="255" y="195" fill="#E7E5E4" fontSize="12" textAnchor="middle" className="pointer-events-none font-mono">
              {sections['body'] ? '✓ Body' : '+ Tap Body'}
            </text>
          </g>

          {/* Wing 1 (Foreground) */}
          <g onClick={() => handleApplySection('wing1')} className="cursor-pointer group">
            <path
              d="M 220 180 C 200 150, 250 140, 275 165 C 265 195, 235 205, 220 180 Z"
              fill={sections['wing1'] ? getColorHex(sections['wing1'].color) : '#332E2B'}
              stroke="#E7E5E4"
              strokeWidth="2"
            />
            <text x="245" y="175" fill="#E7E5E4" fontSize="11" textAnchor="middle" className="pointer-events-none font-mono">
              {sections['wing1'] ? '✓ Crest' : '+ Crest'}
            </text>
          </g>

          {/* Head & Neck */}
          <path d="M 265 140 Q 295 100 320 85 Q 340 70 345 85 Q 330 115 300 145 Z" fill="#0D9488" stroke="#E7E5E4" strokeWidth="2" />
          {/* Eye */}
          <circle cx="335" cy="82" r="3.5" fill="#FEF08A" stroke="#000" strokeWidth="1" />
          <circle cx="335.5" cy="82" r="1.5" fill="#000" />
          {/* Beak */}
          <polygon points="345,82 360,86 345,90" fill="#F59E0B" />

          {/* Crown Feathers */}
          <g onClick={() => handleApplySection('crown')} className="cursor-pointer group">
            <line x1="330" y1="75" x2="335" y2="55" stroke="#E7E5E4" strokeWidth="2" />
            <line x1="335" y1="73" x2="345" y2="52" stroke="#E7E5E4" strokeWidth="2" />
            <line x1="340" y1="75" x2="355" y2="56" stroke="#E7E5E4" strokeWidth="2" />
            <circle cx="335" cy="55" r="4.5" fill={sections['crown'] ? getColorHex(sections['crown'].color) : '#10B981'} />
            <circle cx="345" cy="52" r="4.5" fill={sections['crown'] ? getColorHex(sections['crown'].color) : '#10B981'} />
            <circle cx="355" cy="56" r="4.5" fill={sections['crown'] ? getColorHex(sections['crown'].color) : '#10B981'} />
          </g>
        </svg>

        <span className="text-xs text-stone-400 mt-2">
          Tap each section of the sacred peacock to apply your signature pattern!
        </span>
      </div>

      {isFinished && (
        <div className="mt-5 text-center p-4 bg-emerald-950/40 border border-emerald-600/40 rounded-xl space-y-3">
          <h3 className="text-xl font-serif font-bold text-emerald-300">Master of Dots Badge Earned!</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Just like Bhajju Shyam and Bhuri Bai, you transformed traditional folk symbols into your own unique signature artwork!
          </p>
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Collect Stamp & Return to Museum
          </button>
        </div>
      )}
    </div>
  );
};
