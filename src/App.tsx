import React, { Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Link, CircularProgress } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { theme, tokens } from './theme';
import { Header } from './components/Header';
import { Home } from './screens/Home';
import { getActiveTools } from './tools/registry';

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
      <CircularProgress size={24} sx={{ color: tokens.colors.text.muted }} />
    </Box>
  );
}

// Cache lazy components so repeated navigations reuse the same wrapper
const lazyCache = new Map<
  () => Promise<{ default: React.ComponentType }>,
  React.LazyExoticComponent<React.ComponentType>
>();

function getLazy(loader: () => Promise<{ default: React.ComponentType }>) {
  let cached = lazyCache.get(loader);
  if (!cached) {
    cached = React.lazy(loader);
    lazyCache.set(loader, cached);
  }
  return cached;
}

function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 3,
        mt: 8,
        borderTop: `1px solid ${tokens.colors.border}`,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
        <Link href="https://kgrz.design" rel="me noopener" target="_blank" underline="hover" sx={{ color: tokens.colors.text.secondary }}>kgrz.design</Link>
        {' / '}
        <Link href="https://kev.studio" rel="me noopener" target="_blank" underline="hover" sx={{ color: tokens.colors.text.secondary }}>kev.studio</Link>
      </Typography>
    </Box>
  );
}

const activeTools = getActiveTools();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              {activeTools.map((tool) => {
                const Component = getLazy(tool.component);
                return (
                  <Route
                    key={tool.id}
                    path={tool.route}
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Component />
                      </Suspense>
                    }
                  />
                );
              })}
            </Routes>
          </Box>
          <SiteFooter />
        </Box>
        <Analytics />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
