/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ROOMS_METADATA,
  CURATORIAL_ESSAYS,
  INITIAL_ARTWORKS,
  Artwork,
  CuratorialRoom,
  Exhibition
} from '../data/collectionData';

interface CuratorStudioProps {
  artworks: Artwork[];
  onAddArtwork: (art: Artwork) => void;
  onUpdateArtwork: (art: Artwork) => void;
  onDeleteArtwork: (id: string) => void;
  onExportData: () => void;
  onImportData: (data: unknown) => void;
  onLaunchGame: () => void;
}

type TabMode = 'catalog' | 'theories' | 'exhibitions' | 'add_artwork';

export const CuratorStudio: React.FC<CuratorStudioProps> = ({
  artworks,
  onAddArtwork,
  onUpdateArtwork,
  onDeleteArtwork,
  onExportData,
  onImportData,
  onLaunchGame,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('catalog');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  // New artwork form state
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newNationality, setNewNationality] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newMedium, setNewMedium] = useState('');
  const [newDimensions, setNewDimensions] = useState('');
  const [newRoom, setNewRoom] = useState<number>(1);
  const [newAccession, setNewAccession] = useState(`NAY.${new Date().getFullYear()}.${String(artworks.length + 1).padStart(2, '0')}`);
  const [newDescription, setNewDescription] = useState('');
  const [newCuratorialEssay, setNewCuratorialEssay] = useState('');
  const [newYoungNote, setNewYoungNote] = useState('');
  const [newFunFact, setNewFunFact] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  // Exhibitions list
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([
    {
      id: 'ex-01',
      title: 'Narrative Systems: The Architecture of Meaning',
      curator: 'Benjamin Nay',
      dates: 'Permanent Collection Exhibition',
      description: 'The core conceptual exhibition tracing narrative from sacred ritual and the birth of authorship through industrialized mass print, personal memory architectures, autonomous code, and language.',
      artworkIds: artworks.map((a) => a.id),
    },
    {
      id: 'ex-02',
      title: 'Sacred Roots & Signature Dots: Folk Voices of Central India',
      curator: 'Curatorial Board',
      dates: 'Autumn Special Focus',
      description: 'A dialogue between Warli geometric ritual paintings and the vibrant dotted cosmologies of Gond masters Bhajju Shyam and Bhuri Bai.',
      artworkIds: ['art-01', 'art-03', 'art-04'],
    },
    {
      id: 'ex-03',
      title: 'Code & The Thread: Algorithmic Memory',
      curator: 'Benjamin Nay',
      dates: 'Winter Contemporary Pavilion',
      description: 'Juxtaposing Chiharu Shiota’s spatial red thread networks with procedural mathematical GLSL shaders and algorithmic art.',
      artworkIds: ['art-06', 'art-07'],
    }
  ]);

  const handleCreateArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;

    const roomMeta = ROOMS_METADATA.find((r) => r.id === newRoom);

    const created: Artwork = {
      id: `art-${Date.now()}`,
      title: newTitle,
      artist: newArtist,
      nationality: newNationality || 'Unknown',
      year: newYear || 'Contemporary',
      medium: newMedium || 'Mixed media',
      dimensions: newDimensions || 'Dimensions variable',
      room: newRoom,
      roomName: roomMeta?.name || 'Origins of Narrative',
      accessionNo: newAccession,
      description: newDescription,
      curatorialEssay: newCuratorialEssay,
      youngCuratorNote: newYoungNote || 'An extraordinary piece in the Narrative Systems framework!',
      funFact: newFunFact || 'Curated into the permanent collection of Nay Collection.',
      imageUrl: newImageUrl || INITIAL_ARTWORKS[0]?.imageUrl || '',
      tags: newTags ? newTags.split(',').map((t) => t.trim()) : ['Narrative Systems'],
    };

    onAddArtwork(created);
    // Reset form
    setNewTitle('');
    setNewArtist('');
    setNewDescription('');
    setNewCuratorialEssay('');
    setNewYoungNote('');
    setActiveTab('catalog');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportData(parsed);
      } catch {
        onImportData(null);
      }
    };
    reader.readAsText(file);
  };

  const filteredArtworks = artworks.filter((a) => {
    const matchesRoom = selectedRoomFilter === 'all' || a.room === selectedRoomFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.accessionNo.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q));
    return matchesRoom && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Editorial Top Bar (Follows Top Bar Contract) */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-stone-800 bg-stone-900/60 sticky top-0 z-20 backdrop-blur-md">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <span className="text-xl font-editorial font-bold tracking-tight text-amber-200">
            The Nay Collection
          </span>
          <span className="text-xs text-stone-400 font-mono hidden sm:inline">
            · naycollection.art
          </span>
        </div>

        {/* Zone 2: Single-line Clean Nav Links */}
        <nav className="flex items-center gap-4 text-xs font-medium text-stone-300">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap transition py-1 hover:text-white ${
              activeTab === 'catalog' ? 'text-amber-400 border-b border-amber-400 font-semibold' : ''
            }`}
          >
            Collection Catalog ({artworks.length})
          </button>
          <button
            onClick={() => setActiveTab('theories')}
            className={`whitespace-nowrap transition py-1 hover:text-white ${
              activeTab === 'theories' ? 'text-amber-400 border-b border-amber-400 font-semibold' : ''
            }`}
          >
            Narrative Systems Theory
          </button>
          <button
            onClick={() => setActiveTab('exhibitions')}
            className={`whitespace-nowrap transition py-1 hover:text-white ${
              activeTab === 'exhibitions' ? 'text-amber-400 border-b border-amber-400 font-semibold' : ''
            }`}
          >
            Exhibitions ({exhibitions.length})
          </button>
          <button
            onClick={() => setActiveTab('add_artwork')}
            className={`whitespace-nowrap transition py-1 hover:text-white ${
              activeTab === 'add_artwork' ? 'text-amber-400 border-b border-amber-400 font-semibold' : ''
            }`}
          >
            + Add Artwork
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLaunchGame}
            className="px-4 py-2 text-xs font-bold text-stone-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition shadow whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>🎮</span>
            <span>Launch Museum Adventure</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 space-y-8">
        {/* ===================== TAB 1: CATALOG ===================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Header & Data Sync Ribbon */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">
                  Permanent Collection Archive
                </span>
                <h1 className="text-3xl font-editorial font-bold text-stone-100 mt-1">
                  Catalogued Artworks & Accessions
                </h1>
                <p className="text-xs text-stone-400 mt-1 max-w-xl">
                  Maintain and explore the registered artworks of the Nay Collection across all 6 rooms of Narrative Systems.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onExportData}
                  className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 transition"
                  title="Export collection as JSON file"
                >
                  📥 Export JSON
                </button>
                <label className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 cursor-pointer transition">
                  📤 Import JSON
                  <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
              {/* Room Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  onClick={() => setSelectedRoomFilter('all')}
                  className={`px-3 py-1.5 text-xs rounded-md transition font-medium ${
                    selectedRoomFilter === 'all'
                      ? 'bg-amber-600 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Rooms
                </button>
                {ROOMS_METADATA.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoomFilter(r.id)}
                    className={`px-3 py-1.5 text-xs rounded-md transition font-medium ${
                      selectedRoomFilter === r.id
                        ? 'bg-stone-700 text-white font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    R{r.id}: {r.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Search Query */}
              <input
                type="text"
                placeholder="Search artist, title, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 w-64"
              />
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArtwork(art)}
                  className="group bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition cursor-pointer shadow-lg flex flex-col"
                >
                  <div className="relative aspect-4/3 bg-stone-950 overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-stone-700">
                      Room {art.room}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-stone-400 font-mono">{art.accessionNo}</div>
                      <h3 className="text-lg font-editorial font-bold text-stone-100 group-hover:text-amber-300 transition mt-0.5 line-clamp-1">
                        {art.title}
                      </h3>
                      <div className="text-xs text-stone-400 mt-1">
                        {art.artist} · {art.year}
                      </div>
                      <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                        {art.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-amber-500 font-medium">Click to inspect & edit</span>
                      <span className="text-stone-500 text-[10px] font-mono">{art.dimensions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: THEORIES ===================== */}
        {activeTab === 'theories' && (
          <div className="space-y-10">
            {/* Header */}
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">
                Curatorial Manifesto & Structural Framework
              </span>
              <h1 className="text-4xl font-editorial font-bold text-stone-100 mt-1">
                Narrative Systems in Art
              </h1>
              <p className="text-sm text-stone-300 mt-3 leading-relaxed">
                A curatorial methodology founded by Benjamin Nay. Rather than treating narrative merely as illustrative storytelling, the Nay Collection investigates narrative as a fundamental operating system of human thought and visual organization.
              </p>
            </div>

            {/* The 6 Curatorial Rooms Breakdown */}
            <div className="space-y-6">
              <h2 className="text-2xl font-editorial font-bold text-amber-200 border-b border-stone-800 pb-2">
                The Six Thematic Rooms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ROOMS_METADATA.map((room) => (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-500 font-bold">ROOM 0{room.id}</span>
                        <span className="text-xl">{room.badgeIcon}</span>
                      </div>
                      <h3 className="text-xl font-editorial font-bold text-stone-100 mt-1">
                        {room.name}
                      </h3>
                      <div className="text-xs text-stone-400 italic mb-2">{room.subtitle}</div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {room.curatorialThesis}
                      </p>
                    </div>

                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                      <div className="text-[10px] uppercase font-mono text-amber-400 mb-1">Pedagogical Translation (10-Year-Old Daughter):</div>
                      <p className="text-stone-300 italic">{room.kidMission}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Curatorial Essays */}
            <div className="space-y-6">
              <h2 className="text-2xl font-editorial font-bold text-amber-200 border-b border-stone-800 pb-2">
                Curatorial Essays
              </h2>
              <div className="space-y-6">
                {CURATORIAL_ESSAYS.map((essay) => (
                  <article
                    key={essay.id}
                    className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3 max-w-3xl"
                  >
                    <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                      <span>{essay.author}</span>
                      <span>·</span>
                      <span>{essay.readingTime}</span>
                    </div>
                    <h3 className="text-2xl font-editorial font-bold text-amber-100">{essay.title}</h3>
                    <div className="text-xs text-amber-400/80 font-medium">{essay.subtitle}</div>
                    <div className="text-sm text-stone-300 leading-relaxed whitespace-pre-line pt-2">
                      {essay.content}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: EXHIBITIONS ===================== */}
        {activeTab === 'exhibitions' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">
                Exhibition Program
              </span>
              <h1 className="text-3xl font-editorial font-bold text-stone-100 mt-1">
                Curated Exhibitions & Displays
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Explore how the Nay Collection connects vernacular traditions, contemporary installations, and computational artworks under specific curatorial themes.
              </p>
            </div>

            <div className="space-y-6">
              {exhibitions.map((ex) => {
                const exArts = artworks.filter((a) => ex.artworkIds.includes(a.id));
                return (
                  <div
                    key={ex.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                      <div>
                        <div className="text-xs text-amber-500 font-mono">{ex.dates} · Curated by {ex.curator}</div>
                        <h2 className="text-2xl font-editorial font-bold text-stone-100 mt-0.5">{ex.title}</h2>
                      </div>
                      <span className="text-xs text-stone-400 font-mono">{exArts.length} Artworks Assigned</span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                      {ex.description}
                    </p>

                    <div>
                      <span className="text-xs text-stone-400 font-mono uppercase block mb-2">Exhibition Checklist:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {exArts.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => setSelectedArtwork(art)}
                            className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 hover:border-amber-500/50 transition cursor-pointer flex items-center gap-3"
                          >
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className="w-12 h-12 object-cover rounded-lg shrink-0"
                            />
                            <div className="overflow-hidden">
                              <div className="text-xs font-semibold text-stone-200 truncate">{art.title}</div>
                              <div className="text-[10px] text-stone-400 truncate">{art.artist}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: ADD ARTWORK ===================== */}
        {activeTab === 'add_artwork' && (
          <div className="max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">
                Registrar & Cataloguer
              </span>
              <h1 className="text-3xl font-editorial font-bold text-stone-100 mt-1">
                Add New Artwork to Collection
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Enter details to catalog an artwork into the Nay Collection and display it in the interactive museum!
              </p>
            </div>

            <form onSubmit={handleCreateArtwork} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Title:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. The Tree of Night"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Artist:</label>
                  <input
                    type="text"
                    required
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Bhajju Shyam"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Narrative Room:</label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {ROOMS_METADATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.id}: {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Year / Period:</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                    placeholder="e.g. 2019"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Accession No:</label>
                  <input
                    type="text"
                    value={newAccession}
                    onChange={(e) => setNewAccession(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Medium & Support:</label>
                  <input
                    type="text"
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                    placeholder="e.g. Acrylic on linen, Ink on tin"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Dimensions:</label>
                  <input
                    type="text"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                    placeholder="e.g. 90 × 120 cm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">Image URL / Asset Path:</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white font-mono"
                  placeholder="e.g. /src/assets/images/... or https://..."
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">Curatorial Description & Essay:</label>
                <textarea
                  rows={3}
                  value={newCuratorialEssay}
                  onChange={(e) => setNewCuratorialEssay(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                  placeholder="How does this artwork operate within its Narrative System?"
                />
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl space-y-2">
                <label className="text-xs text-amber-300 font-semibold block">
                  🌟 Young Curator Note (Fun explanation for 10-year-olds):
                </label>
                <textarea
                  rows={2}
                  value={newYoungNote}
                  onChange={(e) => setNewYoungNote(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                  placeholder="Explain why this artwork is cool, funny, or magical to a 10-year-old!"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded-lg text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg shadow"
                >
                  Save Artwork to Collection
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ===================== ARTWORK DETAIL & EDIT MODAL ===================== */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-stone-950/85 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative my-auto">
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white px-3 py-1 bg-stone-800 rounded-lg text-sm"
            >
              ✕ Close
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{selectedArtwork.accessionNo}</span>
              <span>·</span>
              <span>Room {selectedArtwork.room}: {selectedArtwork.roomName}</span>
            </div>

            <h2 className="text-2xl font-editorial font-bold text-amber-100">{selectedArtwork.title}</h2>
            <div className="text-xs text-stone-400 mb-4">
              {selectedArtwork.artist} ({selectedArtwork.nationality}) · {selectedArtwork.year}
            </div>

            <div className="relative rounded-xl overflow-hidden border border-stone-700 bg-stone-950 max-h-80 flex items-center justify-center mb-4">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-80"
              />
            </div>

            {/* Kid Explanation Box */}
            <div className="p-3.5 bg-amber-950/40 border border-amber-800/40 rounded-xl mb-4">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>💡</span>
                <span>Explanation for Young Explorers (10yo):</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                {selectedArtwork.youngCuratorNote}
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-3">
              <p><strong>Medium:</strong> {selectedArtwork.medium} ({selectedArtwork.dimensions})</p>
              <p><strong>Curatorial Essay:</strong> {selectedArtwork.curatorialEssay}</p>
              <p className="text-amber-200/90 italic"><strong>Fun Fact:</strong> {selectedArtwork.funFact}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-800 flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm(`Remove "${selectedArtwork.title}" from the collection?`)) {
                    onDeleteArtwork(selectedArtwork.id);
                    setSelectedArtwork(null);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Delete from Collection
              </button>
              <button
                onClick={() => setSelectedArtwork(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
