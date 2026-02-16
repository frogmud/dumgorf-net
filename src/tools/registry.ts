import CasinoIcon from '@mui/icons-material/Casino';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PeopleIcon from '@mui/icons-material/People';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TerminalIcon from '@mui/icons-material/Terminal';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import TableChartIcon from '@mui/icons-material/TableChart';
import InputIcon from '@mui/icons-material/Input';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ScienceIcon from '@mui/icons-material/Science';
import AnimationIcon from '@mui/icons-material/Animation';
import type { ToolManifest } from './manifest';

export const toolRegistry: ToolManifest[] = [
  {
    id: 'dice',
    title: 'Dice Calculator',
    description: 'RPG dice probability explorer. Input notation like 2d6+3, see probability curves, compare meteor types.',
    route: '/dice',
    color: '#3b82f6',
    icon: CasinoIcon,
    component: () => import('../screens/DiceCalculator').then((m) => ({ default: m.DiceCalculator })),
    category: 'game-engine',
    tags: ['dice', 'probability', 'rpg'],
    localOnly: false,
    status: 'stable',
    order: 1,
  },
  {
    id: 'rng',
    title: 'Seeded RNG',
    description: 'Deterministic random number playground. Enter a seed, see outputs, visualize distributions.',
    route: '/rng',
    color: '#10b981',
    icon: ShuffleIcon,
    component: () => import('../screens/RngPlayground').then((m) => ({ default: m.RngPlayground })),
    category: 'game-engine',
    tags: ['rng', 'seed', 'deterministic'],
    localOnly: false,
    status: 'stable',
    order: 2,
  },
  {
    id: 'npcs',
    title: 'NPC Viewer',
    description: 'Browse the pantheon: Mr. Bones, Xtreme, Dr. Voss, King James, Boots. See mood states and voice profiles.',
    route: '/npcs',
    color: '#f59e0b',
    icon: PeopleIcon,
    component: () => import('../screens/NpcViewer').then((m) => ({ default: m.NpcViewer })),
    category: 'game-engine',
    tags: ['npc', 'pantheon', 'personality'],
    localOnly: false,
    status: 'stable',
    order: 3,
  },
  {
    id: 'vectorize',
    title: 'Vectorize',
    description: 'Raster to vector conversion with 9 presets. Upload an image, pick a style, download SVG.',
    route: '/vectorize',
    color: '#ec4899',
    icon: AutoFixHighIcon,
    component: () => import('../screens/VectorizeTool').then((m) => ({ default: m.VectorizeTool })),
    category: 'media',
    tags: ['image', 'svg', 'vector'],
    localOnly: false,
    status: 'stable',
    order: 4,
  },
  {
    id: 'ffmpeg',
    title: 'FFmpeg Cookbook',
    description: 'Pick a recipe, configure options, copy a ready-to-paste ffmpeg command. 9 presets with batch mode.',
    route: '/ffmpeg',
    color: '#06b6d4',
    icon: TerminalIcon,
    component: () => import('../screens/FfmpegTool').then((m) => ({ default: m.FfmpegTool })),
    category: 'media',
    tags: ['ffmpeg', 'video', 'command'],
    localOnly: true,
    status: 'stable',
    order: 6,
  },
  {
    id: 'audio',
    title: 'Audio Utility',
    description: 'Generate ffmpeg audio commands: trim silence, normalize loudness, convert format, batch export.',
    route: '/audio',
    color: '#14b8a6',
    icon: GraphicEqIcon,
    component: () => import('../screens/AudioUtility').then((m) => ({ default: m.AudioUtility })),
    category: 'media',
    tags: ['audio', 'ffmpeg', 'loudness'],
    localOnly: true,
    status: 'beta',
    order: 8,
  },
  {
    id: 'loot',
    title: 'Loot Tables',
    description: 'Simulate loot table drops. See EV, variance, bad-streak probability, and seed-specific results.',
    route: '/loot',
    color: '#f97316',
    icon: TableChartIcon,
    component: () => import('../screens/LootTableExplorer').then((m) => ({ default: m.LootTableExplorer })),
    category: 'game-engine',
    tags: ['loot', 'probability', 'simulation'],
    localOnly: false,
    status: 'beta',
    order: 9,
  },
  {
    id: 'formatter',
    title: 'Input Formatter',
    description: 'Live input masking for phone, credit card, date, currency, SSN. Custom regex mode.',
    route: '/formatter',
    color: '#a855f7',
    icon: InputIcon,
    component: () => import('../screens/InputFormatter').then((m) => ({ default: m.InputFormatter })),
    category: 'dev-utils',
    tags: ['format', 'mask', 'input'],
    localOnly: false,
    status: 'beta',
    order: 10,
  },
  {
    id: 'assets',
    title: 'Asset Checker',
    description: 'Drop a folder or zip. Scan for naming issues, missing @2x, odd sizes, large files, duplicates.',
    route: '/assets',
    color: '#f43f5e',
    icon: FolderOpenIcon,
    component: () => import('../screens/AssetChecker').then((m) => ({ default: m.AssetChecker })),
    category: 'dev-utils',
    tags: ['assets', 'audit', 'naming'],
    localOnly: true,
    status: 'beta',
    order: 11,
  },
  {
    id: 'algorithms',
    title: 'Algorithms',
    description: 'Visualize sorting, searching, and probability algorithms step by step. See complexity analysis.',
    route: '/algorithms',
    color: '#22d3ee',
    icon: ScienceIcon,
    component: () => import('../screens/AlgorithmsPlayground').then((m) => ({ default: m.AlgorithmsPlayground })),
    category: 'dev-utils',
    tags: ['algorithm', 'sorting', 'visualization'],
    localOnly: false,
    status: 'beta',
    order: 12,
  },
  {
    id: 'motion',
    title: 'Motion Sandbox',
    description: 'Interactive animation demos: FLIP reorder, list transitions, grid shuffle. Copy React code.',
    route: '/motion',
    color: '#fb923c',
    icon: AnimationIcon,
    component: () => import('../screens/MotionSandbox').then((m) => ({ default: m.MotionSandbox })),
    category: 'dev-utils',
    tags: ['animation', 'css', 'motion'],
    localOnly: false,
    status: 'beta',
    order: 13,
  },
];

export function getActiveTools(): ToolManifest[] {
  return toolRegistry
    .filter((t) => t.status !== 'coming-soon')
    .sort((a, b) => a.order - b.order);
}

export function getAllTools(): ToolManifest[] {
  return [...toolRegistry].sort((a, b) => a.order - b.order);
}

export function getTool(id: string): ToolManifest | undefined {
  return toolRegistry.find((t) => t.id === id);
}
