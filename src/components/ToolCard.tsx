import { Paper, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../theme';
import type { ToolStatus } from '../tools/manifest';

interface ToolCardProps {
  title: string;
  description: string;
  route: string;
  color: string;
  icon: React.ReactNode;
  status?: ToolStatus;
}

export function ToolCard({ title, description, route, color, icon, status }: ToolCardProps) {
  return (
    <Paper
      component={Link}
      to={route}
      elevation={0}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        p: 3,
        transition: 'all 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          bgcolor: `${color}10`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="h3">{title}</Typography>
        {status && status !== 'stable' && (
          <Chip
            label={status}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              bgcolor: status === 'beta' ? `${color}20` : tokens.colors.elevated,
              color: status === 'beta' ? color : tokens.colors.text.muted,
              border: `1px solid ${status === 'beta' ? `${color}40` : tokens.colors.border}`,
            }}
          />
        )}
      </Box>
      <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
        {description}
      </Typography>
    </Paper>
  );
}
