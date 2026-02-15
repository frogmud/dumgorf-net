import { useRef, useState, useCallback } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { tokens } from '../theme';

interface FileDropZoneProps {
  accept?: string;
  onFiles: (files: File[]) => void;
  preview?: React.ReactNode;
  accentColor: string;
  label?: string;
  hint?: string;
}

export function FileDropZone({
  accept,
  onFiles,
  preview,
  accentColor,
  label = 'Click or drag to upload',
  hint,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    },
    [onFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <Paper
      elevation={0}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      sx={{
        p: 4,
        textAlign: 'center',
        bgcolor: tokens.colors.paper,
        border: `2px dashed ${dragOver ? accentColor : tokens.colors.border}`,
        cursor: 'pointer',
        transition: 'border-color 150ms ease',
        '&:hover': { borderColor: accentColor },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
      {preview ?? (
        <Box>
          <UploadFileIcon sx={{ fontSize: 48, color: tokens.colors.text.muted, mb: 1 }} />
          <Typography sx={{ color: tokens.colors.text.secondary }}>{label}</Typography>
          {hint && (
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 0.5 }}>
              {hint}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}
