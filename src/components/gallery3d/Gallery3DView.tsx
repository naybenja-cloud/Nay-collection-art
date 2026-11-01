/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Artwork, CuratorialRoom, ROOMS_METADATA } from '../../data/collectionData';
import { soundFx } from '../../utils/audio';

interface Gallery3DViewProps {
  artworks: Artwork[];
  onOpenDetectiveCase?: (artworkId: string) => void;
  onOpenVirtualTour?: (roomId: number) => void;
}

function checkWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export const Gallery3DView: React.FC<Gallery3DViewProps> = ({
  artworks,
  onOpenDetectiveCase,
  onOpenVirtualTour
}) => {
  // Navigation / Display state
  const isGlInitiallyAvailable = checkWebGLAvailable();
  const [webGlFailed, setWebGlFailed] = useState<boolean>(!isGlInitiallyAvailable);
  const [viewStyle, setViewStyle] = useState<'3D' | 'MATRIX'>(() => (isGlInitiallyAvailable ? '3D' : 'MATRIX'));
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isKidMode, setIsKidMode] = useState<boolean>(true); // Defaults to fun 10-year-old explanation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // 3D Canvas Refs
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);
  const artworkMeshesRef = useRef<Map<string, THREE.Group>>(new Map());

  // Filtered artworks
  const filteredArtworks = artworks.filter((art) => {
    const matchesRoom = selectedRoomFilter === 'ALL' || art.room === selectedRoomFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRoom && matchesSearch;
  });

  // Handle SpeechSynthesis audio guide
  const handleToggleAudio = (art: Artwork) => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = isKidMode ? art.youngCuratorNote : art.curatorialEssay;
    const narration = `Artwork: ${art.title}, by ${art.artist}, ${art.year}. ${textToRead} Fun fact: ${art.funFact}`;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(narration);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      soundFx.playInspectChime();
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Teleport camera to artwork in 3D
  const teleportToArtwork = (art: Artwork) => {
    setSelectedArtwork(art);
    soundFx.playInspectChime();

    const group = artworkMeshesRef.current.get(art.id);
    if (group && cameraRef.current && controlsRef.current) {
      const artPos = group.position;
      // Position camera in front of the artwork facing towards center
      const dir = artPos.clone().normalize();
      const camPos = artPos.clone().sub(dir.multiplyScalar(3.8));
      camPos.y = Math.max(camPos.y, 2.2);

      targetCamPosRef.current = camPos;
      targetLookAtRef.current = new THREE.Vector3(artPos.x, artPos.y + 0.5, artPos.z);
      setAutoRotate(false);
    }
  };

  const resetCamera = () => {
    soundFx.playFootstep();
    targetCamPosRef.current = new THREE.Vector3(0, 7.5, 21);
    targetLookAtRef.current = new THREE.Vector3(0, 1.8, 0);
    setAutoRotate(true);
    setSelectedArtwork(null);
  };

  // Three.js Mount Lifecycle
  useEffect(() => {
    if (viewStyle !== '3D' || !mountRef.current || webGlFailed) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to Matrix Discovery:', err);
      setWebGlFailed(true);
      setViewStyle('MATRIX');
      return;
    }

    // Handle runtime context loss
    const onContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context was lost, switching to Matrix Discovery.');
      setWebGlFailed(true);
      setViewStyle('MATRIX');
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    container.replaceChildren(renderer.domElement);

    // Scene & Studio Reflection
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0c);
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.022);

    let floorTexture: THREE.CanvasTexture | null = null;
    let animFrameId: number;
    let controls: OrbitControls;

    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();

      // Camera & Controls
      const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
      camera.position.set(0, 8, 22);
      cameraRef.current = camera;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below floor
      controls.minDistance = 2.5;
      controls.maxDistance = 38;
      controls.target.set(0, 1.8, 0);
      controlsRef.current = controls;

      // Studio Lighting Rig
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambientLight);

      const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1c1917, 0.7);
      scene.add(hemiLight);

      const dirKeyLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
      dirKeyLight.position.set(12, 22, 10);
      scene.add(dirKeyLight);

      // High-Tech Obsidian Floor with Procedural Cybernetic Grid
      const floorCanvas = document.createElement('canvas');
      floorCanvas.width = 1024;
      floorCanvas.height = 1024;
      const fctx = floorCanvas.getContext('2d')!;
      fctx.fillStyle = '#09090b';
      fctx.fillRect(0, 0, 1024, 1024);

      // Concentric high-tech rings & grid lines
      fctx.strokeStyle = '#27272a';
      fctx.lineWidth = 1.5;
      for (let r = 80; r < 512; r += 64) {
        fctx.beginPath();
        fctx.arc(512, 512, r, 0, Math.PI * 2);
        fctx.stroke();
      }
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        fctx.beginPath();
        fctx.moveTo(512, 512);
        fctx.lineTo(512 + Math.cos(angle) * 512, 512 + Math.sin(angle) * 512);
        fctx.stroke();
      }

      fctx.fillStyle = '#f59e0b';
      fctx.beginPath();
      fctx.arc(512, 512, 24, 0, Math.PI * 2);
      fctx.fill();

      floorTexture = new THREE.CanvasTexture(floorCanvas);
      floorTexture.colorSpace = THREE.SRGBColorSpace;
      floorTexture.wrapS = THREE.ClampToEdgeWrapping;
      floorTexture.wrapT = THREE.ClampToEdgeWrapping;

      const floorGeo = new THREE.CircleGeometry(26, 64);
      const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.18,
        metalness: 0.85,
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      scene.add(floorMesh);

      // Outer architectural stanchions & pavilion columns
      const columnCount = 14;
      const columnRadius = 24;
      const columnGeo = new THREE.CylinderGeometry(0.18, 0.22, 10, 16);
      const columnMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.9,
        roughness: 0.2,
      });
      for (let c = 0; c < columnCount; c++) {
        const colAngle = (c / columnCount) * Math.PI * 2;
        const colMesh = new THREE.Mesh(columnGeo, columnMat);
        colMesh.position.set(
          Math.cos(colAngle) * columnRadius,
          5,
          Math.sin(colAngle) * columnRadius
        );
        scene.add(colMesh);

        const beaconGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(
          Math.cos(colAngle) * columnRadius,
          10,
          Math.sin(colAngle) * columnRadius
        );
        scene.add(beacon);
      }

      // Load Artworks as 3D Spatial Exhibits in an Amphitheater Rotunda
      const textureLoader = new THREE.TextureLoader();
      const radius = 14.5;
      const totalArtworks = artworks.length;
      artworkMeshesRef.current.clear();

      const raycastClickables: THREE.Object3D[] = [];

      artworks.forEach((art, idx) => {
        const arcSpan = (Math.PI * 2 * 310) / 360;
        const angle = (idx / (totalArtworks - 1 || 1)) * arcSpan - arcSpan / 2 + Math.PI / 2;
        const posX = Math.cos(angle) * radius;
        const posZ = Math.sin(angle) * radius;

        const exhibitGroup = new THREE.Group();
        exhibitGroup.position.set(posX, 0, posZ);
        exhibitGroup.lookAt(0, 0, 0);

        // (A) Base Plinth
        const plinthGeo = new THREE.BoxGeometry(3.2, 0.35, 0.9);
        const plinthMat = new THREE.MeshStandardMaterial({
          color: 0x18181b,
          metalness: 0.7,
          roughness: 0.3,
        });
        const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
        plinthMesh.position.y = 0.175;
        exhibitGroup.add(plinthMesh);

        const roomMeta = ROOMS_METADATA.find((r) => r.id === art.room);
        const accentHex = roomMeta ? parseInt(roomMeta.accentColor.replace('#', '0x'), 16) : 0xd97706;
        const stripGeo = new THREE.BoxGeometry(3.0, 0.05, 0.08);
        const stripMat = new THREE.MeshBasicMaterial({ color: accentHex });
        const stripMesh = new THREE.Mesh(stripGeo, stripMat);
        stripMesh.position.set(0, 0.04, 0.45);
        exhibitGroup.add(stripMesh);

        // (B) Stanchion Wall / Support Easel
        const supportGeo = new THREE.BoxGeometry(0.12, 3.4, 0.12);
        const supportMat = new THREE.MeshStandardMaterial({
          color: 0x27272a,
          metalness: 0.95,
          roughness: 0.15,
        });
        const leftSupport = new THREE.Mesh(supportGeo, supportMat);
        leftSupport.position.set(-1.2, 1.7, 0);
        const rightSupport = new THREE.Mesh(supportGeo, supportMat);
        rightSupport.position.set(1.2, 1.7, 0);
        exhibitGroup.add(leftSupport, rightSupport);

        // (C) Artwork Metallic Bevel Frame
        const frameWidth = 2.8;
        const frameHeight = 2.0;
        const frameGeo = new THREE.BoxGeometry(frameWidth, frameHeight, 0.14);
        const frameMat = new THREE.MeshStandardMaterial({
          color: 0x1f2937,
          metalness: 0.85,
          roughness: 0.25,
        });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        frameMesh.position.set(0, 2.2, 0);
        exhibitGroup.add(frameMesh);

        // (D) High-Res Artwork Canvas Texture
        const canvasWidth = frameWidth - 0.2;
        const canvasHeight = frameHeight - 0.2;
        const canvasGeo = new THREE.PlaneGeometry(canvasWidth, canvasHeight);

        const canvasMat = new THREE.MeshStandardMaterial({
          color: 0xd4d4d8,
          roughness: 0.4,
          metalness: 0.05,
        });
        const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
        canvasMesh.position.set(0, 2.2, 0.075);

        textureLoader.load(
          art.imageUrl,
          (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            canvasMat.map = loadedTex;
            canvasMat.needsUpdate = true;
          },
          undefined,
          () => {}
        );
        exhibitGroup.add(canvasMesh);

        // (E) Floating 3D Title Plaque
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 512;
        labelCanvas.height = 128;
        const lctx = labelCanvas.getContext('2d')!;
        lctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
        lctx.roundRect(0, 0, 512, 128, 16);
        lctx.fill();
        lctx.strokeStyle = roomMeta?.accentColor || '#d97706';
        lctx.lineWidth = 4;
        lctx.roundRect(0, 0, 512, 128, 16);
        lctx.stroke();

        lctx.fillStyle = '#ffffff';
        lctx.font = 'bold 26px sans-serif';
        lctx.fillText(art.title.length > 28 ? art.title.slice(0, 26) + '...' : art.title, 24, 48);

        lctx.fillStyle = '#fbbf24';
        lctx.font = '20px monospace';
        lctx.fillText(`${art.artist} · ${art.year}`, 24, 82);

        lctx.fillStyle = '#9ca3af';
        lctx.font = '16px monospace';
        lctx.fillText(`ROOM 0${art.room} · ${art.accessionNo}`, 24, 110);

        const labelTex = new THREE.CanvasTexture(labelCanvas);
        labelTex.colorSpace = THREE.SRGBColorSpace;
        const labelGeo = new THREE.PlaneGeometry(1.9, 0.48);
        const labelMat = new THREE.MeshBasicMaterial({
          map: labelTex,
          transparent: true,
        });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.position.set(0, 0.72, 0.42);
        exhibitGroup.add(labelMesh);

        // (F) Gallery Spot Light
        const spotLight = new THREE.SpotLight(0xfffbeb, 1.8, 8, Math.PI / 4, 0.4, 1.2);
        spotLight.position.set(0, 4.2, 1.2);
        spotLight.target = canvasMesh;
        exhibitGroup.add(spotLight);

        frameMesh.userData = { artworkId: art.id, artwork: art };
        canvasMesh.userData = { artworkId: art.id, artwork: art };
        raycastClickables.push(frameMesh, canvasMesh);

        scene.add(exhibitGroup);
        artworkMeshesRef.current.set(art.id, exhibitGroup);
      });

      // Raycasting for Click Detection
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const handleCanvasClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(raycastClickables, false);

        if (intersects.length > 0) {
          const hitArt = intersects[0].object.userData.artwork as Artwork;
          if (hitArt) {
            teleportToArtwork(hitArt);
          }
        }
      };

      const domElement = renderer.domElement;
      domElement.addEventListener('click', handleCanvasClick);

      // Resize Handler
      const handleResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop with Exponential Damping Kinematics
      const clock = new THREE.Clock();

      const tick = () => {
        const delta = clock.getDelta();

        if (targetCamPosRef.current && targetLookAtRef.current) {
          camera.position.lerp(targetCamPosRef.current, 0.08);
          controls.target.lerp(targetLookAtRef.current, 0.08);

          if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
            targetCamPosRef.current = null;
            targetLookAtRef.current = null;
          }
        }

        controls.autoRotate = autoRotate && !targetCamPosRef.current && !selectedArtwork;
        controls.autoRotateSpeed = 0.6;
        controls.update();

        renderer.render(scene, camera);
        animFrameId = requestAnimationFrame(tick);
      };

      tick();

      return () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener('resize', handleResize);
        domElement.removeEventListener('click', handleCanvasClick);
        domElement.removeEventListener('webglcontextlost', onContextLost);
        controls.dispose();
        renderer.dispose();
        floorTexture?.dispose();
      };
    } catch (err) {
      console.warn('Three.js scene building failed, falling back to Matrix Discovery:', err);
      setWebGlFailed(true);
      setViewStyle('MATRIX');
      renderer?.dispose();
    }
  }, [viewStyle, artworks, webGlFailed]);

  return (
    <div className="w-full h-[calc(100vh-49px)] bg-stone-950 text-stone-100 flex flex-col overflow-hidden relative font-sans">
      {/* Top High-Tech Spec Bar */}
      <div className="bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 py-2.5 flex items-center justify-between text-xs z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${webGlFailed ? 'bg-amber-500' : 'bg-emerald-400'}`}></span>
            <span className="font-mono text-amber-300 font-semibold tracking-wider uppercase text-[11px]">
              Collection Discovery
            </span>
          </div>
          <span className="text-stone-600 hidden md:inline">|</span>
          <span className="text-stone-400 text-xs hidden md:inline">
            Authentic Works: <strong className="text-white font-mono">{artworks.length}</strong>
          </span>
          {webGlFailed && (
            <span className="hidden lg:inline bg-amber-950/60 text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded border border-amber-800/60">
              WebGL Hardware Acceleration Blocked · Showing Matrix View
            </span>
          )}
        </div>

        {/* View Style Switcher & Search Bar */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artist, title, tag..."
              className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-1.5 pl-8 w-40 sm:w-56 focus:outline-none focus:border-amber-500 transition"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-stone-900 p-0.5 rounded-xl border border-stone-800">
            <button
              type="button"
              disabled={webGlFailed}
              onClick={() => {
                if (webGlFailed) return;
                soundFx.playInspectChime();
                setViewStyle('3D');
              }}
              className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                viewStyle === '3D'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : webGlFailed
                  ? 'text-stone-600 cursor-not-allowed opacity-50'
                  : 'text-stone-400 hover:text-white'
              }`}
              title={webGlFailed ? 'WebGL is currently unavailable in this browser' : '3D Spatial Rotunda'}
            >
              <span>🌐</span>
              <span className="hidden sm:inline">3D Spatial</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playInspectChime();
                setViewStyle('MATRIX');
              }}
              className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                viewStyle === 'MATRIX'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>⊞</span>
              <span className="hidden sm:inline">High-Tech Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewStyle === '3D' && !webGlFailed ? (
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {/* WebGL Canvas Container */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Ambient Guidance Cue */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:block">
            <div className="bg-stone-950/75 border border-stone-800 px-3 py-1.5 rounded-xl text-[11px] text-stone-400 font-mono shadow-lg">
              Drag to orbit · Scroll to zoom · Click artwork to inspect
            </div>
          </div>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={resetCamera}
            className="absolute top-4 right-4 z-20 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <span>🔄</span>
            <span>Reset View</span>
          </button>

          {/* Collapsible Ergonomic Bottom Control Dock (Zero Viewport Occlusion) */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300 ${
              isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
            }`}
          >
            {/* Collapse / Expand Toggle Bar */}
            <div className="flex justify-center mb-1">
              <button
                type="button"
                onClick={() => setIsDockCollapsed(!isDockCollapsed)}
                className="cursor-pointer bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 text-stone-300 hover:text-amber-300 text-[11px] font-mono px-4 py-1 rounded-full shadow-lg transition flex items-center gap-1.5"
              >
                <span>{isDockCollapsed ? '▴ Expand Collection Dock' : '▾ Hide Dock (Zen View)'}</span>
              </button>
            </div>

            {/* Glassmorphic Dock Container */}
            <div className="bg-stone-950/85 backdrop-blur-md border border-stone-800 rounded-2xl p-3 shadow-2xl space-y-2.5">
              {/* Room Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRoomFilter('ALL')}
                  className={`cursor-pointer px-3 py-1 rounded-lg font-mono text-[11px] transition whitespace-nowrap ${
                    selectedRoomFilter === 'ALL'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  All Rooms ({artworks.length})
                </button>
                {ROOMS_METADATA.map((r) => {
                  const count = artworks.filter((a) => a.room === r.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoomFilter(r.id)}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg font-mono text-[11px] transition flex items-center gap-1.5 whitespace-nowrap ${
                        selectedRoomFilter === r.id
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      <span>{r.badgeIcon}</span>
                      <span>R0{r.id}: {r.name.split(' ')[0]} ({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Artwork Filmstrip Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {filteredArtworks.map((art) => {
                  const isSelected = selectedArtwork?.id === art.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => teleportToArtwork(art)}
                      className={`cursor-pointer flex-shrink-0 w-36 bg-stone-900 rounded-xl overflow-hidden border text-left transition group ${
                        isSelected
                          ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                          : 'border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      <div className="relative aspect-4/3 w-full bg-stone-950 overflow-hidden">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute top-1 left-1 bg-stone-950/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-amber-300">
                          R0{art.room}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-white truncate">
                          {art.title}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {art.artist}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* High-Tech Matrix / Catalog Grid Discovery View */
        <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Room Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedRoomFilter('ALL')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl font-mono text-xs transition ${
                selectedRoomFilter === 'ALL'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              All Artworks ({artworks.length})
            </button>
            {ROOMS_METADATA.map((r) => {
              const count = artworks.filter((a) => a.room === r.id).length;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoomFilter(r.id)}
                  className={`cursor-pointer px-3.5 py-1.5 rounded-xl font-mono text-xs transition flex items-center gap-1.5 ${
                    selectedRoomFilter === r.id
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>{r.badgeIcon}</span>
                  <span>Room 0{r.id}: {r.name} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Artworks High-Tech Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="bg-stone-900/70 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/60 transition group flex flex-col shadow-lg"
              >
                {/* Artwork Real Image Display */}
                <div
                  className="relative aspect-4/3 w-full bg-stone-950 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedArtwork(art);
                    soundFx.playInspectChime();
                  }}
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 bg-stone-950/90 text-amber-300 text-xs font-mono px-2 py-0.5 rounded-md border border-stone-800">
                    Room 0{art.room} · {art.accessionNo}
                  </div>
                  {art.featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-editorial text-lg font-bold text-white leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-mono">
                      {art.artist} · {art.year}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs text-stone-400 font-mono">
                      {art.medium} · {art.dimensions}
                    </div>
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {art.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-stone-800/80 text-stone-400 text-[10px] font-mono px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAudio(art)}
                      className="cursor-pointer text-xs font-semibold text-stone-300 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>🔊</span>
                      <span>Audio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArtwork(art);
                        soundFx.playInspectChime();
                      }}
                      className="cursor-pointer text-xs font-semibold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/50 px-3 py-1.5 rounded-xl transition"
                    >
                      Inspect Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holographic Inspection Modal / Drawer */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-800 sticky top-0 bg-stone-900/95 z-10 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="text-xl">🖼️</span>
                <div>
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                    Room 0{selectedArtwork.room} · {selectedArtwork.accessionNo}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-editorial font-bold text-white">
                    {selectedArtwork.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAudio(selectedArtwork)}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                >
                  <span>{isPlayingAudio ? '🔊 Reading...' : '🎧 Audio Guide'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsPlayingAudio(false);
                    setSelectedArtwork(null);
                  }}
                  className="cursor-pointer text-stone-400 hover:text-white p-2 rounded-xl bg-stone-800 hover:bg-stone-700 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Real High-Res Artwork Image */}
              <div className="relative aspect-16/10 w-full bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center">
                <img
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80 text-xs">
                <div>
                  <div className="text-stone-500 font-mono text-[10px] uppercase">Artist</div>
                  <div className="font-semibold text-white">{selectedArtwork.artist}</div>
                </div>
                <div>
                  <div className="text-stone-500 font-mono text-[10px] uppercase">Year & Origin</div>
                  <div className="font-semibold text-white">{selectedArtwork.year} · {selectedArtwork.nationality}</div>
                </div>
                <div>
                  <div className="text-stone-500 font-mono text-[10px] uppercase">Medium</div>
                  <div className="font-semibold text-white truncate" title={selectedArtwork.medium}>
                    {selectedArtwork.medium}
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 font-mono text-[10px] uppercase">Dimensions</div>
                  <div className="font-semibold text-white">{selectedArtwork.dimensions}</div>
                </div>
              </div>

              {/* Kid Explanation Mode vs Curatorial Deep Dive Switch */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-stone-400">Interpretation Mode:</div>
                  <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
                    <button
                      type="button"
                      onClick={() => setIsKidMode(true)}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                        isKidMode
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>🧒</span>
                      <span>For 10-Year-Olds</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsKidMode(false)}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                        !isKidMode
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>🏛️</span>
                      <span>Curator Deep Dive</span>
                    </button>
                  </div>
                </div>

                {isKidMode ? (
                  <div className="bg-amber-950/30 border border-amber-600/40 p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-bold font-mono text-amber-300 flex items-center gap-2">
                      <span>💡</span>
                      <span>Kid Curator Secret Note:</span>
                    </div>
                    <p className="text-stone-200 text-sm leading-relaxed">
                      {selectedArtwork.youngCuratorNote}
                    </p>
                  </div>
                ) : (
                  <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-bold font-mono text-stone-300 flex items-center gap-2">
                      <span>📜</span>
                      <span>Curatorial Essay (Narrative Systems):</span>
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {selectedArtwork.curatorialEssay}
                    </p>
                  </div>
                )}
              </div>

              {/* Fun Fact Pill */}
              <div className="bg-stone-950/40 border border-stone-800/80 p-3.5 rounded-2xl flex items-start gap-3">
                <span className="text-xl">🌟</span>
                <div className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-amber-300 font-mono">Fun Fact: </strong>
                  {selectedArtwork.funFact}
                </div>
              </div>

              {/* Interactive Shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
                <div className="flex flex-wrap gap-1.5">
                  {selectedArtwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-stone-800 text-stone-400 text-xs font-mono px-2.5 py-1 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {onOpenDetectiveCase && (
                    <button
                      type="button"
                      onClick={() => onOpenDetectiveCase(selectedArtwork.id)}
                      className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <span>🔍</span>
                      <span>Investigate in Detective Mode</span>
                    </button>
                  )}
                  {onOpenVirtualTour && (
                    <button
                      type="button"
                      onClick={() => onOpenVirtualTour(selectedArtwork.room)}
                      className="cursor-pointer px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition"
                    >
                      Walk in Room 0{selectedArtwork.room} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
