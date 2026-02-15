import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';


const TOOL_COLOR = '#f97316';

interface LootItem {
  name: string;
  weight: number;
  value?: number;
}

interface LootTable {
  id: string;
  label: string;
  items: LootItem[];
}

const PRESETS: LootTable[] = [
  {
    id: 'basic-chest',
    label: 'Basic Chest',
    items: [
      { name: 'Gold Pouch (50g)', weight: 40, value: 50 },
      { name: 'Health Potion', weight: 30, value: 25 },
      { name: 'Iron Sword', weight: 15, value: 100 },
      { name: 'Rare Gem', weight: 10, value: 250 },
      { name: 'Legendary Scroll', weight: 5, value: 1000 },
    ],
  },
  {
    id: 'rare-drop',
    label: 'Rare Drop',
    items: [
      { name: 'Nothing', weight: 60, value: 0 },
      { name: 'Common Material', weight: 20, value: 10 },
      { name: 'Uncommon Material', weight: 12, value: 50 },
      { name: 'Rare Material', weight: 6, value: 200 },
      { name: 'Epic Material', weight: 1.5, value: 800 },
      { name: 'Legendary Material', weight: 0.5, value: 5000 },
    ],
  },
  {
    id: 'boss-loot',
    label: 'Boss Loot',
    items: [
      { name: 'Gold Hoard (500g)', weight: 30, value: 500 },
      { name: 'Boss Armor', weight: 25, value: 400 },
      { name: 'Boss Weapon', weight: 20, value: 600 },
      { name: 'Unique Trinket', weight: 15, value: 1200 },
      { name: 'Mount Scroll', weight: 7, value: 3000 },
      { name: 'World Drop', weight: 3, value: 10000 },
    ],
  },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

function rollTable(table: LootItem[], rng: () => number): LootItem {
  const totalWeight = table.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * totalWeight;
  for (const item of table) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return table[table.length - 1];
}

interface SimResult {
  counts: Map<string, number>;
  totalValue: number;
  minValue: number;
  maxValue: number;
  runs: number;
}

function simulate(table: LootItem[], runs: number, seed?: number): SimResult {
  const rng = seed !== undefined ? seededRandom(seed) : Math.random;
  const counts = new Map<string, number>();
  let totalValue = 0;
  let minValue = Infinity;
  let maxValue = -Infinity;

  for (const item of table) counts.set(item.name, 0);

  for (let i = 0; i < runs; i++) {
    const drop = rollTable(table, rng);
    counts.set(drop.name, (counts.get(drop.name) || 0) + 1);
    const v = drop.value ?? 0;
    totalValue += v;
    if (v < minValue) minValue = v;
    if (v > maxValue) maxValue = v;
  }

  return { counts, totalValue, minValue, maxValue, runs };
}

export function LootTableExplorer() {
  const [selectedPreset, setSelectedPreset] = useState('basic-chest');
  const [runCount, setRunCount] = useState(1000);
  const [seedInput, setSeedInput] = useState('');
  const [result, setResult] = useState<SimResult | null>(null);
  const table = PRESETS.find((p) => p.id === selectedPreset)!;
  const totalWeight = table.items.reduce((s, i) => s + i.weight, 0);

  const ev = useMemo(() => {
    return table.items.reduce((sum, item) => {
      return sum + (item.weight / totalWeight) * (item.value ?? 0);
    }, 0);
  }, [table, totalWeight]);

  const variance = useMemo(() => {
    return table.items.reduce((sum, item) => {
      const prob = item.weight / totalWeight;
      const diff = (item.value ?? 0) - ev;
      return sum + prob * diff * diff;
    }, 0);
  }, [table, totalWeight, ev]);

  const runSim = () => {
    const seed = seedInput.trim() ? parseInt(seedInput, 10) : undefined;
    const r = simulate(table.items, runCount, seed);
    setResult(r);
  };

  // Bad streak probability: P(N consecutive misses of a given item)
  const badStreakItem = table.items[table.items.length - 1]; // rarest item
  const rareProb = badStreakItem.weight / totalWeight;

  const seedLink = seedInput.trim()
    ? `dumgorf.net/loot?seed=${seedInput}&table=${selectedPreset}`
    : '';

  const maxCount = result ? Math.max(...result.counts.values()) : 0;

  return (
    <ToolPageLayout
      title="Loot Tables"
      description="Simulate loot table drops. See EV, variance, bad-streak probability, and seed-specific results."
    >
      {/* Table selector */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Loot Table
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={PRESETS.map((p) => ({ id: p.id, label: p.label }))}
          selected={selectedPreset}
          onSelect={(id) => { setSelectedPreset(id); setResult(null); }}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Table contents */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.paper }}>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 1 }}>
          Items (weight / probability / value)
        </Typography>
        {table.items.map((item) => (
          <Box
            key={item.name}
            sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: `1px solid ${tokens.colors.border}` }}
          >
            <Typography variant="body2">{item.name}</Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted, fontFamily: 'monospace' }}>
              {item.weight}w / {((item.weight / totalWeight) * 100).toFixed(1)}% / {item.value ?? 0}g
            </Typography>
          </Box>
        ))}
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="body2" sx={{ color: TOOL_COLOR }}>
            EV: {ev.toFixed(1)}g | Std Dev: {Math.sqrt(variance).toFixed(1)}g
          </Typography>
        </Box>
      </Paper>

      {/* Simulation controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'flex-start' }}>
        <TextField
          label="Runs"
          value={runCount}
          onChange={(e) => setRunCount(Math.max(1, Math.min(100000, parseInt(e.target.value) || 1)))}
          type="number"
          size="small"
          sx={{ width: 120 }}
        />
        <TextField
          label="Seed (optional)"
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
          size="small"
          sx={{ width: 160 }}
          slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.875rem' } } }}
        />
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={runSim}
          sx={{
            bgcolor: TOOL_COLOR,
            '&:hover': { bgcolor: `${TOOL_COLOR}cc` },
          }}
        >
          Simulate
        </Button>
      </Stack>

      {/* Results */}
      {result && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: tokens.colors.paper }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Results ({result.runs.toLocaleString()} runs)
          </Typography>

          {/* Histogram */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 160, mb: 2 }}>
            {table.items.map((item) => {
              const count = result.counts.get(item.name) || 0;
              return (
                <Box
                  key={item.name}
                  sx={{
                    flex: 1,
                    bgcolor: `${TOOL_COLOR}80`,
                    height: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%',
                    borderRadius: '2px 2px 0 0',
                    minHeight: 2,
                    position: 'relative',
                    '&:hover': {
                      bgcolor: TOOL_COLOR,
                      '& .bar-label': { display: 'block' },
                    },
                  }}
                >
                  <Box
                    className="bar-label"
                    sx={{
                      display: 'none',
                      position: 'absolute',
                      top: -28,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.6rem',
                      color: tokens.colors.text.primary,
                      whiteSpace: 'nowrap',
                      bgcolor: tokens.colors.elevated,
                      px: 0.5,
                      borderRadius: 0.5,
                    }}
                  >
                    {count} ({((count / result.runs) * 100).toFixed(1)}%)
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', gap: '2px' }}>
            {table.items.map((item) => (
              <Typography
                key={item.name}
                sx={{ flex: 1, fontSize: '0.6rem', color: tokens.colors.text.muted, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.name.split(' ')[0]}
              </Typography>
            ))}
          </Box>

          {/* Summary stats */}
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
              Total value: <span style={{ color: TOOL_COLOR }}>{result.totalValue.toLocaleString()}g</span>
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
              Avg per run: <span style={{ color: TOOL_COLOR }}>{(result.totalValue / result.runs).toFixed(1)}g</span>
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
              Min single: <span style={{ color: tokens.colors.text.secondary }}>{result.minValue}g</span>
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
              Max single: <span style={{ color: tokens.colors.text.secondary }}>{result.maxValue.toLocaleString()}g</span>
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Bad streak probability */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.elevated }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Bad Streak: {badStreakItem.name}
        </Typography>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 1 }}>
          Probability of N consecutive misses (drop rate: {(rareProb * 100).toFixed(1)}%)
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 0.5 }}>
          {[5, 10, 20, 50, 100].map((n) => {
            const missProb = Math.pow(1 - rareProb, n);
            return (
              <Typography key={n} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <span style={{ color: tokens.colors.text.muted }}>{n} miss:</span>{' '}
                <span style={{ color: missProb > 0.5 ? tokens.colors.text.secondary : TOOL_COLOR }}>
                  {(missProb * 100).toFixed(2)}%
                </span>
              </Typography>
            );
          })}
        </Box>
      </Paper>

      {/* Seed link */}
      {seedLink && (
        <>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Shareable Seed Link
          </Typography>
          <CommandOutput content={seedLink} accentColor={TOOL_COLOR} />
        </>
      )}
    </ToolPageLayout>
  );
}
