import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { FileDropZone } from '../components/FileDropZone';

const TOOL_COLOR = '#ec4899';

const PRESETS = [
  { id: 'logo-clean', label: 'Logo Clean', description: 'Sharp edges, minimal paths, perfect for logos' },
  { id: 'sketch-detailed', label: 'Sketch Detailed', description: 'Preserves hand-drawn quality with fine detail' },
  { id: 'pixel-art', label: 'Pixel Art', description: 'Crisp pixel boundaries, retro game style' },
  { id: 'photo-trace', label: 'Photo Trace', description: 'Posterized photo effect with layered colors' },
  { id: 'line-art', label: 'Line Art', description: 'Extracts outlines only, illustration style' },
  { id: 'stencil', label: 'Stencil', description: 'High contrast, stencil-ready output' },
  { id: 'geometric', label: 'Geometric', description: 'Reduces to geometric shapes, low poly effect' },
  { id: 'woodcut', label: 'Woodcut', description: 'Traditional woodcut print aesthetic' },
  { id: 'halftone', label: 'Halftone', description: 'Dot pattern conversion, comic book style' },
] as const;

type PresetId = (typeof PRESETS)[number]['id'];

export function VectorizeTool() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('logo-clean');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const activePreset = PRESETS.find((p) => p.id === selectedPreset)!;

  return (
    <ToolPageLayout
      title="Vectorize"
      description="Raster to vector conversion with 9 presets. Upload an image, pick a style, download SVG."
    >
      {/* Preset selector */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Preset
      </Typography>
      <Box sx={{ mb: 2 }}>
        <ChipSelector
          items={PRESETS.map((p) => ({ id: p.id, label: p.label }))}
          selected={selectedPreset}
          onSelect={setSelectedPreset}
          accentColor={TOOL_COLOR}
        />
      </Box>
      <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 4 }}>
        {activePreset.description}
      </Typography>

      {/* Upload area */}
      <Box sx={{ mb: 4 }}>
        <FileDropZone
          accept="image/*"
          onFiles={handleFiles}
          accentColor={TOOL_COLOR}
          label="Click or drag to upload an image"
          hint="PNG, JPG, GIF, WebP"
          preview={
            preview ? (
              <Box
                component="img"
                src={preview}
                alt="Upload preview"
                sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: 1 }}
              />
            ) : undefined
          }
        />
      </Box>

      {/* Convert button */}
      <Button
        variant="contained"
        disabled={!file}
        sx={{
          bgcolor: TOOL_COLOR,
          '&:hover': { bgcolor: `${TOOL_COLOR}cc` },
          '&:disabled': { bgcolor: tokens.colors.border },
        }}
      >
        Convert to SVG
      </Button>

      {!file && (
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 2 }}>
          Note: Vectorization requires server-side processing. This demo will be connected to a Vercel function.
        </Typography>
      )}
    </ToolPageLayout>
  );
}
