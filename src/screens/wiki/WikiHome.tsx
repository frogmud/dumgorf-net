import { Box, Typography, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CodeIcon from '@mui/icons-material/Code';
import { tokens } from '../../theme';
import { wikiNpcs } from '../../data/wiki/npcs';

const COMPONENTS = [
  {
    name: 'WikiLayout',
    description: 'Two-column layout with sticky sidebar, table of contents, infobox, and responsive collapsible TOC on mobile.',
    usage: '<WikiLayout infobox={...} sections={[...]} breadcrumbs={...} footer={...} accentColor="#f59e0b">',
  },
  {
    name: 'SectionAnchor',
    description: 'Scroll-margin wrapper for wiki sections. Provides smooth scrolling targets for the TOC.',
    usage: '<SectionAnchor id="synopsis">',
  },
  {
    name: 'SectionHeader',
    description: 'Styled h2 with optional accent color bar on the left. Used as section dividers throughout wiki pages.',
    usage: '<SectionHeader title="Synopsis" accentColor="#f59e0b" />',
  },
  {
    name: 'Breadcrumbs',
    description: 'Navigation breadcrumb trail. Last item renders as static text, all others as links.',
    usage: '<Breadcrumbs items={[{ label: "Wiki", href: "/wiki" }, { label: "Page Name" }]} />',
  },
];

export function WikiHome() {
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Build Your Own Wiki
        </Typography>
        <Typography variant="body1" sx={{ color: tokens.colors.text.secondary, maxWidth: 600 }}>
          Reusable wiki-style layout components for building structured content pages with table of contents, infobox sidebars, and cross-linked navigation.
        </Typography>
      </Box>

      {/* Link to real Diepedia */}
      <Paper
        component="a"
        href="https://neverdieguy.com/diepedia"
        target="_blank"
        rel="noopener noreferrer"
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          mb: 6,
          textDecoration: 'none',
          color: 'inherit',
          bgcolor: `${tokens.colors.accent}10`,
          border: `1px solid ${tokens.colors.accent}30`,
          transition: 'all 150ms ease',
          '&:hover': {
            bgcolor: `${tokens.colors.accent}20`,
          },
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ color: tokens.colors.accent, mb: 0.5 }}>
            Diepedia
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
            The official NEVER DIE GUY wiki lives at neverdieguy.com. NPCs, items, domains, and game mechanics.
          </Typography>
        </Box>
        <OpenInNewIcon sx={{ color: tokens.colors.accent, flexShrink: 0, ml: 2 }} />
      </Paper>

      {/* Components section */}
      <Typography variant="h2" sx={{ mb: 3 }}>
        Components
      </Typography>
      <Stack spacing={2} sx={{ mb: 6 }}>
        {COMPONENTS.map((comp) => (
          <Paper key={comp.name} elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CodeIcon sx={{ fontSize: 18, color: tokens.colors.accent }} />
              <Typography variant="h3">{comp.name}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 2 }}>
              {comp.description}
            </Typography>
            <Box
              component="code"
              sx={{
                display: 'block',
                p: 1.5,
                bgcolor: tokens.colors.background.base,
                borderRadius: 1,
                fontSize: '0.8rem',
                fontFamily: 'IBM Plex Mono, monospace',
                color: tokens.colors.text.muted,
                overflowX: 'auto',
              }}
            >
              {comp.usage}
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Live examples */}
      <Typography variant="h2" sx={{ mb: 1 }}>
        Live Examples
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 3 }}>
        These demo pages use the wiki components above to render NPC data.
      </Typography>
      <Stack spacing={1}>
        {wikiNpcs.map((npc) => (
          <Paper
            key={npc.slug}
            component={Link}
            to={`/wiki/npcs/${npc.slug}`}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 150ms ease',
              '&:hover': {
                bgcolor: `${npc.color}10`,
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: `${npc.color}30`,
                border: `2px solid ${npc.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: npc.color }}>
                {npc.name.charAt(0)}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500 }}>{npc.name}</Typography>
              <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
                {npc.title} -- {npc.domain}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
