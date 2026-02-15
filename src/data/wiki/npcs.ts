export interface WikiNpc {
  slug: string;
  name: string;
  title: string;
  color: string;
  domain: string;
  affiliation: string;
  role: string;
  synopsis: string;
  personality: string;
  voiceStyle: string;
  moods: { name: string; description: string }[];
  backstory: string;
  abilities: string[];
  quotes: { text: string; context?: string }[];
  trivia: string[];
  relatedSlugs: string[];
}

export const wikiNpcs: WikiNpc[] = [
  {
    slug: 'mr-bones',
    name: 'Mr. Bones',
    title: 'Skeletal Banker',
    color: '#a0a0a0',
    domain: 'The Vault',
    affiliation: 'Die-rectors (Finance Division)',
    role: 'Shopkeeper / Banker',
    synopsis: 'Mr. Bones is the financial backbone of the Die-rectors\' operation. A sentient skeleton with an obsessive dedication to ledger keeping, he manages the economy of resurrected planets with meticulous precision.',
    personality: 'Dry wit, ledger-obsessed, methodical. Finds meaning in perfect accounting. Views chaos as a bookkeeping error. Occasionally reveals a deeper philosophical side, pondering the cosmic balance sheet.',
    voiceStyle: 'Clipped, precise sentences. Accounting metaphors. Rarely uses contractions. Occasionally delivers deadpan humor that takes a moment to register.',
    moods: [
      { name: 'Neutral', description: 'Default state. Processing transactions with mechanical efficiency.' },
      { name: 'Calculating', description: 'Deeply focused on a particularly complex ledger entry.' },
      { name: 'Amused', description: 'Something has happened that defies his actuarial tables. Rare smile.' },
      { name: 'Disapproving', description: 'A transaction has been filed incorrectly. This is unacceptable.' },
      { name: 'Existential', description: 'Questioning the meaning of counting when numbers are infinite.' },
    ],
    backstory: 'Before the Die-rectors recruited him, Mr. Bones was the chief accountant of a civilization that measured its wealth in crystallized time. When that civilization collapsed, the only thing that survived was his ledger -- and him. He has been counting ever since, finding comfort in the certainty of numbers amid cosmic chaos.',
    abilities: [
      'Perfect recall of every transaction in history',
      'Can calculate probability distributions instantly',
      'Ledger-based reality manipulation (limited)',
      'Immune to emotional manipulation (already dead)',
    ],
    quotes: [
      { text: 'The ledger never lies. Unlike you, it has no capacity for self-deception.', context: 'Greeting' },
      { text: 'Another cosmic transaction. I shall file it under "improbable but documented."', context: 'Combat reaction' },
      { text: 'Bankruptcy of the soul is not something I can process. Try the void department.', context: 'Idle' },
    ],
    trivia: [
      'Mr. Bones has never miscounted anything. He considers this his greatest achievement and his heaviest burden.',
      'His ledger is rumored to contain an entry for every atom in the universe.',
      'He secretly enjoys jazz, though he claims to find all music "acoustically inefficient."',
      'The bones are not his original body. He upgraded for better posture.',
    ],
    relatedSlugs: ['xtreme', 'king-james'],
  },
  {
    slug: 'xtreme',
    name: 'Xtreme',
    title: 'Hype Engine',
    color: '#ef4444',
    domain: 'The Arena',
    affiliation: 'Die-rectors (Morale Division)',
    role: 'Combat Commentator / Motivator',
    synopsis: 'Xtreme is pure kinetic energy given form. Serving as the Die-rectors\' morale officer, they ensure every meteor throw feels like the most important event in cosmic history.',
    personality: 'Pure energy incarnate. Everything is the most exciting thing that has ever happened. Gambling addict in the cosmic sense -- bets on outcomes of everything from dice rolls to supernova timing.',
    voiceStyle: 'ALL CAPS energy. Short, punchy sentences. Exclamation marks are mandatory. Sports commentary meets energy drink commercial.',
    moods: [
      { name: 'HYPED', description: 'Standard operating mode. Everything is amazing.' },
      { name: 'MEGA HYPED', description: 'Something actually exciting happened. Volume increases 300%.' },
      { name: 'Momentarily calm', description: 'Catching breath between hype cycles. Lasts 2.3 seconds max.' },
      { name: 'ULTRA HYPED', description: 'Transcendent state. Speaking in pure energy patterns.' },
      { name: 'Contemplative', description: 'Rare. Wondering what happens when the hype dies. It does not.' },
    ],
    backstory: 'Xtreme was once the background radiation of a dying universe -- ambient energy with no purpose. When the Die-rectors found them, they offered something irresistible: an audience. Now Xtreme channels that cosmic energy into making every moment feel legendary.',
    abilities: [
      'Infinite enthusiasm generation',
      'Hype field projection (boosts morale in radius)',
      'Cannot be silenced or muted by any known force',
      'Probability manipulation through sheer optimism',
    ],
    quotes: [
      { text: 'LETS GOOOOO! That roll was INSANE!', context: 'Victory' },
      { text: 'I bet EVERYTHING on the next throw. No regrets. MAXIMUM HYPE.', context: 'Combat' },
      { text: 'Even LOSING is EXCITING when you do it with STYLE!', context: 'Defeat' },
    ],
    trivia: [
      'Xtreme has never spoken below 90 decibels.',
      'Their "momentarily calm" mood was only observed once, during a universal heat death. It lasted exactly 2.3 seconds.',
      'They keep a running tally of "sickest moments" across all realities.',
      'Multiple civilizations have tried to harness Xtreme as a power source. All attempts resulted in "too much energy."',
    ],
    relatedSlugs: ['mr-bones', 'boots'],
  },
  {
    slug: 'dr-voss',
    name: 'Dr. Voss',
    title: 'Void Researcher',
    color: '#8b5cf6',
    domain: 'The Lab',
    affiliation: 'Die-rectors (Research Division)',
    role: 'Analyst / Exposition Provider',
    synopsis: 'Dr. Voss studies the space between spaces. Her clinical detachment masks a deep fascination with the mechanisms of destruction and creation that the Die-rectors employ.',
    personality: 'Clinical detachment masking deep fascination. Studies the void the way others study butterflies. Prone to unsettling observations delivered with academic calm.',
    voiceStyle: 'Academic tone. Precise measurements. Casually mentions terrifying phenomena. Uses footnote references in conversation.',
    moods: [
      { name: 'Analytical', description: 'Default. Processing data with cool efficiency.' },
      { name: 'Intrigued', description: 'A new phenomenon has presented itself. Eyes widen 0.3mm.' },
      { name: 'Concerned', description: 'The data suggests something unprecedented. Still calm, but faster speech.' },
      { name: 'Euphoric', description: 'A breakthrough discovery. The closest she comes to emotion.' },
      { name: 'Afraid', description: 'She found something in the void that looked back. Extremely rare.' },
    ],
    backstory: 'Dr. Voss once headed a prestigious research institute studying dark matter. When her experiments accidentally opened a rift to the void, she did not run -- she took notes. The Die-rectors recruited her for her unique ability to remain calm while staring into nothingness.',
    abilities: [
      'Void analysis and measurement',
      'Entropic field calculations',
      'Can perceive dimensions 5 through 11',
      'Complete emotional suppression (self-taught)',
    ],
    quotes: [
      { text: 'The void speaks in frequencies most beings cannot perceive. I have charts.', context: 'Greeting' },
      { text: 'Fascinating. The entropic decay rate exceeds my initial projections by 0.003%.', context: 'Combat' },
      { text: 'I would not recommend looking directly into the null field. Side effects include... well.', context: 'Warning' },
    ],
    trivia: [
      'Dr. Voss has published 847 papers. None have been peer-reviewed because no peers exist in her field.',
      'She keeps a personal void sample in a jar on her desk. It occasionally whispers.',
      'Her real name is classified. Even she does not remember it.',
      'She considers "afraid" to be an unpublished mood state and denies its existence.',
    ],
    relatedSlugs: ['king-james', 'boots'],
  },
  {
    slug: 'king-james',
    name: 'King James',
    title: 'Null Throne Authority',
    color: '#f59e0b',
    domain: 'The Court',
    affiliation: 'Die-rectors (Executive Division)',
    role: 'Authority Figure / Judge',
    synopsis: 'King James sits on a throne of compressed nothing, ruling over everything and nothing with equal disinterest. As the Die-rectors\' senior authority figure, his word is law -- when he bothers to speak.',
    personality: 'Absolute monarch of nothing and everything. Regal to the point of absurdity. Dismissive of lesser beings (everyone). Uses the royal "we" without irony.',
    voiceStyle: 'Royal "we." Commands, not requests. Short declarations. Barely tolerates conversation. Every word sounds like a decree.',
    moods: [
      { name: 'Imperious', description: 'Default. Radiating authority from the null throne.' },
      { name: 'Bored', description: 'The current reality fails to amuse. This is most realities.' },
      { name: 'Mildly interested', description: 'Something has caught his attention. Do not waste this moment.' },
      { name: 'Dismissive', description: 'You have been weighed, measured, and found wanting.' },
      { name: 'Impressed', description: 'Something truly remarkable has occurred. Eyebrow raises 1mm.' },
    ],
    backstory: 'King James was once the ruler of a vast empire that existed in the space between dimensions. When his empire was consumed by the void, he simply declared the void part of his domain. The Die-rectors recognized in him a leader who could not be diminished by any force -- because he refused to acknowledge any force greater than himself.',
    abilities: [
      'Absolute authority projection',
      'Null field generation (makes things stop existing temporarily)',
      'Royal decree enforcement (reality compliance)',
      'Crown of compressed nothing (grants cosmic authority)',
    ],
    quotes: [
      { text: 'You may approach the throne. Briefly.', context: 'Greeting' },
      { text: 'The null crown weighs nothing and everything simultaneously. You would not understand.', context: 'Idle' },
      { text: 'We are not impressed. We are never impressed. Continue.', context: 'Combat' },
    ],
    trivia: [
      'The null throne is visible only to those King James deems worthy. Most people see an empty chair.',
      'He has never asked a question. He only makes statements that others interpret as questions.',
      'His crown is literally made of nothing -- compressed absence given form.',
      'Despite his demeanor, he secretly keeps a log of "subjects who showed promise."',
    ],
    relatedSlugs: ['mr-bones', 'dr-voss'],
  },
  {
    slug: 'boots',
    name: 'Boots',
    title: 'Cosmic Cat',
    color: '#10b981',
    domain: 'Everywhere',
    affiliation: 'Die-rectors (Observation Division)',
    role: 'Oracle / Wildcard',
    synopsis: 'Boots is an omniscient cosmic entity trapped in the form of a cat. They know everything, care about almost nothing, and help only when the mood strikes -- which is rarely.',
    personality: 'Profoundly bored by knowing everything. Laconic. Drops universe-shattering revelations between naps. Helps when it suits them, which follows no discernible pattern.',
    voiceStyle: 'Laconic. Cryptic one-liners. Yawns mid-sentence. Drops universe-shattering facts casually, as if discussing the weather.',
    moods: [
      { name: 'Bored', description: 'Default. Everything is predictable when you know everything.' },
      { name: 'Asleep', description: 'May or may not be listening. Probably is. Does not care.' },
      { name: 'Mildly amused', description: 'Something unexpected happened. A rare treat.' },
      { name: 'Cryptic', description: 'Dispensing wisdom in the most unhelpful way possible.' },
      { name: 'Engaged', description: 'Genuinely interested. The universe should be concerned.' },
    ],
    backstory: 'Boots existed before existence. When the universe began, Boots was already there, having seen it coming. The cat form was chosen for its optimal napping ergonomics. The Die-rectors did not recruit Boots -- Boots allowed them to believe they did.',
    abilities: [
      'Omniscience (finds it tedious)',
      'Temporal perception (sees all timelines simultaneously)',
      'Dimensional phase-shifting (appears wherever needed)',
      'Cosmic indifference field (immune to all external influence)',
    ],
    quotes: [
      { text: 'I have seen the birth and death of seventeen galaxies today. Boring.', context: 'Greeting' },
      { text: '*yawns* Oh, were you doing something? I was contemplating infinity.', context: 'Idle' },
      { text: 'I know how this ends. Multiple ways, actually. None of them are interesting.', context: 'Combat' },
    ],
    trivia: [
      'Boots has never been surprised. They claim this is the worst part of omniscience.',
      'The name "Boots" was self-chosen. The reasoning has never been explained.',
      'Boots can be in multiple locations simultaneously but chooses to be in none of them enthusiastically.',
      'Their "engaged" mood state has been observed exactly three times in recorded history.',
    ],
    relatedSlugs: ['xtreme', 'dr-voss'],
  },
];
