/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_ARTWORKS, Artwork } from './data/collectionData';
import { Gallery3DView } from './components/gallery3d/Gallery3DView';
import { MuseumGame } from './game/MuseumGame';
import { CuratorStudio } from './components/CuratorStudio';
import { ArtDetectiveView } from './components/detective/ArtDetectiveView';
import { VirtualTourView } from './components/tour/VirtualTourView';

const STORAGE_KEY = 'nay_collection_artworks_v2_real';
export type AppViewMode = 'GALLERY_3D' | 'GAME' | 'DETECTIVE' | 'TOUR' | 'STUDIO';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('GALLERY_3D');
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Storage safety
    }
    return INITIAL_ARTWORKS;
  });

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
    } catch {
      // Storage safety
    }
  }, [artworks]);

  const handleAddArtwork = (newArt: Artwork) => {
    setArtworks((prev) => [newArt, ...prev]);
  };

  const handleUpdateArtwork = (updated: Artwork) => {
    setArtworks((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(artworks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nay_collection_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Collection data exported successfully!');
  };

  const handleImportData = (imported: unknown) => {
    if (Array.isArray(imported)) {
      setArtworks(imported as Artwork[]);
      showToast(`Successfully imported ${(imported as Artwork[]).length} artworks into the Nay Collection!`);
    } else {
      showToast('Import file is not a valid artwork list.');
    }
  };

  const [targetDetectiveArtId, setTargetDetectiveArtId] = useState<string | undefined>(undefined);
  const [targetTourRoomId, setTargetTourRoomId] = useState<number | undefined>(undefined);

  const handleOpenDetective = (artId?: string) => {
    setTargetDetectiveArtId(artId);
    setCurrentView('DETECTIVE');
  };

  const handleOpenTour = (roomId?: number) => {
    setTargetTourRoomId(roomId);
    setCurrentView('TOUR');
  };

  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Universal Navigation Header */}
      <header className="bg-stone-950 border-b border-stone-800/80 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-editorial text-amber-300 font-bold tracking-tight text-sm">
            THE NAY COLLECTION
          </span>
          <span className="text-stone-500 font-mono hidden md:inline">· naycollection.art</span>
        </div>

        {/* 5 View Mode Buttons */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setCurrentView('GALLERY_3D')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'GALLERY_3D'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span>3D Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('GAME')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'GAME'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🎮</span>
            <span className="hidden sm:inline">2D Adventure</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenDetective(undefined)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'DETECTIVE'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🔍</span>
            <span>Art Detective</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenTour(undefined)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'TOUR'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🚶</span>
            <span className="hidden sm:inline">Virtual Tour</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('STUDIO')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'STUDIO'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>📜</span>
            <span className="hidden sm:inline">Curator Studio</span>
          </button>
        </div>
      </header>

      {/* Render Selected View */}
      <div className="flex-1 min-h-0 relative">
        {currentView === 'GALLERY_3D' && (
          <Gallery3DView
            artworks={artworks}
            onOpenDetectiveCase={handleOpenDetective}
            onOpenVirtualTour={handleOpenTour}
          />
        )}
        {currentView === 'GAME' && (
          <MuseumGame onSwitchToStudio={() => setCurrentView('STUDIO')} />
        )}
        {currentView === 'DETECTIVE' && (
          <ArtDetectiveView
            initialArtworkId={targetDetectiveArtId}
            onReturnToGame={() => setCurrentView('GAME')}
          />
        )}
        {currentView === 'TOUR' && (
          <VirtualTourView
            initialRoomId={targetTourRoomId}
            onReturnToGame={() => setCurrentView('GAME')}
            onOpenDetective={handleOpenDetective}
          />
        )}
        {currentView === 'STUDIO' && (
          <CuratorStudio
            artworks={artworks}
            onAddArtwork={handleAddArtwork}
            onUpdateArtwork={handleUpdateArtwork}
            onDeleteArtwork={handleDeleteArtwork}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onLaunchGame={() => setCurrentView('GAME')}
          />
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/60 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
