/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../../utils/audio';

interface MagnifyingLensProps {
  imageUrl: string;
  altText: string;
  target?: {
    x: number; // percentage (0 - 100)
    y: number; // percentage (0 - 100)
    zoom: number;
    note: string;
  };
  onTargetFound?: () => void;
}

export const MagnifyingLens: React.FC<MagnifyingLensProps> = ({
  imageUrl,
  altText,
  target,
  onTargetFound,
}) => {
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [foundTarget, setFoundTarget] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(2.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const chimePlayedRef = useRef(false);

  // Reset target found state whenever the clue target or image changes
  useEffect(() => {
    setFoundTarget(false);
    chimePlayedRef.current = false;
  }, [target?.x, target?.y, target?.note, imageUrl]);

  // Check if lens is near target
  useEffect(() => {
    if (!lensPos || !target || foundTarget) return;

    const dx = lensPos.x - target.x;
    const dy = lensPos.y - target.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 12) {
      setFoundTarget(true);
      if (!chimePlayedRef.current) {
        soundFx.playInspectChime();
        chimePlayedRef.current = true;
      }
      onTargetFound?.();
    }
  }, [lensPos, target, foundTarget, onTargetFound]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setLensPos({ x, y });
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const handleAutoInspect = () => {
    if (!target) return;
    setLensPos({ x: target.x, y: target.y });
    setIsHovered(true);
    setFoundTarget(true);
    soundFx.playInspectChime();
    onTargetFound?.();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Magnifier Canvas Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        className="relative w-full max-w-xl aspect-4/3 bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-800 shadow-2xl cursor-crosshair group touch-none"
      >
        {/* Base Image */}
        <img
          src={imageUrl}
          alt={altText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Ambient Dark Scrim to guide focus */}
        <div
          className={`absolute inset-0 bg-stone-950/20 transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Clue Target Pulse Indicator if not yet found */}
        {target && (
          <button
            type="button"
            onClick={handleAutoInspect}
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer outline-none"
          >
            <div className={`w-8 h-8 rounded-full border-2 ${foundTarget ? 'border-emerald-400 bg-emerald-500/20' : 'border-amber-400 bg-amber-500/20 animate-ping'} `} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs">{foundTarget ? '✓' : '🔍'}</span>
            </div>
          </button>
        )}

        {/* The Magnifying Lens Loupe */}
        {lensPos && (
          <div
            style={{
              left: `${lensPos.x}%`,
              top: `${lensPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute w-36 h-36 rounded-full border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] overflow-hidden pointer-events-none z-20 bg-stone-900"
          >
            {/* Zoomed portion */}
            <div
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
              className="w-full h-full"
            />

            {/* Lens Reticle & Optics Glass Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-amber-300/40 rounded-full pointer-events-none" />
            {/* Crosshair */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-400/50 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-400/50 pointer-events-none" />

            {/* Magnification label */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-stone-950/90 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/50">
              {zoomLevel.toFixed(1)}× ZOOM
            </div>
          </div>
        )}

        {/* Discovery Callout Badge */}
        {foundTarget && target && (
          <div className="absolute bottom-3 left-3 right-3 bg-stone-950/90 border border-emerald-500/80 rounded-xl p-2.5 shadow-xl flex items-center gap-2.5 z-30 animate-fade-in">
            <span className="text-2xl">🔎</span>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                Clue Verified by Detective Lens!
              </div>
              <div className="text-xs text-stone-200 font-medium truncate">
                {target.note}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lens Controls Ribbon */}
      <div className="mt-3 flex items-center justify-between gap-3 w-full max-w-xl text-xs text-stone-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Zoom:</span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(1.5, z - 0.5))}
            className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-200 font-bold"
          >
            -
          </button>
          <span className="text-amber-400 font-bold tabular-nums">{zoomLevel.toFixed(1)}×</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(4.0, z + 0.5))}
            className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-200 font-bold"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAutoInspect}
          className="px-3 py-1 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60 rounded-lg text-xs font-sans transition"
        >
          {foundTarget ? '✓ Target Locked' : '🎯 Point Lens to Clue'}
        </button>
      </div>
    </div>
  );
};
