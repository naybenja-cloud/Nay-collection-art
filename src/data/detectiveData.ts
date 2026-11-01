/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Import real artwork images for the Detective cases
import jivyaTrainImg from '../assets/real_artworks/jivya_soma_mashe_train.jpg';
import miracleBullImg from '../assets/real_artworks/miracle_daniel_bull.jpg';
import bhuriMonkeyCrocodileImg from '../assets/real_artworks/bhuri_bai_monkey_crocodile.jpg';
import chiharuShiotaStateImg from '../assets/real_artworks/chiharu_shiota_state_of_being_20.jpg';
import annaLuciaPublicSpacesImg from '../assets/real_artworks/anna_lucia_public_spaces_22.jpg';

export interface Suspect {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alibi: string;
  statement: string;
  isGuilty: boolean;
  motiveRevealed: string;
}

export interface Clue {
  id: number;
  stage: 'Visual Inspection' | 'Material & Technique' | 'Narrative Philosophy';
  headline: string;
  text: string;
  hint: string;
  lensTarget?: { x: number; y: number; zoom: number; note: string };
}

export interface DetectiveCase {
  id: string;
  caseNumber: string;
  title: string;
  roomId: number;
  roomName: string;
  artworkId: string;
  artworkTitle: string;
  artist: string;
  year: string;
  imageUrl: string;
  teaser: string;
  mysterySynopsis: string;
  clues: Clue[];
  suspects: Suspect[];
  correctSuspectId: string;
  solutionExplanation: string;
  artAppreciationLesson: string;
  badgeTitle: string;
  badgeIcon: string;
}

export interface ScavengerItem {
  id: string;
  name: string;
  roomId: number;
  roomName: string;
  artworkTitle: string;
  icon: string;
  clueRiddle: string;
  funFact: string;
  found?: boolean;
}

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 'case-01',
    caseNumber: 'CASE #101',
    title: 'The Mystery of the Modern Locomotive in Ancient Warli',
    roomId: 1,
    roomName: 'Origins of Narrative',
    artworkId: 'art-01',
    artworkTitle: 'Train (A Modern Machine in the Tribal Landscape)',
    artist: 'Jivya Soma Mashe',
    year: 'c. 1990',
    imageUrl: jivyaTrainImg,
    teaser: 'A smoking iron locomotive is snaking through an ancient tribal village! Why did a Warli master paint a train with two-triangle stick figures?',
    mysterySynopsis:
      'Archie the Museum Cat noticed something incredible in this masterwork by Jivya Soma Mashe: instead of just traditional harvest dances and deer, there is a giant multi-car passenger train puffing steam right through the village! Did someone vandalize the canvas with a modern train, or did the father of modern Warli art invent a whole new way to capture the modern world?',
    clues: [
      {
        id: 1,
        stage: 'Visual Inspection',
        headline: 'Geometric Stick Figures & The Iron Engine',
        text: 'Look at the passengers and villagers watching the locomotive. Every human body is constructed from two inverted triangles touching point-to-point!',
        hint: 'Two triangles joined at the tip symbolize cosmic balance in Warli belief: heaven and earth, movement and balance.',
        lensTarget: { x: 50, y: 48, zoom: 2.2, note: 'The locomotive wheels mirror the sacred circular dance!' }
      },
      {
        id: 2,
        stage: 'Material & Technique',
        headline: 'Natural Village Pigments Only',
        text: 'This painting was made with zero store-bought synthetic paint! The white pigment was hand-ground in the village.',
        hint: 'It is made of white rice paste mixed with water and tree resin, painted with a chewed bamboo twig brush on cow-dung and red earth ground.',
        lensTarget: { x: 30, y: 35, zoom: 2.5, note: 'Ground rice paste on natural earthen mud ground.' }
      },
      {
        id: 3,
        stage: 'Narrative Philosophy',
        headline: 'Absorbing Modernity into Sacred Grammar',
        text: 'Why did Jivya paint the train with the same geometric rhythm as the traditional harvest circle?',
        hint: 'In Warli narrative systems, the modern machine is not feared; it is welcomed and absorbed into the eternal cosmic cycle of village life.',
        lensTarget: { x: 65, y: 55, zoom: 2.0, note: 'Cattle and villagers living peacefully alongside the iron machine.' }
      }
    ],
    suspects: [
      {
        id: 'suspect-lazy-painter',
        name: 'Lazy Leonardo',
        role: 'Impatient Cartoonist',
        avatar: '🎨',
        alibi: '"I drew that train because drawing 50 bullock carts would take too many days!"',
        statement: 'He claims drawing a modern train was just a shortcut to fill up canvas space.',
        isGuilty: false,
        motiveRevealed: 'Debunked! Jivya Soma Mashe spent weeks grinding rice pigment and painting with meditative reverence.'
      },
      {
        id: 'suspect-jivya-genius',
        name: 'Jivya Soma Mashe’s Visionary Genius',
        role: 'Padma Shri Warli Master Pioneer',
        avatar: '🚂',
        alibi: '"I saw the iron train crossing our hills, and I gave it the heartbeat of our ancestral triangles!"',
        statement: 'Jivya took Warli painting off wedding mud walls and used it to chronicle the modern world while preserving sacred tribal cosmology.',
        isGuilty: true,
        motiveRevealed: 'CORRECT! Jivya showed that ancient tribal art is not trapped in the past—it can chronicle modern history!'
      },
      {
        id: 'suspect-cat',
        name: 'Barnaby the Cat',
        role: 'Gallery Cat',
        avatar: '🐱',
        alibi: '"I thought the train was a giant caterpillar made of rice cakes!"',
        statement: 'Barnaby just likes chasing the little painted birds perched in the trees.',
        isGuilty: false,
        motiveRevealed: 'Barnaby is innocent, though he did try to nap on the warm red mud canvas.'
      }
    ],
    correctSuspectId: 'suspect-jivya-genius',
    solutionExplanation:
      'Case Solved! You cracked the Warli mystery! Jivya Soma Mashe (awarded the Padma Shri) showed the world that tribal art is a living, evolving narrative system. By rendering the modern locomotive with the two-triangle human figures and rice paste of his ancestors, he brought the ancient and modern worlds into cosmic harmony.',
    artAppreciationLesson:
      'Art appreciation tip: Traditional art is not dead history! When indigenous masters paint modern subjects, they create powerful bridges between ancestral memory and the future.',
    badgeTitle: 'Warli Locomotive Sleuth',
    badgeIcon: '🚂'
  },
  {
    id: 'case-02',
    caseNumber: 'CASE #102',
    title: 'The Case of Daniel and the Charging Bull',
    roomId: 1,
    roomName: 'Origins of Narrative',
    artworkId: 'art-02',
    artworkTitle: 'The Miracle of Daniel Saved from a Rampaging Bull',
    artist: 'Luis Vilchis',
    year: '1968',
    imageUrl: miracleBullImg,
    teaser: 'Furious black bull, razor-sharp horns, and a helpless boy in the dirt! How did this real-life miracle get immortalized on a piece of roofing tin?',
    mysterySynopsis:
      'In this authentic Mexican ex-voto (retablo), young Daniel is cornered in a pasture by a ferocious black fighting bull! In the sky, a heavenly saint appears in glowing golden clouds. At the bottom, handwriting tells the true story of how Daniel escaped without a single injury. Why did Daniel hire a village painter to make this?',
    clues: [
      {
        id: 1,
        stage: 'Visual Inspection',
        headline: 'The Three-Part Miracle Recipe',
        text: 'Notice how the painting is divided into three distinct zones: Danger on earth, Heaven in the clouds, and Testimonial text below.',
        hint: 'Every Mexican ex-voto follows this strict three-part grammar to legally prove an answered prayer!',
        lensTarget: { x: 50, y: 70, zoom: 2.2, note: 'The charging black bull inches away from Daniel.' }
      },
      {
        id: 2,
        stage: 'Material & Technique',
        headline: 'Recycled Roofing Tin (Lámina)',
        text: 'Tap the surface—this is not linen canvas or paper! It is painted on an actual piece of cut metal tin.',
        hint: 'Poor Mexican families couldn’t afford expensive stretched canvas, so they painted devotional retablos on recycled food cans or tin roof sheets.',
        lensTarget: { x: 50, y: 90, zoom: 2.6, note: 'Handwritten testimonial inscription at the base.' }
      },
      {
        id: 3,
        stage: 'Narrative Philosophy',
        headline: 'Art as a Contract of Gratitude',
        text: 'This painting was never meant to be sold in an art auction. What was its real purpose?',
        hint: 'Daniel made a sacred promise: "If you save my life, I will paint this miracle and hang it on the church wall for everyone to witness!"',
        lensTarget: { x: 50, y: 20, zoom: 2.4, note: 'The Virgin Mary appearing in glowing clouds.' }
      }
    ],
    suspects: [
      {
        id: 'suspect-matador',
        name: 'The Rodeo Ringmaster',
        role: 'Carnival Showman',
        avatar: '🎪',
        alibi: '"It was just a staged publicity stunt to sell circus tickets!"',
        statement: 'He claims the bull was a trained pet wearing cardboard horns.',
        isGuilty: false,
        motiveRevealed: 'Untrue! Daniel was a real farmer facing mortal danger in an open pasture.'
      },
      {
        id: 'suspect-devotional-vow',
        name: 'Daniel’s Sacred Vow of Gratitude',
        role: 'Forensic Witness & Believer',
        avatar: '🙏',
        alibi: '"I promised that if I survived the bull’s horns, the whole world would know I was saved!"',
        statement: 'Ex-votos were created as sacred contracts: an artist was commissioned to testify to a real miracle on a church wall.',
        isGuilty: true,
        motiveRevealed: 'CORRECT! The painting was an authentic devotional offering of gratitude for surviving a deadly encounter.'
      },
      {
        id: 'suspect-ferdinand',
        name: 'Barnaby & Ferdinand the Bull',
        role: 'Innocent Pasture Bull',
        avatar: '🐂',
        alibi: '"Moo! I just wanted to smell the lovely wildflowers in Daniel’s pocket!"',
        statement: 'The bull claims it was just running to say hello.',
        isGuilty: false,
        motiveRevealed: 'The bull was definitely charging, but Daniel survived to tell the tale!'
      }
    ],
    correctSuspectId: 'suspect-devotional-vow',
    solutionExplanation:
      'Case Solved! You decoded the secret grammar of the Mexican ex-voto! In Latin American folk tradition, paintings were forensic receipts of gratitude. By painting the charging bull, the saving saint, and the written date, Daniel fulfilled his sacred vow to thank the heavens.',
    artAppreciationLesson:
      'Art appreciation tip: Art isn’t always made for rich collectors or museums. For centuries, everyday people made art to say "Thank You" for surviving the hardest moments of their lives.',
    badgeTitle: 'Miracle Retablo Sleuth',
    badgeIcon: '🐂'
  },
  {
    id: 'case-03',
    caseNumber: 'CASE #103',
    title: 'The Case of the Rainbow Crocodile Dots',
    roomId: 2,
    roomName: 'From Ritual to Authorship',
    artworkId: 'art-06',
    artworkTitle: 'The Monkey and the Crocodile (Panchatantra Fable)',
    artist: 'Bhuri Bai',
    year: '2017',
    imageUrl: bhuriMonkeyCrocodileImg,
    teaser: 'A crocodile covered in dazzling multicolored dots is swimming with a monkey on its back! Why did Bhuri Bai transform ancient tribal mud art into a rainbow optical symphony?',
    mysterySynopsis:
      'In traditional Bhil villages, women only painted with dirt and cow dung during sacred Pithora rituals. But artist Bhuri Bai became the very first Bhil woman to pick up a paintbrush and poster paints! Here, she retells the ancient fable of the monkey and the crocodile with thousands of vibrant dots. What do all these rainbow dots represent?',
    clues: [
      {
        id: 1,
        stage: 'Visual Inspection',
        headline: 'Constellations of Multicolored Dots',
        text: 'Look closely at the crocodile’s snout and belly. Every scale is a cluster of tiny, joyful dots in yellow, magenta, turquoise, and lime green!',
        hint: 'Bhuri Bai invented this unique polychromatic dotting technique as her personal signature.',
        lensTarget: { x: 50, y: 55, zoom: 2.6, note: 'Thousands of vibrant rainbow dots defining the crocodile scales!' }
      },
      {
        id: 2,
        stage: 'Material & Technique',
        headline: 'From Construction Bricks to the Canvas',
        text: 'Bhuri Bai was working as a manual laborer carrying bricks on a building site when curator J. Swaminathan discovered her talent and handed her paints!',
        hint: 'She had never held a store paintbrush before, but within hours she painted with breathtaking instinctive mastery.',
        lensTarget: { x: 40, y: 35, zoom: 2.4, note: 'The clever monkey riding atop the crocodile’s back.' }
      },
      {
        id: 3,
        stage: 'Narrative Philosophy',
        headline: 'Ritual to Authorship',
        text: 'Why is this painting in Room 2 (From Ritual to Authorship)?',
        hint: 'Traditional tribal art was anonymous. Bhuri Bai turned ancestral folklore into an internationally celebrated personal artistic identity, winning the Padma Shri!',
        lensTarget: { x: 75, y: 50, zoom: 2.2, note: 'Swimming fish and river reeds framing the moral fable.' }
      }
    ],
    suspects: [
      {
        id: 'suspect-sprinkles',
        name: 'The Baker’s Apprentice',
        role: 'Pastry Chef',
        avatar: '🧁',
        alibi: '"I accidentally dropped a jar of rainbow cake sprinkles onto the canvas!"',
        statement: 'He claims the dots are just sugary doughnut sprinkles.',
        isGuilty: false,
        motiveRevealed: 'Nonsense! Bhuri Bai painted every single dot by hand with rhythmic precision.'
      },
      {
        id: 'suspect-bhuri-bai',
        name: 'Bhuri Bai’s Visionary Voice',
        role: 'Pioneering Bhil Artist & Padma Shri Laureate',
        avatar: '🦚',
        alibi: '"I turned the memory of our tribal mud walls into a celebration of color so the whole world could hear our songs!"',
        statement: 'Bhuri Bai used her signature rainbow dots to pioneer modern Bhil fine art and give voice to tribal women.',
        isGuilty: true,
        motiveRevealed: 'BINGO! Bhuri Bai invented this dotting system, becoming one of India’s most famous modern masters!'
      },
      {
        id: 'suspect-crocodile',
        name: 'Barnaby & The Crafty Crocodile',
        role: 'River Resident',
        avatar: '🐊',
        alibi: '"I just wanted to invite the monkey over for afternoon tea!"',
        statement: 'The crocodile claims he wasn’t going to steal the monkey’s heart.',
        isGuilty: false,
        motiveRevealed: 'The clever monkey tricked the crocodile into taking him back to the berry tree!'
      }
    ],
    correctSuspectId: 'suspect-bhuri-bai',
    solutionExplanation:
      'Case Solved! You uncovered the magic of Room 2 (From Ritual to Authorship)! Bhuri Bai, once a construction worker, became a national hero by translating ancestral Bhil rituals into radiant modern painting. Each rainbow dot is a celebration of life, nature, and female creative power!',
    artAppreciationLesson:
      'Art appreciation tip: True artistic genius can emerge from anywhere. Look at how an artist invents their own visual language to share their cultural heritage with the world.',
    badgeTitle: 'Rainbow Dot Investigator',
    badgeIcon: '🐊'
  },
  {
    id: 'case-04',
    caseNumber: 'CASE #104',
    title: 'The Mystery of the Suspended Aviator Goggles',
    roomId: 4,
    roomName: 'Image, Memory & Identity',
    artworkId: 'art-12',
    artworkTitle: 'State of Being #20 (Aviator Goggles & Webbed Relic)',
    artist: 'Chiharu Shiota',
    year: '2012',
    imageUrl: chiharuShiotaStateImg,
    teaser: 'Inside a welded black steel cube, vintage pilot goggles hang frozen in mid-air inside a dense web of thread! Whose skies did these goggles see?',
    mysterySynopsis:
      'In Room 4, visitors encounter an authentic sculpture by world-renowned artist Chiharu Shiota: State of Being #20. A welded steel cube encloses thousands of dense, hand-woven black and red threads. Floating motionless in the very center is an antique pair of aviator flight goggles! Why did Shiota trap this vintage object in a thread cocoon?',
    clues: [
      {
        id: 1,
        stage: 'Visual Inspection',
        headline: 'The Dimensional Web Cocoon',
        text: 'Look inside the steel cube. The threads form an intricate three-dimensional maze, criss-crossing from every steel edge.',
        hint: 'In Japanese thought, thread evokes blood vessels, neural synapses in the brain, and the invisible red string of fate.',
        lensTarget: { x: 50, y: 50, zoom: 2.6, note: 'Vintage aviator goggles floating in the center of the web.' }
      },
      {
        id: 2,
        stage: 'Material & Technique',
        headline: 'Authentic Relics of Human Experience',
        text: 'The goggles are real—scuffed leather, scratched glass, worn metal buckles. Someone actually flew airplanes wearing these!',
        hint: 'Shiota collects everyday items that hold the imprint of human presence, even after the person has departed.',
        lensTarget: { x: 52, y: 48, zoom: 3.0, note: 'The worn leather frame and glass lenses of the aviator goggles.' }
      },
      {
        id: 3,
        stage: 'Narrative Philosophy',
        headline: 'Existence in Absence',
        text: 'There is no human body or pilot figure inside the cube. How does the sculpture tell a story about a human being?',
        hint: 'This concept is called "Existence in Absence"—the memory of the human pilot is preserved by the empty object they left behind.',
        lensTarget: { x: 45, y: 35, zoom: 2.2, note: 'Dense thread network symbolizing time and memories.' }
      }
    ],
    suspects: [
      {
        id: 'suspect-spider',
        name: 'The Giant Clockwork Spider',
        role: 'Mechanical Insect',
        avatar: '🕷️',
        alibi: '"I was spinning my web and an airplane flew right through it!"',
        statement: 'Claims that a spider caught the goggles like a fly.',
        isGuilty: false,
        motiveRevealed: 'Incorrect! Chiharu Shiota wove every knot by hand with profound philosophical intent.'
      },
      {
        id: 'suspect-memory-archive',
        name: 'Chiharu Shiota’s Memory Capsule',
        role: 'Global Installation Artist',
        avatar: '🗝️',
        alibi: '"I trap the invisible feeling of human existence inside webs of thread so time can never erase it."',
        statement: 'The aviator goggles evoke vision, dreaming, and the absent human who once looked at the clouds through them.',
        isGuilty: true,
        motiveRevealed: 'EXACTLY RIGHT! The sculpture is an emotional monument to human memory and flight.'
      },
      {
        id: 'suspect-pilot',
        name: 'Barnaby the Aviator Cat',
        role: 'Feline Pilot',
        avatar: '🐱',
        alibi: '"Meow! I lost my pilot goggles during a loop-de-loop over Paris!"',
        statement: 'Barnaby claims he was doing aerial acrobatics.',
        isGuilty: false,
        motiveRevealed: 'Barnaby is cute, but these goggles belong to 20th-century aviation history.'
      }
    ],
    correctSuspectId: 'suspect-memory-archive',
    solutionExplanation:
      'Case Solved! You unlocked the emotional depth of Chiharu Shiota’s State of Being #20! In Room 4 (Image, Memory & Identity), art doesn’t need to paint a picture of a face to tell a story about a person. By suspending a real relic inside a taut universe of thread, Shiota preserves the soul and memories of someone who once flew through the skies!',
    artAppreciationLesson:
      'Art appreciation tip: Contemporary sculpture can freeze time. An everyday object left behind by a person can hold more emotion and mystery than an entire history book!',
    badgeTitle: 'Memory Relic Detective',
    badgeIcon: '🗝️'
  },
  {
    id: 'case-05',
    caseNumber: 'CASE #105',
    title: 'The Secret of the Digital Loom Mural',
    roomId: 5,
    roomName: 'Algorithmic Narrative',
    artworkId: 'art-13',
    artworkTitle: 'Art For Walls In Public Spaces #22',
    artist: 'Anna Lucia',
    year: '2022',
    imageUrl: annaLuciaPublicSpacesImg,
    teaser: 'Monumental geometric shapes, vibrant architectural colors, and intricate textile patterns! But no human hand painted this wall—it was born from code in 0.2 seconds!',
    mysterySynopsis:
      'In Room 5, visitors are transfixed by Anna Lucia’s Art For Walls In Public Spaces #22, minted on the decentralized art platform fxhash. It looks like a masterfully woven Dutch tapestry or a futuristic architectural mural. But there is no wool, thread, or paint listed—only lines of JavaScript code! How can computer code weave a work of art?',
    clues: [
      {
        id: 1,
        stage: 'Visual Inspection',
        headline: 'Textile-Inspired Geometric Harmonies',
        text: 'Look at the interlocking rectangular blocks, stripes, and subtle cross-hatching. It mirrors centuries of Dutch textile weaving traditions!',
        hint: 'Anna Lucia studied traditional needlework and weaving drafts, then translated those craft techniques into mathematical rules.',
        lensTarget: { x: 50, y: 50, zoom: 2.2, note: 'Geometric blocks and color gradients constructed by code.' }
      },
      {
        id: 2,
        stage: 'Material & Technique',
        headline: 'Deterministic Algorithmic Seeds',
        text: 'The entire artwork is generated by a computer algorithm reading a cryptographic transaction hash on the blockchain.',
        hint: 'If you change a single digit in the seed code, the algorithm recalculates every coordinate, producing an entirely unique sister mural!',
        lensTarget: { x: 35, y: 40, zoom: 2.5, note: 'Parametric color palette and mathematical proportions.' }
      },
      {
        id: 3,
        stage: 'Narrative Philosophy',
        headline: 'The Artist as Rule Composer',
        text: 'Did the computer create the art by itself? Or is the programmer the true artist?',
        hint: 'In algorithmic narrative, the artist acts like a composer who writes the sheet music; the computer is the musician that plays the song.',
        lensTarget: { x: 65, y: 60, zoom: 2.0, note: 'Balanced visual rhythm connecting digital algorithms with human public spaces.' }
      }
    ],
    suspects: [
      {
        id: 'suspect-glitch',
        name: 'The Spilled Milk Computer Bug',
        role: 'Hardware Glitch',
        avatar: '💥',
        alibi: '"I pressed random keys on the keyboard and colorful squares appeared!"',
        statement: 'Claims that accidental chaos generated the mural.',
        isGuilty: false,
        motiveRevealed: 'Incorrect! The artwork follows rigorous mathematical rules of harmony and composition.'
      },
      {
        id: 'suspect-anna-lucia',
        name: 'Anna Lucia’s Algorithmic Architecture',
        role: 'Generative Artist & Software Engineer',
        avatar: '✨',
        alibi: '"I wrote code that acts like an invisible digital loom, weaving centuries of textile heritage into computational space!"',
        statement: 'Anna Lucia bridges historical craftsmanship with decentralized code, designing algorithms that create beauty in public spaces.',
        isGuilty: true,
        motiveRevealed: 'BRILLIANT! Anna Lucia created the generative system, turning software into modern textile art!'
      },
      {
        id: 'suspect-fox',
        name: 'Byte the Glitch Fox',
        role: 'Gallery Code Mascot',
        avatar: '🦊',
        alibi: '"I was just playing with the seed numbers to see what pretty colors would pop out!"',
        statement: 'Byte loves running code algorithms and seeing new patterns.',
        isGuilty: false,
        motiveRevealed: 'Byte is the curious mascot, but Anna Lucia is the master artist.'
      }
    ],
    correctSuspectId: 'suspect-anna-lucia',
    solutionExplanation:
      'Case Solved! You solved the mystery of the algorithmic tapestry! In Room 5 (Algorithmic Narrative), Anna Lucia proves that computer programming is an art form. By combining ancient Dutch textile weaving concepts with modern algorithms, she creates digital art that feels warm, human, and monumental!',
    artAppreciationLesson:
      'Art appreciation tip: Code is a modern paintbrush! Algorithms allow artists to create living systems that can generate thousands of unique, harmonious artworks.',
    badgeTitle: 'Algorithmic Mural Sleuth',
    badgeIcon: '✨'
  }
];

export const SCAVENGER_ITEMS: ScavengerItem[] = [
  {
    id: 'scav-01',
    name: 'The Warli Steam Locomotive',
    roomId: 1,
    roomName: 'Origins of Narrative',
    artworkTitle: 'Train by Jivya Soma Mashe',
    icon: '🚂',
    clueRiddle: 'I puff white smoke across the red earthen village, snaking past cattle and two-triangle dancers!',
    funFact: 'Jivya Soma Mashe was awarded the Padma Shri for bringing Warli art to world museums like the Centre Pompidou.'
  },
  {
    id: 'scav-02',
    name: 'The Rampaging Black Bull',
    roomId: 1,
    roomName: 'Origins of Narrative',
    artworkTitle: 'The Miracle of Daniel Saved from a Bull',
    icon: '🐂',
    clueRiddle: 'Fierce black horns and pounding hooves! Daniel called for heaven’s help and I veered away in the pasture!',
    funFact: 'Mexican ex-votos were painted on recycled tin roofing sheets (láminas) to thank saints for miraculous rescues.'
  },
  {
    id: 'scav-03',
    name: 'The Tiger Shrine (Waghoba)',
    roomId: 1,
    roomName: 'Origins of Narrative',
    artworkTitle: 'Tiger Shrine by Balu Mashe',
    icon: '🐅',
    clueRiddle: 'In the sacred forest clearing, villagers gather around my golden shrine to ask for forest peace!',
    funFact: 'Warli villagers worshipped Waghoba the tiger so predators would protect the village cattle.'
  },
  {
    id: 'scav-04',
    name: 'The Rainbow-Dotted Crocodile',
    roomId: 2,
    roomName: 'From Ritual to Authorship',
    artworkTitle: 'The Monkey and the Crocodile by Bhuri Bai',
    icon: '🐊',
    clueRiddle: 'My scales are covered with thousands of cheerful rainbow dots as I carry a clever monkey through the river!',
    funFact: 'Bhuri Bai was the first Bhil woman to paint on paper and won the prestigious Padma Shri award.'
  },
  {
    id: 'scav-05',
    name: 'The Storm River Basket',
    roomId: 2,
    roomName: 'From Ritual to Authorship',
    artworkTitle: 'Vasudev Carrying Baby Krishna by Bhajju Shyam',
    icon: '🧺',
    clueRiddle: 'Vasudev holds me high on his head while wading across the Yamuna river waves at midnight!',
    funFact: 'Bhajju Shyam illustrated "The London Jungle Book", turning London buses into friendly chameleons.'
  },
  {
    id: 'scav-06',
    name: 'The Sacred Banyan Animals',
    roomId: 2,
    roomName: 'From Ritual to Authorship',
    artworkTitle: 'Tree of Life by Durga Bai Vyam',
    icon: '🌳',
    clueRiddle: 'We nest in lyrical curling branches while villagers gather below for harvest ceremonies!',
    funFact: 'Durga Bai Vyam co-created the graphic novel "Bhimayana" using traditional Gond visual storytelling.'
  },
  {
    id: 'scav-07',
    name: 'Computer-Colored Comic Frames',
    roomId: 3,
    roomName: 'Industrialized Narrative',
    artworkTitle: 'Sequential Color Master Proof by Steve Oliff',
    icon: '⚡',
    clueRiddle: 'Look for glowing neon gradients and cinematic lighting on Bristol comic board!',
    funFact: 'Steve Oliff pioneered the first computerized color separation in comic book history for Akira!'
  },
  {
    id: 'scav-08',
    name: 'The Suspended Aviator Goggles',
    roomId: 4,
    roomName: 'Image, Memory & Identity',
    artworkTitle: 'State of Being #20 by Chiharu Shiota',
    icon: '🥽',
    clueRiddle: 'I hang motionless inside a welded steel cube, caught in a dense spiderweb of black and red yarn!',
    funFact: 'Chiharu Shiota suspended 50,000 keys from red yarn inside a palace for the Venice Biennale.'
  },
  {
    id: 'scav-09',
    name: 'The Algorithmic Tapestry Seed',
    roomId: 5,
    roomName: 'Algorithmic Narrative',
    artworkTitle: 'Art For Walls In Public Spaces #22 by Anna Lucia',
    icon: '✨',
    clueRiddle: 'I look like a woven Dutch rug on a monumental wall, but I was compiled in 0.2 seconds by code!',
    funFact: 'Anna Lucia’s generative artworks are minted with unique digital seeds on the Tezos blockchain via fxhash.'
  }
];
