/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Direct imports of the authentic Nay Collection artworks
import jivyaTrainImg from '../assets/real_artworks/jivya_soma_mashe_train.jpg';
import miracleBullImg from '../assets/real_artworks/miracle_daniel_bull.jpg';
import baluTigerShrineImg from '../assets/real_artworks/balu_mashe_tiger_shrine.jpg';
import baluVillageFestivalImg from '../assets/real_artworks/balu_mashe_village_festival.jpg';
import jivyaTwoFishermenImg from '../assets/real_artworks/jivya_soma_mashe_two_fishermen.jpg';
import bhuriMonkeyCrocodileImg from '../assets/real_artworks/bhuri_bai_monkey_crocodile.jpg';
import bhajjuKrishnaImg from '../assets/real_artworks/bhajju_shyam_vasudev_krishna.jpg';
import durgaTreeOfLifeImg from '../assets/real_artworks/durga_bai_tree_of_life.jpg';
import heeramanTreeOfLifeImg from '../assets/real_artworks/heeraman_urwati_tree_of_life.jpg';
import steveOliffComicImg from '../assets/real_artworks/steve_oliff_comic_color.jpg';
import artSpiegelmanComicImg from '../assets/real_artworks/art_spiegelman_comic_art.jpg';
import chiharuShiotaStateImg from '../assets/real_artworks/chiharu_shiota_state_of_being_20.jpg';
import annaLuciaPublicSpacesImg from '../assets/real_artworks/anna_lucia_public_spaces_22.jpg';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  nationality: string;
  year: string;
  medium: string;
  dimensions: string;
  room: number; // 1 to 6
  roomName: string;
  accessionNo: string;
  description: string;
  curatorialEssay: string;
  youngCuratorNote: string; // Fun explanation for 10-year-olds
  funFact: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
}

export interface CuratorialRoom {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  themeColor: string;
  accentColor: string;
  mascotName: string;
  mascotRole: string;
  badgeName: string;
  badgeIcon: string;
  coreQuestion: string;
  curatorialThesis: string;
  kidMission: string;
}

export interface Exhibition {
  id: string;
  title: string;
  curator: string;
  dates: string;
  description: string;
  artworkIds: string[];
}

export const ROOMS_METADATA: CuratorialRoom[] = [
  {
    id: 1,
    slug: 'origins-of-narrative',
    name: 'Origins of Narrative',
    subtitle: 'Myth, Ritual & Collective Systems',
    themeColor: '#78350F', // Warm terracotta / ochre
    accentColor: '#D97706',
    mascotName: 'Barnaby & The Sacred Bull',
    mascotRole: 'Guardians of Sacred Memory',
    badgeName: 'Origin Seeker',
    badgeIcon: '☀️',
    coreQuestion: 'How did humans tell stories before books or museums existed?',
    curatorialThesis:
      'In early visual cultures, images were not decorative commodities hung in isolated white cubes. They were active ritual instruments—inscribed on hut walls, invoked in harvest dances (Warli), or painted on tin sheets to thank saints for surviving dangerous encounters (Mexican ex-votos). Narrative was a shared social system of survival, cosmic alignment, and gratitude.',
    kidMission: 'Help decode the Warli train and harvest circle, and find out why Daniel was saved from the charging bull!'
  },
  {
    id: 2,
    slug: 'from-ritual-to-authorship',
    name: 'From Ritual to Authorship',
    subtitle: 'Pattern, Identity & The Gond Metamorphosis',
    themeColor: '#047857', // Forest emerald
    accentColor: '#10B981',
    mascotName: 'Gondi the Pattern Peacock',
    mascotRole: 'Master of Sacred Dots',
    badgeName: 'Master of Dots',
    badgeIcon: '🦚',
    coreQuestion: 'When does a community pattern turn into an individual voice?',
    curatorialThesis:
      'In traditional indigenous cultures like the Gond and Bhil of central India, patterns were shared ancestral languages. In the late 20th century, trailblazing artists like Bhajju Shyam, Bhuri Bai, and Durga Bai moved from communal clay walls onto paper and canvas. Each artist invented their own signature micro-patterns (dots, scales, grain waves), turning ritual repetition into visionary individual authorship.',
    kidMission: 'Explore Bhajju Shyam’s river waves and Bhuri Bai’s crocodile dots to see how ancient tribal stories became world-famous art!'
  },
  {
    id: 3,
    slug: 'industrialized-narrative',
    name: 'Industrialized Narrative',
    subtitle: 'Sequential Art, Comics & Mass Reproduction',
    themeColor: '#1D4ED8', // Cobalt blue
    accentColor: '#3B82F6',
    mascotName: 'Zippy the Comic Pup',
    mascotRole: 'Gutter & Panel Detective',
    badgeName: 'Sequence Detective',
    badgeIcon: '⚡',
    coreQuestion: 'How do tiny boxes on paper make your brain see motion and time?',
    curatorialThesis:
      'Industrial print created a revolution: images could be duplicated millions of times and arranged sequentially. Master colorists like Steve Oliff and cartoonists like Art Spiegelman demonstrated how panels and the gutter—the space between panels—demand closure from the reader’s mind, transforming static ink into cinematic time.',
    kidMission: 'Investigate the comic frames and learn how Steve Oliff brought digital computers into comic coloring for the first time!'
  },
  {
    id: 4,
    slug: 'image-memory-identity',
    name: 'Image, Memory & Identity',
    subtitle: 'Relics, Presence & Spatial Weaving',
    themeColor: '#881337', // Deep crimson
    accentColor: '#E11D48',
    mascotName: 'Ariadne the Thread Weaver',
    mascotRole: 'Architect of Forgotten Keys',
    badgeName: 'Memory Cartographer',
    badgeIcon: '🗝️',
    coreQuestion: 'Can an artwork hold a memory even when the person who lived it is gone?',
    curatorialThesis:
      'Chiharu Shiota radicalizes the narrative impulse by suspending everyday relics (vintage aviator goggles, old keys, shoes) inside dense webs of hand-tied yarn. The object functions as an emotional anchor—an imprint of absent human existence suspended in geometric steel cubes.',
    kidMission: 'Step inside Chiharu Shiota’s State of Being #20 and investigate why vintage aviator goggles are floating inside a steel web!'
  },
  {
    id: 5,
    slug: 'algorithmic-narrative',
    name: 'Algorithmic Narrative',
    subtitle: 'Code, Determinism & Autonomous Systems',
    themeColor: '#312E81', // Electric indigo
    accentColor: '#6366F1',
    mascotName: 'Byte the Glitch Fox',
    mascotRole: 'Compiler of Algorithmic Tapestries',
    badgeName: 'Code Alchemist',
    badgeIcon: '✨',
    coreQuestion: 'Can computer code have feelings and paint beautiful tapestries?',
    curatorialThesis:
      'In generative art, narrative is procedural rather than linear. Artists like Anna Lucia script mathematical rules, probability distributions, and geometric constraints. When the script runs, deterministic seeds generate intricate wall works that dialogue directly with traditional textile weaving.',
    kidMission: 'Run Anna Lucia’s digital loom and discover how a few lines of code create wall murals for public spaces!'
  },
  {
    id: 6,
    slug: 'language-generative-narrative',
    name: 'Language & Generative Narrative',
    subtitle: 'Typography, Semiotics & Concrete Meaning',
    themeColor: '#4C1D95', // Royal violet
    accentColor: '#8B5CF6',
    mascotName: 'Lexi the Concrete Owl',
    mascotRole: 'Sculptor of Words',
    badgeName: 'Wordsmith',
    badgeIcon: '📖',
    coreQuestion: 'What happens when words stop being just text and start behaving like paintings?',
    curatorialThesis:
      'Language is humanity’s original generative system. In conceptual art and concrete poetry, typography transcends passive reading. Letters become physical shapes, spatial geometries, and symbolic systems, completing the arc back to the sacred signs of Room 1.',
    kidMission: 'Shape words into spatial visual poetry and explore how language creates worlds!'
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-01',
    title: 'Train (A Modern Machine in the Tribal Landscape)',
    artist: 'Jivya Soma Mashe',
    nationality: 'Indian (Warli Community, Maharashtra)',
    year: 'c. 1990',
    medium: 'White rice pigment and tree gum on cow-dung and mud ground',
    dimensions: '82 × 115 cm',
    room: 1,
    roomName: 'Origins of Narrative',
    accessionNo: 'NAY.WARLI.01.01',
    description:
      'A seminal masterwork by Jivya Soma Mashe, the venerated pioneer of modern Warli art. The canvas captures the dramatic confrontation between ancestral tribal life and modern industrial technology: a multi-car passenger train snakes horizontally across the landscape, puffing smoke, while Warli villagers with bullock carts, grazing cattle, and dancing figures go about their eternal daily rhythms.',
    curatorialEssay:
      'Mashe broke Warli painting out of ephemeral ritual marriage walls (chowk) into permanent narrative documentation. In Train, the mechanical repetition of locomotive wheels mirrors the sacred circular Tarpa dance, absorbing modern industrial infrastructure into the timeless geometric syntax of triangles and circles.',
    youngCuratorNote:
      'Look at the giant steam train puffing across the village! Before Jivya painted this, Warli people only painted on mud hut walls during weddings. Jivya saw a real train for the first time and decided: "I can draw this with our two-triangle people too!" Look at the people watching the train from the trees!',
    funFact:
      'Jivya Soma Mashe was awarded the prestigious Padma Shri by the President of India and had a major solo exhibition at the Centre Pompidou in Paris!',
    imageUrl: jivyaTrainImg,
    tags: ['Warli', 'Jivya Soma Mashe', 'Padma Shri', 'Vernacular', 'Locomotive', 'Ritual'],
    featured: true
  },
  {
    id: 'art-02',
    title: 'The Miracle of Daniel Saved from a Rampaging Bull',
    artist: 'Luis Vilchis',
    nationality: 'Mexican (Guanajuato)',
    year: '1968',
    medium: 'Oil and enamel on recycled tin plate (Lámina)',
    dimensions: '25 × 35 cm',
    room: 1,
    roomName: 'Origins of Narrative',
    accessionNo: 'NAY.VOTO.01.02',
    description:
      'A classic Mexican retablo / ex-voto devotional painting recording a dramatic real-life escape. Daniel was working in an open pasture when an aggressive black fighting bull broke free and charged directly toward him. Daniel commended his soul to the Virgin of San Juan de los Lagos, who appeared in celestial clouds and averted disaster, leaving Daniel unharmed.',
    curatorialEssay:
      'Latin American ex-votos function as contracts of gratitude. Painted on inexpensive repurposed tin sheets, they follow a strict tripartite structural grammar: mortal crisis in the foreground, celestial intercession in the clouds, and inscribed forensic testimony along the bottom margin. They are sacred news reports commemorating personal salvation.',
    youngCuratorNote:
      'Imagine an angry black bull charging right at you with huge horns! Daniel fell to the ground, prayed as hard as he could, and the bull stopped in its tracks! To thank the Virgin Mary, he paid a painter to capture the exact scary second on a sheet of shiny tin.',
    funFact:
      'People used to cut up olive oil cans and biscuit tins to paint these, and church walls in Mexico were covered from floor to ceiling with thousands of them!',
    imageUrl: miracleBullImg,
    tags: ['Ex-Voto', 'Retablo', 'Mexican Folk Art', 'Devotional', 'Miracle', 'Tin'],
    featured: true
  },
  {
    id: 'art-03',
    title: 'Tiger Shrine (Waghoba Ritual Circle)',
    artist: 'Balu Mashe',
    nationality: 'Indian (Warli Community, Maharashtra)',
    year: '2005',
    medium: 'White rice flour paste on ochre geru mud ground',
    dimensions: '75 × 100 cm',
    room: 1,
    roomName: 'Origins of Narrative',
    accessionNo: 'NAY.WARLI.01.03',
    description:
      'An evocative ritual painting honoring Waghoba, the big cat deity of the Sahyadri forests. Balu Mashe (son and master pupil of Jivya Soma Mashe) paints a sacred forest clearing with a tiger shrine at its heart, surrounded by hunters, protective spirits, dancing villagers, and sacred trees.',
    curatorialEssay:
      'Balu Mashe inherited his father Jivya’s narrative fluidity while introducing deeper mythological forest density. In Warli cosmology, tigers are both mortal predators and spiritual guardians (Waghoba). Ritual depictions negotiate peace between human settlements and forest apex predators.',
    youngCuratorNote:
      'In the forest where the Warli live, real tigers walk at night! Instead of fighting them, the villagers built shrines for the Tiger God "Waghoba" and danced for him so he would protect the village instead of attacking!',
    funFact:
      'The villagers believed if they treated Waghoba with respect and offered fresh harvest grains, the tigers would guard their cows from thieves!',
    imageUrl: baluTigerShrineImg,
    tags: ['Warli', 'Balu Mashe', 'Tiger Shrine', 'Waghoba', 'Sacred Animal']
  },
  {
    id: 'art-04',
    title: 'Village Festival and Sacred Union',
    artist: 'Balu Mashe',
    nationality: 'Indian (Warli Community, Maharashtra)',
    year: '2008',
    medium: 'Natural rice paste and gum on hand-pressed paper with geru wash',
    dimensions: '88 × 124 cm',
    room: 1,
    roomName: 'Origins of Narrative',
    accessionNo: 'NAY.WARLI.01.04',
    description:
      'A panoramic festive narrative portraying the sacred marriage procession and harvest ceremonies. Huts, climbing monkeys, musicians playing the long tarpa trumpet, toddy tappers climbing palms, and intricate concentric dance circles pulse across the composition.',
    curatorialEssay:
      'The Warli universe has no empty space—every square inch breathes life. Balu Mashe balances domestic intimacy (women grinding grain, babies in cradles) with cosmic celebration in an unending cycle of nature and community.',
    youngCuratorNote:
      'Can you spot the little monkeys climbing up the palm trees to steal sweet fruit while the whole village is busy dancing? There are over 100 people here and every single one is having a blast!',
    funFact:
      'Warli painters make their brushes by chewing the end of a fresh bamboo twig until the wood fibers fray into soft bristles!',
    imageUrl: baluVillageFestivalImg,
    tags: ['Warli', 'Balu Mashe', 'Festival', 'Celebration', 'Cosmology']
  },
  {
    id: 'art-05',
    title: 'Two Fishermen Casting Nets',
    artist: 'Jivya Soma Mashe',
    nationality: 'Indian (Warli Community, Maharashtra)',
    year: 'c. 1995',
    medium: 'Rice pigment on dung-treated cloth',
    dimensions: '55 × 75 cm',
    room: 1,
    roomName: 'Origins of Narrative',
    accessionNo: 'NAY.WARLI.01.05',
    description:
      'A concentrated, poetic work by Jivya Soma Mashe focusing on two fishermen casting delicate mesh nets into a river brimming with swimming fish, aquatic plants, and hunting cranes.',
    curatorialEssay:
      'Unlike large choral compositions, Two Fishermen demonstrates Mashe’s mastery of negative space and rhythmic tension. The circular nets suspended in mid-throw embody dynamic suspension of time.',
    youngCuratorNote:
      'Look at the moment the fishing nets spread out like spiderwebs over the water! The fish below are swimming in circles trying to escape.',
    funFact:
      'Jivya was orphaned at a young age and didn’t speak for years—he expressed everything he felt through drawing in the dust before becoming a painter!',
    imageUrl: jivyaTwoFishermenImg,
    tags: ['Warli', 'Jivya Soma Mashe', 'Fishermen', 'Water', 'Movement']
  },
  {
    id: 'art-06',
    title: 'The Monkey and the Crocodile (Panchatantra Fable)',
    artist: 'Bhuri Bai',
    nationality: 'Indian (Bhil Community, Madhya Pradesh)',
    year: '2017',
    medium: 'Acrylic on handmade canvas',
    dimensions: '90 × 120 cm',
    room: 2,
    roomName: 'From Ritual to Authorship',
    accessionNo: 'NAY.BHIL.02.01',
    description:
      'A dazzling contemporary Bhil narrative painting retelling the famous Panchatantra fable of the clever monkey and the treacherous crocodile. The entire body of each animal is filled with Bhuri Bai’s signature multi-color dotted constellations.',
    curatorialEssay:
      'Bhuri Bai was the first Bhil woman to transfer traditional ritual Pithora wall painting onto paper and canvas. In this work, the ancient moral fable becomes an optical symphony of polychromatic dots, where each dot represents a seed of life, ancestral memory, and individual artistic voice.',
    youngCuratorNote:
      'Do you know this story? The crocodile told the monkey: "Come ride on my back!" but secretly wanted to eat his heart! The smart monkey said: "Oh, I left my heart up in that berry tree, let’s go back and get it!" Look at all the colorful rainbow dots on the crocodile’s scales!',
    funFact:
      'Bhuri Bai was working on a building site carrying bricks when she was discovered and given her first paintbrush. She won India’s Padma Shri award!',
    imageUrl: bhuriMonkeyCrocodileImg,
    tags: ['Bhil', 'Bhuri Bai', 'Padma Shri', 'Panchatantra', 'Dots', 'Authorship'],
    featured: true
  },
  {
    id: 'art-07',
    title: 'Vasudev Carrying Baby Krishna Across the Yamuna',
    artist: 'Bhajju Shyam',
    nationality: 'Indian (Gond Pardhan, Patangarh)',
    year: '2015',
    medium: 'Acrylic and natural pigment on fine Belgian linen',
    dimensions: '100 × 140 cm',
    room: 2,
    roomName: 'From Ritual to Authorship',
    accessionNo: 'NAY.GOND.02.02',
    description:
      'A sublime Gond interpretation of the mythological crossing of the Yamuna River. Vasudev wades through turbulent, swirling waves carrying the infant Krishna in a wicker basket on his head, while the multi-headed serpent Sheshnaag arches overhead like a protective umbrella.',
    curatorialEssay:
      'Bhajju Shyam reimagines traditional Hindu mythology through the distinct visual taxonomy of the Gond Pardhan tribe. The swirling river waters are rendered through thousands of micro-patterned scales and undulating dots that pulse with spiritual life force (Bana).',
    youngCuratorNote:
      'Vasudev is carrying the magical baby Krishna in a basket over a giant storm river at midnight! Look at the giant serpent sheltering the baby like an umbrella so no raindrops get him wet!',
    funFact:
      'Bhajju Shyam wrote and illustrated "The London Jungle Book", where he drew London double-decker buses as giant friendly chameleons!',
    imageUrl: bhajjuKrishnaImg,
    tags: ['Gond', 'Bhajju Shyam', 'Krishna', 'Mythology', 'Micro-Patterns', 'Padma Shri'],
    featured: true
  },
  {
    id: 'art-08',
    title: 'Tree of Life with Animals and Village Scene',
    artist: 'Durga Bai Vyam',
    nationality: 'Indian (Gond Pardhan)',
    year: '2019',
    medium: 'Acrylic on archival canvas',
    dimensions: '110 × 135 cm',
    room: 2,
    roomName: 'From Ritual to Authorship',
    accessionNo: 'NAY.GOND.02.03',
    description:
      'An intricate masterpiece showing the sacred banyan tree teeming with birds, deer, peacocks, flying squirrels, and villagers gathered below for harvest rituals, rendered in Durga Bai’s lyrical curves and vibrant earth pigments.',
    curatorialEssay:
      'Durga Bai is celebrated for infusing Gond Pardhan art with female agency, folklore, and feminist re-interpretations of tribal legends. Her signature patterns evoke woven textiles, grain sheaves, and seed pods.',
    youngCuratorNote:
      'Look at the branches of this tree—they are curling and dancing like musical notes! Look for the secret birds hidden in the leaves eating wild berries.',
    funFact:
      'Durga Bai co-created the graphic novel "Bhimayana" about Dr. B.R. Ambedkar, using only traditional Gond storytelling methods!',
    imageUrl: durgaTreeOfLifeImg,
    tags: ['Gond', 'Durga Bai Vyam', 'Tree of Life', 'Padma Shri', 'Feminine Narrative']
  },
  {
    id: 'art-09',
    title: 'Tree of Life with Village Rituals',
    artist: 'Heeraman Urwati',
    nationality: 'Indian (Gond Pardhan)',
    year: '2018',
    medium: 'Acrylic and natural binder on Belgian linen',
    dimensions: '95 × 125 cm',
    room: 2,
    roomName: 'From Ritual to Authorship',
    accessionNo: 'NAY.GOND.02.04',
    description:
      'A commanding Gond composition depicting the sacred cosmic tree where ancestral spirits, deer, and ritual dancers coalesce. Urwati uses dense textural hatching and concentric dotted fields to convey sacred ecology.',
    curatorialEssay:
      'In Gond philosophy, nature is not a resource to exploit but a sentient kinship network. Urwati’s hypnotic line density invites prolonged contemplation, breaking down the boundary between tree bark, animal flesh, and human spirit.',
    youngCuratorNote:
      'If you touch a tree in the Gond forest, they believe the tree can feel your heartbeat! Heeraman drew the tree with thousands of tiny lines so it looks like it is breathing.',
    funFact:
      'Gond artists often listen to Pardhan bardic songs played on the bana (a single-string fiddle) while painting!',
    imageUrl: heeramanTreeOfLifeImg,
    tags: ['Gond', 'Heeraman Urwati', 'Sacred Tree', 'Ancestral Memory']
  },
  {
    id: 'art-10',
    title: 'Sequential Color Master Proof (USA.Steve Oliff.1)',
    artist: 'Steve Oliff',
    nationality: 'American (Master Colorist & Sequential Pioneer)',
    year: '1988–1993',
    medium: 'Mixed media color process, gouache, airbrush, and early computerized color separation',
    dimensions: '43 × 58 cm',
    room: 3,
    roomName: 'Industrialized Narrative',
    accessionNo: 'NAY.COMIC.03.01',
    description:
      'An authentic production color proof and layout by Steve Oliff, the legendary comic colorist who revolutionized sequential art by introducing digital computer coloring to masterworks like Akira, Spawn, and superhero comics.',
    curatorialEssay:
      'Oliff changed the material grammar of comics. Before Oliff, comics were limited to flat 64-color Ben-Day dot mechanical separations. Oliff used custom computer algorithms and hand airbrushing to introduce cinematic lighting, specular highlights, and psychological color moods to mass-produced paper.',
    youngCuratorNote:
      'Did you know that 40 years ago, comics could only have flat red, yellow, and blue? Steve Oliff was one of the very first people in the world to connect a computer to comics, inventing glowing neon lights and sunset shadows for comic books!',
    funFact:
      'Katsuhiro Otomo, creator of Akira, specifically selected Steve Oliff to color the English edition because his computer gradients looked like real movie film!',
    imageUrl: steveOliffComicImg,
    tags: ['Comics', 'Steve Oliff', 'Colorist', 'Sequential Art', 'Akira', 'Digital Revolution'],
    featured: true
  },
  {
    id: 'art-11',
    title: 'Sequential Art & Narrative Gutter (USA.Art Spiegelman.1)',
    artist: 'Art Spiegelman',
    nationality: 'American (Cartoonist & Co-Founder of RAW)',
    year: '1978–1985',
    medium: 'Pen, ink, and lithographic print on archival paper',
    dimensions: '30 × 42 cm',
    room: 3,
    roomName: 'Industrialized Narrative',
    accessionNo: 'NAY.COMIC.03.02',
    description:
      'An original sequential art piece by Art Spiegelman, the visionary creator of Maus and editor of RAW magazine, illustrating how comic panels manipulate time, trauma, and personal history.',
    curatorialEssay:
      'Spiegelman proved that sequential art is capable of conveying the deepest tragedies of modern history. In Spiegelman’s hands, the gutter is not merely empty paper; it is the space of memory, loss, and moral reckoning.',
    youngCuratorNote:
      'Art Spiegelman showed the whole world that comics aren’t just for superheroes—they can tell real family history and deep truths that touch people’s hearts all over the globe.',
    funFact:
      'Spiegelman won a special Pulitzer Prize in 1992—the first time a graphic novel ever won the world’s most prestigious literary prize!',
    imageUrl: artSpiegelmanComicImg,
    tags: ['Comics', 'Art Spiegelman', 'Maus', 'RAW', 'Pulitzer Prize', 'Sequential Art']
  },
  {
    id: 'art-12',
    title: 'State of Being #20 (Aviator Goggles & Webbed Relic)',
    artist: 'Chiharu Shiota',
    nationality: 'Japanese (Berlin Contemporary)',
    year: '2012',
    medium: 'Vintage aviator goggles, dense hand-woven black and red thread, welded steel cube armature',
    dimensions: '45 × 45 × 45 cm',
    room: 4,
    roomName: 'Image, Memory & Identity',
    accessionNo: 'NAY.SHIOTA.04.01',
    description:
      'An authentic original sculpture from Chiharu Shiota’s iconic State of Being series. Inside a black geometric steel cube, hundreds of dense, taut threads are woven into a dimensional web, suspending a pair of antique aviator flight goggles in mid-air like a relic frozen in time.',
    curatorialEssay:
      'Shiota’s State of Being series materializes absence and presence. The aviator goggles evoke vision, flight, forgotten journeys, and human gaze; the dense woven thread cocoon traps time and memories. The viewer is compelled to ask: who wore these goggles, what skies did they witness, and where did they go?',
    youngCuratorNote:
      'Look inside the steel cube! There is a pair of old-fashioned airplane pilot goggles floating in the middle of a black and red web! It feels like time stopped 100 years ago, and we are looking at someone’s flying dream frozen in mid-air!',
    funFact:
      'Shiota represented Japan at the Venice Biennale, where she filled an entire two-story palace with red yarn and 50,000 old keys collected from people all over the planet!',
    imageUrl: chiharuShiotaStateImg,
    tags: ['Chiharu Shiota', 'Sculpture', 'State of Being', 'Memory', 'Installation', 'Thread'],
    featured: true
  },
  {
    id: 'art-13',
    title: 'Art For Walls In Public Spaces #22',
    artist: 'Anna Lucia',
    nationality: 'Dutch (Generative Artist & Software Engineer)',
    year: '2022',
    medium: 'Autonomous deterministic generative code (JavaScript, Canvas2D, SVG on fxhash Tezos blockchain)',
    dimensions: 'Autonomous vector system / variable physical mural',
    room: 5,
    roomName: 'Algorithmic Narrative',
    accessionNo: 'NAY.GEN.05.01',
    description:
      'An acclaimed generative artwork from Anna Lucia’s series Art For Walls In Public Spaces, minted on the decentralized Tezos art platform fxhash. The code algorithmically constructs monumental textile-like geometric murals, blending traditional Dutch weaving patterns with computational randomness.',
    curatorialEssay:
      'Anna Lucia bridges the centuries-old history of craft and needlework with autonomous generative software. Rather than executing manual stitches, the artist scripts rules of tension, proportion, and color harmony. The computer executes the tapestry according to cryptographic seed numbers.',
    youngCuratorNote:
      'This looks like a colorful rug woven by a grandmother, but it was generated in 0.2 seconds by a computer program! The artist Anna wrote code rules that act like an invisible digital loom weaving shapes on screen!',
    funFact:
      'Each version of this artwork has a unique digital seed number—if you change just one digit of the seed, the whole mural rearranges into completely new colors!',
    imageUrl: annaLuciaPublicSpacesImg,
    tags: ['Generative Art', 'Anna Lucia', 'fxhash', 'Algorithmic', 'Weaving', 'Tezos'],
    featured: true
  }
];

export const CURATORIAL_ESSAYS = [
  {
    id: 'theory-manifesto',
    title: 'The Narrative Systems Manifesto',
    subtitle: 'Beyond Traditional Chronologies in Art Curation',
    author: 'Curator Benjamin Nay',
    readingTime: '5 min read',
    content: `For centuries, art history has organized collections along three rigid axes: geography (Western, Asian, African), chronology (Renaissance, Modern, Postmodern), or medium (Painting, Sculpture, Photography).

The Nay Collection breaks these silos to propose a different organizing thesis: Narrative Systems.

Narrative is not simply a cute story told by an image. Narrative is an architectural operating system through which human minds organize perception, ritualize communal survival, make sense of memory, and compute reality.

By juxtaposing Indian Warli and Gond vernacular masters alongside Mexican Catholic ex-votos, 20th-century comic strips, Chiharu Shiota's thread architectures, and autonomous generative code, the collection reveals that every human era invents its own specific engine for producing meaning.`
  },
  {
    id: 'theory-ritual-to-author',
    title: 'From Communal Walls to Signature Dots',
    subtitle: 'The Gond and Bhil Metamorphosis',
    author: 'Curatorial Research Group',
    readingTime: '4 min read',
    content: `In central India, tribal painting was originally an ephemeral, collective ritual. Mud walls were renewed before harvest; symbols were painted by women to invoke fertility, protection, and harmony with the forest.

When artists like Jangarh Singh Shyam, Bhajju Shyam, Bhuri Bai, and Durga Bai began applying poster paints to paper, a profound shift took place:
1. The ritual syntax transformed into individual authorship.
2. The dot patterns—once collective signs—became personal artistic signatures.
3. The stories transitioned from local village oral traditions into universal contemporary dialogues about ecology and mythology.`
  },
  {
    id: 'theory-code-and-thread',
    title: 'The Code and The Thread',
    subtitle: 'Connecting Chiharu Shiota with Algorithmic Art',
    author: 'Nay Collection Curatorial Board',
    readingTime: '4 min read',
    content: `At first glance, a room filled with thousands of hand-tied yarn fibers (Chiharu Shiota's State of Being) seems entirely opposite to thousands of lines of mathematical generative code (Anna Lucia).

Yet structurally, both are generative network systems:
- Shiota uses physical iteration, nodal connections, and tension to map invisible emotional relationships.
- Creative coders use algorithmic iteration, recursive loops, and mathematical nodes to generate visual harmonies.

Both demonstrate that human feeling and computational logic are not adversaries; they are two dialectics of the same quest to weave order out of cosmic chaos.`
  }
];
