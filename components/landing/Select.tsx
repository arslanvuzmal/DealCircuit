'use client';

import React from 'react';

interface SelectProps {
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function Select({ options, defaultValue, className, onChange, ...props }: SelectProps) {
  return (
    <select
      defaultValue={defaultValue}
      className={className}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}