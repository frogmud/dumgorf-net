import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Stack, Chip, Paper } from '@mui/material';
import { tokens } from '../../theme';
import { wikiNpcs } from '../../data/wiki/npcs';
import { WikiLayout, SectionAnchor, SectionHeader } from '../../components/wiki/WikiLayout';
import { Breadcrumbs } from '../../components/wiki/Breadcrumbs';

export function NpcPage() {
  const { slug } = useParams<{ slug: string }>();
  const npc = wikiNpcs.find((n) => n.slug === slug);

  if (!npc) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 8, textAlign: 'center' }}>
        <Typography variant="h2">NPC not found</Typography>
        <Typography
          component={Link}
          to="/wiki"
          sx={{ color: tokens.colors.accent, mt: 2, display: 'block' }}
        >
          Back to wiki
        </Typography>
      </Box>
    );
  }

  const relatedNpcs = npc.relatedSlugs
    .map((s) => wikiNpcs.find((n) => n.slug === s))
    .filter(Boolean);

  const sections = [
    { id: 'synopsis', title: 'Synopsis' },
    { id: 'personality', title: 'Personality' },
    { id: 'backstory', title: 'Backstory' },
    { id: 'abilities', title: 'Abilities' },
    { id: 'moods', title: 'Mood States' },
    { id: 'quotes', title: 'Quotes' },
    { id: 'trivia', title: 'Trivia' },
    ...(relatedNpcs.length > 0 ? [{ id: 'see-also', title: 'See Also' }] : []),
  ];

  const infobox = (
    <Box>
      {/* Portrait placeholder */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1/1',
          bgcolor: `${npc.color}20`,
          borderRadius: 1,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${npc.color}40`,
        }}
      >
        <Typography sx={{ fontSize: '4rem', fontWeight: 700, color: npc.color }}>
          {npc.name.charAt(0)}
        </Typography>
      </Box>

      {/* Info table */}
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          '& td': {
            py: 0.75,
            borderBottom: `1px solid ${tokens.colors.border}`,
            fontSize: '0.85rem',
            verticalAlign: 'top',
          },
          '& td:first-of-type': {
            color: tokens.colors.text.muted,
            pr: 2,
            whiteSpace: 'nowrap',
            fontWeight: 500,
          },
        }}
      >
        <tbody>
          <tr><td>Title</td><td>{npc.title}</td></tr>
          <tr><td>Domain</td><td>{npc.domain}</td></tr>
          <tr><td>Affiliation</td><td>{npc.affiliation}</td></tr>
          <tr><td>Role</td><td>{npc.role}</td></tr>
        </tbody>
      </Box>
    </Box>
  );

  const footer = (
    <Box
      sx={{
        pt: 3,
        borderTop: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
        Home {'>'} Wiki {'>'} NPCs {'>'} {npc.name}
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.colors.text.muted, fontSize: '0.75rem' }}>
        Last edited 2026-02-07
      </Typography>
    </Box>
  );

  return (
    <WikiLayout
      infobox={infobox}
      sections={sections}
      breadcrumbs={
        <Breadcrumbs items={[
          { label: 'NPCs', href: '/wiki' },
          { label: npc.name },
        ]} />
      }
      footer={footer}
      accentColor={npc.color}
    >
      {/* Title */}
      <Typography variant="h1" sx={{ mb: 1 }}>
        {npc.name}
      </Typography>
      <Typography variant="body2" sx={{ color: npc.color, mb: 4 }}>
        {npc.title}
      </Typography>

      {/* Synopsis */}
      <SectionAnchor id="synopsis">
        <SectionHeader title="Synopsis" accentColor={npc.color} />
        <Typography variant="body1">{npc.synopsis}</Typography>
      </SectionAnchor>

      {/* Personality */}
      <SectionAnchor id="personality">
        <SectionHeader title="Personality" accentColor={npc.color} />
        <Typography variant="body1" sx={{ mb: 2 }}>{npc.personality}</Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: `${npc.color}10`, borderLeft: `3px solid ${npc.color}`, borderRadius: '0 4px 4px 0' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: npc.color }}>
            Voice Style
          </Typography>
          <Typography variant="body1">{npc.voiceStyle}</Typography>
        </Paper>
      </SectionAnchor>

      {/* Backstory */}
      <SectionAnchor id="backstory">
        <SectionHeader title="Backstory" accentColor={npc.color} />
        <Typography variant="body1">{npc.backstory}</Typography>
      </SectionAnchor>

      {/* Abilities */}
      <SectionAnchor id="abilities">
        <SectionHeader title="Abilities" accentColor={npc.color} />
        <Box component="ul" sx={{ pl: 3, m: 0 }}>
          {npc.abilities.map((ability, i) => (
            <Box component="li" key={i} sx={{ mb: 1 }}>
              <Typography variant="body1">{ability}</Typography>
            </Box>
          ))}
        </Box>
      </SectionAnchor>

      {/* Mood States */}
      <SectionAnchor id="moods">
        <SectionHeader title="Mood States" accentColor={npc.color} />
        <Stack spacing={1.5}>
          {npc.moods.map((mood) => (
            <Box key={mood.name}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: mood.name.startsWith('Rare') || mood.name === 'Existential' || mood.name === 'Afraid' || mood.name === 'Contemplative' || mood.name === 'Impressed' || mood.name === 'Engaged'
                    ? npc.color
                    : tokens.colors.text.primary,
                  fontSize: '0.9rem',
                }}
              >
                {mood.name}
              </Typography>
              <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
                {mood.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </SectionAnchor>

      {/* Quotes */}
      <SectionAnchor id="quotes">
        <SectionHeader title="Quotes" accentColor={npc.color} />
        {npc.quotes.map((quote, i) => (
          <Box
            key={i}
            sx={{
              borderLeft: `3px solid ${npc.color}`,
              pl: 2,
              py: 1,
              mb: 2,
              bgcolor: `${npc.color}08`,
              borderRadius: '0 4px 4px 0',
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "{quote.text}"
            </Typography>
            {quote.context && (
              <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 0.5 }}>
                -- {quote.context}
              </Typography>
            )}
          </Box>
        ))}
      </SectionAnchor>

      {/* Trivia */}
      <SectionAnchor id="trivia">
        <SectionHeader title="Trivia" accentColor={npc.color} />
        <Box component="ul" sx={{ pl: 3, m: 0 }}>
          {npc.trivia.map((item, i) => (
            <Box component="li" key={i} sx={{ mb: 1 }}>
              <Typography variant="body1">{item}</Typography>
            </Box>
          ))}
        </Box>
      </SectionAnchor>

      {/* See Also */}
      {relatedNpcs.length > 0 && (
        <SectionAnchor id="see-also">
          <SectionHeader title="See Also" accentColor={npc.color} />
          <Stack spacing={1}>
            {relatedNpcs.map((related) => related && (
              <Paper
                key={related.slug}
                component={Link}
                to={`/wiki/npcs/${related.slug}`}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  textDecoration: 'none',
                  color: 'inherit',
                  borderLeft: `3px solid ${related.color}`,
                  transition: 'all 150ms ease',
                  '&:hover': {
                    bgcolor: `${related.color}10`,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: `${related.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: related.color, fontSize: '0.85rem' }}>
                    {related.name.charAt(0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{related.name}</Typography>
                  <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
                    {related.title}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </SectionAnchor>
      )}
    </WikiLayout>
  );
}
