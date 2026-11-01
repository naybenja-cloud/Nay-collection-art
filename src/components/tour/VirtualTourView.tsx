/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';
import { ROOMS_METADATA, INITIAL_ARTWORKS, Artwork, CuratorialRoom } from '../../data/collectionData';
import { SCAVENGER_ITEMS, ScavengerItem } from '../../data/detectiveData';

interface VirtualTourProps {
  initialRoomId?: number;
  onReturnToGame?: () => void;
  onOpenDetective?: (artworkId?: string) => void;
}

export const VirtualTourView: React.FC<VirtualTourProps> = ({
  initialRoomId,
  onReturnToGame,
  onOpenDetective,
}) => {
  const [currentRoomId, setCurrentRoomId] = useState<number>(initialRoomId || 1);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [scavengerItems, setScavengerItems] = useState<ScavengerItem[]>(SCAVENGER_ITEMS);
  const [showScavengerDrawer, setShowScavengerDrawer] = useState<boolean>(false);
  const [roomTriviaState, setRoomTriviaState] = useState<{ [roomId: number]: { answered: boolean; correct: boolean } }>({});
  const [audioTranscript, setAudioTranscript] = useState<string>('');

  const currentRoom = ROOMS_METADATA.find((r) => r.id === currentRoomId) || ROOMS_METADATA[0];
  const roomArtworks = INITIAL_ARTWORKS.filter((a) => a.room === currentRoomId);
  const roomScavenger = scavengerItems.filter((s) => s.roomId === currentRoomId);
  const totalFoundScavenger = scavengerItems.filter((s) => s.found).length;

  // Audio Guide Script per room
  const AUDIO_SCRIPTS: { [roomId: number]: string } = {
    1: 'Welcome to Room 1: Origins of Narrative! Hundreds of years ago, before people had tablets, televisions, or art museums, images weren’t hung on walls for decoration. The Warli tribe painted with rice paste to celebrate harvest ceremonies, and Mexican families painted miraculous ex-votos on tin plates to thank the universe for surviving dangerous encounters like charging bulls! Look around the room and click on any painting to discover its secret!',
    2: 'Step inside Room 2: From Ritual to Authorship! Here, traditional communal art transforms into individual genius. Look at master Bhajju Shyam and pioneer Bhuri Bai—they took the sacred wall symbols of their villages and invented their own secret micro-patterns of dots and river waves. Notice how each animal seems to vibrate with its own living spirit!',
    3: 'Welcome to Room 3: Industrialized Narrative! Have you ever wondered why comic books feel like a movie, even though they are just printed ink on paper? That magic happens in the white spaces between panels, called the Gutter! Your brain bridges the gap and creates the movement. Explore the comic frames on the wall!',
    4: 'Welcome to Room 4: Image, Memory, and Identity. Look around you: this entire room is filled with miles of crimson thread, suspending antique brass keys in mid-air. Inspired by artist Chiharu Shiota, each key was donated by a real family from around the world. Even though no people are shown, the room holds thousands of childhood memories!',
    5: 'Welcome to Room 5: Algorithmic Narrative! What if a computer could paint without ever being told what the picture should look like? Creative coders write mathematical formulas and recursive constraints. When you press run, the algorithm generates blooming vector ribbons of starlight! Click the glowing terminal to inspect!',
    6: 'Welcome to the final wing: Room 6, Language and Generative Narrative! Here, words leave straight book lines and become physical architecture and visual poetry. From ancient symbols in Room 1 to living typographical constellations, you have completed the journey of Narrative Systems!',
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      soundFx.playInspectChime();
      const script = AUDIO_SCRIPTS[currentRoomId] || 'Welcome to the Nay Collection!';
      setAudioTranscript(script);
      setIsPlayingAudio(true);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback simulated duration
        setTimeout(() => setIsPlayingAudio(false), 9000);
      }
    }
  };

  useEffect(() => {
    // Reset audio when room changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioTranscript(AUDIO_SCRIPTS[currentRoomId] || '');
  }, [currentRoomId]);

  useEffect(() => {
    if (initialRoomId) {
      setCurrentRoomId(initialRoomId);
    }
  }, [initialRoomId]);

  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const handleSpotScavenger = (item: ScavengerItem) => {
    if (item.found) return;
    soundFx.playBadgeFanfare();
    confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
    const updated = scavengerItems.map((s) => (s.id === item.id ? { ...s, found: true } : s));
    setScavengerItems(updated);

    const newlyFound = updated.filter((s) => s.found).length;
    if (newlyFound === updated.length) {
      setCelebrationMessage('🏆 CONGRATULATIONS! You found all hidden treasures across the Nay Collection!');
      setTimeout(() => setCelebrationMessage(null), 6000);
    }
  };

  const ROOM_TRIVIA: { [key: number]: { question: string; options: string[]; correctIndex: number; rationale: string } } = {
    1: {
      question: 'What was the white paint made of in ancient Warli ritual paintings?',
      options: ['Ground white rice mixed with water', 'Synthetic acrylic paint', 'Crushed white eggshells'],
      correctIndex: 0,
      rationale: 'Warli painters used hand-ground rice paste and chewed bamboo sticks on sun-dried red clay mud!'
    },
    2: {
      question: 'What do the thousands of tiny dots in Bhajju Shyam’s Gond paintings represent?',
      options: ['Accidental paint splatters', 'The invisible living spirit & energy of each creature', 'Measles spots'],
      correctIndex: 1,
      rationale: 'In Gond philosophy, every tree, bird, and river has an invisible heartbeat that dots bring to life!'
    },
    3: {
      question: 'In comic book theory, what do we call the blank white space between boxes?',
      options: ['The Border', 'The Gutter', 'The Fence'],
      correctIndex: 1,
      rationale: 'The Gutter is where the reader’s brain creates the illusion of motion and passing time!'
    },
    4: {
      question: 'Where did artist Chiharu Shiota get the antique keys for her red thread room?',
      options: ['She manufactured them in a toy factory', 'Everyday people from around the world mailed them in', 'She found them in a sunken pirate ship'],
      correctIndex: 1,
      rationale: 'Over 50,000 people contributed their old home keys, infusing the artwork with real family memories!'
    },
    5: {
      question: 'In algorithmic art, how can one single piece of code create 1,000 completely different pictures?',
      options: ['By using different mathematical seeds', 'By asking the computer to close its eyes', 'By changing the computer monitor color'],
      correctIndex: 0,
      rationale: 'Changing the random seed causes the algorithm’s formulas to branch into unique mathematical blossoms!'
    },
    6: {
      question: 'What makes Concrete Poetry different from a normal poem in a book?',
      options: ['It is written on heavy concrete bricks', 'The words are arranged into visual physical shapes and pictures', 'It has no words at all'],
      correctIndex: 1,
      rationale: 'In concrete poetry, the visual placement of the words is part of the poem itself!'
    }
  };

  const currentTrivia = ROOM_TRIVIA[currentRoomId];
  const triviaState = roomTriviaState[currentRoomId];

  const handleAnswerTrivia = (idx: number) => {
    if (triviaState?.answered) return;
    const isCorrect = idx === currentTrivia.correctIndex;
    if (isCorrect) {
      soundFx.playBadgeFanfare();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } else {
      soundFx.playBonk();
    }
    setRoomTriviaState({
      ...roomTriviaState,
      [currentRoomId]: { answered: true, correct: isCorrect }
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between gap-6 px-6 lg:px-12 py-4 border-b border-stone-800 bg-stone-900/60 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <h1 className="text-xl font-editorial font-bold text-amber-200">
              The Nay Collection Virtual Tour
            </h1>
            <div className="text-[11px] text-stone-400 font-mono">
              Room {currentRoom.id}: {currentRoom.name} · {currentRoom.subtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Tour Button */}
          <button
            onClick={handleToggleAudio}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              isPlayingAudio
                ? 'bg-amber-500 text-stone-950 font-bold animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
            }`}
          >
            <span>{isPlayingAudio ? '🔊 Playing Audio Guide' : '🎧 Listen to Audio Guide'}</span>
          </button>

          {/* Scavenger Hunt Tracker */}
          <button
            onClick={() => setShowScavengerDrawer(!showScavengerDrawer)}
            className="px-3.5 py-2 bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border border-amber-600/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>🔎 Scavenger Hunt:</span>
            <span className="font-mono tabular-nums text-white">{totalFoundScavenger} / {scavengerItems.length}</span>
          </button>

          {onOpenDetective && (
            <button
              onClick={() => onOpenDetective()}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-medium transition hidden sm:inline-block"
            >
              Detective Mode →
            </button>
          )}

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

      {/* Room Jump Bar */}
      <div className="bg-stone-900/40 border-b border-stone-800 px-6 lg:px-12 py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {ROOMS_METADATA.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                soundFx.playFootstep();
                setCurrentRoomId(r.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                r.id === currentRoomId
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <span>{r.badgeIcon}</span>
              <span>Room {r.id}: {r.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled={currentRoomId === 1}
            onClick={() => {
              soundFx.playFootstep();
              setCurrentRoomId((prev) => Math.max(1, prev - 1));
            }}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded text-xs text-stone-300"
          >
            ← Prev Gallery
          </button>
          <button
            disabled={currentRoomId === 6}
            onClick={() => {
              soundFx.playFootstep();
              setCurrentRoomId((prev) => Math.min(6, prev + 1));
            }}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded text-xs text-stone-300"
          >
            Next Gallery →
          </button>
        </div>
      </div>

      {/* Audio Guide Transcript Subtitle Bar if playing */}
      {isPlayingAudio && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="animate-spin text-base">💿</span>
            <span className="font-mono uppercase font-bold text-[10px] text-amber-400">Audio Guide Narration:</span>
            <span className="italic line-clamp-1">{audioTranscript}</span>
          </div>
          <button
            onClick={handleToggleAudio}
            className="text-[11px] underline text-amber-300 hover:text-white shrink-0 ml-4"
          >
            Stop Audio
          </button>
        </div>
      )}

      {/* Celebration Banner */}
      {celebrationMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500 px-6 py-3 flex items-center justify-between text-xs text-emerald-200 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bold">{celebrationMessage}</span>
          </div>
          <button
            onClick={() => setCelebrationMessage(null)}
            className="text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Virtual Panoramic Gallery */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-8">
        {/* Gallery Room Viewport */}
        <div className="relative aspect-16/9 w-full bg-stone-900 rounded-3xl overflow-hidden border-2 border-stone-800 shadow-2xl flex flex-col justify-end">
          {/* Gallery Background (Uses authentic museum hall or artwork ambient wallpaper) */}
          <img
            src={roomArtworks[0]?.imageUrl || INITIAL_ARTWORKS[0]?.imageUrl || ''}
            alt={currentRoom.name}
            className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-105"
          />

          {/* Atmospheric Lighting Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20 pointer-events-none" />

          {/* Interactive Artwork Hotspots across the gallery space */}
          {roomArtworks.map((art, index) => {
            const total = roomArtworks.length;
            const posX = ((index + 1) / (total + 1)) * 76 + 12;
            const posY = 46 + (index % 2 === 0 ? -4 : 6);
            return (
              <button
                key={art.id}
                type="button"
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 outline-none"
                onClick={() => {
                  soundFx.playInspectChime();
                  setSelectedArtwork(art);
                }}
              >
                {/* Glowing Pulsing Beacon */}
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-500/30 animate-pulse flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                  <span className="text-xl">🖼️</span>
                </div>

                {/* Hotspot Floating Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-950/90 text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-500/50 whitespace-nowrap shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-105 transition">
                  {art.title}
                </div>
              </button>
            );
          })}

          {/* Scavenger Hunt Hidden Element Hotspots */}
          {roomScavenger.map((scav, i) => {
            const scavX = i === 0 ? 48 : 82;
            const scavY = i === 0 ? 36 : 40;
            return (
              <button
                key={scav.id}
                type="button"
                style={{ left: `${scavX}%`, top: `${scavY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 outline-none"
                onClick={() => handleSpotScavenger(scav)}
              >
                <div className={`p-2 rounded-full border transition transform hover:scale-125 ${
                  scav.found
                    ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                    : 'border-amber-400 bg-amber-500/20 text-amber-300 animate-bounce'
                }`}>
                  <span className="text-xl">{scav.icon}</span>
                </div>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-950/90 text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded border border-amber-600/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {scav.found ? '✓ Found' : '🔎 Spot Me!'}
                </div>
              </button>
            );
          })}

          {/* Gallery Info Plinth (Bottom Banner) */}
          <div className="relative z-10 p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-mono text-amber-400 font-bold tracking-wider">
                Room 0{currentRoom.id} · {currentRoom.name}
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-white mt-1">
                {currentRoom.subtitle}
              </h2>
              <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
                {currentRoom.curatorialThesis}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-mono">
                Click glowing 🖼️ or 🔎 icons to explore!
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Interactive Exhibition Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Room Artworks Spotlight */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xl font-editorial font-bold text-amber-200 border-b border-stone-800 pb-2">
              Artworks on View in this Room ({roomArtworks.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomArtworks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    soundFx.playInspectChime();
                    setSelectedArtwork(art);
                  }}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex gap-4 hover:border-amber-500/50 transition cursor-pointer group shadow-lg"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 object-cover rounded-xl shrink-0 group-hover:scale-105 transition"
                  />
                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <div className="text-[10px] text-amber-400 font-mono">{art.accessionNo}</div>
                      <h4 className="font-editorial font-bold text-base text-stone-100 group-hover:text-amber-300 transition truncate">
                        {art.title}
                      </h4>
                      <div className="text-xs text-stone-400 truncate">{art.artist} · {art.year}</div>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                        {art.youngCuratorNote}
                      </p>
                    </div>
                    <span className="text-[11px] text-amber-400 underline font-medium mt-2">
                      View Plaque & Fun Fact →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Room Trivia Challenge */}
          <div className="lg:col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs uppercase font-mono text-amber-400 font-bold">
                10-Year-Old Quick Trivia Challenge!
              </span>
              <span className="text-lg">🎯</span>
            </div>

            <p className="text-xs font-semibold text-stone-200 leading-snug">
              {currentTrivia.question}
            </p>

            <div className="space-y-2">
              {currentTrivia.options.map((option, idx) => {
                const answered = triviaState?.answered;
                const isSelected = answered && idx === currentTrivia.correctIndex;
                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => handleAnswerTrivia(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold'
                        : answered
                        ? 'border-stone-800 bg-stone-900 text-stone-500 opacity-60'
                        : 'border-stone-700 bg-stone-800 hover:border-amber-400/60 text-stone-300 hover:bg-stone-750'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {triviaState?.answered && (
              <div className={`p-3 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                triviaState.correct
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
              }`}>
                <div className="font-bold mb-1">
                  {triviaState.correct ? '🎉 Correct Answer!' : '💡 Good Try! Here is why:'}
                </div>
                <p>{currentTrivia.rationale}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===================== ARTWORK POP-UP MODAL ===================== */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-stone-950/85 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative my-auto">
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white px-3 py-1 bg-stone-800 rounded-xl text-sm"
            >
              ✕ Close
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{selectedArtwork.accessionNo}</span>
              <span>·</span>
              <span>Room {selectedArtwork.room}: {selectedArtwork.roomName}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-amber-100">
              {selectedArtwork.title}
            </h2>
            <div className="text-xs text-stone-400 mb-4">
              {selectedArtwork.artist} ({selectedArtwork.nationality}) · {selectedArtwork.year}
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-stone-700 bg-stone-950 max-h-80 flex items-center justify-center mb-4">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-80"
              />
            </div>

            {/* 10-Year-Old Explanation & Fun Fact */}
            <div className="p-4 bg-amber-950/50 border border-amber-800/60 rounded-2xl mb-4 space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>💡</span>
                <span>Why This Artwork Is Cool:</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                {selectedArtwork.youngCuratorNote}
              </p>
              <div className="pt-2 border-t border-amber-800/40 text-xs text-amber-200/90 italic">
                <strong>Fun Fact: </strong> {selectedArtwork.funFact}
              </div>
            </div>

            {/* Curatorial depth */}
            <div className="space-y-1.5 text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-3">
              <p><strong>Medium:</strong> {selectedArtwork.medium} ({selectedArtwork.dimensions})</p>
              <p><strong>Curatorial Thesis:</strong> {selectedArtwork.curatorialEssay}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setSelectedArtwork(null)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition"
              >
                Continue Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SCAVENGER HUNT DRAWER ===================== */}
      {showScavengerDrawer && (
        <div className="fixed inset-0 bg-stone-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowScavengerDrawer(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white px-3 py-1 bg-stone-800 rounded-xl text-sm"
            >
              ✕ Close
            </button>

            <div className="text-center pb-4 border-b border-stone-800">
              <span className="text-xs uppercase font-mono text-amber-400 font-bold">Museum Scavenger Hunt</span>
              <h3 className="text-2xl font-editorial font-bold text-amber-100 mt-1">
                Find All 12 Hidden Symbols!
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Score: <strong className="text-white font-mono">{totalFoundScavenger} / {scavengerItems.length}</strong> items discovered across the 6 rooms!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
              {scavengerItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                    item.found
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-stone-200'
                      : 'bg-stone-800/60 border-stone-800 text-stone-400'
                  }`}
                >
                  <span className="text-2xl p-1.5 bg-stone-900 rounded-lg shrink-0">
                    {item.icon}
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-amber-200">{item.name}</div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      Room {item.roomId}: {item.roomName}
                    </div>
                    <p className="text-[11px] text-stone-300 mt-1 italic leading-tight">
                      {item.clueRiddle}
                    </p>
                    {item.found && (
                      <span className="inline-block mt-1 text-[10px] text-emerald-400 font-bold">
                        ✓ Discovered in Gallery!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
