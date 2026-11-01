/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { soundFx } from '../utils/audio';
import { ROOMS_METADATA, INITIAL_ARTWORKS, Artwork, CuratorialRoom } from '../data/collectionData';
import { Room1WarliPuzzle } from './minigames/Room1WarliPuzzle';
import { Room2GondStudio } from './minigames/Room2GondStudio';
import { Room3ComicGutter } from './minigames/Room3ComicGutter';
import { Room4ThreadMaze } from './minigames/Room4ThreadMaze';
import { Room5AlgoStudio } from './minigames/Room5AlgoStudio';
import { Room6ConcretePoem } from './minigames/Room6ConcretePoem';

interface MuseumGameProps {
  onSwitchToStudio: () => void;
}

type GameMode = 'TITLE' | 'PLAYING' | 'PAUSED' | 'INSPECTING_ART' | 'TALKING' | 'PLAYING_MINIGAME' | 'PASSPORT';

interface InteractiveEntity {
  id: string;
  type: 'artwork' | 'npc' | 'challenge' | 'door';
  room: number;
  x: number;
  y: number;
  radius: number;
  title: string;
  subtitle: string;
  icon: string;
  data?: unknown;
}

export const MuseumGame: React.FC<MuseumGameProps> = ({ onSwitchToStudio }) => {
  const [gameState, setGameState] = useState<GameMode>('TITLE');
  const [playerName, setPlayerName] = useState<string>('Lila');
  const [characterStyle, setCharacterStyle] = useState<'redBeret' | 'emeraldBeret' | 'goldBeret'>('redBeret');
  const [currentRoomId, setCurrentRoomId] = useState<number>(1);
  const [activeEntity, setActiveEntity] = useState<InteractiveEntity | null>(null);
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [npcDialog, setNpcDialog] = useState<{ name: string; role: string; text: string; icon: string } | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<number[]>([1]);
  const [activeMiniGameRoom, setActiveMiniGameRoom] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Canvas and game loop refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Player physical state (stored in ref so state updates don't break loop)
  const playerRef = useRef({
    x: 400,
    y: 340,
    vx: 0,
    vy: 0,
    speed: 240,
    facing: 'down' as 'up' | 'down' | 'left' | 'right',
    walking: false,
    walkFrame: 0,
    walkTimer: 0,
    targetX: null as number | null,
    targetY: null as number | null,
  });

  const keysHeld = useRef<{ [key: string]: boolean }>({});
  const nearbyEntityRef = useRef<InteractiveEntity | null>(null);
  const [nearbyPrompt, setNearbyPrompt] = useState<InteractiveEntity | null>(null);

  // Build the list of interactive entities in the 6 rooms
  const entitiesRef = useRef<InteractiveEntity[]>([]);

  // Setup entities once
  useEffect(() => {
    const list: InteractiveEntity[] = [];

    // Setup each room's entities
    ROOMS_METADATA.forEach((room) => {
      // Artworks (Map all authentic artworks in each room)
      const roomArts = INITIAL_ARTWORKS.filter((a) => a.room === room.id);
      const positions = [
        { x: 220, y: 105 },
        { x: 580, y: 105 },
        { x: 400, y: 95 },
        { x: 120, y: 230 },
        { x: 680, y: 180 },
      ];
      roomArts.forEach((art, index) => {
        const pos = positions[index % positions.length];
        list.push({
          id: `art-${art.id}`,
          type: 'artwork',
          room: room.id,
          x: pos.x,
          y: pos.y,
          radius: 45,
          title: art.title,
          subtitle: art.artist,
          icon: '🖼️',
          data: art
        });
      });

      // NPC
      list.push({
        id: `npc-${room.id}`,
        type: 'npc',
        room: room.id,
        x: 620,
        y: 280,
        radius: 42,
        title: room.mascotName,
        subtitle: room.mascotRole,
        icon: room.badgeIcon,
      });

      // Mini-game challenge pedestal in center
      list.push({
        id: `challenge-${room.id}`,
        type: 'challenge',
        room: room.id,
        x: 400,
        y: 240,
        radius: 44,
        title: `${room.name} Challenge`,
        subtitle: room.kidMission,
        icon: '🏆',
      });

      // Door to next room (right wall)
      if (room.id < 6) {
        list.push({
          id: `door-next-${room.id}`,
          type: 'door',
          room: room.id,
          x: 750,
          y: 280,
          radius: 40,
          title: `Next: Room ${room.id + 1}`,
          subtitle: ROOMS_METADATA[room.id].name,
          icon: '🚪',
          data: { targetRoom: room.id + 1, targetX: 100, targetY: 280 }
        });
      }

      // Door to previous room (left wall)
      if (room.id > 1) {
        list.push({
          id: `door-prev-${room.id}`,
          type: 'door',
          room: room.id,
          x: 50,
          y: 280,
          radius: 40,
          title: `Back: Room ${room.id - 1}`,
          subtitle: ROOMS_METADATA[room.id - 2].name,
          icon: '🚪',
          data: { targetRoom: room.id - 1, targetX: 700, targetY: 280 }
        });
      }
    });

    entitiesRef.current = list;
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear target on manual movement
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        playerRef.current.targetX = null;
        playerRef.current.targetY = null;
      }

      keysHeld.current[e.key.toLowerCase()] = true;

      // Handle Title screen start
      if (gameState === 'TITLE' && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
        soundFx.playBadgeFanfare();
        setGameState('PLAYING');
        return;
      }

      // Pause toggle
      if (e.key === 'Escape') {
        if (gameState === 'PLAYING') {
          setGameState('PAUSED');
        } else if (['PAUSED', 'INSPECTING_ART', 'TALKING', 'PLAYING_MINIGAME', 'PASSPORT'].includes(gameState)) {
          setGameState('PLAYING');
          setActiveArtwork(null);
          setNpcDialog(null);
          setActiveMiniGameRoom(null);
        }
        return;
      }

      // Action key (Space or E)
      if ((e.key === ' ' || e.key === 'e' || e.key === 'E') && gameState === 'PLAYING') {
        triggerNearbyInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysHeld.current[e.key.toLowerCase()] = false;
    };

    const handleBlur = () => {
      keysHeld.current = {};
      playerRef.current.targetX = null;
      playerRef.current.targetY = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState]);

  const triggerNearbyInteraction = useCallback(() => {
    const ent = nearbyEntityRef.current;
    if (!ent) return;

    if (ent.type === 'artwork') {
      soundFx.playInspectChime();
      setActiveArtwork(ent.data as Artwork);
      setGameState('INSPECTING_ART');
    } else if (ent.type === 'npc') {
      const room = ROOMS_METADATA.find((r) => r.id === currentRoomId)!;
      soundFx.playTalkBoop(room.id === 1 ? 'cat' : room.id === 2 ? 'peacock' : room.id === 3 ? 'dog' : room.id === 4 ? 'thread' : room.id === 5 ? 'owl' : 'words');
      
      let speech = '';
      if (room.id === 1) {
        speech = `Meow! Welcome, ${playerName}! I’m Barnaby the Gallery Cat. Notice how the Warli stick-figures and Daniel’s miraculous bull weren’t made for price tags? They were painted to live with the spirits and thank the universe! Check the challenge altar in the center to earn your first stamp!`;
      } else if (room.id === 2) {
        speech = `*Flutter!* Welcome to the realm of dots, ${playerName}! Master Bhajju Shyam and pioneer Bhuri Bai showed that an artist can invent their own secret patterns. Step to the challenge easel to harmonize the peacock feathers!`;
      } else if (room.id === 3) {
        speech = `*Woof!* Did you know the white space between comic panels is called the "Gutter"? That’s where your imagination builds the bridge between two frozen seconds! Help me fix the scrambled comic at the challenge desk!`;
      } else if (room.id === 4) {
        speech = `Shhh... listen to the whispers of scarlet yarn. I am Loomi. Chiharu Shiota weaves thousands of threads to map invisible connections—family, old home keys, and childhood dreams. Steer our paper memory boat at the challenge altar!`;
      } else if (room.id === 5) {
        speech = `Hoo-hoo! Welcome to the digital frontier! In Room 5, algorithms turn mathematical equations into blooming cosmic flowers. Jump to the terminal to tweak variables and mint your very own computational artwork!`;
      } else {
        speech = `Greetings, wordsmith! I am Lexi. Here, words aren't just lines of black text—they are concrete architectural shapes. Come compose a living flight poem in our wordsmith laboratory!`;
      }

      setNpcDialog({
        name: room.mascotName,
        role: room.mascotRole,
        text: speech,
        icon: room.badgeIcon,
      });
      setGameState('TALKING');
    } else if (ent.type === 'challenge') {
      soundFx.playInspectChime();
      setActiveMiniGameRoom(currentRoomId);
      setGameState('PLAYING_MINIGAME');
    } else if (ent.type === 'door') {
      const doorData = ent.data as { targetRoom: number; targetX: number; targetY: number };
      soundFx.playFootstep();
      setCurrentRoomId(doorData.targetRoom);
      playerRef.current.x = doorData.targetX;
      playerRef.current.y = doorData.targetY;
      playerRef.current.targetX = null;
      playerRef.current.targetY = null;
    }
  }, [currentRoomId, playerName]);

  const pendingInteractionRef = useRef<InteractiveEntity | null>(null);

  // Click to Move / Tap to Move
  const handleCanvasPointer = (e: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if clicked directly on an entity in the current room
    const currentEntities = entitiesRef.current.filter((ent) => ent.room === currentRoomId);
    for (const ent of currentEntities) {
      const dist = Math.hypot(clickX - ent.x, clickY - ent.y);
      if (dist < ent.radius + 24) {
        const playerDist = Math.hypot(playerRef.current.x - ent.x, playerRef.current.y - ent.y);
        // If already near, trigger immediately!
        if (playerDist < 120) {
          nearbyEntityRef.current = ent;
          triggerNearbyInteraction();
          return;
        }
        // Otherwise walk towards it and trigger on arrival
        playerRef.current.targetX = ent.x;
        playerRef.current.targetY = ent.y + 20;
        pendingInteractionRef.current = ent;
        return;
      }
    }

    // Otherwise walk to position
    pendingInteractionRef.current = null;
    playerRef.current.targetX = clickX;
    playerRef.current.targetY = clickY;
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let active = true;

    const gameLoop = (timestamp: number) => {
      if (!active) return;
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const rawDt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Clamp delta time to avoid physics tunneling
      const dt = Math.min(rawDt, 0.05);

      if (gameState === 'PLAYING') {
        updateSimulation(dt);
      }
      renderGame();

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, currentRoomId]);

  const updateSimulation = (dt: number) => {
    const p = playerRef.current;
    let dx = 0;
    let dy = 0;

    // Continuous keyboard inputs
    if (keysHeld.current['arrowleft'] || keysHeld.current['a']) dx -= 1;
    if (keysHeld.current['arrowright'] || keysHeld.current['d']) dx += 1;
    if (keysHeld.current['arrowup'] || keysHeld.current['w']) dy -= 1;
    if (keysHeld.current['arrowdown'] || keysHeld.current['s']) dy += 1;

    // Target position (pointer click)
    if (p.targetX !== null && p.targetY !== null && dx === 0 && dy === 0) {
      const toTargetX = p.targetX - p.x;
      const toTargetY = p.targetY - p.y;
      const dist = Math.hypot(toTargetX, toTargetY);

      if (dist > 8) {
        dx = toTargetX / dist;
        dy = toTargetY / dist;
      } else {
        p.targetX = null;
        p.targetY = null;
        if (pendingInteractionRef.current) {
          nearbyEntityRef.current = pendingInteractionRef.current;
          pendingInteractionRef.current = null;
          triggerNearbyInteraction();
        }
      }
    }

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
    }

    // Set facing direction
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) p.facing = 'left';
      if (dx > 0) p.facing = 'right';
    } else if (dy !== 0) {
      if (dy < 0) p.facing = 'up';
      if (dy > 0) p.facing = 'down';
    }

    // Update position with boundaries
    p.walking = dx !== 0 || dy !== 0;
    if (p.walking) {
      p.x += dx * p.speed * dt;
      p.y += dy * p.speed * dt;

      // Soft clamp within room playfield
      p.x = Math.max(50, Math.min(750, p.x));
      p.y = Math.max(140, Math.min(420, p.y));

      p.walkTimer += dt * 10;
      if (p.walkTimer > 1) {
        p.walkFrame = (p.walkFrame + 1) % 4;
        p.walkTimer = 0;
        if (p.walkFrame % 2 === 0) {
          soundFx.playFootstep();
        }
      }
    } else {
      p.walkFrame = 0;
    }

    // Check proximity to interactive entities
    const currentEntities = entitiesRef.current.filter((ent) => ent.room === currentRoomId);
    let nearest: InteractiveEntity | null = null;
    let minDist = 50;

    for (const ent of currentEntities) {
      const d = Math.hypot(p.x - ent.x, p.y - ent.y);
      if (d < ent.radius && d < minDist) {
        minDist = d;
        nearest = ent;
      }
    }

    if (nearest !== nearbyEntityRef.current) {
      nearbyEntityRef.current = nearest;
      setNearbyPrompt(nearest);
    }
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const room = ROOMS_METADATA.find((r) => r.id === currentRoomId) || ROOMS_METADATA[0];

    // Clear background
    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 0, width, height);

    // Render Museum Architectural Shell
    renderMuseumRoom(ctx, room, width, height);

    // Render Entities (Artworks, NPCs, Pedestals, Doors)
    const currentEntities = entitiesRef.current.filter((ent) => ent.room === currentRoomId);
    currentEntities.forEach((ent) => {
      renderEntity(ctx, ent, room);
    });

    // Render Player
    renderPlayer(ctx);

    // Render Subtle Gallery Ambient Lighting & Vignette
    renderGalleryLighting(ctx, width, height);
  };

  const renderMuseumRoom = (ctx: CanvasRenderingContext2D, room: CuratorialRoom, width: number, height: number) => {
    // Gallery Wall (Top)
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(0, 0, width, 140);

    // Wall Baseboard / Moulding
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 134, width, 6);

    // Museum Oak Parquet Floor (Distinct per room)
    const floorGrad = ctx.createLinearGradient(0, 140, 0, height);
    if (room.id === 1) {
      floorGrad.addColorStop(0, '#3E2723');
      floorGrad.addColorStop(1, '#271714');
    } else if (room.id === 2) {
      floorGrad.addColorStop(0, '#1E293B');
      floorGrad.addColorStop(1, '#0F172A');
    } else if (room.id === 3) {
      floorGrad.addColorStop(0, '#1E1B4B');
      floorGrad.addColorStop(1, '#0F0E26');
    } else if (room.id === 4) {
      floorGrad.addColorStop(0, '#380B15');
      floorGrad.addColorStop(1, '#1A0409');
    } else if (room.id === 5) {
      floorGrad.addColorStop(0, '#180B2B');
      floorGrad.addColorStop(1, '#0B0515');
    } else {
      floorGrad.addColorStop(0, '#262626');
      floorGrad.addColorStop(1, '#141414');
    }

    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, 140, width, height - 140);

    // Parquet plank grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 140; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 0; x < width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 140);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Room Curatorial Banner on Back Wall
    ctx.fillStyle = room.themeColor;
    ctx.fillRect(280, 18, 240, 26);
    ctx.strokeStyle = room.accentColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(280, 18, 240, 26);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`ROOM ${room.id} · ${room.name.toUpperCase()}`, 400, 35);
  };

  const renderEntity = (ctx: CanvasRenderingContext2D, ent: InteractiveEntity, room: CuratorialRoom) => {
    ctx.save();

    if (ent.type === 'artwork') {
      // Golden gallery wall picture frame
      ctx.fillStyle = '#0C0A09';
      ctx.fillRect(ent.x - 36, ent.y - 48, 72, 60);

      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(ent.x - 36, ent.y - 48, 72, 60);

      // Inner painting color swatch
      ctx.fillStyle = room.themeColor;
      ctx.fillRect(ent.x - 32, ent.y - 44, 64, 52);

      // Small picture spotlight
      const spot = ctx.createRadialGradient(ent.x, ent.y - 20, 5, ent.x, ent.y - 20, 55);
      spot.addColorStop(0, 'rgba(255, 248, 220, 0.25)');
      spot.addColorStop(1, 'rgba(255, 248, 220, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(ent.x - 40, ent.y - 50, 80, 80);

      // Accession wall plaque below
      ctx.fillStyle = '#FAFAF9';
      ctx.fillRect(ent.x - 20, ent.y + 16, 40, 8);
      ctx.fillStyle = '#1C1917';
      ctx.font = '6px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('ACCESSION', ent.x, ent.y + 22);
    } else if (ent.type === 'npc') {
      // Character shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(ent.x, ent.y + 12, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Breathing bob
      const bob = Math.sin(Date.now() / 350) * 3;

      // Mascot bubble
      ctx.fillStyle = room.themeColor;
      ctx.beginPath();
      ctx.arc(ent.x, ent.y - 4 + bob, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = room.accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '18px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ent.icon, ent.x, ent.y - 4 + bob);

      // Name plate
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(ent.title.split(' ')[0], ent.x, ent.y + 26);
    } else if (ent.type === 'challenge') {
      // Challenge Marble Pedestal
      ctx.fillStyle = '#44403C';
      ctx.fillRect(ent.x - 22, ent.y - 12, 44, 26);
      ctx.fillStyle = '#57534E';
      ctx.fillRect(ent.x - 26, ent.y - 16, 52, 6);
      ctx.fillRect(ent.x - 26, ent.y + 12, 52, 6);

      // Floating Trophy / Crest
      const bob = Math.sin(Date.now() / 300) * 4;
      const isRoomSolved = unlockedBadges.includes(ent.room);

      ctx.fillStyle = isRoomSolved ? '#F59E0B' : '#94A3B8';
      ctx.beginPath();
      ctx.arc(ent.x, ent.y - 26 + bob, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isRoomSolved ? '🌟' : '❓', ent.x, ent.y - 26 + bob);

      ctx.fillStyle = '#E7E5E4';
      ctx.font = 'bold 8px system-ui';
      ctx.fillText('MISSION', ent.x, ent.y + 26);
    } else if (ent.type === 'door') {
      // Archway door
      ctx.fillStyle = '#090807';
      ctx.fillRect(ent.x - 14, ent.y - 40, 28, 60);
      ctx.strokeStyle = room.accentColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(ent.x - 14, ent.y - 40, 28, 60);

      ctx.fillStyle = '#F59E0B';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('🚪', ent.x, ent.y - 10);

      ctx.fillStyle = '#A8A29E';
      ctx.font = 'bold 8px system-ui';
      ctx.fillText(ent.title.split(':')[0], ent.x, ent.y + 28);
    }

    // Interaction pulse indicator if near
    if (nearbyEntityRef.current === ent) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ent.x, ent.y, ent.radius + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  const renderPlayer = (ctx: CanvasRenderingContext2D) => {
    const p = playerRef.current;
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 8, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bob / leg swing on walk
    const legOffset = p.walking ? Math.sin(p.walkFrame * Math.PI) * 4 : 0;

    // Body / Coat
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(p.x - 8, p.y - 14, 16, 16);

    // Legs
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(p.x - 6, p.y + 2, 4, 8 + legOffset);
    ctx.fillRect(p.x + 2, p.y + 2, 4, 8 - legOffset);

    // Head
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(p.x, p.y - 20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Beret Hat (Color based on character style)
    let beretColor = '#BE123C';
    if (characterStyle === 'emeraldBeret') beretColor = '#047857';
    if (characterStyle === 'goldBeret') beretColor = '#D97706';

    ctx.fillStyle = beretColor;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - 26, 10, 5, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // Beret stem
    ctx.fillRect(p.x - 1, p.y - 30, 2, 4);

    // Magnifying Glass / Art Notebook in hand
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.arc(p.x + (p.facing === 'left' ? -12 : 12), p.y - 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Player name floating badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(playerName, p.x, p.y - 34);

    ctx.restore();
  };

  const renderGalleryLighting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Gallery edge vignette
    const vignette = ctx.createRadialGradient(width / 2, height / 2, 220, width / 2, height / 2, 480);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  };

  const handleCompleteMission = (roomId: number) => {
    if (!unlockedBadges.includes(roomId)) {
      setUnlockedBadges([...unlockedBadges, roomId]);
    }
    // If next room exists, unlock door
    soundFx.playBadgeFanfare();
  };

  const toggleSound = () => {
    soundFx.muted = !soundFx.muted;
    setIsMuted(soundFx.muted);
  };

  const currentRoom = ROOMS_METADATA.find((r) => r.id === currentRoomId) || ROOMS_METADATA[0];

  return (
    <div className="relative w-full h-[calc(100vh-49px)] bg-stone-950 text-stone-100 flex flex-col overflow-hidden">
      {/* Active Game Canvas Viewport */}
      <div
        className="relative flex-1 flex items-center justify-center bg-black overflow-hidden"
        onPointerDown={handleCanvasPointer}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full max-w-[1200px] max-h-[720px] object-contain shadow-2xl cursor-pointer"
        />

        {/* ---------------- TITLE SCREEN OVERLAY ---------------- */}
        {gameState === 'TITLE' && (
          <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center p-6 text-center z-30">
            {/* Bespoke inline SVG Title Lockup */}
            <div className="max-w-xl w-full mb-6">
              <svg viewBox="0 0 600 130" className="w-full h-auto drop-shadow-lg">
                <text x="300" y="32" fill="#F59E0B" fontSize="13" letterSpacing="6" fontFamily="var(--font-sans)" fontWeight="bold" textAnchor="middle">
                  THE NAY COLLECTION · NARRATIVE SYSTEMS
                </text>
                <text x="300" y="80" fill="#FFFFFF" fontSize="38" fontFamily="var(--font-serif)" fontWeight="bold" textAnchor="middle">
                  MUSEUM ODYSSEY
                </text>
                <line x1="150" y1="96" x2="450" y2="96" stroke="#D97706" strokeWidth="1.5" />
                <text x="300" y="116" fill="#A8A29E" fontSize="12" letterSpacing="3" fontFamily="var(--font-sans)" textAnchor="middle">
                  AN INTERACTIVE EXPLORATION FOR YOUNG CURATORS
                </text>
              </svg>
            </div>

            {/* Character selection */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 max-w-md w-full shadow-xl space-y-4 mb-6">
              <div className="text-left">
                <label className="text-xs text-stone-400 uppercase font-mono block mb-1">Junior Curator Name:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="Your Name (e.g. Lila)"
                />
              </div>

              <div className="text-left">
                <label className="text-xs text-stone-400 uppercase font-mono block mb-1.5">Curator Beret Style:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'redBeret', name: 'Crimson', icon: '🔴' },
                    { id: 'emeraldBeret', name: 'Emerald', icon: '🟢' },
                    { id: 'goldBeret', name: 'Saffron', icon: '🟡' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        soundFx.playTalkBoop('cat');
                        setCharacterStyle(s.id as 'redBeret' | 'emeraldBeret' | 'goldBeret');
                      }}
                      className={`cursor-pointer py-2 px-2 text-xs rounded-lg border flex items-center justify-center gap-1.5 transition ${
                        characterStyle === s.id
                          ? 'border-amber-400 bg-amber-950/40 text-amber-200 font-bold'
                          : 'border-stone-700 bg-stone-800 text-stone-400 hover:border-stone-600'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Start CTA */}
            <button
              type="button"
              onClick={() => {
                soundFx.playBadgeFanfare();
                setGameState('PLAYING');
              }}
              className="cursor-pointer px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-base rounded-xl shadow-2xl transition transform hover:scale-105 active:scale-95"
            >
              Enter Museum (Press Space or Click)
            </button>

            {/* Flat control-hint line */}
            <div className="mt-6 text-xs text-stone-400 font-mono tracking-wide">
              WASD / Arrow Keys Move · Space / E Inspect & Talk · Esc Pause · Click / Tap to Walk
            </div>

            {/* Link to Curator Studio */}
            <div className="mt-4">
              <button
                type="button"
                onClick={onSwitchToStudio}
                className="cursor-pointer text-xs text-stone-400 hover:text-amber-300 underline transition"
              >
                Or open Benjamin's Curatorial Archive & Theories Studio →
              </button>
            </div>
          </div>
        )}

        {/* ---------------- HUD OVERLAYS (World-Matched, Low-Occlusion) ---------------- */}
        {gameState !== 'TITLE' && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-20">
            {/* Top Perimeter Cluster */}
            <div className="flex items-center justify-between w-full">
              {/* Left: Player & Room Info */}
              <div className="pointer-events-auto bg-stone-900/80 border border-stone-800/80 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                <span className="text-xl">{currentRoom.badgeIcon}</span>
                <div>
                  <div className="text-xs uppercase font-mono text-amber-400 font-semibold tracking-wider">
                    Room {currentRoom.id} · {currentRoom.name}
                  </div>
                  <div className="text-[11px] text-stone-300">
                    Curator: <strong className="text-white">{playerName}</strong> · {currentRoom.subtitle}
                  </div>
                </div>
              </div>

              {/* Right: Badges & Controls */}
              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playInspectChime();
                    setGameState('PASSPORT');
                  }}
                  className="cursor-pointer bg-stone-900/80 hover:bg-stone-800 border border-stone-800/80 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold shadow-lg transition"
                >
                  <span>📜 Passport:</span>
                  <span className="font-mono text-amber-400 tabular-nums">{unlockedBadges.length} / 6</span>
                </button>

                <button
                  type="button"
                  onClick={toggleSound}
                  className="cursor-pointer bg-stone-900/80 hover:bg-stone-800 border border-stone-800/80 rounded-xl p-2 text-sm shadow-lg transition"
                  title="Toggle Sound"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                <button
                  type="button"
                  onClick={onSwitchToStudio}
                  className="cursor-pointer bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-2 rounded-xl text-xs shadow-lg transition"
                >
                  Curator Studio
                </button>
              </div>
            </div>

            {/* Bottom Controls Row: Virtual Touch D-Pad + Interaction Prompt */}
            <div className="flex items-end justify-between w-full pointer-events-none">
              {/* Virtual D-Pad for easy clicking on preview without keyboard */}
              <div className="pointer-events-auto flex flex-col items-center gap-1 bg-stone-900/80 p-2 rounded-2xl border border-stone-800 shadow-xl">
                <button
                  type="button"
                  onPointerDown={() => { playerRef.current.y = Math.max(140, playerRef.current.y - 28); soundFx.playFootstep(); }}
                  className="w-8 h-8 bg-stone-800 hover:bg-stone-700 active:bg-amber-600 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  ▲
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onPointerDown={() => { playerRef.current.x = Math.max(50, playerRef.current.x - 28); soundFx.playFootstep(); }}
                    className="w-8 h-8 bg-stone-800 hover:bg-stone-700 active:bg-amber-600 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => { playerRef.current.y = Math.min(420, playerRef.current.y + 28); soundFx.playFootstep(); }}
                    className="w-8 h-8 bg-stone-800 hover:bg-stone-700 active:bg-amber-600 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => { playerRef.current.x = Math.min(750, playerRef.current.x + 28); soundFx.playFootstep(); }}
                    className="w-8 h-8 bg-stone-800 hover:bg-stone-700 active:bg-amber-600 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Bottom Interaction Prompt when near entity */}
              {nearbyPrompt && gameState === 'PLAYING' && (
                <button
                  type="button"
                  onClick={() => triggerNearbyInteraction()}
                  className="pointer-events-auto cursor-pointer bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold px-6 py-2.5 rounded-full shadow-2xl animate-bounce flex items-center gap-2 text-xs transition"
                >
                  <span>{nearbyPrompt.icon}</span>
                  <span>Click / Tap here to {nearbyPrompt.type === 'artwork' ? 'Inspect Artwork' : nearbyPrompt.type === 'npc' ? 'Talk to Companion' : nearbyPrompt.type === 'challenge' ? 'Start Room Mission' : 'Enter Door'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ---------------- ARTWORK INSPECTOR MODAL ---------------- */}
        {gameState === 'INSPECTING_ART' && activeArtwork && (
          <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center p-4 z-40 overflow-y-auto">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative my-auto">
              <button
                onClick={() => {
                  soundFx.playFootstep();
                  setGameState('PLAYING');
                  setActiveArtwork(null);
                }}
                className="absolute top-4 right-4 text-stone-400 hover:text-white px-3 py-1 bg-stone-800 rounded-lg text-sm"
              >
                ✕ Close
              </button>

              <div className="flex items-center gap-2 text-xs uppercase font-mono text-amber-400 mb-1">
                <span>{activeArtwork.accessionNo}</span>
                <span>·</span>
                <span>Room {activeArtwork.room}: {activeArtwork.roomName}</span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-amber-100">{activeArtwork.title}</h2>
              <div className="text-xs text-stone-400 mt-1 mb-4">
                {activeArtwork.artist} ({activeArtwork.nationality}) · {activeArtwork.year}
              </div>

              {/* Artwork Image View */}
              <div className="relative rounded-xl overflow-hidden border border-stone-700 bg-stone-950 max-h-72 flex items-center justify-center mb-4">
                <img
                  src={activeArtwork.imageUrl}
                  alt={activeArtwork.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-72"
                />
              </div>

              {/* 10-Year-Old Explanation Box */}
              <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3.5 mb-3">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Curator Note for Young Explorers:</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {activeArtwork.youngCuratorNote}
                </p>
              </div>

              {/* Curatorial depth */}
              <div className="space-y-2 text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-3">
                <p><strong>Medium:</strong> {activeArtwork.medium} ({activeArtwork.dimensions})</p>
                <p><strong>Curatorial Thesis:</strong> {activeArtwork.curatorialEssay}</p>
                <p className="text-amber-200/90 italic"><strong>Fun Fact:</strong> {activeArtwork.funFact}</p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- NPC TALK DIALOG MODAL ---------------- */}
        {gameState === 'TALKING' && npcDialog && (
          <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center p-4 z-40">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-stone-800">
                <span className="text-4xl">{npcDialog.icon}</span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-amber-200">{npcDialog.name}</h3>
                  <span className="text-xs text-stone-400 font-mono">{npcDialog.role}</span>
                </div>
              </div>

              <p className="text-sm text-stone-200 leading-relaxed my-4">
                {npcDialog.text}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    soundFx.playFootstep();
                    setGameState('PLAYING');
                    setNpcDialog(null);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition"
                >
                  Got it, let's explore!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MINI GAME MODALS ---------------- */}
        {gameState === 'PLAYING_MINIGAME' && activeMiniGameRoom && (
          <div className="absolute inset-0 bg-stone-950/85 flex items-center justify-center p-4 z-40 overflow-y-auto">
            {activeMiniGameRoom === 1 && (
              <Room1WarliPuzzle
                onComplete={() => handleCompleteMission(1)}
                onClose={() => {
                  setGameState('PLAYING');
                  setActiveMiniGameRoom(null);
                }}
              />
            )}
            {activeMiniGameRoom === 2 && (
              <Room2GondStudio
                onComplete={() => handleCompleteMission(2)}
                onClose={() => {
                  setGameState('PLAYING');
                  setActiveMiniGameRoom(null);
                }}
              />
            )}
            {activeMiniGameRoom === 3 && (
              <Room3ComicGutter
                onComplete={() => handleCompleteMission(3)}
                onClose={() => {
                  setGameState('PLAYING');
                  setActiveMiniGameRoom(null);
                }}
              />
            )}
            {activeMiniGameRoom === 4 && (
              <Room4ThreadMaze
                onComplete={() => handleCompleteMission(4)}
                onClose={() => {
                  setGameState('PLAYING');
                  setActiveMiniGameRoom(null);
                }}
              />
            )}
            {activeMiniGameRoom === 5 && (
              <Room5AlgoStudio
                onComplete={() => handleCompleteMission(5)}
                onClose={() => {
                  setGameState('PLAYING');
                  setActiveMiniGameRoom(null);
                }}
              />
            )}
            {activeMiniGameRoom === 6 && (
              <Room6ConcretePoem
                onComplete={() => handleCompleteMission(6)}
                onClose={() => {
                  setGameState('PLAYING');
                  setActiveMiniGameRoom(null);
                }}
              />
            )}
          </div>
        )}

        {/* ---------------- PASSPORT & BADGES MODAL ---------------- */}
        {gameState === 'PASSPORT' && (
          <div className="absolute inset-0 bg-stone-950/85 flex items-center justify-center p-4 z-40 overflow-y-auto">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl relative my-auto">
              <button
                onClick={() => {
                  soundFx.playFootstep();
                  setGameState('PLAYING');
                }}
                className="absolute top-4 right-4 text-stone-400 hover:text-white px-3 py-1 bg-stone-800 rounded-lg text-sm"
              >
                ✕ Close
              </button>

              <div className="text-center pb-4 border-b border-stone-800">
                <span className="text-xs uppercase font-mono text-amber-500 tracking-widest">Official Curatorial Passport</span>
                <h2 className="text-3xl font-serif font-bold text-amber-100 mt-1">Junior Curator {playerName}</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Master the 6 rooms of The Nay Collection to earn your Master of Narrative Systems Diploma!
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-5">
                {ROOMS_METADATA.map((room) => {
                  const isEarned = unlockedBadges.includes(room.id);
                  return (
                    <div
                      key={room.id}
                      className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition ${
                        isEarned
                          ? 'bg-stone-800/90 border-amber-500/60 shadow-lg'
                          : 'bg-stone-900/60 border-stone-800 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-1.5">{isEarned ? room.badgeIcon : '🔒'}</div>
                      <div className="font-semibold text-xs text-stone-200">{room.badgeName}</div>
                      <div className="text-[10px] text-amber-400 uppercase font-mono mt-0.5">Room {room.id}</div>
                      <div className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                        {isEarned ? '✓ Authenticated' : room.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Master Curator Diploma if all 6 earned */}
              {unlockedBadges.length >= 6 ? (
                <div className="bg-amber-950/50 border border-amber-500/60 rounded-xl p-4 text-center space-y-2">
                  <div className="text-3xl">🎓 🏛️ 🏆</div>
                  <h3 className="text-xl font-serif font-bold text-amber-300">Master Curator Diploma Awarded!</h3>
                  <p className="text-xs text-stone-200 max-w-md mx-auto leading-relaxed">
                    By order of Curator Benjamin Nay: <strong>{playerName}</strong> has proven that art is not just decorations on walls, but living systems of ritual, authorship, memory, code, and language!
                  </p>
                </div>
              ) : (
                <div className="text-xs text-stone-400 text-center">
                  Tip: Step up to the glowing MISSION pedestals in each room to take on the challenge!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- PAUSED MODAL ---------------- */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center p-4 z-40">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
              <h2 className="text-2xl font-serif font-bold text-stone-100">Museum Paused</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setGameState('PLAYING')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-sm"
                >
                  Resume Playing (Esc)
                </button>
                <button
                  onClick={onSwitchToStudio}
                  className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium rounded-xl text-sm border border-stone-700"
                >
                  Curator Studio & Theories
                </button>
                <button
                  onClick={() => setGameState('TITLE')}
                  className="w-full py-2 bg-transparent hover:bg-stone-800 text-stone-400 text-xs rounded-lg"
                >
                  Return to Title Screen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
