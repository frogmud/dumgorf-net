import { useState } from 'react';
import { Box, Typography, Grid, Chip, Stack } from '@mui/material';
import { ToolCard } from '../components/ToolCard';
import { tokens } from '../theme';
import { getAllTools } from '../tools/registry';
import type { ToolCategory } from '../tools/manifest';

const CATEGORIES: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'game-engine', label: 'Game Engine' },
  { id: 'media', label: 'Media' },
  { id: 'dev-utils', label: 'Dev Utils' },
  { id: 'meta', label: 'Meta' },
];

const allTools = getAllTools();

export function Home() {
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');

  const filtered = category === 'all'
    ? allTools
    : allTools.filter((t) => t.category === category);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Free Browser Tools
        </Typography>
        <Typography variant="body1" sx={{ color: tokens.colors.text.secondary, maxWidth: 600 }}>
          Design, development, and game engine utilities. No login, no install.
        </Typography>
      </Box>

      {/* Category filter */}
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            size="small"
            onClick={() => setCategory(cat.id)}
            sx={{
              bgcolor: category === cat.id ? `${tokens.colors.accent}30` : 'transparent',
              color: category === cat.id ? tokens.colors.accent : tokens.colors.text.muted,
              border: `1px solid ${category === cat.id ? tokens.colors.accent : tokens.colors.border}`,
              fontWeight: category === cat.id ? 600 : 400,
            }}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={tool.id}>
              <ToolCard
                title={tool.title}
                description={tool.description}
                route={tool.route}
                color={tool.color}
                icon={<Icon />}
                status={tool.status}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
