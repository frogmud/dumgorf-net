import type { SvgIconComponent } from '@mui/icons-material';

export type ToolStatus = 'stable' | 'beta' | 'coming-soon';
export type ToolCategory = 'game-engine' | 'media' | 'dev-utils' | 'meta';

export interface ToolManifest {
  id: string;
  title: string;
  description: string;
  route: string;
  color: string;
  icon: SvgIconComponent;
  component: () => Promise<{ default: React.ComponentType }>;
  category: ToolCategory;
  tags: string[];
  localOnly: boolean;
  status: ToolStatus;
  order: number;
}
