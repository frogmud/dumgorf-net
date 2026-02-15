import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
} from '@mui/material';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';

interface Recipe {
  id: string;
  label: string;
  description: string;
  options?: RecipeOption[];
  generate: (input: string, output: string, opts: Record<string, string | number | boolean>) => string;
  batchGenerate?: (ext: string, opts: Record<string, string | number | boolean>) => string;
}

interface RecipeOption {
  key: string;
  label: string;
  type: 'select' | 'text' | 'slider';
  default: string | number;
  choices?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

const RECIPES: Recipe[] = [
  {
    id: 'avi-to-mp4',
    label: 'AVI to MP4',
    description: 'Convert legacy AVI files to H.264 MP4. Useful for old camcorder footage.',
    generate: (i, o) => `ffmpeg -i "${i}" -c:v libx264 -c:a aac "${o}"`,
    batchGenerate: () => `for f in *.avi; do ffmpeg -i "$f" -c:v libx264 -c:a aac "\${f%.avi}.mp4"; done`,
  },
  {
    id: 'mov-to-mp4',
    label: 'MOV to MP4',
    description: 'Convert iPhone/camera MOV files to web-friendly MP4.',
    generate: (i, o) => `ffmpeg -i "${i}" -c:v libx264 -c:a aac "${o}"`,
    batchGenerate: () => `for f in *.mov; do ffmpeg -i "$f" -c:v libx264 -c:a aac "\${f%.mov}.mp4"; done`,
  },
  {
    id: 'fix-rotation',
    label: 'Fix Rotation',
    description: 'Fix vertical iPhone videos that play sideways. Choose rotation direction.',
    options: [
      {
        key: 'rotation',
        label: 'Rotation',
        type: 'select',
        default: 'auto',
        choices: [
          { value: 'auto', label: 'Auto-detect (copy metadata)' },
          { value: 'cw', label: '90 clockwise' },
          { value: 'ccw', label: '90 counter-clockwise' },
          { value: '180', label: '180 degrees' },
        ],
      },
    ],
    generate: (i, o, opts) => {
      if (opts.rotation === 'auto') return `ffmpeg -i "${i}" -c copy -metadata:s:v rotate=0 "${o}"`;
      const map: Record<string, string> = { cw: 'transpose=1', ccw: 'transpose=2', '180': 'transpose=1,transpose=1' };
      return `ffmpeg -i "${i}" -vf "${map[opts.rotation as string] || 'transpose=1'}" -c:a copy "${o}"`;
    },
  },
  {
    id: 'extract-audio',
    label: 'Extract Audio',
    description: 'Pull the audio track from a video file as WAV or MP3.',
    options: [
      {
        key: 'format',
        label: 'Output format',
        type: 'select',
        default: 'wav',
        choices: [
          { value: 'wav', label: 'WAV (lossless)' },
          { value: 'mp3', label: 'MP3 (compressed)' },
          { value: 'aac', label: 'AAC' },
        ],
      },
    ],
    generate: (i, _o, opts) => {
      const fmt = opts.format as string;
      const name = i.replace(/\.[^.]+$/, '');
      if (fmt === 'wav') return `ffmpeg -i "${i}" -vn -c:a pcm_s16le "${name}.wav"`;
      if (fmt === 'mp3') return `ffmpeg -i "${i}" -vn -c:a libmp3lame -q:a 2 "${name}.mp3"`;
      return `ffmpeg -i "${i}" -vn -c:a aac "${name}.aac"`;
    },
  },
  {
    id: 'clip-segment',
    label: 'Clip Segment',
    description: 'Cut a time range from a video. Uses stream copy for speed (no re-encoding).',
    options: [
      { key: 'start', label: 'Start time (HH:MM:SS)', type: 'text', default: '00:00:00' },
      { key: 'duration', label: 'Duration (HH:MM:SS)', type: 'text', default: '00:00:30' },
    ],
    generate: (i, o, opts) =>
      `ffmpeg -ss ${opts.start} -i "${i}" -t ${opts.duration} -c copy "${o}"`,
  },
  {
    id: 'compress',
    label: 'Compress Video',
    description: 'Reduce file size using CRF (Constant Rate Factor). Higher CRF = smaller file, lower quality.',
    options: [
      { key: 'crf', label: 'CRF (18=high quality, 28=small file)', type: 'slider', default: 23, min: 18, max: 35, step: 1 },
    ],
    generate: (i, o, opts) =>
      `ffmpeg -i "${i}" -c:v libx264 -crf ${opts.crf} -c:a aac "${o}"`,
    batchGenerate: (_ext, opts) =>
      `for f in *.mp4; do ffmpeg -i "$f" -c:v libx264 -crf ${opts.crf} -c:a aac "compressed_$f"; done`,
  },
  {
    id: 'gif',
    label: 'GIF from Video',
    description: 'Extract an animated GIF from a video. Control framerate and width.',
    options: [
      { key: 'fps', label: 'Framerate', type: 'slider', default: 10, min: 5, max: 30, step: 1 },
      { key: 'width', label: 'Width (px)', type: 'slider', default: 480, min: 160, max: 1280, step: 40 },
      { key: 'start', label: 'Start time (HH:MM:SS)', type: 'text', default: '00:00:00' },
      { key: 'duration', label: 'Duration (seconds)', type: 'text', default: '5' },
    ],
    generate: (i, _o, opts) => {
      const name = i.replace(/\.[^.]+$/, '');
      return `ffmpeg -ss ${opts.start} -t ${opts.duration} -i "${i}" -vf "fps=${opts.fps},scale=${opts.width}:-1:flags=lanczos" "${name}.gif"`;
    },
  },
  {
    id: 'thumbnail-grid',
    label: 'Thumbnail Grid',
    description: 'Generate a contact sheet / thumbnail grid from a video.',
    options: [
      { key: 'cols', label: 'Columns', type: 'slider', default: 4, min: 2, max: 8, step: 1 },
      { key: 'rows', label: 'Rows', type: 'slider', default: 4, min: 2, max: 8, step: 1 },
    ],
    generate: (i, _o, opts) => {
      const name = i.replace(/\.[^.]+$/, '');
      const frames = Number(opts.cols) * Number(opts.rows);
      return `ffmpeg -i "${i}" -vf "select='not(mod(n\\,30))',tile=${opts.cols}x${opts.rows}" -frames:v 1 "${name}_grid.png"

# Tip: Adjust mod(n,30) to change frame sampling interval.
# For a 30fps video, mod(n,30) = every 1 second, mod(n,90) = every 3 seconds.
# Total frames needed: ${frames} (${opts.cols} cols x ${opts.rows} rows)`;
    },
  },
  {
    id: 'resize',
    label: 'Resize Video',
    description: 'Scale video to a specific resolution. Maintains aspect ratio with -1.',
    options: [
      {
        key: 'resolution',
        label: 'Target resolution',
        type: 'select',
        default: '1280:-1',
        choices: [
          { value: '1920:-1', label: '1080p (1920w)' },
          { value: '1280:-1', label: '720p (1280w)' },
          { value: '854:-1', label: '480p (854w)' },
          { value: '640:-1', label: '360p (640w)' },
        ],
      },
    ],
    generate: (i, o, opts) =>
      `ffmpeg -i "${i}" -vf "scale=${opts.resolution}" -c:a copy "${o}"`,
  },
];

const TOOL_COLOR = '#06b6d4';

export function FfmpegTool() {
  const [selectedRecipe, setSelectedRecipe] = useState('avi-to-mp4');
  const [inputPath, setInputPath] = useState('input.avi');
  const [outputPath, setOutputPath] = useState('output.mp4');
  const [batchMode, setBatchMode] = useState(false);
  const [options, setOptions] = useState<Record<string, string | number | boolean>>({});

  const recipe = RECIPES.find((r) => r.id === selectedRecipe)!;

  const handleRecipeChange = (id: string) => {
    setSelectedRecipe(id);
    setBatchMode(false);
    const r = RECIPES.find((rec) => rec.id === id)!;
    // Reset options to defaults
    const defaults: Record<string, string | number | boolean> = {};
    for (const opt of r.options || []) {
      defaults[opt.key] = opt.default;
    }
    setOptions(defaults);
    // Update input/output extensions
    if (id === 'avi-to-mp4') { setInputPath('input.avi'); setOutputPath('output.mp4'); }
    else if (id === 'mov-to-mp4') { setInputPath('input.mov'); setOutputPath('output.mp4'); }
    else if (id === 'extract-audio') { setInputPath('input.mp4'); setOutputPath(''); }
    else if (id === 'gif') { setInputPath('input.mp4'); setOutputPath(''); }
    else if (id === 'thumbnail-grid') { setInputPath('input.mp4'); setOutputPath(''); }
    else { setInputPath('input.mp4'); setOutputPath('output.mp4'); }
  };

  const getOptionValue = (key: string, defaultVal: string | number) => {
    return options[key] ?? defaultVal;
  };

  const setOptionValue = (key: string, value: string | number | boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const generatedCommand = batchMode && recipe.batchGenerate
    ? recipe.batchGenerate(inputPath.split('.').pop() || 'mp4', options)
    : recipe.generate(inputPath, outputPath, options);

  // Initialize options for default recipe on first render
  useState(() => {
    const defaults: Record<string, string | number | boolean> = {};
    for (const opt of recipe.options || []) {
      defaults[opt.key] = opt.default;
    }
    setOptions(defaults);
  });

  return (
    <ToolPageLayout
      title="FFmpeg Cookbook"
      description="Pick a recipe, configure options, copy the command. No server needed -- runs in your terminal."
    >
      {/* Recipe selector */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Recipe
      </Typography>
      <Box sx={{ mb: 2 }}>
        <ChipSelector
          items={RECIPES.map((r) => ({ id: r.id, label: r.label }))}
          selected={selectedRecipe}
          onSelect={handleRecipeChange}
          accentColor={TOOL_COLOR}
        />
      </Box>
      <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 3 }}>
        {recipe.description}
      </Typography>

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
        {outputPath !== '' && !['extract-audio', 'gif', 'thumbnail-grid'].includes(selectedRecipe) && (
          <TextField
            label="Output file"
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

      {/* Recipe-specific options */}
      {recipe.options && recipe.options.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {recipe.options.map((opt) => (
            <Box key={opt.key} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>
                {opt.label}
              </Typography>
              {opt.type === 'select' && (
                <ChipSelector
                  items={opt.choices!.map((c) => ({ id: c.value, label: c.label }))}
                  selected={String(getOptionValue(opt.key, opt.default))}
                  onSelect={(val) => setOptionValue(opt.key, val)}
                  accentColor={TOOL_COLOR}
                />
              )}
              {opt.type === 'text' && (
                <TextField
                  value={getOptionValue(opt.key, opt.default)}
                  onChange={(e) => setOptionValue(opt.key, e.target.value)}
                  size="small"
                  slotProps={{
                    input: { sx: { fontFamily: 'monospace', fontSize: '0.875rem' } },
                  }}
                />
              )}
              {opt.type === 'slider' && (
                <Box sx={{ px: 1, maxWidth: 400 }}>
                  <Slider
                    value={Number(getOptionValue(opt.key, opt.default))}
                    onChange={(_, val) => setOptionValue(opt.key, val as number)}
                    min={opt.min}
                    max={opt.max}
                    step={opt.step}
                    valueLabelDisplay="auto"
                    sx={{ color: TOOL_COLOR }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Batch mode toggle */}
      {recipe.batchGenerate && (
        <FormControlLabel
          control={
            <Switch
              checked={batchMode}
              onChange={(_, checked) => setBatchMode(checked)}
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

      {/* Generated command */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Command
      </Typography>
      <CommandOutput content={generatedCommand} accentColor={TOOL_COLOR} />

      <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 3 }}>
        Requires ffmpeg installed locally. On macOS: brew install ffmpeg
      </Typography>
    </ToolPageLayout>
  );
}
