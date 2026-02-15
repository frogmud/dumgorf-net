import { useState } from 'react';
import { Box, Paper, Typography, IconButton, Collapse, useMediaQuery, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { tokens } from '../../theme';

interface Section {
  id: string;
  title: string;
}

interface WikiLayoutProps {
  children: React.ReactNode;
  infobox?: React.ReactNode;
  sections?: Section[];
  breadcrumbs?: React.ReactNode;
  footer?: React.ReactNode;
  accentColor?: string;
}

export function WikiLayout({ children, infobox, sections, breadcrumbs, footer, accentColor }: WikiLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tocOpen, setTocOpen] = useState(true);

  const accent = accentColor || tokens.colors.accent;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        flexDirection: { xs: 'column', md: 'row' },
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {breadcrumbs && <Box sx={{ mb: 3 }}>{breadcrumbs}</Box>}

        {/* Inline TOC for mobile */}
        {sections && sections.length > 0 && isMobile && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: tokens.colors.elevated,
              borderTop: `3px solid ${accent}`,
            }}
          >
            <Box
              onClick={() => setTocOpen(!tocOpen)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <Typography variant="overline" sx={{ color: tokens.colors.text.muted }}>
                Contents
              </Typography>
              {tocOpen ? (
                <ExpandLessIcon sx={{ fontSize: 18, color: tokens.colors.text.muted }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 18, color: tokens.colors.text.muted }} />
              )}
            </Box>
            <Collapse in={tocOpen}>
              <Box sx={{ mt: 1 }}>
                {sections.map((section, i) => (
                  <Typography
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      display: 'block',
                      py: 0.5,
                      color: tokens.colors.text.secondary,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      '&:hover': { color: accent },
                      '&::before': {
                        content: `"${i + 1}."`,
                        mr: 1,
                        color: tokens.colors.text.muted,
                      },
                    }}
                  >
                    {section.title}
                  </Typography>
                ))}
              </Box>
            </Collapse>
          </Paper>
        )}

        {children}

        {footer && <Box sx={{ mt: 6 }}>{footer}</Box>}
      </Box>

      {/* Sidebar */}
      {(infobox || sections) && (
        <Box
          sx={{
            width: { xs: '100%', md: 300 },
            flexShrink: 0,
            order: { xs: -1, md: 1 },
          }}
        >
          {infobox && (
            <Paper
              elevation={0}
              sx={{
                mb: 2,
                bgcolor: tokens.colors.elevated,
                overflow: 'hidden',
              }}
            >
              {/* Accent title bar */}
              <Box sx={{ bgcolor: accent, px: 2, py: 1 }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                  Info
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {infobox}
              </Box>
            </Paper>
          )}

          {/* Sticky TOC (desktop) */}
          {sections && sections.length > 0 && !isMobile && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                position: 'sticky',
                top: 80,
                bgcolor: tokens.colors.elevated,
              }}
            >
              <Box
                onClick={() => setTocOpen(!tocOpen)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  mb: tocOpen ? 1 : 0,
                }}
              >
                <Typography variant="overline" sx={{ color: tokens.colors.text.muted }}>
                  On this page
                </Typography>
                <IconButton size="small" sx={{ p: 0 }}>
                  {tocOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 16, color: tokens.colors.text.muted }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 16, color: tokens.colors.text.muted }} />
                  )}
                </IconButton>
              </Box>
              <Collapse in={tocOpen}>
                {sections.map((section) => (
                  <Typography
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      display: 'block',
                      py: 0.5,
                      color: tokens.colors.text.secondary,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      '&:hover': { color: accent },
                    }}
                  >
                    {section.title}
                  </Typography>
                ))}
              </Collapse>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}

export function SectionAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Box id={id} sx={{ scrollMarginTop: 80, mb: 4 }}>
      {children}
    </Box>
  );
}

export function SectionHeader({ title, accentColor }: { title: string; accentColor?: string }) {
  return (
    <Typography
      variant="h2"
      sx={{
        mb: 2,
        pb: 1,
        borderBottom: `1px solid ${tokens.colors.border}`,
        '&::before': accentColor ? {
          content: '""',
          display: 'inline-block',
          width: 4,
          height: '0.8em',
          bgcolor: accentColor,
          mr: 1,
          borderRadius: 1,
          verticalAlign: 'middle',
        } : undefined,
      }}
    >
      {title}
    </Typography>
  );
}
