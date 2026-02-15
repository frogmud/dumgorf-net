import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../theme';

export function Header() {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 4 },
        py: 2,
        borderBottom: `1px solid ${tokens.colors.border}`,
        position: 'sticky',
        top: 0,
        bgcolor: tokens.colors.background,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box
        component={Link}
        to="/"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: tokens.colors.accent,
          }}
        >
          dumgorf.net
        </Typography>
      </Box>

    </Box>
  );
}
