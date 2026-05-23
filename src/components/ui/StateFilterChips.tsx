'use client';

import { motion, AnimatePresence } from 'motion/react';
import type { ChipRenderData } from './ChipRenderData';

type StateFilterChipsProps = {
  items: ChipRenderData[];
  value: string;
  onChange: (value: string) => void;
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StateFilterChips({
  items,
  value,
  onChange,
}: StateFilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none z-100 pr-3">
      {items.map((item) => {
        const isActive = item.value === value;
        const a = item.activeColor;
        const i = item.inactiveColor;

        return (
          <motion.button
            layout
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className="group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: isActive ? hexToRgba(a, 0.1) : 'transparent',
              color: isActive ? a : i,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: isActive ? hexToRgba(a, 0.3) : hexToRgba(i, 0.2),
            }}
            transition={{ duration: 0.2 }}
          >
            {!isActive && item.hasDot && (
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: hexToRgba(i, 0.4) }}
              />
            )}
            <span className="whitespace-nowrap">{item.label}</span>
            <span
              className="rounded-full px-1.5 text-[11px] font-semibold tabular-nums"
              style={{
                backgroundColor: isActive
                  ? hexToRgba(a, 0.2)
                  : hexToRgba(i, 0.1),
                color: isActive ? a : i,
                minWidth: '20px',
                minHeight: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.span
                layout
                key={item.count}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'block' }}
              >
                {item.count}
              </motion.span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
