import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Paper, Button, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';

// Simple seeded RNG (mulberry32)
function seededRng(seed: number) {
  let t = seed + 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

const TOOL_COLOR = '#10b981';

export function RngPlayground() {
  const [seedInput, setSeedInput] = useState('hello-world');
  const [count, setCount] = useState(100);

  const seedNumber = useMemo(() => hashString(seedInput), [seedInput]);

  const values = useMemo(() => {
    const rng = seededRng(seedNumber);
    return Array.from({ length: count }, () => rng());
  }, [seedNumber, count]);

  // Distribution histogram (20 buckets)
  const histogram = useMemo(() => {
    const buckets = new Array(20).fill(0);
    for (const v of values) {
      const idx = Math.min(Math.floor(v * 20), 19);
      buckets[idx]++;
    }
    return buckets;
  }, [values]);

  const maxBucket = Math.max(...histogram);

  return (
    <ToolPageLayout
      title="Seeded RNG"
      description="Deterministic random number generation. Same seed = same results."
    >
      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
          label="Seed"
          size="small"
          sx={{ flex: 1, maxWidth: 300 }}
        />
        <TextField
          value={count}
          onChange={(e) => setCount(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
          label="Count"
          type="number"
          size="small"
          sx={{ width: 100 }}
        />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => setSeedInput(String(Date.now()))}
          sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
        >
          Random
        </Button>
      </Stack>

      {/* Seed info */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: tokens.colors.paper }}>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
          Seed hash: {seedNumber}
        </Typography>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
          First 5 values: {values.slice(0, 5).map((v) => v.toFixed(4)).join(', ')}
        </Typography>
      </Paper>

      {/* Distribution */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: tokens.colors.paper }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Distribution ({count} samples)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 200 }}>
          {histogram.map((bucketCount, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                bgcolor: `${TOOL_COLOR}${Math.round(40 + (bucketCount / maxBucket) * 60).toString(16)}`,
                height: `${(bucketCount / maxBucket) * 100}%`,
                borderRadius: '2px 2px 0 0',
                minHeight: 2,
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.7rem', color: tokens.colors.text.muted }}>0.0</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: tokens.colors.text.muted }}>0.5</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: tokens.colors.text.muted }}>1.0</Typography>
        </Box>
      </Paper>

      {/* Scatter plot */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: tokens.colors.paper }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sequence (first {Math.min(200, values.length)})
        </Typography>
        <Box sx={{ position: 'relative', height: 200, bgcolor: tokens.colors.background, borderRadius: 1, overflow: 'hidden' }}>
          {values.slice(0, 200).map((v, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: `${(i / Math.min(200, values.length)) * 100}%`,
                bottom: `${v * 100}%`,
                width: 3,
                height: 3,
                borderRadius: '50%',
                bgcolor: TOOL_COLOR,
                opacity: 0.6,
              }}
            />
          ))}
        </Box>
      </Paper>
    </ToolPageLayout>
  );
}
