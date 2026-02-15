import { Box, Typography } from '@mui/material';
import { tokens } from '../theme';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  maxWidth?: number;
  children: React.ReactNode;
}

export function ToolPageLayout({
  title,
  description,
  maxWidth = 800,
  children,
}: ToolPageLayoutProps) {
  return (
    <Box sx={{ maxWidth, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 4 }}>
        {description}
      </Typography>
      {children}
    </Box>
  );
}
