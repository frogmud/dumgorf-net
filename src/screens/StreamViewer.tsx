import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';

interface StreamMessage {
  id: number;
  npc: string;
  text: string;
  color: string;
}

const NPC_PROFILES = [
  { id: 'mr-bones', label: 'Mr. Bones', color: '#a0a0a0' },
  { id: 'xtreme', label: 'Xtreme', color: '#ef4444' },
  { id: 'dr-voss', label: 'Dr. Voss', color: '#8b5cf6' },
  { id: 'king-james', label: 'King James', color: '#f59e0b' },
  { id: 'boots', label: 'Boots', color: '#10b981' },
];

const NPC_NAMES: Record<string, string> = {
  'mr-bones': 'Mr. Bones',
  'xtreme': 'Xtreme',
  'dr-voss': 'Dr. Voss',
  'king-james': 'King James',
  'boots': 'Boots',
};

// Sample dialogue pool
const SAMPLE_DIALOGUE: Record<string, string[]> = {
  'Mr. Bones': [
    'The ledger never lies. Unlike you, it has no capacity for self-deception.',
    'Another entry. Another cosmic transaction. The balance sheet of existence grows.',
    'I have counted every grain of stardust in this sector. Twice. For accuracy.',
    'Your performance metrics are... let me consult my records... adequate.',
  ],
  'Xtreme': [
    'LETS GOOOOO! That roll was INSANE!',
    'Bro the ENERGY in here is OFF THE CHARTS right now!',
    'I bet EVERYTHING on the next throw. No regrets. MAXIMUM HYPE.',
    'You call that a meteor? I have seen BIGGER. Way bigger. Trust me.',
  ],
  'Dr. Voss': [
    'The void speaks in frequencies most beings cannot perceive. I have charts.',
    'Fascinating. The entropic decay rate here exceeds my initial projections by 0.003%.',
    'I would not recommend looking directly into the null field. Side effects include... well.',
    'My research suggests this planet has approximately 4.7 minutes of structural integrity remaining.',
  ],
  'King James': [
    'You may approach the throne. Briefly.',
    'I did not ask for your opinion. I rarely do. Proceed with your task.',
    'The null crown weighs nothing and everything simultaneously. You would not understand.',
    'Dismissed. No, wait. State your business first. Then you are dismissed.',
  ],
  'Boots': [
    'I have seen the birth and death of seventeen galaxies today. Boring.',
    '*yawns* Oh, were you doing something? I was contemplating infinity.',
    'The cosmic threads are tangled again. Someone should fix that. Not me, obviously.',
    'I know how this ends. Multiple ways, actually. None of them are interesting.',
  ],
};

const TOOL_COLOR = '#8b5cf6';

export function StreamViewer() {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [activeNpcs, setActiveNpcs] = useState<string[]>(NPC_PROFILES.map((n) => n.id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedChars, setDisplayedChars] = useState<Record<number, number>>({});
  const counterRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleNpc = (id: string) => {
    setActiveNpcs((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  // Generate new messages periodically
  useEffect(() => {
    if (!isPlaying || activeNpcs.length === 0) return;

    const interval = setInterval(() => {
      const npcId = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];
      const npcName = NPC_NAMES[npcId];
      const profile = NPC_PROFILES.find((n) => n.id === npcId);
      const dialoguePool = SAMPLE_DIALOGUE[npcName] || [];
      const text = dialoguePool[Math.floor(Math.random() * dialoguePool.length)];

      if (!profile || !text) return;

      const id = counterRef.current++;
      setMessages((prev) => [...prev.slice(-50), { id, npc: npcName, text, color: profile.color }]);
      setDisplayedChars((prev) => ({ ...prev, [id]: 0 }));
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isPlaying, activeNpcs]);

  // Typewriter effect
  useEffect(() => {
    const incomplete = messages.filter(
      (m) => (displayedChars[m.id] ?? 0) < m.text.length
    );
    if (incomplete.length === 0) return;

    const timer = setInterval(() => {
      setDisplayedChars((prev) => {
        const next = { ...prev };
        for (const msg of incomplete) {
          const current = next[msg.id] ?? 0;
          if (current < msg.text.length) {
            next[msg.id] = current + 1;
          }
        }
        return next;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [messages, displayedChars]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ToolPageLayout
      title="Eternal Stream"
      description="Ambient NPC conversation generator. Pick characters and watch them chat."
    >
      {/* NPC selector */}
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={NPC_PROFILES}
          selected={activeNpcs}
          onSelect={toggleNpc}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Controls */}
      <Button
        variant="outlined"
        startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        onClick={() => setIsPlaying(!isPlaying)}
        sx={{
          mb: 3,
          borderColor: tokens.colors.border,
          color: tokens.colors.text.primary,
        }}
      >
        {isPlaying ? 'Pause' : 'Start Stream'}
      </Button>

      {/* Messages */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          minHeight: 400,
          maxHeight: 600,
          overflowY: 'auto',
          bgcolor: tokens.colors.paper,
        }}
      >
        {messages.length === 0 && (
          <Typography sx={{ color: tokens.colors.text.muted, textAlign: 'center', py: 8 }}>
            Press Start Stream to begin.
          </Typography>
        )}
        {messages.map((msg) => {
          const chars = displayedChars[msg.id] ?? msg.text.length;
          const displayed = msg.text.slice(0, chars);
          const isTyping = chars < msg.text.length;

          return (
            <Box key={msg.id} sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: msg.color,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  mb: 0.25,
                }}
              >
                {msg.npc}
              </Typography>
              <Typography sx={{ color: tokens.colors.text.primary, fontSize: '0.9rem' }}>
                {displayed}
                {isTyping && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 2,
                      height: '1em',
                      bgcolor: msg.color,
                      ml: 0.25,
                      animation: 'blink 1s steps(2) infinite',
                      '@keyframes blink': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0 },
                      },
                    }}
                  />
                )}
              </Typography>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Paper>
    </ToolPageLayout>
  );
}
