import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { CommandOutput } from '../components/CommandOutput';

const TOOL_COLOR = '#a3a3a3';
const STORAGE_KEY = 'ndf-feedback';
const MAX_CHARS = 500;

interface FeedbackEntry {
  id: string;
  text: string;
  timestamp: number;
}

function loadEntries(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: FeedbackEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const EMBED_SNIPPET = `<iframe
  src="https://dumgorf.net/feedback"
  width="400"
  height="600"
  style="border: 1px solid #222; border-radius: 8px;"
  title="Feedback"
/>`;

export function FeedbackWidget() {
  const [entries, setEntries] = useState<FeedbackEntry[]>(loadEntries);
  const [input, setInput] = useState('');

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const addEntry = () => {
    const text = input.trim();
    if (!text) return;
    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
    };
    setEntries((prev) => [entry, ...prev]);
    setInput('');
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const clearAll = () => {
    setEntries([]);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addEntry();
    }
  };

  return (
    <ToolPageLayout
      title="Feedback Widget"
      description="Local-only comment box. Everything stays in your browser's localStorage."
    >
      {/* Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Leave feedback..."
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          size="small"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
            {input.length}/{MAX_CHARS}
          </Typography>
          <Button
            onClick={addEntry}
            disabled={!input.trim()}
            variant="contained"
            size="small"
            sx={{
              bgcolor: TOOL_COLOR,
              '&:hover': { bgcolor: `${TOOL_COLOR}cc` },
              '&:disabled': { bgcolor: tokens.colors.border },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>

      {/* Actions */}
      {entries.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={exportJson}
            sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.secondary }}
          >
            Export JSON
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={clearAll}
            sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.muted }}
          >
            Clear All
          </Button>
        </Stack>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: tokens.colors.paper }}>
          <Typography sx={{ color: tokens.colors.text.muted }}>
            No feedback yet. Write something above.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {entries.map((entry) => (
            <Paper
              key={entry.id}
              elevation={0}
              sx={{ p: 2, bgcolor: tokens.colors.paper, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>{entry.text}</Typography>
                <Typography variant="body2" sx={{ color: tokens.colors.text.muted, fontSize: '0.75rem' }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => removeEntry(entry.id)} sx={{ color: tokens.colors.text.muted }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Privacy note */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: tokens.colors.elevated, borderLeft: `3px solid ${TOOL_COLOR}` }}>
        <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
          Privacy: All feedback is stored in your browser's localStorage. Nothing is sent to any server.
          Clear your browser data to remove all entries.
        </Typography>
      </Paper>

      {/* Embed snippet */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Embed Snippet
      </Typography>
      <CommandOutput content={EMBED_SNIPPET} accentColor={TOOL_COLOR} />
    </ToolPageLayout>
  );
}
