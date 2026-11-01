# Art Detective & Immersive Virtual Gallery Tour · The Nay Collection

An interactive mystery-solving game and immersive virtual gallery tour created for **The Nay Collection** (`naycollection.art`), designed to educate and entertain a 10-year-old daughter while illuminating the curatorial theories of **Narrative Systems**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed and will guide the implementation:

- **Confirmed Detective Mode**: "Case Files with Progressive Clues, Magnifying Zoom, and Suspects" — Players solve curated museum mysteries by uncovering 3 progressive forensic clues (symbolism, pigment/materials, hidden narrative details), inspecting high-res artworks with an interactive magnifying glass, and interrogating quirky suspect personas (Barnaby the Cat, Ferdinand the Bull, Gondi the Peacock, Zippy the Comic Pup, Loomi the Thread Sprite, Ada the Generative Owl).
- **Confirmed Virtual Tour Architecture**: "Immersive Gallery Walk with Clickable Hotspots & Audio Guide" — Panoramic room vistas of the 6 thematic galleries with interactive glowing hotspots, simulated audio narration (with playful tone controls), wall text popups, and a 10-year-old Scavenger Hunt hunt list.
- **Confirmed Reward Loop**: "Detective Badges & Printable Junior Curator Diploma" — Earn official detective stamps for each solved case and print or download a personalized high-resolution Master Art Detective Diploma signed by Curator Benjamin Nay.

---

## 1. Overview & Core Concept

### What It Delivers
1. **The Art Detective Bureau**:
   - 6 standalone mystery cases mapped to the 6 Narrative Systems rooms:
     * *Case #1: The Mystery of the Two Triangles* (Room 1: Origins & Warli Ritual)
     * *Case #2: The Miracle of the Charging Bull* (Room 1: Mexican Ex-Voto)
     * *Case #3: The Riddle of the Thousand Dots* (Room 2: Bhajju Shyam & Gond Authorship)
     * *Case #4: The Vanishing Comic Gutter* (Room 3: Sequential Art & Closure)
     * *Case #5: The Secret of the Crimson Keys* (Room 4: Chiharu Shiota & Memory)
     * *Case #6: The Phantom Shader Code* (Room 5: Algorithmic Generative Art)
   - **Magnifying Glass Inspection**: Interactive lens tool that magnifies artwork textures (rice paste brushstrokes, tiny Gond stippling, screentone halftone dots, red thread knots, recursive vector spirals) to teach visual art appreciation.
   - **Progressive Clue Docket**: Clue 1 (Visual clue) $\rightarrow$ Clue 2 (Material & Technique clue) $\rightarrow$ Clue 3 (Philosophical Narrative clue).
   - **Suspect Line-Up & Accusation**: Present findings to solve who or what created the artistic effect.

2. **The Immersive Virtual Gallery Tour**:
   - Fluid 360-style panoramic gallery walkthrough spanning all 6 Narrative Systems rooms.
   - **Clickable Hotspots**: Inspect wall paintings, floor sculptures, and architectural features.
   - **Audio Tour Guide**: Built-in audio narration with child-friendly humor and curatorial rigor, voiced procedurally via Web Speech API and synchronized sound cues.
   - **Scavenger Hunt Overlay**: Spot 12 hidden objects across the galleries (e.g. the sacred sun, the charging bull, the dancing tiger, the vintage brass key, the speech bubble, the recursion spiral).
   - **Wall Popups**: Clean accession definitions, artist backgrounds, and 10-year-old "Why this is cool!" fun facts.

3. **Master Detective Diploma & Rewards**:
   - Collectible Case Badges in the Detective Dossier.
   - In-app printable/downloadable high-resolution Certificate of Art Detection with personalized name, custom badge stamps, and Benjamin Nay’s curatorial seal.

---

## 2. User Experience & Visual Design

### Visual Identity & Curatorial Palette
- **Dominant Neutral Canvas (60%)**: Warm archival museum alabaster (`#FBF9F5`) and contemporary dark gallery slate (`#1C1917` / `#0C0A09`).
- **Structural Surfaces (30%)**: Polished gallery oak, antique brass borders (`#D97706`), parchment dossier dockets (`#292524`).
- **Accent Budget (10%)**: Golden magnifying glass amber (`#F59E0B`), case solved emerald (`#10B981`), crimson thread red (`#F43F5E`).
- **Typography**: Refined editorial serif for curatorial headings (`Cormorant Garamond`) paired with clear geometric sans (`Plus Jakarta Sans`) and tabular mono figures for accession IDs (`JetBrains Mono` / `tabular-nums`).

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOP NAVIGATION BAR                              │
│  [The Nay Collection]  ·  [Play 2D Game]  [Art Detective]  [Virtual Tour]  [Curator Studio]
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     ART DETECTIVE BUREAU        │   │    IMMERSIVE VIRTUAL TOUR       │
│ • Case Selection Dossier        │   │ • 6 Thematic Panoramic Wings    │
│ • 3 Clue Docket with Hints      │   │ • Clickable Artwork Hotspots    │
│ • Interactive Magnifier Lens    │   │ • Audio Guide Narration         │
│ • Suspects & Accusation         │   │ • 12-Item Scavenger Hunt        │
│ • Solved Fanfare & Badges       │   │ • Pop-up Artwork Plaque         │
│ • Printable Signed Diploma      │   │ • Room-to-Room Teleportation    │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

1. **Integrated Multi-Mode Architecture**:
   - *Chosen Approach*: Seamlessly incorporate **Art Detective Mode** and **Virtual Tour Mode** into the existing top bar alongside the **2D Museum Game** and **Curator Studio**.
   - *Why*: Allows Benjamin to switch instantly between maintaining the collection, letting his daughter play the 2D action exploration, or solving detective cases and taking the guided virtual tour together.
2. **Interactive Magnifying Glass Component**:
   - *Chosen Approach*: HTML5 Canvas sub-sampling coordinate lens that dynamically magnifies the high-resolution artwork texture at $2.5\times$ zoom with illuminated crosshairs.
   - *Why*: Teaches a 10-year-old close-looking observation skills (brushstroke texture, dots, paper grain) without overwhelming UI lag.
3. **Web Speech Synthesis Audio Guide**:
   - *Chosen Approach*: Native browser Web Speech API combined with synthesized Web Audio chimes for voiceover tour stops.
   - *Why*: Zero external API latency or bandwidth costs, works fully offline and hermetically in AI Studio sandbox.
4. **Printable Diploma Generation**:
   - *Chosen Approach*: Bespoke vector SVG/HTML printable certificate with `window.print()` styling and SVG download option.
   - *Why*: Gives tangible, proud real-world recognition to the daughter upon completing the cases.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                           App.tsx (Root State)                        │
│   • Active View: 'GAME' | 'STUDIO' | 'DETECTIVE' | 'TOUR'             │
│   • Artworks Database & Case Progress State                           │
└───────┬───────────────────┬───────────────────┬───────────────────┬───┘
        │                   │                   │                   │
        ▼                   ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  MuseumGame  │    │CuratorStudio │    │ ArtDetective │    │ VirtualTour  │
│  (2D Canvas) │    │(Maintenance) │    │  (Case Files)│    │(Interactive) │
└──────────────┘    └──────────────┘    └───────┬──────┘    └───────┬──────┘
                                                │                   │
                     ┌──────────────────────────┴────────┐          │
                     ▼                                   ▼          ▼
           ┌───────────────────┐               ┌───────────────────┐
           │ MagnifyingLens.tsx│               │ AudioTourPlayer   │
           │ (Interactive Zoom)│               │ ScavengerTracker  │
           └───────────────────┘               └───────────────────┘
```

### Data Entities & Case Model
- `DetectiveCase`: `id`, `caseNumber`, `title`, `roomNumber`, `artworkId`, `teaser`, `clues: [Clue1, Clue2, Clue3]`, `magnifierTarget: {x, y, zoomFactor, highlightLabel}`, `suspects: [Suspect1, Suspect2, Suspect3]`, `correctSuspectId`, `solvedExplanation`, `badgeIcon`, `badgeTitle`.
- `ScavengerItem`: `id`, `name`, `roomNumber`, `description`, `icon`, `hotspotCoordinates`, `found`.
- `TourStop`: `id`, `roomId`, `artworkId`, `hotspotX`, `hotspotY`, `audioScript`, `funFact`, `curatorPlaque`.

### Verification & Testing
- Compile check via `compile_applet`.
- Syntax & type verification via `lint_applet`.
- Verify magnifier tracking, sound feedback, clue unlocks, case solved celebrations, and print preview.
