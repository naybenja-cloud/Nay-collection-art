/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { soundFx } from '../../utils/audio';

interface PrintableDiplomaProps {
  detectiveName: string;
  solvedCount: number;
  totalCases: number;
  badges: { icon: string; title: string }[];
  onClose: () => void;
}

export const PrintableDiploma: React.FC<PrintableDiplomaProps> = ({
  detectiveName,
  solvedCount,
  totalCases,
  badges,
  onClose,
}) => {
  const handlePrint = () => {
    soundFx.playInspectChime();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-3xl w-full p-6 text-stone-100 shadow-2xl relative my-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <span className="text-xs uppercase font-mono text-amber-400 font-bold tracking-wider">
              Official Award Document
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition"
            >
              <span>🖨️</span>
              <span>Print Diploma</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable Certificate Sheet */}
        <div
          id="diploma-print-area"
          className="mt-4 p-8 sm:p-12 bg-amber-50 text-stone-900 rounded-2xl border-8 border-double border-amber-800/60 shadow-inner flex flex-col items-center text-center relative overflow-hidden"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Ornate corner embellishments */}
          <div className="absolute top-3 left-3 text-2xl text-amber-700 opacity-60">❧</div>
          <div className="absolute top-3 right-3 text-2xl text-amber-700 opacity-60">☙</div>
          <div className="absolute bottom-3 left-3 text-2xl text-amber-700 opacity-60">❧</div>
          <div className="absolute bottom-3 right-3 text-2xl text-amber-700 opacity-60">☙</div>

          {/* Header */}
          <div className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-amber-900 mb-2">
            The Nay Collection · naycollection.art
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-950 tracking-tight mb-2">
            Master Art Detective Diploma
          </h1>
          <div className="w-48 h-0.5 bg-amber-800/40 my-3 mx-auto" />

          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto italic mb-4">
            This certifies that young investigator and budding curator
          </p>

          {/* Name Plate */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 pb-1 border-b-2 border-amber-800/60 inline-block px-8 my-2 font-serif">
            {detectiveName || 'Special Investigator'}
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto mt-4 leading-relaxed">
            has demonstrated exceptional forensic observation, deciphering the sacred symbols of Warli rituals, the rhythmic micro-dots of Gond masters, the secret gutters of sequential art, the woven architectures of memory, and the algorithmic formulas of generative code across the <strong>Narrative Systems</strong> rooms.
          </p>

          {/* Badges Earned Ribbon */}
          <div className="my-6 w-full max-w-lg bg-amber-100/70 border border-amber-300 rounded-xl p-3 flex flex-wrap items-center justify-center gap-3">
            {badges.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-lg border border-amber-200 text-xs font-sans font-semibold text-stone-800">
                <span>{b.icon}</span>
                <span>{b.title}</span>
              </div>
            ))}
            {badges.length === 0 && (
              <span className="text-xs text-stone-500 font-sans italic">
                Solve cases in the Art Detective Bureau to pin your badges here!
              </span>
            )}
          </div>

          {/* Signatures & Seal */}
          <div className="w-full max-w-xl grid grid-cols-2 gap-8 items-end pt-6 border-t border-amber-800/30 text-xs font-sans">
            <div className="text-center">
              <div className="font-serif italic text-lg text-amber-950 font-bold mb-1">
                Benjamin Nay
              </div>
              <div className="w-36 h-px bg-stone-400 mx-auto mb-1" />
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                Benjamin Nay, Chief Curator
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl mb-1">🏛️ 🔍 🎖️</div>
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                Date: {currentDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
