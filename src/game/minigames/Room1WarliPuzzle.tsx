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

interface SymbolCard {
  id: string;
  name: string;
  meaning: string;
  icon: string;
  category: 'symbol' | 'meaning';
  matched?: boolean;
}

export const Room1WarliPuzzle: React.FC<Props> = ({ onComplete, onClose }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [bullOrder, setBullOrder] = useState<number[]>([2, 0, 1]);
  const [step, setStep] = useState<'symbols' | 'exvoto' | 'victory'>('symbols');
  const [hint, setHint] = useState<string>('Tap a sacred Warli symbol, then tap what it means to the village!');

  const SYMBOLS = [
    { id: 'triangles', name: 'Two Triangles', icon: '⏳', meaning: 'Human Body & Movement (Balance)' },
    { id: 'tarpa', name: 'Tarpa Trumpet', icon: '🎺', meaning: 'The Music that Unites the Whole Village' },
    { id: 'circle', name: 'The Spiral Circle', icon: '🌀', meaning: 'Eternal Life & Sacred Sun/Harvest' },
    { id: 'tree', name: 'Mahua Tree', icon: '🌳', meaning: 'Shelter, Food, and Home for Forest Spirits' },
  ];

  const handleSymbolClick = (id: string) => {
    soundFx.playTalkBoop('cat');
    setSelectedSymbol(id);
    if (selectedMeaning) {
      checkPair(id, selectedMeaning);
    }
  };

  const handleMeaningClick = (id: string) => {
    soundFx.playTalkBoop('cat');
    setSelectedMeaning(id);
    if (selectedSymbol) {
      checkPair(selectedSymbol, id);
    }
  };

  const checkPair = (symId: string, meanId: string) => {
    if (symId === meanId) {
      soundFx.playPuzzleSuccess();
      const newMatches = [...matches, symId];
      setMatches(newMatches);
      setSelectedSymbol(null);
      setSelectedMeaning(null);
      setHint('✨ Spot on! You unlocked a sacred Warli visual secret!');

      if (newMatches.length === SYMBOLS.length) {
        setTimeout(() => {
          setStep('exvoto');
          soundFx.playInspectChime();
        }, 800);
      }
    } else {
      soundFx.playBonk();
      setSelectedSymbol(null);
      setSelectedMeaning(null);
      setHint('Oops! Try another pair. Look at how nature and life connect!');
    }
  };

  const EX_VOTO_CARDS = [
    {
      id: 0,
      title: '1. The Danger',
      desc: 'Young Daniel is caught in the pasture! A giant angry black bull is charging straight at him!',
      icon: '🐂'
    },
    {
      id: 1,
      title: '2. The Answered Prayer',
      desc: 'Daniel cries out to the Virgin of San Juan in the sky, and miraculously the bull veers away!',
      icon: '✨'
    },
    {
      id: 2,
      title: '3. The Painted Thanks',
      desc: 'Safe at home, Daniel hires a painter to paint this tin retablo to hang on the church wall forever!',
      icon: '🖼️'
    }
  ];

  const swapBullCards = (fromIdx: number, toIdx: number) => {
    soundFx.playTalkBoop('bull');
    const updated = [...bullOrder];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    setBullOrder(updated);

    if (updated[0] === 0 && updated[1] === 1 && updated[2] === 2) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setStep('victory');
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">Room 1 Challenge</span>
          <h2 className="text-2xl font-serif font-bold text-amber-100">
            {step === 'symbols' ? 'The Warli Sacred Cipher' : step === 'exvoto' ? 'The Miracle Bull Sequence' : 'Ritual Master!'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white px-3 py-1 rounded text-sm bg-stone-800 hover:bg-stone-700 transition"
        >
          ✕ Close
        </button>
      </div>

      {step === 'symbols' && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-stone-300 leading-relaxed">
            In Warli art, drawings weren’t just pretty pictures—they were sacred symbols painted with rice milk so the village harvests would be blessed! Can you match each symbol with its meaning?
          </p>

          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-amber-200 text-xs">
            {hint}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs text-stone-400 uppercase font-mono">Sacred Warli Shapes</span>
              {SYMBOLS.map((s) => {
                const isMatched = matches.includes(s.id);
                const isSelected = selectedSymbol === s.id;
                return (
                  <button
                    key={s.id}
                    disabled={isMatched}
                    onClick={() => handleSymbolClick(s.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition ${
                      isMatched
                        ? 'opacity-40 bg-stone-800/50 border-stone-800 line-through'
                        : isSelected
                        ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg'
                        : 'bg-stone-800/80 border-stone-700 hover:border-amber-500/50 hover:bg-stone-800'
                    }`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-sm font-medium">{s.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <span className="text-xs text-stone-400 uppercase font-mono">Sacred Meanings</span>
              {SYMBOLS.map((s) => {
                const isMatched = matches.includes(s.id);
                const isSelected = selectedMeaning === s.id;
                return (
                  <button
                    key={s.id}
                    disabled={isMatched}
                    onClick={() => handleMeaningClick(s.id)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      isMatched
                        ? 'opacity-40 bg-stone-800/50 border-stone-800 line-through text-stone-400'
                        : isSelected
                        ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg'
                        : 'bg-stone-800/80 border-stone-700 hover:border-amber-500/50 hover:bg-stone-800 text-stone-300'
                    }`}
                  >
                    <span className="text-xs leading-snug block">{s.meaning}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-stone-500 text-center pt-2">
            Progress: {matches.length} / {SYMBOLS.length} Warli Secrets Decoded
          </div>
        </div>
      )}

      {step === 'exvoto' && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-stone-300 leading-relaxed">
            Awesome! Now check out the Mexican Ex-Voto: <em className="text-amber-200">The Miracle of Daniel Saved from a Bull</em>. Ex-votos always tell a 3-part drama!
            Click any two cards to swap them until they are in the correct order:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bullOrder.map((cardId, index) => {
              const card = EX_VOTO_CARDS[cardId];
              return (
                <div
                  key={card.id}
                  className="bg-stone-800 border border-stone-700 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <div className="font-semibold text-amber-300 text-sm">{card.title}</div>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-stone-700/60">
                    <button
                      disabled={index === 0}
                      onClick={() => swapBullCards(index, index - 1)}
                      className="px-2 py-1 text-xs bg-stone-700 disabled:opacity-30 rounded hover:bg-stone-600 flex-1 text-center"
                    >
                      ← Left
                    </button>
                    <button
                      disabled={index === bullOrder.length - 1}
                      onClick={() => swapBullCards(index, index + 1)}
                      className="px-2 py-1 text-xs bg-stone-700 disabled:opacity-30 rounded hover:bg-stone-600 flex-1 text-center"
                    >
                      Right →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-stone-400 text-center">
            Hint: 1) The Danger → 2) The Miracle → 3) The Painted Plaque of Thanks!
          </p>
        </div>
      )}

      {step === 'victory' && (
        <div className="mt-6 text-center space-y-4 py-4">
          <div className="text-5xl animate-bounce">☀️ 🐂</div>
          <h3 className="text-2xl font-serif font-bold text-amber-300">Origin Seeker Badge Unlocked!</h3>
          <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            You discovered the secret of Room 1: ancient art wasn't made to sell in stores—it was created to celebrate life, survive wild beasts, and thank the universe!
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg transition"
            >
              Collect Stamp & Return to Museum
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
