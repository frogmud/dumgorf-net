import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Slider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';

const TOOL_COLOR = '#22d3ee';

type AlgoCategory = 'sorting' | 'searching' | 'probability';

const CATEGORIES = [
  { id: 'sorting' as const, label: 'Sorting' },
  { id: 'searching' as const, label: 'Searching' },
  { id: 'probability' as const, label: 'Probability' },
];

interface AlgoInfo {
  id: string;
  label: string;
  category: AlgoCategory;
  description: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  code: string;
}

const ALGORITHMS: AlgoInfo[] = [
  {
    id: 'bubble', label: 'Bubble Sort', category: 'sorting',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)',
    code: `function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}`,
  },
  {
    id: 'selection', label: 'Selection Sort', category: 'sorting',
    description: 'Finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion.',
    best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)',
    code: `function selectionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
    }
    [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}`,
  },
  {
    id: 'insertion', label: 'Insertion Sort', category: 'sorting',
    description: 'Builds the sorted array one item at a time by inserting each element into its correct position.',
    best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)',
    code: `function insertionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,
  },
  {
    id: 'quick', label: 'Quick Sort', category: 'sorting',
    description: 'Picks a pivot, partitions the array around it, then recursively sorts the sub-arrays.',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)',
    code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const mid = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}`,
  },
  {
    id: 'merge', label: 'Merge Sort', category: 'sorting',
    description: 'Divides the array in half, recursively sorts both halves, then merges the sorted halves.',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
    code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] < right[j] ? left[i++] : right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  },
  {
    id: 'binary-search', label: 'Binary Search', category: 'searching',
    description: 'Finds a target value in a sorted array by repeatedly dividing the search interval in half.',
    best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)',
    code: `function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  },
  {
    id: 'linear-search', label: 'Linear Search', category: 'searching',
    description: 'Sequentially checks each element until the target is found or the end is reached.',
    best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)',
    code: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
  },
  {
    id: 'monte-carlo', label: 'Monte Carlo Pi', category: 'probability',
    description: 'Estimates Pi by randomly sampling points in a unit square and counting how many fall inside a quarter circle.',
    best: '-', average: 'O(n)', worst: 'O(n)', space: 'O(1)',
    code: `function estimatePi(samples: number): number {
  let inside = 0;
  for (let i = 0; i < samples; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) inside++;
  }
  return (4 * inside) / samples;
}`,
  },
];

// Generator for bubble sort steps
function* bubbleSortSteps(arr: number[]): Generator<{ array: number[]; comparing: [number, number]; swapped: boolean }> {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      const shouldSwap = a[j] > a[j + 1];
      if (shouldSwap) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      yield { array: [...a], comparing: [j, j + 1], swapped: shouldSwap };
    }
  }
}

function* selectionSortSteps(arr: number[]): Generator<{ array: number[]; comparing: [number, number]; swapped: boolean }> {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      yield { array: [...a], comparing: [min, j], swapped: false };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      yield { array: [...a], comparing: [i, min], swapped: true };
    }
  }
}

function* insertionSortSteps(arr: number[]): Generator<{ array: number[]; comparing: [number, number]; swapped: boolean }> {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      yield { array: [...a], comparing: [j - 1, j], swapped: true };
      j--;
    }
    if (j === i) yield { array: [...a], comparing: [j - 1 < 0 ? 0 : j - 1, j], swapped: false };
  }
}

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

export function AlgorithmsPlayground() {
  const [category, setCategory] = useState<AlgoCategory>('sorting');
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [array, setArray] = useState(() => generateArray(30));
  const [comparing, setComparing] = useState<[number, number] | null>(null);

  const generatorRef = useRef<Generator<{ array: number[]; comparing: [number, number]; swapped: boolean }> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;
  const categoryAlgos = ALGORITHMS.filter((a) => a.category === category);

  const maxVal = Math.max(...array);

  const randomize = useCallback(() => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    generatorRef.current = null;
    setComparing(null);
    const newArr = generateArray(arraySize);
    setArray(newArr);
  }, [arraySize]);

  const startSort = useCallback(() => {
    const arr = [...array];
    if (selectedAlgo === 'bubble') generatorRef.current = bubbleSortSteps(arr);
    else if (selectedAlgo === 'selection') generatorRef.current = selectionSortSteps(arr);
    else if (selectedAlgo === 'insertion') generatorRef.current = insertionSortSteps(arr);
    else {
      generatorRef.current = bubbleSortSteps(arr);
    }
    setIsPlaying(true);
  }, [array, selectedAlgo]);

  const step = useCallback(() => {
    if (!generatorRef.current) return;
    const next = generatorRef.current.next();
    if (next.done) {
      setIsPlaying(false);
      clearInterval(timerRef.current);
      setComparing(null);
      return;
    }
    setArray(next.value.array);
    setComparing(next.value.comparing);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(5, 200 - speed * 2);
      timerRef.current = setInterval(step, delay);
      return () => clearInterval(timerRef.current);
    }
  }, [isPlaying, speed, step]);

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(timerRef.current);
    } else {
      if (!generatorRef.current) startSort();
      else setIsPlaying(true);
    }
  };

  return (
    <ToolPageLayout
      title="Algorithms"
      description="Visualize sorting, searching, and probability algorithms step by step. See complexity analysis."
    >
      {/* Category selector */}
      <Box sx={{ mb: 2 }}>
        <ChipSelector
          items={CATEGORIES}
          selected={category}
          onSelect={(id) => {
            setCategory(id);
            const first = ALGORITHMS.find((a) => a.category === id);
            if (first) setSelectedAlgo(first.id);
          }}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Algorithm selector */}
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={categoryAlgos.map((a) => ({ id: a.id, label: a.label }))}
          selected={selectedAlgo}
          onSelect={(id) => {
            setSelectedAlgo(id);
            setIsPlaying(false);
            clearInterval(timerRef.current);
            generatorRef.current = null;
            setComparing(null);
          }}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Visualization */}
      {category === 'sorting' && (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: tokens.colors.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: 200 }}>
              {array.map((val, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    bgcolor:
                      comparing && (comparing[0] === i || comparing[1] === i)
                        ? TOOL_COLOR
                        : `${TOOL_COLOR}50`,
                    height: `${(val / maxVal) * 100}%`,
                    borderRadius: '1px 1px 0 0',
                    transition: 'height 50ms ease',
                    minWidth: 1,
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Controls */}
          <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={handlePlay}
              sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SkipNextIcon />}
              onClick={() => { if (!generatorRef.current) startSort(); step(); }}
              disabled={isPlaying}
              sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
            >
              Step
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ShuffleIcon />}
              onClick={randomize}
              sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.primary }}
            >
              Randomize
            </Button>
          </Stack>

          <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1, maxWidth: 200 }}>
              <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 0.5 }}>
                Array size ({arraySize})
              </Typography>
              <Slider
                value={arraySize}
                onChange={(_, val) => { setArraySize(val as number); }}
                onChangeCommitted={() => randomize()}
                min={10}
                max={100}
                step={5}
                sx={{ color: TOOL_COLOR }}
              />
            </Box>
            <Box sx={{ flex: 1, maxWidth: 200 }}>
              <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mb: 0.5 }}>
                Speed ({speed})
              </Typography>
              <Slider
                value={speed}
                onChange={(_, val) => setSpeed(val as number)}
                min={1}
                max={100}
                sx={{ color: TOOL_COLOR }}
              />
            </Box>
          </Stack>
        </>
      )}

      {/* Non-sorting placeholder */}
      {category !== 'sorting' && (
        <Paper elevation={0} sx={{ p: 4, mb: 3, bgcolor: tokens.colors.paper, textAlign: 'center' }}>
          <Typography sx={{ color: tokens.colors.text.muted }}>
            Interactive visualization for {algo.label} -- see the code implementation below.
          </Typography>
        </Paper>
      )}

      {/* Info panel */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.elevated }}>
        <Typography variant="body1" sx={{ mb: 2 }}>{algo.description}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          <Box>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block' }}>Best</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: TOOL_COLOR }}>{algo.best}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block' }}>Average</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: TOOL_COLOR }}>{algo.average}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block' }}>Worst</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: TOOL_COLOR }}>{algo.worst}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: tokens.colors.text.muted, display: 'block' }}>Space</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: TOOL_COLOR }}>{algo.space}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Code */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Implementation
      </Typography>
      <CommandOutput content={algo.code} accentColor={TOOL_COLOR} />
    </ToolPageLayout>
  );
}
