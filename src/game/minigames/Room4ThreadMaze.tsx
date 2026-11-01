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

interface KeyItem {
  id: number;
  x: number;
  y: number;
  name: string;
  icon: string;
  collected: boolean;
}

export const Room4ThreadMaze: React.FC<Props> = ({ onComplete, onClose }) => {
  const [player, setPlayer] = useState({ x: 40, y: 40 });
  const [keys, setKeys] = useState<KeyItem[]>([
    { id: 1, x: 120, y: 160, name: 'Key to Secret Treehouse', icon: '🗝️', collected: false },
    { id: 2, x: 260, y: 60, name: 'Key to Grandpa’s Sketchbook', icon: '🔑', collected: false },
    { id: 3, x: 340, y: 220, name: 'Key to Grandma’s Music Box', icon: '🗝️', collected: false },
  ]);
  const [message, setMessage] = useState<string>('Guide the paper memory boat through the red threads to gather all 3 antique keys!');
  const [completed, setCompleted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Red thread obstacles (lines)
  const THREADS = [
    { x1: 80, y1: 20, x2: 80, y2: 120 },
    { x1: 80, y1: 180, x2: 80, y2: 280 },
    { x1: 80, y1: 120, x2: 180, y2: 120 },
    { x1: 180, y1: 40, x2: 180, y2: 200 },
    { x1: 220, y1: 120, x2: 300, y2: 120 },
    { x1: 300, y1: 20, x2: 300, y2: 180 },
    { x1: 220, y1: 180, x2: 220, y2: 280 },
    { x1: 220, y1: 240, x2: 320, y2: 240 },
  ];

  const movePlayer = (dx: number, dy: number) => {
    if (completed) return;
    const nextX = Math.max(20, Math.min(380, player.x + dx));
    const nextY = Math.max(20, Math.min(280, player.y + dy));

    // Simple line collision test
    let collided = false;
    for (const t of THREADS) {
      const dist = pointToSegmentDist(nextX, nextY, t.x1, t.y1, t.x2, t.y2);
      if (dist < 10) {
        collided = true;
        break;
      }
    }

    if (collided) {
      soundFx.playBonk();
      setMessage('Tension strum! A red thread gently held the boat back. Try another path!');
      return;
    }

    soundFx.playFootstep();
    setPlayer({ x: nextX, y: nextY });

    // Check key pickup
    const updatedKeys = keys.map((k) => {
      if (!k.collected) {
        const d = Math.hypot(nextX - k.x, nextY - k.y);
        if (d < 22) {
          soundFx.playInspectChime();
          setMessage(`Found the ${k.name}! Beautiful memory restored.`);
          return { ...k, collected: true };
        }
      }
      return k;
    });

    setKeys(updatedKeys);

    if (updatedKeys.every((k) => k.collected) && !completed) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setCompleted(true);
      setMessage('All 3 memory keys gathered! Chiharu Shiota’s room shines with memories!');
    }
  };

  const pointToSegmentDist = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) movePlayer(0, -18);
      if (['ArrowDown', 's', 'S'].includes(e.key)) movePlayer(0, 18);
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) movePlayer(-18, 0);
      if (['ArrowRight', 'd', 'D'].includes(e.key)) movePlayer(18, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, keys, completed]);

  return (
    <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-400 font-mono">Room 4 Challenge</span>
          <h2 className="text-2xl font-serif font-bold text-rose-100">The Red Thread of Lost Memories</h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white px-3 py-1 rounded text-sm bg-stone-800 hover:bg-stone-700 transition"
        >
          ✕ Close
        </button>
      </div>

      <p className="text-sm text-stone-300 mt-4 leading-relaxed">
        Artist Chiharu Shiota uses miles of crimson thread to connect memories and old keys. Steer your tiny paper boat through the yarn web to recover all 3 antique keys!
      </p>

      <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-200 text-xs mt-3">
        {message}
      </div>

      {/* Thread Canvas */}
      <div
        ref={containerRef}
        className="mt-4 bg-stone-950 rounded-xl border border-rose-900/40 p-2 flex flex-col items-center select-none"
      >
        <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto bg-stone-950 rounded-lg">
          {/* Ambient red web fibers */}
          <line x1="0" y1="0" x2="400" y2="300" stroke="#E11D48" strokeWidth="0.5" opacity="0.15" />
          <line x1="400" y1="0" x2="0" y2="300" stroke="#E11D48" strokeWidth="0.5" opacity="0.15" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#E11D48" strokeWidth="0.5" opacity="0.15" />
          <line x1="0" y1="150" x2="400" y2="150" stroke="#E11D48" strokeWidth="0.5" opacity="0.15" />

          {/* Actual structural threads (obstacles) */}
          {THREADS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="#F43F5E"
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0 0 3px #F43F5E)"
            />
          ))}

          {/* Keys to collect */}
          {keys.map((k) =>
            !k.collected ? (
              <g key={k.id} transform={`translate(${k.x - 12}, ${k.y - 12})`}>
                <circle cx="12" cy="12" r="14" fill="#FBBF24" opacity="0.2" className="animate-pulse" />
                <text x="12" y="16" fontSize="16" textAnchor="middle">
                  {k.icon}
                </text>
              </g>
            ) : null
          )}

          {/* Paper Boat Player */}
          <g transform={`translate(${player.x - 14}, ${player.y - 14})`}>
            <circle cx="14" cy="14" r="16" fill="#38BDF8" opacity="0.25" />
            <text x="14" y="19" fontSize="18" textAnchor="middle">
              ⛵
            </text>
          </g>
        </svg>

        {/* Direction Pad for Touch / Mouse */}
        <div className="flex gap-2 mt-3 items-center justify-center">
          <button
            onClick={() => movePlayer(-22, 0)}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs rounded-lg font-mono border border-stone-700"
          >
            ← Left
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => movePlayer(0, -22)}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-xs rounded font-mono border border-stone-700"
            >
              ↑ Up
            </button>
            <button
              onClick={() => movePlayer(0, 22)}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-xs rounded font-mono border border-stone-700"
            >
              ↓ Down
            </button>
          </div>
          <button
            onClick={() => movePlayer(22, 0)}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs rounded-lg font-mono border border-stone-700"
          >
            Right →
          </button>
        </div>
      </div>

      {completed && (
        <div className="mt-5 text-center p-4 bg-rose-950/40 border border-rose-600/40 rounded-xl space-y-3">
          <h3 className="text-xl font-serif font-bold text-rose-300">Keeper of Memories Badge Earned!</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            You retrieved all 3 keys! You understand Room 4: an artwork doesn't need to show a person to tell their deepest story—their memories can be held in space itself.
          </p>
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Collect Stamp & Return to Museum
          </button>
        </div>
      )}
    </div>
  );
};
