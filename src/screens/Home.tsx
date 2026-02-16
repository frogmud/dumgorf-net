import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
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

const CATEGORY_LABELS: Record<string, string> = {
  'game-engine': 'Game Engine',
  media: 'Media',
  'dev-utils': 'Dev Utils',
  meta: 'Meta',
};

const allTools = getAllTools();

export function Home() {
  const navigate = useNavigate();
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

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ bgcolor: 'transparent', border: `1px solid ${tokens.colors.border}` }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  bgcolor: tokens.colors.elevated,
                  color: tokens.colors.text.muted,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `1px solid ${tokens.colors.border}`,
                  width: 48,
                  px: 1.5,
                }}
              />
              <TableCell
                sx={{
                  bgcolor: tokens.colors.elevated,
                  color: tokens.colors.text.muted,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `1px solid ${tokens.colors.border}`,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: tokens.colors.elevated,
                  color: tokens.colors.text.muted,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `1px solid ${tokens.colors.border}`,
                  display: { xs: 'none', sm: 'table-cell' },
                  width: 140,
                }}
              >
                Category
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  bgcolor: tokens.colors.elevated,
                  borderBottom: `1px solid ${tokens.colors.border}`,
                  width: 48,
                  px: 1.5,
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((tool) => {
              const Icon = tool.icon;
              return (
                <TableRow
                  key={tool.id}
                  onClick={() => navigate(tool.route)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: tokens.colors.elevated },
                    '& td': { borderBottom: `1px solid ${tokens.colors.border}` },
                  }}
                >
                  <TableCell sx={{ px: 1.5, py: 2, width: 48 }}>
                    <Icon sx={{ color: tool.color, fontSize: 22 }} />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: tokens.colors.text.primary, fontWeight: 500 }}
                    >
                      {tool.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: tokens.colors.text.muted, fontSize: '0.8rem', mt: 0.25 }}
                    >
                      {tool.description}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: tokens.colors.text.secondary,
                      py: 2,
                      width: 140,
                      display: { xs: 'none', sm: 'table-cell' },
                    }}
                  >
                    {CATEGORY_LABELS[tool.category] || tool.category}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2, width: 48, px: 1.5 }}>
                    <Tooltip
                      title={
                        tool.status === 'stable'
                          ? 'Stable'
                          : tool.status === 'beta'
                            ? 'Beta'
                            : 'Coming Soon'
                      }
                      arrow
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          mx: 'auto',
                          bgcolor:
                            tool.status === 'stable'
                              ? '#10b981'
                              : tool.status === 'beta'
                                ? tokens.colors.accent
                                : tokens.colors.text.muted,
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
