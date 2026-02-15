import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';
import { FileDropZone } from '../components/FileDropZone';
import { useClipboard } from '../hooks/useClipboard';

const TOOL_COLOR = '#f43f5e';

type IssueSeverity = 'error' | 'warning' | 'info';
type IssueCategory = 'naming' | 'missing-2x' | 'odd-sizes' | 'large-files' | 'duplicates';

interface AssetIssue {
  severity: IssueSeverity;
  category: IssueCategory;
  file: string;
  description: string;
  suggestion?: string;
}

const CATEGORY_FILTERS = [
  { id: 'all' as const, label: 'All' },
  { id: 'naming' as const, label: 'Naming' },
  { id: 'missing-2x' as const, label: 'Missing @2x' },
  { id: 'odd-sizes' as const, label: 'Odd Sizes' },
  { id: 'large-files' as const, label: 'Large Files' },
  { id: 'duplicates' as const, label: 'Duplicates' },
];

function analyzeFiles(files: File[]): AssetIssue[] {
  const issues: AssetIssue[] = [];
  const nameMap = new Map<string, File[]>();

  for (const file of files) {
    const name = file.name;
    const path = file.webkitRelativePath || name;

    // Naming checks
    if (/[A-Z]/.test(name) && !name.includes('@')) {
      issues.push({
        severity: 'warning',
        category: 'naming',
        file: path,
        description: 'Filename contains uppercase characters',
        suggestion: `mv "${name}" "${name.toLowerCase()}"`,
      });
    }
    if (/\s/.test(name)) {
      issues.push({
        severity: 'error',
        category: 'naming',
        file: path,
        description: 'Filename contains spaces',
        suggestion: `mv "${name}" "${name.replace(/\s+/g, '-')}"`,
      });
    }
    if (/[^a-zA-Z0-9._@\-]/.test(name)) {
      issues.push({
        severity: 'warning',
        category: 'naming',
        file: path,
        description: 'Filename contains special characters',
      });
    }

    // Missing @2x check for image files
    if (/\.(png|jpg|jpeg|webp)$/i.test(name) && !name.includes('@2x') && !name.includes('@3x')) {
      const base = name.replace(/\.[^.]+$/, '');
      const ext = name.match(/\.[^.]+$/)?.[0] || '';
      const has2x = files.some((f) => f.name === `${base}@2x${ext}`);
      if (!has2x) {
        issues.push({
          severity: 'info',
          category: 'missing-2x',
          file: path,
          description: `No @2x variant found (${base}@2x${ext})`,
        });
      }
    }

    // Large files (> 500KB)
    if (file.size > 500 * 1024) {
      issues.push({
        severity: 'warning',
        category: 'large-files',
        file: path,
        description: `File size: ${(file.size / 1024).toFixed(0)} KB`,
      });
    }

    // Track for duplicate detection
    const sizeKey = `${file.size}-${name.replace(/.*\//, '')}`;
    if (!nameMap.has(sizeKey)) nameMap.set(sizeKey, []);
    nameMap.get(sizeKey)!.push(file);
  }

  // Duplicate check
  for (const [, group] of nameMap) {
    if (group.length > 1) {
      for (const file of group.slice(1)) {
        issues.push({
          severity: 'warning',
          category: 'duplicates',
          file: file.webkitRelativePath || file.name,
          description: `Possible duplicate of ${group[0].webkitRelativePath || group[0].name} (same size)`,
        });
      }
    }
  }

  return issues;
}

const SEVERITY_COLORS: Record<IssueSeverity, string> = {
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export function AssetChecker() {
  const [issues, setIssues] = useState<AssetIssue[]>([]);
  const [scanning, setScanning] = useState(false);
  const [totalFiles, setTotalFiles] = useState(0);
  const [filter, setFilter] = useState<IssueCategory | 'all'>('all');
  const { copy, copied } = useClipboard();

  const handleFiles = useCallback((files: File[]) => {
    setScanning(true);
    setTotalFiles(files.length);
    // Use requestAnimationFrame to allow UI to update
    requestAnimationFrame(() => {
      const result = analyzeFiles(files);
      setIssues(result);
      setScanning(false);
    });
  }, []);

  const filtered = filter === 'all'
    ? issues
    : issues.filter((i) => i.category === filter);

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warnCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  const renameScript = issues
    .filter((i) => i.suggestion)
    .map((i) => i.suggestion)
    .join('\n');

  const prChecklist = issues.map((i) => {
    const icon = i.severity === 'error' ? '[!]' : i.severity === 'warning' ? '[~]' : '[i]';
    return `- [ ] ${icon} **${i.file}**: ${i.description}`;
  }).join('\n');

  const downloadMarkdown = () => {
    const md = `# Asset Check Report\n\n**Files scanned:** ${totalFiles}\n**Issues found:** ${issues.length} (${errorCount} errors, ${warnCount} warnings, ${infoCount} info)\n\n## Issues\n\n${prChecklist}\n\n## Suggested Renames\n\n\`\`\`bash\n${renameScript}\n\`\`\`\n`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      title="Asset Checker"
      description="Drop a folder or zip. Scan for naming issues, missing @2x, odd sizes, large files, duplicates."
    >
      {/* Upload */}
      <Box sx={{ mb: 3 }}>
        <FileDropZone
          accept="image/*,.svg,.png,.jpg,.jpeg,.webp,.gif"
          onFiles={handleFiles}
          accentColor={TOOL_COLOR}
          label="Drop files or click to upload"
          hint="Images, SVGs, or use folder upload below"
        />
      </Box>

      {scanning && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: TOOL_COLOR } }} />
          <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mt: 0.5 }}>
            Scanning {totalFiles} files...
          </Typography>
        </Box>
      )}

      {/* Summary */}
      {totalFiles > 0 && !scanning && (
        <>
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.paper }}>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2">
                <strong>{totalFiles}</strong> files scanned
              </Typography>
              <Typography variant="body2" sx={{ color: SEVERITY_COLORS.error }}>
                <strong>{errorCount}</strong> errors
              </Typography>
              <Typography variant="body2" sx={{ color: SEVERITY_COLORS.warning }}>
                <strong>{warnCount}</strong> warnings
              </Typography>
              <Typography variant="body2" sx={{ color: SEVERITY_COLORS.info }}>
                <strong>{infoCount}</strong> info
              </Typography>
            </Stack>
          </Paper>

          {/* Filter */}
          {issues.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <ChipSelector
                items={CATEGORY_FILTERS}
                selected={filter}
                onSelect={setFilter}
                accentColor={TOOL_COLOR}
              />
            </Box>
          )}

          {/* Issue cards */}
          <Stack spacing={1} sx={{ mb: 3 }}>
            {filtered.map((issue, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: tokens.colors.paper,
                  borderLeft: `3px solid ${SEVERITY_COLORS[issue.severity]}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {issue.file}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: SEVERITY_COLORS[issue.severity],
                    }}
                  >
                    {issue.severity}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: tokens.colors.text.secondary }}>
                  {issue.description}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {/* Actions */}
          {issues.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => copy(prChecklist)}
                sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.secondary }}
              >
                {copied ? 'Copied' : 'Copy PR Checklist'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={downloadMarkdown}
                sx={{ borderColor: tokens.colors.border, color: tokens.colors.text.secondary }}
              >
                Download Report
              </Button>
            </Stack>
          )}

          {/* Rename script */}
          {renameScript && (
            <>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Suggested Renames
              </Typography>
              <CommandOutput content={renameScript} accentColor={TOOL_COLOR} />
            </>
          )}
        </>
      )}
    </ToolPageLayout>
  );
}
