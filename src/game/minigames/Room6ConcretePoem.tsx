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

interface PlacedWord {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

export const Room6ConcretePoem: React.FC<Props> = ({ onComplete, onClose }) => {
  const WORD_BANK = ['DREAM', 'LIGHT', 'STARS', 'ECHO', 'THREAD', 'COSMOS', 'FLUTTER', 'RIVER', 'SECRET', 'MEMORY', 'PATTERN'];
  const [selectedWord, setSelectedWord] = useState<string>('LIGHT');
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([
    { id: 1, text: 'MYTH', x: 200, y: 80, size: 24, color: '#F59E0B', rotation: 0 },
    { id: 2, text: 'RITUAL', x: 200, y: 120, size: 20, color: '#D97706', rotation: 0 },
    { id: 3, text: 'CODE', x: 200, y: 160, size: 22, color: '#8B5CF6', rotation: 0 },
    { id: 4, text: 'STORY', x: 200, y: 200, size: 28, color: '#38BDF8', rotation: 0 },
  ]);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 260;

    soundFx.playTalkBoop('words');
    const colors = ['#F59E0B', '#38BDF8', '#EC4899', '#10B981', '#A855F7', '#FBBF24'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = Math.floor(Math.random() * 14) + 16;
    const randomRot = (Math.random() - 0.5) * 30;

    const newPlaced = [
      ...placedWords,
      {
        id: Date.now(),
        text: selectedWord,
        x,
        y,
        size: randomSize,
        color: randomColor,
        rotation: randomRot,
      }
    ];

    setPlacedWords(newPlaced);

    if (newPlaced.length >= 8 && !completed) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setCompleted(true);
    }
  };

  const handleCreateFlock = () => {
    soundFx.playInspectChime();
    // Shape words in a soaring arc
    const words = ['ORIGIN', 'RITUAL', 'AUTHOR', 'GUTTER', 'MEMORY', 'THREAD', 'SYNTAX', 'ALGORITHM', 'SYSTEM', 'VISION'];
    const flock: PlacedWord[] = words.map((w, i) => {
      const angle = (i / words.length) * Math.PI;
      const x = 200 - Math.cos(angle) * 140;
      const y = 200 - Math.sin(angle) * 110;
      return {
        id: i + 100,
        text: w,
        x,
        y,
        size: 16 + (i % 3) * 4,
        color: i % 2 === 0 ? '#F59E0B' : '#38BDF8',
        rotation: ((angle - Math.PI / 2) * 180) / Math.PI,
      };
    });

    setPlacedWords(flock);
    soundFx.playBadgeFanfare();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setCompleted(true);
  };

  return (
    <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Room 6 Studio</span>
          <h2 className="text-2xl font-serif font-bold text-amber-100">The Living Concrete Poetry Lab</h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white px-3 py-1 rounded text-sm bg-stone-800 hover:bg-stone-700 transition"
        >
          ✕ Close
        </button>
      </div>

      <p className="text-sm text-stone-300 mt-4 leading-relaxed">
        Concrete poetry turns words into physical visual architecture! Select a word and click the canvas to place it, or click "Create Flying Arc" to shape words into a celestial flock!
      </p>

      {/* Word bank */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {WORD_BANK.map((w) => (
          <button
            key={w}
            onClick={() => {
              soundFx.playTalkBoop('words');
              setSelectedWord(w);
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition ${
              selectedWord === w
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-300 border border-stone-700 hover:border-amber-400/50'
            }`}
          >
            {w}
          </button>
        ))}
        <button
          onClick={handleCreateFlock}
          className="px-3 py-1 rounded-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition ml-auto"
        >
          ✨ Shape Flying Arc
        </button>
      </div>

      {/* Interactive Poetry Canvas */}
      <div className="mt-4 bg-stone-950 rounded-xl border border-stone-800 p-2 select-none">
        <svg
          viewBox="0 0 400 260"
          onClick={handleCanvasClick}
          className="w-full max-w-lg h-auto cursor-crosshair rounded bg-stone-950"
        >
          <rect width="400" height="260" fill="#0C0A09" />
          <defs>
            <pattern id="gridDots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#292524" />
            </pattern>
          </defs>
          <rect width="400" height="260" fill="url(#gridDots)" />

          {placedWords.map((pw) => (
            <text
              key={pw.id}
              x={pw.x}
              y={pw.y}
              fill={pw.color}
              fontSize={pw.size}
              fontWeight="bold"
              fontFamily="var(--font-serif)"
              textAnchor="middle"
              transform={`rotate(${pw.rotation}, ${pw.x}, ${pw.y})`}
              className="transition duration-200"
            >
              {pw.text}
            </text>
          ))}
        </svg>
        <div className="text-[11px] text-stone-400 text-center mt-2">
          Click anywhere on the canvas to place "{selectedWord}" (Place 8+ words or shape an arc!)
        </div>
      </div>

      {completed && (
        <div className="mt-5 text-center p-4 bg-amber-950/40 border border-amber-600/40 rounded-xl space-y-3">
          <h3 className="text-xl font-serif font-bold text-amber-300">Wordsmith Badge Earned!</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            You've completed the loop of Narrative Systems! From ancient Warli stick symbols in Room 1 to living typographical constellations in Room 6!
          </p>
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Collect Stamp & Return to Museum
          </button>
        </div>
      )}
    </div>
  );
};
