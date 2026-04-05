'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ResourceCheckboxGridProps {
  availableResources: { key: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function ResourceCheckboxGrid({
  availableResources,
  selected,
  onChange,
}: ResourceCheckboxGridProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((r) => r !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {availableResources.map((res) => (
        <div key={res.key} className="flex items-center gap-1.5">
          <Checkbox
            id={`res-${res.key}`}
            checked={selected.includes(res.key)}
            onCheckedChange={() => toggle(res.key)}
          />
          <Label
            htmlFor={`res-${res.key}`}
            className="text-xs cursor-pointer select-none"
          >
            {res.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
