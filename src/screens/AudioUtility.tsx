import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  Slider,
  Paper,
} from '@mui/material';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';

const TOOL_COLOR = '#14b8a6';

type AudioMode = 'trim-silence' | 'normalize' | 'convert' | 'split' | 'batch-export';

const MODES = [
  { id: 'trim-silence' as const, label: 'Trim Silence' },
  { id: 'normalize' as const, label: 'Normalize Loudness' },
  { id: 'convert' as const, label: 'Convert Format' },
  { id: 'split' as const, label: 'Split by Marker' },
  { id: 'batch-export' as const, label: 'Batch Export' },
];

const FORMATS = [
  { id: 'mp3', label: 'MP3' },
  { id: 'wav', label: 'WAV' },
  { id: 'aac', label: 'AAC' },
  { id: 'flac', label: 'FLAC' },
  { id: 'ogg', label: 'OGG' },
];

function generateCommand(
  mode: AudioMode,
  input: string,
  output: string,
  opts: {
    lufs: number;
    truePeak: number;
    format: string;
    threshold: number;
    batch: boolean;
  },
): string {
  const name = input.replace(/\.[^.]+$/, '');

  switch (mode) {
    case 'trim-silence':
      return opts.batch
        ? `for f in *.wav; do ffmpeg -i "$f" -af "silenceremove=start_periods=1:start_threshold=${opts.threshold}dB:stop_periods=1:stop_threshold=${opts.threshold}dB" "trimmed_$f"; done`
        : `ffmpeg -i "${input}" -af "silenceremove=start_periods=1:start_threshold=${opts.threshold}dB:stop_periods=1:stop_threshold=${opts.threshold}dB" "${output || `${name}_trimmed.wav`}"`;

    case 'normalize': {
      const pass1 = `ffmpeg -i "${input}" -af "loudnorm=I=${opts.lufs}:TP=${opts.truePeak}:print_format=json" -f null -`;
      const pass2 = `ffmpeg -i "${input}" -af "loudnorm=I=${opts.lufs}:TP=${opts.truePeak}:linear=true" "${output || `${name}_normalized.wav`}"`;
      return opts.batch
        ? `# Two-pass normalization (batch)\nfor f in *.wav; do\n  ffmpeg -i "$f" -af "loudnorm=I=${opts.lufs}:TP=${opts.truePeak}:linear=true" "normalized_$f"\ndone`
        : `# Pass 1: Measure\n${pass1}\n\n# Pass 2: Apply\n${pass2}`;
    }

    case 'convert': {
      const codecMap: Record<string, string> = {
        mp3: '-c:a libmp3lame -q:a 2',
        wav: '-c:a pcm_s16le',
        aac: '-c:a aac -b:a 192k',
        flac: '-c:a flac',
        ogg: '-c:a libvorbis -q:a 6',
      };
      const codec = codecMap[opts.format] || codecMap.mp3;
      return opts.batch
        ? `for f in *.wav; do ffmpeg -i "$f" ${codec} "\${f%.wav}.${opts.format}"; done`
        : `ffmpeg -i "${input}" ${codec} "${name}.${opts.format}"`;
    }

    case 'split':
      return `# Split audio at silence points (auto-detect chapters/markers)\nffmpeg -i "${input}" -f segment -segment_time 0 -c copy -reset_timestamps 1 "${name}_%03d.wav"\n\n# Alternative: split at fixed intervals (e.g., 30 seconds)\nffmpeg -i "${input}" -f segment -segment_time 30 -c copy "${name}_%03d.wav"`;

    case 'batch-export': {
      const codecMap: Record<string, string> = {
        mp3: '-c:a libmp3lame -q:a 2',
        wav: '-c:a pcm_s16le',
        aac: '-c:a aac -b:a 192k',
        flac: '-c:a flac',
        ogg: '-c:a libvorbis -q:a 6',
      };
      const codec = codecMap[opts.format] || codecMap.mp3;
      return `# Export all audio files in directory to ${opts.format.toUpperCase()}\nmkdir -p output\nfor f in *.wav *.mp3 *.flac *.aac *.ogg; do\n  [ -f "$f" ] && ffmpeg -i "$f" ${codec} -af "loudnorm=I=${opts.lufs}:TP=${opts.truePeak}" "output/\${f%.*}.${opts.format}"\ndone`;
    }
  }
}

export function AudioUtility() {
  const [mode, setMode] = useState<AudioMode>('trim-silence');
  const [inputPath, setInputPath] = useState('input.wav');
  const [outputPath, setOutputPath] = useState('');
  const [lufs, setLufs] = useState(-16);
  const [truePeak, setTruePeak] = useState(-1.5);
  const [format, setFormat] = useState('mp3');
  const [threshold, setThreshold] = useState(-40);
  const [batch, setBatch] = useState(false);

  const command = generateCommand(mode, inputPath, outputPath, {
    lufs,
    truePeak,
    format,
    threshold,
    batch,
  });

  return (
    <ToolPageLayout
      title="Audio Utility"
      description="Generate ffmpeg audio commands: trim silence, normalize loudness, convert format, batch export."
    >
      {/* Mode selector */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Mode
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={MODES}
          selected={mode}
          onSelect={setMode}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Input/Output paths */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Input file"
          value={inputPath}
          onChange={(e) => setInputPath(e.target.value)}
          size="small"
          fullWidth
          slotProps={{
            inputLabel: { sx: { color: tokens.colors.text.muted } },
            input: { sx: { fontFamily: 'monospace', fontSize: '0.875rem' } },
          }}
        />
        {mode !== 'batch-export' && mode !== 'split' && (
          <TextField
            label="Output file (optional)"
            value={outputPath}
            onChange={(e) => setOutputPath(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              inputLabel: { sx: { color: tokens.colors.text.muted } },
              input: { sx: { fontFamily: 'monospace', fontSize: '0.875rem' } },
            }}
          />
        )}
      </Stack>

      {/* Mode-specific controls */}
      {mode === 'trim-silence' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>
            Silence threshold ({threshold} dB)
          </Typography>
          <Box sx={{ px: 1, maxWidth: 400 }}>
            <Slider
              value={threshold}
              onChange={(_, val) => setThreshold(val as number)}
              min={-60}
              max={-20}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: TOOL_COLOR }}
            />
          </Box>
        </Box>
      )}

      {(mode === 'normalize' || mode === 'batch-export') && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>
            Target loudness ({lufs} LUFS)
          </Typography>
          <Box sx={{ px: 1, maxWidth: 400 }}>
            <Slider
              value={lufs}
              onChange={(_, val) => setLufs(val as number)}
              min={-24}
              max={-14}
              step={0.5}
              valueLabelDisplay="auto"
              sx={{ color: TOOL_COLOR }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5, mt: 2 }}>
            True peak ({truePeak} dB)
          </Typography>
          <Box sx={{ px: 1, maxWidth: 400 }}>
            <Slider
              value={truePeak}
              onChange={(_, val) => setTruePeak(val as number)}
              min={-3}
              max={-1}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ color: TOOL_COLOR }}
            />
          </Box>
        </Box>
      )}

      {(mode === 'convert' || mode === 'batch-export') && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>
            Output format
          </Typography>
          <ChipSelector
            items={FORMATS}
            selected={format}
            onSelect={setFormat}
            accentColor={TOOL_COLOR}
          />
        </Box>
      )}

      {/* Batch mode toggle */}
      {mode !== 'batch-export' && mode !== 'split' && (
        <FormControlLabel
          control={
            <Switch
              checked={batch}
              onChange={(_, checked) => setBatch(checked)}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: TOOL_COLOR } }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
              Batch mode (process entire directory)
            </Typography>
          }
          sx={{ mb: 3 }}
        />
      )}

      {/* Info cards */}
      {mode === 'normalize' && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.elevated, borderLeft: `3px solid ${TOOL_COLOR}` }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
            <strong>LUFS</strong> (Loudness Units relative to Full Scale) measures perceived loudness.
            Streaming platforms target -14 LUFS (Spotify/YouTube) to -16 LUFS (Apple Music).
            <strong> True Peak</strong> is the absolute max sample level -- keep at -1 dB or lower to prevent clipping.
          </Typography>
        </Paper>
      )}

      {/* Generated command */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Command
      </Typography>
      <CommandOutput content={command} accentColor={TOOL_COLOR} />

      <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 3 }}>
        Requires ffmpeg installed locally. On macOS: brew install ffmpeg
      </Typography>
    </ToolPageLayout>
  );
}
