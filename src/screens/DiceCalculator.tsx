import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';

interface RollResult {
  notation: string;
  rolls: number[];
  total: number;
  min: number;
  max: number;
  average: number;
}

function parseDiceNotation(notation: string): { count: number; sides: number; modifier: number } | null {
  const match = notation.trim().match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return {
    count: parseInt(match[1] || '1', 10),
    sides: parseInt(match[2], 10),
    modifier: parseInt(match[3] || '0', 10),
  };
}

function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
}

function calculateDistribution(count: number, sides: number, modifier: number): Map<number, number> {
  const dist = new Map<number, number>();
  const min = count + modifier;
  const max = count * sides + modifier;

  // For small dice, calculate exactly. For large, approximate.
  if (count <= 4 && sides <= 20) {
    const total = Math.pow(sides, count);
    const recurse = (depth: number, sum: number) => {
      if (depth === 0) {
        const val = sum + modifier;
        dist.set(val, (dist.get(val) || 0) + 1 / total);
        return;
      }
      for (let i = 1; i <= sides; i++) {
        recurse(depth - 1, sum + i);
      }
    };
    recurse(count, 0);
  } else {
    // Normal approximation for large dice pools
    const mean = count * (sides + 1) / 2 + modifier;
    const variance = count * (sides * sides - 1) / 12;
    const stddev = Math.sqrt(variance);
    for (let v = min; v <= max; v++) {
      const z = (v - mean) / stddev;
      const prob = Math.exp(-0.5 * z * z) / (stddev * Math.sqrt(2 * Math.PI));
      dist.set(v, prob);
    }
  }

  return dist;
}

const TOOL_COLOR = '#3b82f6';

const PRESETS = [
  { id: '1d20', label: '1d20' },
  { id: '2d6', label: '2d6' },
  { id: '3d8+5', label: '3d8+5' },
  { id: '4d6', label: '4d6' },
  { id: '1d100', label: '1d100' },
  { id: '2d12', label: '2d12' },
];

export function DiceCalculator() {
  const [notation, setNotation] = useState('2d6');
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  const parsed = parseDiceNotation(notation);

  const distribution = useMemo(() => {
    if (!parsed) return null;
    return calculateDistribution(parsed.count, parsed.sides, parsed.modifier);
  }, [parsed]);

  const maxProb = useMemo(() => {
    if (!distribution) return 0;
    let max = 0;
    for (const p of distribution.values()) {
      if (p > max) max = p;
    }
    return max;
  }, [distribution]);

  const handleRoll = () => {
    if (!parsed) return;
    const rolls = rollDice(parsed.count, parsed.sides);
    const total = rolls.reduce((a, b) => a + b, 0) + parsed.modifier;
    setLastRoll({
      notation,
      rolls,
      total,
      min: parsed.count + parsed.modifier,
      max: parsed.count * parsed.sides + parsed.modifier,
      average: parsed.count * (parsed.sides + 1) / 2 + parsed.modifier,
    });
  };

  return (
    <ToolPageLayout
      title="Dice Calculator"
      description="RPG dice probability explorer. Enter notation, see distributions."
    >
      {/* Input */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
        <TextField
          value={notation}
          onChange={(e) => setNotation(e.target.value)}
          label="Dice Notation"
          placeholder="2d6+3"
          size="small"
          error={!parsed && notation.length > 0}
          helperText={!parsed && notation.length > 0 ? 'Invalid notation (e.g., 2d6+3)' : undefined}
          sx={{ flex: 1, maxWidth: 200 }}
        />
        <Box
          component="button"
          onClick={handleRoll}
          disabled={!parsed}
          sx={{
            px: 3,
            py: 1,
            bgcolor: parsed ? TOOL_COLOR : tokens.colors.border,
            color: '#fff',
            border: 'none',
            borderRadius: 1,
            cursor: parsed ? 'pointer' : 'default',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Roll
        </Box>
      </Box>

      {/* Presets */}
      <Box sx={{ mb: 4 }}>
        <ChipSelector
          items={PRESETS}
          selected={notation}
          onSelect={setNotation}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Roll result */}
      {lastRoll && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: tokens.colors.paper }}>
          <Typography variant="h2" sx={{ color: TOOL_COLOR, mb: 1 }}>
            {lastRoll.total}
          </Typography>
          <Typography variant="body2">
            Rolls: [{lastRoll.rolls.join(', ')}]
            {parsed && parsed.modifier !== 0 && ` ${parsed.modifier > 0 ? '+' : ''}${parsed.modifier}`}
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
            Range: {lastRoll.min} - {lastRoll.max} | Average: {lastRoll.average.toFixed(1)}
          </Typography>
        </Paper>
      )}

      {/* Distribution chart */}
      {distribution && parsed && (
        <Paper elevation={0} sx={{ p: 3, bgcolor: tokens.colors.paper }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Probability Distribution
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: 200 }}>
            {Array.from(distribution.entries()).map(([value, prob]) => (
              <Box
                key={value}
                sx={{
                  flex: 1,
                  minWidth: 2,
                  maxWidth: 40,
                  bgcolor: lastRoll?.total === value ? TOOL_COLOR : `${TOOL_COLOR}60`,
                  height: `${(prob / maxProb) * 100}%`,
                  borderRadius: '2px 2px 0 0',
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
                    top: -24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: tokens.colors.text.primary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}: {(prob * 100).toFixed(1)}%
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', color: tokens.colors.text.muted }}>
              {parsed.count + parsed.modifier}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: tokens.colors.text.muted }}>
              {parsed.count * parsed.sides + parsed.modifier}
            </Typography>
          </Box>
        </Paper>
      )}
    </ToolPageLayout>
  );
}
