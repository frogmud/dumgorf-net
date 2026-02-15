import { Paper, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { tokens } from '../theme';
import { useClipboard } from '../hooks/useClipboard';

interface CommandOutputProps {
  content: string;
  accentColor: string;
}

export function CommandOutput({ content, accentColor }: CommandOutputProps) {
  const { copy, copied } = useClipboard();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        position: 'relative',
        bgcolor: tokens.colors.paper,
        border: `1px solid ${tokens.colors.border}`,
        fontFamily: 'monospace',
      }}
    >
      <Tooltip title={copied ? 'Copied' : 'Copy to clipboard'}>
        <IconButton
          onClick={() => copy(content)}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: copied ? '#22c55e' : tokens.colors.text.muted,
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Typography
        component="pre"
        sx={{
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: accentColor,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          m: 0,
          pr: 4,
          lineHeight: 1.6,
        }}
      >
        {content}
      </Typography>
    </Paper>
  );
}
