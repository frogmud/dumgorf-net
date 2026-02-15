import { useState } from 'react';
import { Box, Typography, Paper, Stack, Chip, Grid } from '@mui/material';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';

interface NpcProfile {
  id: string;
  name: string;
  title: string;
  color: string;
  domain: string;
  personality: string;
  voiceStyle: string;
  moods: string[];
  quotes: string[];
  traits: string[];
}

const NPCS: NpcProfile[] = [
  {
    id: 'mr-bones',
    name: 'Mr. Bones',
    title: 'Skeletal Banker',
    color: '#a0a0a0',
    domain: 'The Vault',
    personality: 'Dry wit, ledger-obsessed, methodical. Finds meaning in perfect accounting. Views chaos as a bookkeeping error.',
    voiceStyle: 'Clipped, precise sentences. Accounting metaphors. Occasionally deadpan humor.',
    moods: ['Neutral', 'Calculating', 'Amused', 'Disapproving', 'Rare: Existential'],
    quotes: [
      'The ledger never lies. Unlike you, it has no capacity for self-deception.',
      'Another cosmic transaction. I shall file it under "improbable but documented."',
    ],
    traits: ['Meticulous', 'Dry humor', 'Numbers-oriented', 'Secretly philosophical'],
  },
  {
    id: 'xtreme',
    name: 'Xtreme',
    title: 'Hype Engine',
    color: '#ef4444',
    domain: 'The Arena',
    personality: 'Pure energy incarnate. Everything is the most exciting thing that has ever happened. Gambling addict in the cosmic sense.',
    voiceStyle: 'ALL CAPS energy. Short, punchy sentences. Exclamation marks. Sports commentary vibes.',
    moods: ['HYPED', 'MEGA HYPED', 'Momentarily calm', 'ULTRA HYPED', 'Rare: Contemplative'],
    quotes: [
      'LETS GOOOOO! That roll was INSANE!',
      'I bet EVERYTHING on the next throw. No regrets. MAXIMUM HYPE.',
    ],
    traits: ['Energetic', 'Impulsive', 'Encouraging', 'Never gives up'],
  },
  {
    id: 'dr-voss',
    name: 'Dr. Voss',
    title: 'Void Researcher',
    color: '#8b5cf6',
    domain: 'The Lab',
    personality: 'Clinical detachment masking deep fascination. Studies the void the way others study butterflies. Prone to unsettling observations.',
    voiceStyle: 'Academic tone. Precise measurements. Casual about terrifying phenomena.',
    moods: ['Analytical', 'Intrigued', 'Concerned', 'Euphoric (discovery)', 'Rare: Afraid'],
    quotes: [
      'The void speaks in frequencies most beings cannot perceive. I have charts.',
      'Fascinating. The entropic decay rate here exceeds my initial projections by 0.003%.',
    ],
    traits: ['Intellectual', 'Detached', 'Curious', 'Unsettling calm'],
  },
  {
    id: 'king-james',
    name: 'King James',
    title: 'Null Throne Authority',
    color: '#f59e0b',
    domain: 'The Court',
    personality: 'Absolute monarch of nothing and everything. Regal to the point of absurdity. Dismissive of lesser beings (everyone).',
    voiceStyle: 'Royal "we." Commands, not requests. Short declarations. Barely tolerates conversation.',
    moods: ['Imperious', 'Bored', 'Mildly interested', 'Dismissive', 'Rare: Impressed'],
    quotes: [
      'You may approach the throne. Briefly.',
      'The null crown weighs nothing and everything simultaneously. You would not understand.',
    ],
    traits: ['Authoritative', 'Dismissive', 'Dramatic', 'Secretly lonely'],
  },
  {
    id: 'boots',
    name: 'Boots',
    title: 'Cosmic Cat',
    color: '#10b981',
    domain: 'Everywhere',
    personality: 'Omniscient cosmic entity trapped in cat form. Profoundly bored by knowing everything. Helps when it suits them.',
    voiceStyle: 'Laconic. Cryptic one-liners. Yawns mid-sentence. Drops universe-shattering facts casually.',
    moods: ['Bored', 'Asleep', 'Mildly amused', 'Cryptic', 'Rare: Engaged'],
    quotes: [
      'I have seen the birth and death of seventeen galaxies today. Boring.',
      '*yawns* Oh, were you doing something? I was contemplating infinity.',
    ],
    traits: ['Omniscient', 'Apathetic', 'Cryptic', 'Occasionally helpful'],
  },
];

export function NpcViewer() {
  const [selectedNpc, setSelectedNpc] = useState<string>(NPCS[0].id);

  const npc = NPCS.find((n) => n.id === selectedNpc)!;

  return (
    <ToolPageLayout
      title="NPC Viewer"
      description="Browse the pantheon. See mood states, voice profiles, and behavioral patterns."
      maxWidth={1000}
    >
      {/* NPC selector */}
      <Box sx={{ mb: 4 }}>
        <ChipSelector
          items={NPCS.map((n) => ({ id: n.id, label: n.name, color: n.color }))}
          selected={selectedNpc}
          onSelect={setSelectedNpc}
          accentColor="#f59e0b"
        />
      </Box>

      {/* NPC profile */}
      <Grid container spacing={3}>
        {/* Main content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: tokens.colors.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: `${npc.color}30`,
                  border: `2px solid ${npc.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 700, color: npc.color, fontSize: '1.2rem' }}>
                  {npc.name.charAt(0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h2">{npc.name}</Typography>
                <Typography variant="body2" sx={{ color: npc.color }}>
                  {npc.title}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h3" sx={{ mb: 1, borderBottom: `1px solid ${tokens.colors.border}`, pb: 1 }}>
              Personality
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {npc.personality}
            </Typography>

            <Typography variant="h3" sx={{ mb: 1, borderBottom: `1px solid ${tokens.colors.border}`, pb: 1 }}>
              Voice Style
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {npc.voiceStyle}
            </Typography>

            <Typography variant="h3" sx={{ mb: 1, borderBottom: `1px solid ${tokens.colors.border}`, pb: 1 }}>
              Sample Quotes
            </Typography>
            {npc.quotes.map((quote, i) => (
              <Box
                key={i}
                sx={{
                  borderLeft: `3px solid ${npc.color}`,
                  pl: 2,
                  py: 1,
                  mb: 1.5,
                  bgcolor: `${npc.color}10`,
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{quote}"
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: tokens.colors.elevated }}>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block', mb: 1 }}>
              Domain
            </Typography>
            <Typography variant="body1">{npc.domain}</Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: tokens.colors.elevated }}>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block', mb: 1 }}>
              Mood States
            </Typography>
            <Stack spacing={0.5}>
              {npc.moods.map((mood) => (
                <Typography key={mood} variant="body2" sx={{ color: mood.startsWith('Rare:') ? npc.color : tokens.colors.text.secondary }}>
                  {mood}
                </Typography>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: tokens.colors.elevated }}>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block', mb: 1 }}>
              Traits
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {npc.traits.map((trait) => (
                <Chip
                  key={trait}
                  label={trait}
                  size="small"
                  sx={{
                    bgcolor: `${npc.color}20`,
                    color: npc.color,
                    border: `1px solid ${npc.color}40`,
                    fontSize: '0.7rem',
                    mb: 0.5,
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </ToolPageLayout>
  );
}
