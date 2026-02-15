import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { tokens } from '../../theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" sx={{ color: tokens.colors.text.muted }} />}
      sx={{ mb: 2 }}
    >
      <Link
        component={RouterLink}
        to="/"
        sx={{
          color: tokens.colors.text.secondary,
          textDecoration: 'none',
          '&:hover': { color: tokens.colors.text.primary },
        }}
      >
        Home
      </Link>
      <Link
        component={RouterLink}
        to="/wiki"
        sx={{
          color: tokens.colors.text.secondary,
          textDecoration: 'none',
          '&:hover': { color: tokens.colors.text.primary },
        }}
      >
        Wiki
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={item.label} sx={{ color: tokens.colors.text.primary }}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.href || '/wiki'}
            sx={{
              color: tokens.colors.text.secondary,
              textDecoration: 'none',
              '&:hover': { color: tokens.colors.text.primary },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
