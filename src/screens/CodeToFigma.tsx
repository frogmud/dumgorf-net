import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';

const TOOL_COLOR = '#6366f1';

const C2D_PROXY_URL = import.meta.env.VITE_C2D_PROXY_URL || '';

type TemplateId = 'blank' | 'button' | 'card' | 'layout' | 'hero';

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'blank', label: 'Blank' },
  { id: 'button', label: 'Button' },
  { id: 'card', label: 'Card' },
  { id: 'layout', label: 'Grid Layout' },
  { id: 'hero', label: 'Hero Section' },
];

const TEMPLATE_CODE: Record<TemplateId, string> = {
  blank: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 24px; font-family: Inter, sans-serif; }
  </style>
</head>
<body>
  <h1>Hello, Figma</h1>
</body>
</html>`,
  button: `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 32px; font-family: Inter, sans-serif; background: #fafafa; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 150ms ease; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-outline { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
    .btn-ghost { background: transparent; color: #6366f1; }
    .row { display: flex; gap: 12px; margin-bottom: 16px; }
    h3 { margin: 0 0 12px; color: #333; font-size: 14px; }
  </style>
</head>
<body>
  <h3>Button Variants</h3>
  <div class="row">
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-outline">Outline</button>
    <button class="btn btn-ghost">Ghost</button>
  </div>
</body>
</html>`,
  card: `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 32px; font-family: Inter, sans-serif; background: #f5f5f5; }
    .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 320px; }
    .card-img { width: 100%; height: 180px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; }
    .card-body { padding: 20px; }
    .card-title { margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #111; }
    .card-text { margin: 0 0 16px; font-size: 14px; color: #666; line-height: 1.5; }
    .card-btn { display: inline-block; padding: 10px 20px; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-img">Preview</div>
    <div class="card-body">
      <h2 class="card-title">Card Title</h2>
      <p class="card-text">A simple card component with image, text content, and a call-to-action button.</p>
      <a href="#" class="card-btn">Learn More</a>
    </div>
  </div>
</body>
</html>`,
  layout: `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 32px; font-family: Inter, sans-serif; background: #fafafa; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 800px; }
    .cell { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .cell-header { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; }
    .cell-value { font-size: 28px; font-weight: 700; margin: 0; }
    .cell-sub { font-size: 12px; color: #888; margin: 4px 0 0; }
    .c1 .cell-value { color: #6366f1; }
    .c2 .cell-value { color: #10b981; }
    .c3 .cell-value { color: #f59e0b; }
  </style>
</head>
<body>
  <div class="grid">
    <div class="cell c1">
      <p class="cell-header">Users</p>
      <p class="cell-value">12,847</p>
      <p class="cell-sub">+14% this month</p>
    </div>
    <div class="cell c2">
      <p class="cell-header">Revenue</p>
      <p class="cell-value">$48.2K</p>
      <p class="cell-sub">+8% this month</p>
    </div>
    <div class="cell c3">
      <p class="cell-header">Conversion</p>
      <p class="cell-value">3.24%</p>
      <p class="cell-sub">-2% this month</p>
    </div>
  </div>
</body>
</html>`,
  hero: `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; font-family: Inter, sans-serif; }
    .hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 80px 48px; text-align: center; }
    .hero h1 { color: white; font-size: 48px; font-weight: 800; margin: 0 0 16px; letter-spacing: -1px; }
    .hero p { color: #94a3b8; font-size: 18px; margin: 0 0 32px; max-width: 560px; margin-left: auto; margin-right: auto; line-height: 1.6; }
    .hero-actions { display: flex; gap: 12px; justify-content: center; }
    .btn { padding: 14px 28px; border-radius: 10px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-outline { background: transparent; color: white; border: 2px solid #475569; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Ship faster with design</h1>
    <p>Convert your code components to Figma layers instantly. Iterate on design without leaving your workflow.</p>
    <div class="hero-actions">
      <button class="btn btn-primary">Get Started</button>
      <button class="btn btn-outline">Learn More</button>
    </div>
  </div>
</body>
</html>`,
};

type ThemeOption = 'light' | 'dark';

const THEMES: { id: ThemeOption; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export function CodeToFigma() {
  const [template, setTemplate] = useState<TemplateId>('blank');
  const [code, setCode] = useState(TEMPLATE_CODE.blank);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [theme, setTheme] = useState<ThemeOption>('light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  const proxyConfigured = !!C2D_PROXY_URL;

  // Fetch credit balance on mount
  useEffect(() => {
    if (!proxyConfigured) return;
    setCreditsLoading(true);
    fetch(`${C2D_PROXY_URL}/api/balance`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.credits === 'number') setCredits(data.credits);
        else if (typeof data.balance === 'number') setCredits(data.balance);
      })
      .catch(() => setCredits(null))
      .finally(() => setCreditsLoading(false));
  }, [proxyConfigured]);

  const handleTemplateChange = useCallback((id: TemplateId) => {
    setTemplate(id);
    setCode(TEMPLATE_CODE[id]);
    setError('');
    setSuccess('');
  }, []);

  const previewSrc = useMemo(() => {
    return code;
  }, [code]);

  const handleCopyForFigma = useCallback(async () => {
    setConfirmOpen(false);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${C2D_PROXY_URL}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: code,
          clip: true,
          width,
          height,
          theme,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API returned ${response.status}`);
      }

      const data = await response.json();

      // The clipboard mode returns data that needs to be written to clipboard
      // as a special Figma-compatible format
      if (data.clip) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([data.clip], { type: 'text/html' }),
          }),
        ]);
        setSuccess('Copied to clipboard. Paste in Figma (Cmd+V).');
      } else {
        // Fallback: copy the raw response as text
        await navigator.clipboard.writeText(JSON.stringify(data));
        setSuccess('Response copied. Check Figma plugin for import.');
      }

      // Refresh balance
      if (proxyConfigured) {
        fetch(`${C2D_PROXY_URL}/api/balance`)
          .then((r) => r.json())
          .then((d) => {
            if (typeof d.credits === 'number') setCredits(d.credits);
            else if (typeof d.balance === 'number') setCredits(d.balance);
          })
          .catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert');
    } finally {
      setLoading(false);
    }
  }, [code, width, height, theme, proxyConfigured]);

  const configJson = JSON.stringify(
    {
      width,
      height,
      theme,
      clip: true,
      codeLength: code.length,
    },
    null,
    2,
  );

  return (
    <ToolPageLayout
      title="Code to Figma"
      description="Paste HTML, preview live, push to Figma as editable layers. Use the html.to.design MCP in Claude Code (free with Pro) or the code.to.design API."
    >
      {/* Template presets */}
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={TEMPLATES}
          selected={template}
          onSelect={handleTemplateChange}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Code editor */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        HTML
      </Typography>
      <TextField
        multiline
        minRows={12}
        maxRows={24}
        value={code}
        onChange={(e) => { setCode(e.target.value); setError(''); setSuccess(''); }}
        fullWidth
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            sx: {
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              bgcolor: tokens.colors.paper,
              color: tokens.colors.text.primary,
            },
          },
        }}
      />

      {/* Preview */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Preview
      </Typography>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        }}
      >
        <Box
          component="iframe"
          srcDoc={previewSrc}
          sandbox="allow-scripts"
          sx={{
            width: '100%',
            height: Math.min(height, 500),
            border: 'none',
            display: 'block',
          }}
        />
      </Paper>

      {/* Viewport controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'flex-start' }}>
        <TextField
          label="Width"
          value={width}
          onChange={(e) => setWidth(Math.max(320, Math.min(2560, parseInt(e.target.value) || 1280)))}
          type="number"
          size="small"
          sx={{ width: 100 }}
        />
        <TextField
          label="Height"
          value={height}
          onChange={(e) => setHeight(Math.max(200, Math.min(2560, parseInt(e.target.value) || 720)))}
          type="number"
          size="small"
          sx={{ width: 100 }}
        />
        <Box>
          <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 0.5, fontSize: '0.75rem' }}>
            Theme
          </Typography>
          <ChipSelector
            items={THEMES}
            selected={theme}
            onSelect={setTheme}
            accentColor={TOOL_COLOR}
          />
        </Box>
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        {proxyConfigured ? (
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ContentPasteIcon />}
            onClick={() => setConfirmOpen(true)}
            disabled={loading || !code.trim()}
            sx={{
              bgcolor: TOOL_COLOR,
              '&:hover': { bgcolor: `${TOOL_COLOR}cc` },
              '&.Mui-disabled': { bgcolor: `${TOOL_COLOR}40` },
            }}
          >
            {loading ? 'Converting...' : 'Copy for Figma'}
          </Button>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: tokens.colors.elevated,
              border: `1px solid ${TOOL_COLOR}40`,
              flex: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5, fontWeight: 600 }}>
              Figma export via API is not configured.
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted }}>
              Use the <strong>html.to.design MCP</strong> in Claude Code instead -- it's free
              with html.to.design Pro (1000 imports/month). See the setup guide below.
            </Typography>
          </Paper>
        )}

        {/* Credit balance */}
        {proxyConfigured && credits !== null && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccountBalanceWalletIcon sx={{ fontSize: 16, color: tokens.colors.text.muted }} />
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted, fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {creditsLoading ? '...' : `${credits} credits`}
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Status messages */}
      {error && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#ef444420', borderLeft: `3px solid #ef4444` }}>
          <Typography variant="body2" sx={{ color: '#ef4444' }}>{error}</Typography>
        </Paper>
      )}
      {success && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#22c55e20', borderLeft: `3px solid #22c55e` }}>
          <Typography variant="body2" sx={{ color: '#22c55e' }}>{success}</Typography>
        </Paper>
      )}

      {/* MCP setup guide */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.elevated, border: `1px solid ${TOOL_COLOR}30` }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          Recommended: html.to.design MCP
        </Typography>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted, lineHeight: 1.6, mb: 1.5 }}>
          With html.to.design Pro you get <strong>1000 free MCP imports/month</strong>.
          The MCP server gives Claude Code direct access to{' '}
          <code style={{ color: TOOL_COLOR }}>import-html</code> and{' '}
          <code style={{ color: TOOL_COLOR }}>import-url</code> tools that push
          HTML straight to your open Figma file as editable layers.
        </Typography>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted, lineHeight: 1.6, mb: 0.5, fontWeight: 600 }}>
          Setup
        </Typography>
        <Typography
          component="ol"
          variant="body2"
          sx={{
            color: tokens.colors.text.muted,
            lineHeight: 1.8,
            pl: 2.5,
            m: 0,
            '& li': { mb: 0.5 },
            '& code': { color: TOOL_COLOR, fontSize: '0.8rem' },
          }}
        >
          <li>Open the html.to.design plugin in Figma and go to the <strong>MCP</strong> tab</li>
          <li>Copy the server URL</li>
          <li>Run: <code>claude mcp add html-to-design --transport sse --url YOUR_URL</code></li>
          <li>Restart Claude Code</li>
          <li>Ask Claude to push HTML to your open Figma file</li>
        </Typography>
      </Paper>

      {/* Config */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Export Config
      </Typography>
      <CommandOutput content={configJson} accentColor={TOOL_COLOR} />

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { bgcolor: tokens.colors.paper, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: tokens.colors.text.primary }}>
          <DesignServicesIcon sx={{ mr: 1, verticalAlign: 'middle', color: TOOL_COLOR }} />
          Confirm Export
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
            This will use <strong>1 credit</strong> from your code.to.design balance
            {credits !== null && (
              <> (<strong>{credits}</strong> remaining)</>
            )}.
            The HTML will be converted to Figma clipboard format.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: tokens.colors.text.muted }}>
            Cancel
          </Button>
          <Button
            onClick={handleCopyForFigma}
            variant="contained"
            sx={{ bgcolor: TOOL_COLOR, '&:hover': { bgcolor: `${TOOL_COLOR}cc` } }}
          >
            Use 1 Credit
          </Button>
        </DialogActions>
      </Dialog>
    </ToolPageLayout>
  );
}
