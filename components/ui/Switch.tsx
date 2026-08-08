"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export function Switch({ 
  className, 
  label, 
  description,
  id,
  ...props 
}: SwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <label className={cn("flex items-start gap-3 cursor-pointer", className)}>
      <div className="relative mt-1">
        <input
          type="checkbox"
          id={switchId}
          className={cn(
            "peer h-6 w-6 appearance-none rounded-full border-2 border-border-subtle",
            "bg-surface-interactive transition-all duration-200",
            "checked:border-brand-cyan checked:bg-brand-cyan",
            "checked:after:translate-x-full",
            "focus:outline-none focus:ring-2 focus:ring-brand-cyan/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
            "after:h-4 after:w-4 after:rounded-full after:bg-white",
            "after:transition-transform after:duration-200",
            "after:shadow-sm"
          )}
          {...props}
        />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-text-muted peer-checked:text-brand-navy peer-checked:hidden">OFF</span>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-brand-navy opacity-0 peer-checked:opacity-100">ON</span>
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-body-sm font-medium text-text-primary">{label}</span>}
          {description && <span className="text-caption text-text-muted">{description}</span>}
        </div>
      )}
    </label>
  );
}