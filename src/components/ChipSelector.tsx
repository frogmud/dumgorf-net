import { Stack, Chip } from '@mui/material';
import { tokens } from '../theme';

interface ChipItem<T extends string> {
  id: T;
  label: string;
  color?: string;
}

interface ChipSelectorProps<T extends string> {
  items: ChipItem<T>[];
  selected: T | T[];
  onSelect: (id: T) => void;
  accentColor: string;
}

export function ChipSelector<T extends string>({
  items,
  selected,
  onSelect,
  accentColor,
}: ChipSelectorProps<T>) {
  const isSelected = (id: T) =>
    Array.isArray(selected) ? selected.includes(id) : selected === id;

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {items.map((item) => {
        const active = isSelected(item.id);
        const chipColor = item.color ?? accentColor;
        return (
          <Chip
            key={item.id}
            label={item.label}
            size="small"
            onClick={() => onSelect(item.id)}
            sx={{
              bgcolor: active ? `${chipColor}30` : 'transparent',
              color: active ? chipColor : tokens.colors.text.muted,
              border: `1px solid ${active ? chipColor : tokens.colors.border}`,
              fontWeight: active ? 600 : 400,
              mb: 0.5,
            }}
          />
        );
      })}
    </Stack>
  );
}
