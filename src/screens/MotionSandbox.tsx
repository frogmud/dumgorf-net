import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Slider,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';

const TOOL_COLOR = '#fb923c';

type DemoType = 'flip-reorder' | 'list-transitions' | 'route-transitions' | 'grid-shuffle';

const DEMOS = [
  { id: 'flip-reorder' as const, label: 'FLIP Reorder' },
  { id: 'list-transitions' as const, label: 'List Transitions' },
  { id: 'route-transitions' as const, label: 'Route Transitions' },
  { id: 'grid-shuffle' as const, label: 'Grid Shuffle' },
];

const EASINGS = [
  { id: 'ease', label: 'ease' },
  { id: 'ease-in-out', label: 'ease-in-out' },
  { id: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'spring' },
  { id: 'linear', label: 'linear' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function generateItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    label: `${i + 1}`,
    color: COLORS[i % COLORS.length],
  }));
}

const CODE_SNIPPETS: Record<DemoType, string> = {
  'flip-reorder': `// FLIP animation technique
// First: record initial positions
const rects = items.map(el => el.getBoundingClientRect());

// Last: update DOM order
reorderItems();

// Invert: calculate deltas and apply inverse transform
items.forEach((el, i) => {
  const newRect = el.getBoundingClientRect();
  const dx = rects[i].left - newRect.left;
  const dy = rects[i].top - newRect.top;
  el.style.transform = \`translate(\${dx}px, \${dy}px)\`;
});

// Play: animate to final position
requestAnimationFrame(() => {
  items.forEach(el => {
    el.style.transition = 'transform 300ms ease';
    el.style.transform = '';
  });
});`,
  'list-transitions': `// CSS-based list enter/exit transitions
.list-item {
  transition: all 300ms ease;
  opacity: 1;
  transform: translateX(0);
}

.list-item-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.list-item-exit {
  opacity: 0;
  transform: translateX(20px);
  position: absolute;
}`,
  'route-transitions': `// Page transition with CSS animations
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease;
}

.page-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: all 200ms ease;
}`,
  'grid-shuffle': `// Grid shuffle with Web Animations API
function animateGridShuffle(container: HTMLElement) {
  const items = [...container.children] as HTMLElement[];

  // Record initial positions
  const firstRects = items.map(el => el.getBoundingClientRect());

  // Shuffle DOM order
  items.sort(() => Math.random() - 0.5)
    .forEach(el => container.appendChild(el));

  // Animate from old to new positions
  items.forEach((el, i) => {
    const lastRect = el.getBoundingClientRect();
    const dx = firstRects[i].left - lastRect.left;
    const dy = firstRects[i].top - lastRect.top;

    el.animate([
      { transform: \`translate(\${dx}px, \${dy}px)\` },
      { transform: 'translate(0, 0)' }
    ], { duration: 300, easing: 'ease' });
  });
}`,
};

// FLIP Reorder Demo
function FlipReorderDemo({ duration, easing, stagger }: { duration: number; easing: string; stagger: boolean }) {
  const [items, setItems] = useState(() => generateItems(8));
  const containerRef = useRef<HTMLDivElement>(null);
  const rectsRef = useRef<Map<string, DOMRect>>(new Map());

  const captureRects = useCallback(() => {
    if (!containerRef.current) return;
    const map = new Map<string, DOMRect>();
    const children = containerRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      const id = el.dataset.id;
      if (id) map.set(id, el.getBoundingClientRect());
    }
    rectsRef.current = map;
  }, []);

  const handleShuffle = useCallback(() => {
    captureRects();
    setItems((prev) => shuffle(prev));
  }, [captureRects]);

  useEffect(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      const id = el.dataset.id;
      if (!id) continue;
      const oldRect = rectsRef.current.get(id);
      if (!oldRect) continue;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (dx === 0 && dy === 0) continue;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        {
          duration,
          easing,
          delay: stagger ? i * 30 : 0,
        },
      );
    }
  }, [items, duration, easing, stagger]);

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ShuffleIcon />}
        onClick={handleShuffle}
        sx={{ mb: 2, borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
      >
        Shuffle
      </Button>
      <Box
        ref={containerRef}
        sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            data-id={item.id}
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1,
              bgcolor: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#fff',
              cursor: 'grab',
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// List Transitions Demo
function ListTransitionsDemo({ duration, easing }: { duration: number; easing: string }) {
  const [items, setItems] = useState(() => generateItems(5));
  const counterRef = useRef(5);

  const addItem = () => {
    const i = counterRef.current++;
    setItems((prev) => [
      ...prev,
      { id: `item-${i}`, label: `${i + 1}`, color: COLORS[i % COLORS.length] },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        onClick={addItem}
        sx={{ mb: 2, mr: 1, borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
      >
        Add Item
      </Button>
      <Stack spacing={1}>
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => removeItem(item.id)}
            sx={{
              p: 1.5,
              bgcolor: `${item.color}20`,
              border: `1px solid ${item.color}40`,
              borderRadius: 1,
              cursor: 'pointer',
              transition: `all ${duration}ms ${easing}`,
              '&:hover': { bgcolor: `${item.color}40` },
              animation: `slideIn ${duration}ms ${easing}`,
              '@keyframes slideIn': {
                from: { opacity: 0, transform: 'translateX(-20px)' },
                to: { opacity: 1, transform: 'translateX(0)' },
              },
            }}
          >
            <Typography variant="body2" sx={{ color: item.color, fontWeight: 600 }}>
              Item {item.label} (click to remove)
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// Grid Shuffle Demo
function GridShuffleDemo({ duration, easing, stagger }: { duration: number; easing: string; stagger: boolean }) {
  const [items, setItems] = useState(() => generateItems(12));
  const containerRef = useRef<HTMLDivElement>(null);
  const rectsRef = useRef<Map<string, DOMRect>>(new Map());

  const captureRects = useCallback(() => {
    if (!containerRef.current) return;
    const map = new Map<string, DOMRect>();
    const children = containerRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      const id = el.dataset.id;
      if (id) map.set(id, el.getBoundingClientRect());
    }
    rectsRef.current = map;
  }, []);

  const handleShuffle = useCallback(() => {
    captureRects();
    setItems((prev) => shuffle(prev));
  }, [captureRects]);

  useEffect(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      const id = el.dataset.id;
      if (!id) continue;
      const oldRect = rectsRef.current.get(id);
      if (!oldRect) continue;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (dx === 0 && dy === 0) continue;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration, easing, delay: stagger ? i * 20 : 0 },
      );
    }
  }, [items, duration, easing, stagger]);

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ShuffleIcon />}
        onClick={handleShuffle}
        sx={{ mb: 2, borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
      >
        Shuffle Grid
      </Button>
      <Box
        ref={containerRef}
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            data-id={item.id}
            sx={{
              height: 64,
              borderRadius: 1,
              bgcolor: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#fff',
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Route Transitions Demo
function RouteTransitionsDemo({ duration, easing }: { duration: number; easing: string }) {
  const [page, setPage] = useState(0);
  const pages = ['Dashboard', 'Settings', 'Profile'];

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {pages.map((p, i) => (
          <Button
            key={p}
            variant={page === i ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setPage(i)}
            sx={{
              bgcolor: page === i ? `${TOOL_COLOR}30` : 'transparent',
              color: page === i ? TOOL_COLOR : tokens.colors.text.muted,
              borderColor: page === i ? TOOL_COLOR : tokens.colors.border,
            }}
          >
            {p}
          </Button>
        ))}
      </Stack>
      <Paper
        key={page}
        elevation={0}
        sx={{
          p: 4,
          bgcolor: tokens.colors.elevated,
          textAlign: 'center',
          animation: `pageEnter ${duration}ms ${easing}`,
          '@keyframes pageEnter': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Typography variant="h2" sx={{ color: TOOL_COLOR }}>{pages[page]}</Typography>
        <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 1 }}>
          Simulated page content for {pages[page].toLowerCase()} view
        </Typography>
      </Paper>
    </Box>
  );
}

export function MotionSandbox() {
  const [demo, setDemo] = useState<DemoType>('flip-reorder');
  const [duration, setDuration] = useState(300);
  const [easing, setEasing] = useState('ease');
  const [stagger, setStagger] = useState(false);

  return (
    <ToolPageLayout
      title="Motion Sandbox"
      description="Interactive animation demos: FLIP reorder, list transitions, grid shuffle. Copy React code."
    >
      {/* Demo selector */}
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={DEMOS}
          selected={demo}
          onSelect={setDemo}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Demo area */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: tokens.colors.paper }}>
        {demo === 'flip-reorder' && <FlipReorderDemo duration={duration} easing={easing} stagger={stagger} />}
        {demo === 'list-transitions' && <ListTransitionsDemo duration={duration} easing={easing} />}
        {demo === 'route-transitions' && <RouteTransitionsDemo duration={duration} easing={easing} />}
        {demo === 'grid-shuffle' && <GridShuffleDemo duration={duration} easing={easing} stagger={stagger} />}
      </Paper>

      {/* Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1, maxWidth: 250 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 0.5 }}>
            Duration ({duration}ms)
          </Typography>
          <Slider
            value={duration}
            onChange={(_, val) => setDuration(val as number)}
            min={50}
            max={1000}
            step={50}
            sx={{ color: TOOL_COLOR }}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 0.5 }}>
            Easing
          </Typography>
          <ChipSelector
            items={EASINGS}
            selected={easing}
            onSelect={setEasing}
            accentColor={TOOL_COLOR}
          />
        </Box>
        {(demo === 'flip-reorder' || demo === 'grid-shuffle') && (
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={stagger}
                  onChange={(_, checked) => setStagger(checked)}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: TOOL_COLOR } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>Stagger</Typography>}
            />
          </Box>
        )}
      </Stack>

      {/* Code */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Code
      </Typography>
      <CommandOutput content={CODE_SNIPPETS[demo]} accentColor={TOOL_COLOR} />
    </ToolPageLayout>
  );
}
