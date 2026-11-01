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

interface ComicPanel {
  id: number;
  correctOrder: number;
  speech: string;
  action: string;
  drawing: string;
}

export const Room3ComicGutter: React.FC<Props> = ({ onComplete, onClose }) => {
  const COMIC_PANELS: ComicPanel[] = [
    {
      id: 1,
      correctOrder: 1,
      drawing: '🐱👀🏛️',
      speech: '"Human art is fascinating..."',
      action: 'Barnaby the Cat sneaks into the grand contemporary hall of the Nay Collection.'
    },
    {
      id: 2,
      correctOrder: 2,
      drawing: '⬜🖼️🧐',
      speech: '"Wait, what is this white square?"',
      action: 'He inspects a mysterious minimalist white square painting on a gallery wall.'
    },
    {
      id: 3,
      correctOrder: 3,
      drawing: '💡🥛😻',
      speech: '"EUREKA! A giant flat bowl of fresh milk!"',
      action: 'Barnaby’s eyes widen in pure feline joy as he prepares to take a giant sip.'
    },
    {
      id: 4,
      correctOrder: 4,
      drawing: '💥💫😵',
      speech: '*BOOOOING!* "Oof! Dry canvas!"',
      action: 'He pounces at the painting and harmlessly bounces right off the canvas!'
    }
  ];

  // Start shuffled
  const [panelOrder, setPanelOrder] = useState<number[]>([3, 1, 4, 2]);
  const [solved, setSolved] = useState<boolean>(false);

  const swap = (fromIdx: number, toIdx: number) => {
    soundFx.playTalkBoop('dog');
    const updated = [...panelOrder];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    setPanelOrder(updated);

    const isCorrect = updated.every((val, idx) => val === idx + 1);
    if (isCorrect) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setSolved(true);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-mono">Room 3 Challenge</span>
          <h2 className="text-2xl font-serif font-bold text-blue-100">The Comic Strip Time Machine</h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white px-3 py-1 rounded text-sm bg-stone-800 hover:bg-stone-700 transition"
        >
          ✕ Close
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-sm text-stone-300 leading-relaxed">
          Comics are magic because time moves between the boxes! The white space between panels is called the <strong className="text-blue-300">"Gutter"</strong>—where your imagination fills in the motion!
        </p>
        <p className="text-xs text-stone-400">
          The 4 panels of Barnaby the Cat’s museum visit are all mixed up. Use the arrows to swap them into the funny 1-2-3-4 order:
        </p>

        {/* Comic Strip Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {panelOrder.map((panelId, idx) => {
            const panel = COMIC_PANELS.find((p) => p.id === panelId)!;
            return (
              <div
                key={panel.id}
                className="bg-white text-stone-900 rounded-lg p-3 border-2 border-stone-950 flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-stone-400 mb-1 border-b border-stone-200 pb-1">
                    <span>Frame #{idx + 1}</span>
                    <span className="font-bold text-stone-800">Panel {panel.id}</span>
                  </div>
                  <div className="text-3xl text-center py-3 bg-stone-100 rounded border border-stone-200 my-1">
                    {panel.drawing}
                  </div>
                  <div className="text-xs font-bold text-blue-700 italic text-center mt-1">
                    {panel.speech}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-2 leading-tight">
                    {panel.action}
                  </p>
                </div>

                <div className="flex gap-1 mt-3 pt-2 border-t border-stone-200">
                  <button
                    disabled={idx === 0}
                    onClick={() => swap(idx, idx - 1)}
                    className="flex-1 py-1 text-[11px] bg-stone-200 hover:bg-stone-300 disabled:opacity-20 rounded font-bold"
                  >
                    ←
                  </button>
                  <button
                    disabled={idx === panelOrder.length - 1}
                    onClick={() => swap(idx, idx + 1)}
                    className="flex-1 py-1 text-[11px] bg-stone-200 hover:bg-stone-300 disabled:opacity-20 rounded font-bold"
                  >
                    →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {solved ? (
        <div className="mt-5 text-center p-4 bg-blue-950/40 border border-blue-600/40 rounded-xl space-y-3">
          <h3 className="text-xl font-serif font-bold text-blue-300">Sequence Detective Badge Earned!</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Hahaha! You mastered the Gutter! In comic art, you are the director—your mind connected the moments into a living story!
          </p>
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Collect Stamp & Return to Museum
          </button>
        </div>
      ) : (
        <div className="mt-4 p-2 bg-stone-800/60 rounded text-center text-xs text-stone-400">
          Hint: Cat enters → discovers white square → thinks it’s milk → BOING!
        </div>
      )}
    </div>
  );
};
