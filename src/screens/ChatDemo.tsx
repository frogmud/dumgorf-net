import { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Paper, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';

interface ChatMessage {
  role: 'user' | 'npc';
  content: string;
  npc?: string;
}

const NPC_OPTIONS = [
  { id: 'mr-bones', label: 'Mr. Bones', color: '#a0a0a0' },
  { id: 'xtreme', label: 'Xtreme', color: '#ef4444' },
];

const TOOL_COLOR = '#ef4444';

// Offline responses for demo without API
const OFFLINE_RESPONSES: Record<string, string[]> = {
  'mr-bones': [
    'Hmm. Your inquiry has been logged. The ledger shows no precedent for this.',
    'I have processed your statement. It has been filed under "moderately interesting."',
    'The cosmic balance sheet does not account for small talk. Nevertheless, I shall respond.',
    'Your words have been recorded. The margins are tight this quarter.',
  ],
  'xtreme': [
    'YOOOO that is such a GOOD question! I am SO PUMPED to answer it!',
    'Bro. BRO. You just said something INCREDIBLE. I am literally vibrating!',
    'LETS TALK ABOUT THIS! The energy right now is UNREAL!',
    'That is the MOST EPIC thing anyone has ever said to me today!',
  ],
};

export function ChatDemo() {
  const [selectedNpc, setSelectedNpc] = useState('mr-bones');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const npc = NPC_OPTIONS.find((n) => n.id === selectedNpc)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate NPC response (offline demo)
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
    const pool = OFFLINE_RESPONSES[selectedNpc] || OFFLINE_RESPONSES['mr-bones'];
    const response = pool[Math.floor(Math.random() * pool.length)];
    setMessages((prev) => [...prev, { role: 'npc', content: response, npc: npc.label }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ToolPageLayout
      title="Chat Demo"
      description="Talk to an NPC. Offline demo mode -- connect to Claude API for live responses."
    >
      {/* NPC selector */}
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={NPC_OPTIONS}
          selected={selectedNpc}
          onSelect={(id) => {
            setSelectedNpc(id);
            setMessages([]);
          }}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Chat window */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          minHeight: 400,
          maxHeight: 500,
          overflowY: 'auto',
          mb: 2,
          bgcolor: tokens.colors.paper,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: tokens.colors.text.muted }}>
              Say something to {npc.label}.
            </Typography>
          </Box>
        )}
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              mb: 2,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            {msg.role === 'npc' && (
              <Typography sx={{ color: npc.color, fontSize: '0.75rem', fontWeight: 600, mb: 0.25 }}>
                {msg.npc}
              </Typography>
            )}
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1,
                bgcolor: msg.role === 'user' ? `${tokens.colors.accent}20` : tokens.colors.elevated,
                border: `1px solid ${msg.role === 'user' ? tokens.colors.accent : tokens.colors.border}`,
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ alignSelf: 'flex-start' }}>
            <Typography sx={{ color: npc.color, fontSize: '0.75rem', fontWeight: 600, mb: 0.25 }}>
              {npc.label}
            </Typography>
            <Paper
              elevation={0}
              sx={{ px: 2, py: 1, bgcolor: tokens.colors.elevated, border: `1px solid ${tokens.colors.border}` }}
            >
              <Typography sx={{ color: tokens.colors.text.muted }}>...</Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${npc.label}...`}
          fullWidth
          size="small"
          disabled={isLoading}
        />
        <IconButton
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          sx={{ color: tokens.colors.accent }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </ToolPageLayout>
  );
}
