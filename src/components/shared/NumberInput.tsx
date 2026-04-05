'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberInputProps {
  id: string;
  label: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: NumberInputProps) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value || ''}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          onChange(isNaN(val) ? 0 : val);
        }}
        min={min}
        max={max}
        step={step}
        className="h-8 text-sm"
      />
    </div>
  );
}
