/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';
import { DETECTIVE_CASES, DetectiveCase, Suspect } from '../../data/detectiveData';
import { MagnifyingLens } from './MagnifyingLens';
import { PrintableDiploma } from './PrintableDiploma';

interface ArtDetectiveViewProps {
  initialArtworkId?: string;
  playerName?: string;
  onReturnToGame?: () => void;
}

export const ArtDetectiveView: React.FC<ArtDetectiveViewProps> = ({
  initialArtworkId,
  playerName = 'Lila',
  onReturnToGame,
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(() => {
    if (initialArtworkId) {
      const match = DETECTIVE_CASES.find((c) => c.artworkId === initialArtworkId);
      if (match) return match.id;
    }
    return 'case-01';
  });
  const [unlockedClueIndices, setUnlockedClueIndices] = useState<{ [caseId: string]: number }>({
    'case-01': 1,
    'case-02': 1,
    'case-03': 1,
    'case-04': 1,
    'case-05': 1,
  });
  const [solvedCases, setSolvedCases] = useState<string[]>([]);
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [caseFeedback, setCaseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDiploma, setShowDiploma] = useState<boolean>(false);
  const [detectiveName, setDetectiveName] = useState<string>(playerName);

  useEffect(() => {
    if (initialArtworkId) {
      const match = DETECTIVE_CASES.find((c) => c.artworkId === initialArtworkId);
      if (match) {
        setActiveCaseId(match.id);
        setCaseFeedback(null);
        setSelectedSuspect(null);
      }
    }
  }, [initialArtworkId]);

  const activeCase = DETECTIVE_CASES.find((c) => c.id === activeCaseId) || DETECTIVE_CASES[0];
  const maxClueUnlocked = unlockedClueIndices[activeCase.id] || 1;
  const isCaseSolved = solvedCases.includes(activeCase.id);

  const handleUnlockNextClue = () => {
    soundFx.playInspectChime();
    const current = unlockedClueIndices[activeCase.id] || 1;
    const next = Math.min(3, current + 1);
    setUnlockedClueIndices({
      ...unlockedClueIndices,
      [activeCase.id]: next,
    });
  };

  const handleInterrogate = (suspect: Suspect) => {
    soundFx.playTalkBoop(suspect.id.includes('cat') ? 'cat' : suspect.id.includes('peacock') ? 'peacock' : suspect.id.includes('owl') ? 'owl' : 'words');
    setSelectedSuspect(suspect);
  };

  const handleAccuse = (suspectId: string) => {
    if (suspectId === activeCase.correctSuspectId) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      if (!solvedCases.includes(activeCase.id)) {
        setSolvedCases([...solvedCases, activeCase.id]);
      }
      setCaseFeedback({
        type: 'success',
        message: activeCase.solutionExplanation,
      });
    } else {
      soundFx.playBonk();
      const suspect = activeCase.suspects.find((s) => s.id === suspectId);
      setCaseFeedback({
        type: 'error',
        message: suspect?.motiveRevealed || 'That doesn’t match our forensic clues! Inspect the artwork again with the lens!',
      });
    }
  };

  const earnedBadges = DETECTIVE_CASES.filter((c) => solvedCases.includes(c.id)).map((c) => ({
    icon: c.badgeIcon,
    title: c.badgeTitle,
  }));

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between gap-6 px-6 lg:px-12 py-4 border-b border-stone-800 bg-stone-900/60 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h1 className="text-xl font-editorial font-bold text-amber-200">
              The Art Detective Bureau
            </h1>
            <div className="text-[11px] text-stone-400 font-mono">
              The Nay Collection Forensic Investigation Unit
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Detective Name input */}
          <div className="hidden sm:flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 text-xs">
            <span className="text-stone-400">Agent:</span>
            <input
              type="text"
              value={detectiveName}
              onChange={(e) => setDetectiveName(e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none w-20"
            />
          </div>

          <button
            onClick={() => setShowDiploma(true)}
            className="px-3.5 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <span>📜 Diploma:</span>
            <span className="font-mono tabular-nums text-white">{solvedCases.length} / {DETECTIVE_CASES.length}</span>
          </button>

          {onReturnToGame && (
            <button
              onClick={onReturnToGame}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
            >
              ← Back
            </button>
          )}
        </div>
      </header>

      {/* Case Dossier Navigation Tabs */}
      <div className="bg-stone-900/40 border-b border-stone-800 px-6 lg:px-12 py-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs uppercase font-mono text-stone-500 mr-2">Case Files:</span>
          {DETECTIVE_CASES.map((c) => {
            const isSolved = solvedCases.includes(c.id);
            const isActive = c.id === activeCaseId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playInspectChime();
                  setActiveCaseId(c.id);
                  setCaseFeedback(null);
                  setSelectedSuspect(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md'
                    : isSolved
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/40'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                <span>{isSolved ? '✅' : '📁'}</span>
                <span>{c.caseNumber}: {c.title.slice(0, 24)}...</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Details & Investigation Space */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 space-y-8">
        {/* Case Header Banner */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500">
              <span>{activeCase.caseNumber}</span>
              <span>·</span>
              <span>Room {activeCase.roomId}: {activeCase.roomName}</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-amber-100">
              {activeCase.title}
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
              Target Artwork: <strong className="text-white">{activeCase.artworkTitle}</strong> by {activeCase.artist} ({activeCase.year})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isCaseSolved ? (
              <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <span>🎖️</span>
                <span>Case Solved · Badge Earned!</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-amber-950/80 border border-amber-500/60 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2">
                <span>🔎</span>
                <span>Active Mystery Under Investigation</span>
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Investigation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Artwork Magnifying Lens Inspector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <span className="text-xs uppercase font-mono text-amber-400 font-bold">
                  Forensic Magnification Desk
                </span>
                <span className="text-xs text-stone-400">Hover / Touch to Zoom</span>
              </div>

              {/* The Interactive Lens Component */}
              <MagnifyingLens
                imageUrl={activeCase.imageUrl}
                altText={activeCase.artworkTitle}
                target={activeCase.clues[maxClueUnlocked - 1]?.lensTarget}
                onTargetFound={() => {
                  if (maxClueUnlocked < 3) {
                    handleUnlockNextClue();
                  }
                }}
              />

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 mt-4 text-xs text-stone-400 leading-relaxed">
                <strong className="text-amber-300">Detective Field Note: </strong>
                {activeCase.teaser}
              </div>
            </div>
          </div>

          {/* Right Column: 3-Clue Docket & Suspects Line-up */}
          <div className="lg:col-span-6 space-y-6">
            {/* 3-Step Clue Docket */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs uppercase font-mono text-amber-400 font-bold">
                  Progressive Clue Docket ({maxClueUnlocked} / 3 Discovered)
                </span>
                {maxClueUnlocked < 3 && (
                  <button
                    onClick={handleUnlockNextClue}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-mono"
                  >
                    + Reveal Next Clue
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {activeCase.clues.map((clue, idx) => {
                  const isUnlocked = idx < maxClueUnlocked;
                  return (
                    <div
                      key={clue.id}
                      className={`p-3.5 rounded-xl border transition ${
                        isUnlocked
                          ? 'bg-stone-800/80 border-amber-500/40 text-stone-200'
                          : 'bg-stone-950/40 border-stone-800/80 text-stone-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="uppercase text-amber-400 font-bold">
                          Clue {clue.id}: {clue.stage}
                        </span>
                        <span>{isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}</span>
                      </div>
                      {isUnlocked ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="font-semibold text-white">{clue.headline}</div>
                          <p className="text-stone-300 leading-relaxed">{clue.text}</p>
                          <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded text-amber-200/90 text-[11px]">
                            💡 {clue.hint}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-stone-500 italic">
                          Inspect the artwork with the magnifying glass or click "+ Reveal Next Clue" to unlock this forensic deduction.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suspects Line-Up */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="pb-2 border-b border-stone-800">
                <span className="text-xs uppercase font-mono text-amber-400 font-bold">
                  Suspects & Theoretical Explanations
                </span>
                <p className="text-xs text-stone-400 mt-1">
                  Interrogate the suspects, evaluate their alibis, and make your formal accusation!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeCase.suspects.map((suspect) => (
                  <div
                    key={suspect.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
                      selectedSuspect?.id === suspect.id
                        ? 'border-amber-400 bg-amber-950/40'
                        : 'border-stone-800 bg-stone-900 hover:border-stone-700'
                    }`}
                    onClick={() => handleInterrogate(suspect)}
                  >
                    <div>
                      <div className="text-3xl text-center mb-1">{suspect.avatar}</div>
                      <div className="font-bold text-xs text-center text-amber-100">{suspect.name}</div>
                      <div className="text-[10px] text-stone-400 text-center font-mono">{suspect.role}</div>
                      <p className="text-[11px] text-stone-300 mt-2 italic line-clamp-3">
                        {suspect.alibi}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccuse(suspect.id);
                      }}
                      className="mt-3 w-full py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg transition"
                    >
                      Accuse!
                    </button>
                  </div>
                ))}
              </div>

              {/* Interrogation statement readout */}
              {selectedSuspect && (
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1 animate-fade-in">
                  <div className="text-amber-400 font-mono font-bold uppercase text-[10px]">
                    Interrogation: {selectedSuspect.name}
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    {selectedSuspect.statement}
                  </p>
                </div>
              )}

              {/* Case Feedback Alert */}
              {caseFeedback && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    caseFeedback.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <span>{caseFeedback.type === 'success' ? '🏆 SOLVED!' : '❌ INCORRECT ACCUSATION'}</span>
                  </div>
                  <p>{caseFeedback.message}</p>

                  {caseFeedback.type === 'success' && (
                    <div className="mt-3 pt-2 border-t border-emerald-500/30 text-amber-300 font-medium">
                      🎓 {activeCase.artAppreciationLesson}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Diploma Modal */}
      {showDiploma && (
        <PrintableDiploma
          detectiveName={detectiveName}
          solvedCount={solvedCases.length}
          totalCases={DETECTIVE_CASES.length}
          badges={earnedBadges}
          onClose={() => setShowDiploma(false)}
        />
      )}
    </div>
  );
};
